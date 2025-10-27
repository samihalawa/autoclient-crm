# Twenty CRM - Google Cloud Deployment Guide

Complete guide to deploy Twenty CRM to Google Cloud Platform using Cloud Run, Cloud SQL, and Memorystore.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Automated)](#quick-start-automated)
3. [Manual Deployment](#manual-deployment)
4. [Configuration](#configuration)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Cost Estimation](#cost-estimation)

---

## 🚀 Prerequisites

### 1. Install Google Cloud SDK

**macOS/Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**Verify installation:**
```bash
gcloud --version
```

### 2. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

### 3. Create a Google Cloud Project

```bash
# Create new project
gcloud projects create YOUR-PROJECT-ID --name="Twenty CRM"

# Set as active project
gcloud config set project YOUR-PROJECT-ID

# Enable billing (required for Cloud Run, Cloud SQL, etc.)
# Visit: https://console.cloud.google.com/billing
```

### 4. Set Environment Variables

```bash
export GCLOUD_PROJECT_ID="your-project-id"
export GCLOUD_REGION="us-central1"  # or your preferred region
```

---

## ⚡ Quick Start (Automated)

The easiest way to deploy Twenty CRM to Google Cloud:

### Step 1: Run the Deployment Script

```bash
# Make script executable (if not already)
chmod +x deploy-gcloud.sh

# Run deployment
./deploy-gcloud.sh
```

This script will automatically:
- ✅ Enable required Google Cloud APIs
- ✅ Create VPC connector for private networking
- ✅ Set up Cloud SQL PostgreSQL database
- ✅ Create Redis instance (Memorystore)
- ✅ Generate and store secrets
- ✅ Build Docker image
- ✅ Deploy to Cloud Run
- ✅ Configure networking and scaling

**Expected time:** 15-20 minutes

### Step 2: Access Your Application

After successful deployment, you'll see:
```
Service URL: https://twenty-crm-xxxxx.us-central1.run.app
```

Visit this URL to access your Twenty CRM instance!

---

## 🔧 Manual Deployment

If you prefer step-by-step control:

### 1. Enable Required APIs

```bash
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    vpcaccess.googleapis.com \
    secretmanager.googleapis.com \
    artifactregistry.googleapis.com
```

### 2. Create VPC Connector

```bash
gcloud compute networks vpc-access connectors create twenty-vpc-connector \
    --region=$GCLOUD_REGION \
    --range=10.8.0.0/28 \
    --network=default
```

### 3. Create Cloud SQL PostgreSQL Instance

```bash
# Create instance
gcloud sql instances create twenty-db \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --region=$GCLOUD_REGION \
    --network=default \
    --no-assign-ip

# Set password
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users set-password postgres \
    --instance=twenty-db \
    --password="$DB_PASSWORD"

# Create database
gcloud sql databases create twenty --instance=twenty-db

# Save password securely!
echo "Database Password: $DB_PASSWORD"
```

### 4. Create Redis Instance

```bash
gcloud redis instances create twenty-redis \
    --size=1 \
    --region=$GCLOUD_REGION \
    --redis-version=redis_7_0 \
    --network=default

# Get Redis connection info
REDIS_HOST=$(gcloud redis instances describe twenty-redis \
    --region=$GCLOUD_REGION \
    --format="get(host)")
REDIS_PORT=$(gcloud redis instances describe twenty-redis \
    --region=$GCLOUD_REGION \
    --format="get(port)")

echo "Redis: $REDIS_HOST:$REDIS_PORT"
```

### 5. Create Secrets

```bash
# Generate APP_SECRET
APP_SECRET=$(openssl rand -base64 32)
echo -n "$APP_SECRET" | gcloud secrets create app-secret --data-file=-

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding app-secret \
    --member="serviceAccount:$GCLOUD_PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 6. Build Docker Image

```bash
# Build using Cloud Build
gcloud builds submit --config=cloudbuild.yaml \
    --substitutions=_REGION="$GCLOUD_REGION",_SERVER_URL="https://your-app.run.app" \
    --timeout=30m
```

### 7. Deploy to Cloud Run

```bash
# Set connection string
CLOUDSQL_CONNECTION_NAME="$GCLOUD_PROJECT_ID:$GCLOUD_REGION:twenty-db"

# Deploy
gcloud run deploy twenty-crm \
    --image="gcr.io/$GCLOUD_PROJECT_ID/twenty-crm:latest" \
    --region=$GCLOUD_REGION \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --memory=2Gi \
    --cpu=2 \
    --min-instances=1 \
    --max-instances=10 \
    --timeout=300s \
    --set-env-vars="PORT=8080,NODE_ENV=production,REDIS_URL=redis://$REDIS_HOST:$REDIS_PORT" \
    --set-secrets="APP_SECRET=app-secret:latest" \
    --add-cloudsql-instances="$CLOUDSQL_CONNECTION_NAME" \
    --vpc-connector=twenty-vpc-connector

# Get service URL
gcloud run services describe twenty-crm \
    --region=$GCLOUD_REGION \
    --format="get(status.url)"
```

---

## ⚙️ Configuration

### Environment Variables

Use `.env.gcloud.template` as reference. Key variables:

```bash
# Required
SERVER_URL=https://your-app.run.app
PG_DATABASE_URL=postgresql://postgres:PASSWORD@/twenty?host=/cloudsql/...
REDIS_URL=redis://10.x.x.x:6379
APP_SECRET=your-random-secret

# Optional
STORAGE_TYPE=gcp
STORAGE_GCP_BUCKET_NAME=your-bucket
EMAIL_DRIVER=smtp
```

### Update Environment Variables

```bash
gcloud run services update twenty-crm \
    --region=$GCLOUD_REGION \
    --set-env-vars="KEY=VALUE"
```

### Add More Secrets

```bash
# Create secret
echo -n "secret-value" | gcloud secrets create secret-name --data-file=-

# Use in Cloud Run
gcloud run services update twenty-crm \
    --region=$GCLOUD_REGION \
    --set-secrets="ENV_VAR=secret-name:latest"
```

---

## 📦 Post-Deployment

### 1. Set Up Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
    --service=twenty-crm \
    --domain=crm.yourdomain.com \
    --region=$GCLOUD_REGION

# Follow DNS instructions to verify domain
```

### 2. Set Up Cloud Storage (Optional)

```bash
# Create bucket for file uploads
gsutil mb -p $GCLOUD_PROJECT_ID -l $GCLOUD_REGION gs://your-bucket-name

# Grant Cloud Run access
gsutil iam ch \
    serviceAccount:$GCLOUD_PROJECT_ID@appspot.gserviceaccount.com:objectAdmin \
    gs://your-bucket-name

# Update environment
gcloud run services update twenty-crm \
    --region=$GCLOUD_REGION \
    --set-env-vars="STORAGE_TYPE=gcp,STORAGE_GCP_BUCKET_NAME=your-bucket-name"
```

### 3. Enable Monitoring

```bash
# View logs
gcloud run services logs read twenty-crm --region=$GCLOUD_REGION

# Set up log-based alerts
gcloud alpha monitoring policies create \
    --notification-channels=YOUR_CHANNEL_ID \
    --display-name="Twenty CRM Errors" \
    --condition-display-name="Error Rate" \
    --condition-threshold-value=10
```

### 4. Database Backups

```bash
# Enable automated backups
gcloud sql instances patch twenty-db \
    --backup-start-time=03:00

# Create manual backup
gcloud sql backups create --instance=twenty-db
```

### 5. Scale Configuration

```bash
# Adjust scaling
gcloud run services update twenty-crm \
    --region=$GCLOUD_REGION \
    --min-instances=2 \
    --max-instances=20 \
    --cpu-throttling \
    --concurrency=80
```

---

## 🔍 Troubleshooting

### Check Logs

```bash
# Recent logs
gcloud run services logs read twenty-crm --region=$GCLOUD_REGION --limit=50

# Follow logs in real-time
gcloud run services logs tail twenty-crm --region=$GCLOUD_REGION

# Filter errors only
gcloud run services logs read twenty-crm \
    --region=$GCLOUD_REGION \
    --filter="severity>=ERROR"
```

### Common Issues

#### 1. Build Timeout
**Error:** `Build timeout`
**Solution:**
```bash
# Increase timeout in cloudbuild.yaml
timeout: 3600s
```

#### 2. Database Connection Failed
**Error:** `Connection to database failed`
**Solution:**
```bash
# Verify Cloud SQL connection
gcloud sql instances describe twenty-db

# Check VPC connector
gcloud compute networks vpc-access connectors describe twenty-vpc-connector \
    --region=$GCLOUD_REGION
```

#### 3. Out of Memory
**Error:** `Container killed due to memory limit`
**Solution:**
```bash
# Increase memory
gcloud run services update twenty-crm \
    --region=$GCLOUD_REGION \
    --memory=4Gi
```

#### 4. Cold Start Issues
**Solution:**
```bash
# Keep minimum instances warm
gcloud run services update twenty-crm \
    --region=$GCLOUD_REGION \
    --min-instances=2
```

### Debug Container Locally

```bash
# Build image locally
docker build -f Dockerfile.cloudrun -t twenty-crm .

# Run with environment variables
docker run -p 8080:8080 \
    -e PORT=8080 \
    -e NODE_ENV=production \
    twenty-crm
```

---

## 💰 Cost Estimation

Monthly costs (approximate):

### Cloud Run
- **Free tier:** 2M requests, 360K GB-seconds, 180K vCPU-seconds
- **After free tier:** ~$0.00002400 per request
- **Estimated:** $10-50/month (depending on traffic)

### Cloud SQL (db-f1-micro)
- **Instance:** ~$7/month
- **Storage:** ~$0.17/GB/month
- **Estimated:** $10-15/month

### Redis (Memorystore, 1GB)
- **Instance:** ~$37/month
- **Estimated:** $37/month

### VPC Connector
- **Data processed:** ~$0.12/GB
- **Estimated:** $5-10/month

### Cloud Build
- **Free tier:** 120 build-minutes/day
- **After:** $0.003/build-minute
- **Estimated:** $0-5/month

### **Total Estimated Monthly Cost: $62-117**

### Cost Optimization Tips

1. **Use smaller Cloud SQL tier for testing:**
   ```bash
   --tier=db-f1-micro  # $7/month
   ```

2. **Reduce Redis size for testing:**
   ```bash
   --size=1  # 1GB, $37/month
   ```

3. **Scale down Cloud Run:**
   ```bash
   --min-instances=0  # Scale to zero when idle
   --max-instances=5
   ```

4. **Delete unused resources:**
   ```bash
   gcloud run services delete twenty-crm --region=$GCLOUD_REGION
   gcloud sql instances delete twenty-db
   ```

---

## 🔐 Security Best Practices

1. **Use Secret Manager for sensitive data**
2. **Enable Cloud Armor for DDoS protection**
3. **Set up VPC Service Controls**
4. **Enable audit logging**
5. **Regular security updates**
6. **Implement least privilege IAM roles**

---

## 📚 Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Twenty CRM Documentation](https://twenty.com/developers)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)

---

## 🆘 Support

- **Twenty CRM:** https://github.com/twentyhq/twenty
- **Google Cloud Support:** https://cloud.google.com/support
- **Community:** https://discord.gg/twenty

---

## 📝 License

This deployment configuration is part of Twenty CRM (AGPL-3.0 License)

---

**Happy Deploying! 🚀**
