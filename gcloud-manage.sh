#!/bin/bash

# Twenty CRM - Google Cloud Management Script
# Manage your deployed Twenty CRM instance

set -e

# Configuration
PROJECT_ID="${GCLOUD_PROJECT_ID:-twenty-crm-project}"
REGION="${GCLOUD_REGION:-us-central1}"
SERVICE_NAME="twenty-crm"
DB_INSTANCE_NAME="twenty-db"
REDIS_INSTANCE_NAME="twenty-redis"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_menu() {
    echo -e "${GREEN}Twenty CRM - Management Menu${NC}\n"
    echo "1)  View service status"
    echo "2)  View logs (last 50 lines)"
    echo "3)  Follow logs (real-time)"
    echo "4)  Get service URL"
    echo "5)  Update environment variable"
    echo "6)  Scale service (instances)"
    echo "7)  Update service memory/CPU"
    echo "8)  Restart service"
    echo "9)  Database backup"
    echo "10) View database info"
    echo "11) Connect to database"
    echo "12) View Redis info"
    echo "13) View all resources"
    echo "14) Delete all resources (DANGER)"
    echo "0)  Exit"
    echo ""
}

# Functions
view_status() {
    print_header "Service Status"
    gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --format="table(status.conditions.status,status.url)"
}

view_logs() {
    print_header "Recent Logs (Last 50 lines)"
    gcloud run services logs read "$SERVICE_NAME" \
        --region="$REGION" \
        --limit=50
}

follow_logs() {
    print_header "Following Logs (Ctrl+C to stop)"
    gcloud run services logs tail "$SERVICE_NAME" \
        --region="$REGION"
}

get_url() {
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --format="get(status.url)")
    print_header "Service URL"
    echo -e "${GREEN}$SERVICE_URL${NC}"
    echo ""
    echo "Click to open: $SERVICE_URL"
}

update_env() {
    print_header "Update Environment Variable"
    read -p "Enter variable name (e.g., DEBUG): " VAR_NAME
    read -p "Enter variable value: " VAR_VALUE

    gcloud run services update "$SERVICE_NAME" \
        --region="$REGION" \
        --set-env-vars="$VAR_NAME=$VAR_VALUE"

    echo -e "${GREEN}✓ Environment variable updated${NC}"
}

scale_service() {
    print_header "Scale Service"
    echo "Current scaling: Check service status"
    read -p "Minimum instances (0-100): " MIN_INST
    read -p "Maximum instances (1-100): " MAX_INST

    gcloud run services update "$SERVICE_NAME" \
        --region="$REGION" \
        --min-instances="$MIN_INST" \
        --max-instances="$MAX_INST"

    echo -e "${GREEN}✓ Scaling updated${NC}"
}

update_resources() {
    print_header "Update Resources"
    echo "1) 1Gi RAM, 1 CPU (Light)"
    echo "2) 2Gi RAM, 2 CPU (Standard)"
    echo "3) 4Gi RAM, 4 CPU (Performance)"
    echo "4) Custom"
    read -p "Select option: " RESOURCE_OPT

    case $RESOURCE_OPT in
        1) MEMORY="1Gi"; CPU="1";;
        2) MEMORY="2Gi"; CPU="2";;
        3) MEMORY="4Gi"; CPU="4";;
        4)
            read -p "Memory (e.g., 2Gi): " MEMORY
            read -p "CPU (1-4): " CPU
            ;;
        *) echo "Invalid option"; return;;
    esac

    gcloud run services update "$SERVICE_NAME" \
        --region="$REGION" \
        --memory="$MEMORY" \
        --cpu="$CPU"

    echo -e "${GREEN}✓ Resources updated${NC}"
}

restart_service() {
    print_header "Restart Service"
    read -p "Are you sure you want to restart? (y/n): " CONFIRM

    if [ "$CONFIRM" = "y" ]; then
        # Update with a dummy env var to trigger restart
        gcloud run services update "$SERVICE_NAME" \
            --region="$REGION" \
            --set-env-vars="LAST_RESTART=$(date +%s)"
        echo -e "${GREEN}✓ Service restarted${NC}"
    fi
}

backup_database() {
    print_header "Database Backup"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"

    gcloud sql backups create \
        --instance="$DB_INSTANCE_NAME" \
        --description="Manual backup: $BACKUP_NAME"

    echo -e "${GREEN}✓ Backup created: $BACKUP_NAME${NC}"
}

view_database_info() {
    print_header "Database Information"
    gcloud sql instances describe "$DB_INSTANCE_NAME" \
        --format="table(name,databaseVersion,region,state,ipAddresses[0].ipAddress)"
}

connect_database() {
    print_header "Connect to Database"
    echo "Opening Cloud SQL Proxy connection..."
    gcloud sql connect "$DB_INSTANCE_NAME" --user=postgres
}

view_redis_info() {
    print_header "Redis Information"
    gcloud redis instances describe "$REDIS_INSTANCE_NAME" \
        --region="$REGION" \
        --format="table(name,version,host,port,memorySizeGb,state)"
}

view_all_resources() {
    print_header "All Resources"

    echo -e "${YELLOW}Cloud Run Services:${NC}"
    gcloud run services list --region="$REGION"

    echo -e "\n${YELLOW}Cloud SQL Instances:${NC}"
    gcloud sql instances list

    echo -e "\n${YELLOW}Redis Instances:${NC}"
    gcloud redis instances list --region="$REGION"

    echo -e "\n${YELLOW}VPC Connectors:${NC}"
    gcloud compute networks vpc-access connectors list --region="$REGION"
}

delete_all() {
    print_header "DELETE ALL RESOURCES"
    echo -e "${RED}⚠️  WARNING: This will delete ALL resources!${NC}"
    echo -e "${RED}This action cannot be undone!${NC}\n"

    read -p "Type 'DELETE' to confirm: " CONFIRM

    if [ "$CONFIRM" = "DELETE" ]; then
        echo "Deleting Cloud Run service..."
        gcloud run services delete "$SERVICE_NAME" --region="$REGION" --quiet

        echo "Deleting Cloud SQL instance..."
        gcloud sql instances delete "$DB_INSTANCE_NAME" --quiet

        echo "Deleting Redis instance..."
        gcloud redis instances delete "$REDIS_INSTANCE_NAME" --region="$REGION" --quiet

        echo "Deleting VPC connector..."
        gcloud compute networks vpc-access connectors delete twenty-vpc-connector \
            --region="$REGION" --quiet

        echo -e "${GREEN}✓ All resources deleted${NC}"
    else
        echo -e "${YELLOW}Deletion cancelled${NC}"
    fi
}

# Main loop
while true; do
    clear
    print_menu
    read -p "Select option: " OPTION

    case $OPTION in
        1) view_status;;
        2) view_logs;;
        3) follow_logs;;
        4) get_url;;
        5) update_env;;
        6) scale_service;;
        7) update_resources;;
        8) restart_service;;
        9) backup_database;;
        10) view_database_info;;
        11) connect_database;;
        12) view_redis_info;;
        13) view_all_resources;;
        14) delete_all;;
        0) echo "Goodbye!"; exit 0;;
        *) echo -e "${RED}Invalid option${NC}";;
    esac

    echo ""
    read -p "Press Enter to continue..."
done
