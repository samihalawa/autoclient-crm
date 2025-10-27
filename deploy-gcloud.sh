#!/bin/bash

# Twenty CRM - Google Cloud Deployment Script
# This script automates the entire deployment process to Google Cloud

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration variables (customize these)
PROJECT_ID="${GCLOUD_PROJECT_ID:-twenty-crm-project}"
REGION="${GCLOUD_REGION:-us-central1}"
SERVICE_NAME="twenty-crm"
DB_INSTANCE_NAME="twenty-db"
REDIS_INSTANCE_NAME="twenty-redis"
VPC_CONNECTOR_NAME="twenty-vpc-connector"

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}Twenty CRM - Google Cloud Deploy${NC}"
echo -e "${GREEN}==================================${NC}\n"

# Function to print status messages
print_status() {
    echo -e "${YELLOW}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud SDK (gcloud) is not installed."
    echo -e "\nInstall it from: https://cloud.google.com/sdk/docs/install"
    echo -e "Or run: curl https://sdk.cloud.google.com | bash"
    exit 1
fi

print_success "Google Cloud SDK found"

# Step 1: Set up Google Cloud project
print_status "Setting up Google Cloud project..."
gcloud config set project "$PROJECT_ID"
print_success "Project set to $PROJECT_ID"

# Step 2: Enable required APIs
print_status "Enabling required Google Cloud APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    vpcaccess.googleapis.com \
    secretmanager.googleapis.com \
    artifactregistry.googleapis.com \
    servicenetworking.googleapis.com \
    compute.googleapis.com \
    --project="$PROJECT_ID"

print_success "APIs enabled"

# Step 2.5: Configure Service Networking for Cloud SQL
print_status "Configuring Service Networking for Cloud SQL..."
if ! gcloud compute addresses describe google-managed-services-default \
    --global --project="$PROJECT_ID" &> /dev/null; then
    gcloud compute addresses create google-managed-services-default \
        --global \
        --purpose=VPC_PEERING \
        --prefix-length=16 \
        --network=default \
        --project="$PROJECT_ID"

    gcloud services vpc-peerings connect \
        --service=servicenetworking.googleapis.com \
        --ranges=google-managed-services-default \
        --network=default \
        --project="$PROJECT_ID"

    print_success "Service Networking configured"
else
    print_success "Service Networking already configured"
fi

# Step 3: Create VPC Connector for private network access
print_status "Creating VPC connector..."
if ! gcloud compute networks vpc-access connectors describe "$VPC_CONNECTOR_NAME" \
    --region="$REGION" &> /dev/null; then
    gcloud compute networks vpc-access connectors create "$VPC_CONNECTOR_NAME" \
        --region="$REGION" \
        --range="10.8.0.0/28" \
        --network="default"
    print_success "VPC connector created"
else
    print_success "VPC connector already exists"
fi

# Step 4: Create Cloud SQL PostgreSQL instance
print_status "Creating Cloud SQL PostgreSQL instance..."
if ! gcloud sql instances describe "$DB_INSTANCE_NAME" &> /dev/null; then
    gcloud sql instances create "$DB_INSTANCE_NAME" \
        --database-version=POSTGRES_16 \
        --tier=db-custom-1-3840 \
        --region="$REGION" \
        --network=default \
        --no-assign-ip \
        --database-flags=max_connections=100 \
        --edition=ENTERPRISE

    # Set root password
    DB_PASSWORD=$(openssl rand -base64 32)
    gcloud sql users set-password postgres \
        --instance="$DB_INSTANCE_NAME" \
        --password="$DB_PASSWORD"

    # Create database
    gcloud sql databases create twenty \
        --instance="$DB_INSTANCE_NAME"

    print_success "Cloud SQL instance created"
    echo -e "${YELLOW}Database password: $DB_PASSWORD${NC}"
    echo -e "${YELLOW}(Save this password securely!)${NC}"
else
    print_success "Cloud SQL instance already exists"
fi

# Step 5: Create Redis instance (Memorystore)
print_status "Creating Redis instance..."
if ! gcloud redis instances describe "$REDIS_INSTANCE_NAME" \
    --region="$REGION" &> /dev/null; then
    gcloud redis instances create "$REDIS_INSTANCE_NAME" \
        --size=1 \
        --region="$REGION" \
        --redis-version=redis_7_0 \
        --network=default
    print_success "Redis instance created"
else
    print_success "Redis instance already exists"
fi

# Step 6: Get Redis connection info
REDIS_HOST=$(gcloud redis instances describe "$REDIS_INSTANCE_NAME" \
    --region="$REGION" \
    --format="get(host)")
REDIS_PORT=$(gcloud redis instances describe "$REDIS_INSTANCE_NAME" \
    --region="$REGION" \
    --format="get(port)")

print_success "Redis: $REDIS_HOST:$REDIS_PORT"

# Step 7: Create secrets in Secret Manager
print_status "Creating secrets..."

# Generate APP_SECRET if not exists
if ! gcloud secrets describe app-secret &> /dev/null; then
    APP_SECRET=$(openssl rand -base64 32)
    echo -n "$APP_SECRET" | gcloud secrets create app-secret --data-file=-
    print_success "APP_SECRET created"
fi

# Step 8: Build Docker image
print_status "Building Docker image..."
SERVER_URL="https://${SERVICE_NAME}-$(gcloud config get-value project).${REGION}.run.app"

gcloud builds submit --config=cloudbuild.yaml \
    --substitutions=_REGION="$REGION",_SERVER_URL="$SERVER_URL" \
    --timeout=30m

print_success "Docker image built and pushed"

# Step 9: Deploy to Cloud Run
print_status "Deploying to Cloud Run..."

CLOUDSQL_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${DB_INSTANCE_NAME}"
DB_CONNECTION_STRING="postgresql://postgres:${DB_PASSWORD}@/${PROJECT_ID}:${REGION}:${DB_INSTANCE_NAME}/twenty?host=/cloudsql/${CLOUDSQL_CONNECTION_NAME}"

gcloud run deploy "$SERVICE_NAME" \
    --image="gcr.io/${PROJECT_ID}/twenty-crm:latest" \
    --region="$REGION" \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --memory=2Gi \
    --cpu=2 \
    --min-instances=1 \
    --max-instances=10 \
    --timeout=300s \
    --set-env-vars="PORT=8080,NODE_ENV=production,SERVER_URL=${SERVER_URL},REDIS_URL=redis://${REDIS_HOST}:${REDIS_PORT},PG_DATABASE_URL=${DB_CONNECTION_STRING}" \
    --set-secrets="APP_SECRET=app-secret:latest" \
    --add-cloudsql-instances="$CLOUDSQL_CONNECTION_NAME" \
    --vpc-connector="$VPC_CONNECTOR_NAME"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$REGION" \
    --format="get(status.url)")

print_success "Deployment complete!"

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}Deployment Information${NC}"
echo -e "${GREEN}==================================${NC}"
echo -e "Service URL:        ${GREEN}${SERVICE_URL}${NC}"
echo -e "Cloud SQL:          ${DB_INSTANCE_NAME}"
echo -e "Redis:              ${REDIS_INSTANCE_NAME}"
echo -e "Region:             ${REGION}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Visit ${SERVICE_URL} to access Twenty CRM"
echo -e "2. Configure custom domain (optional)"
echo -e "3. Set up monitoring and alerts"
echo -e "4. Configure backup schedules"
echo -e "\n${YELLOW}View logs:${NC}"
echo -e "gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
