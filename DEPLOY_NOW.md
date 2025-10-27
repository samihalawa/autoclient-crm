# 🚀 Deploy Twenty CRM to Google Cloud NOW

Follow these exact steps to deploy Twenty CRM to Google Cloud.

## Step 1: Authenticate with Google Cloud

```bash
# Add gcloud to PATH
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

# Login to Google Cloud (this will open your browser)
gcloud auth login

# Set application default credentials
gcloud auth application-default login
```

## Step 2: Create/Select Project

### Option A: Create New Project

```bash
# Set your desired project ID
export GCLOUD_PROJECT_ID="twenty-crm-$(date +%s)"

# Create project
gcloud projects create $GCLOUD_PROJECT_ID --name="Twenty CRM"

# Set as active project
gcloud config set project $GCLOUD_PROJECT_ID

# Enable billing (REQUIRED - visit this URL)
echo "Enable billing at: https://console.cloud.google.com/billing/linkedaccount?project=$GCLOUD_PROJECT_ID"
```

### Option B: Use Existing Project

```bash
# List your projects
gcloud projects list

# Set project ID
export GCLOUD_PROJECT_ID="your-existing-project-id"
gcloud config set project $GCLOUD_PROJECT_ID
```

## Step 3: Set Region

```bash
export GCLOUD_REGION="us-central1"  # or your preferred region
```

## Step 4: Deploy! 🚀

```bash
cd /Users/samihalawa/git/PROJECTS_AUTOCLIENT/2025-FINAL-TWENTY-CRM-cloned-and-adjusted/twenty-crm-clone

./deploy-gcloud.sh
```

## What Happens Next:

The script will:
1. ✅ Enable required APIs (~2 minutes)
2. ✅ Create VPC connector (~3 minutes)
3. ✅ Create Cloud SQL database (~5 minutes)
4. ✅ Create Redis instance (~3 minutes)
5. ✅ Build Docker image (~10 minutes)
6. ✅ Deploy to Cloud Run (~2 minutes)

**Total time: ~15-20 minutes**

## After Deployment:

You'll see output like:

```
================================================================================
Service URL: https://twenty-crm-xxxxx.us-central1.run.app
================================================================================
```

Visit that URL to access your Twenty CRM instance!

## Manage Your Deployment:

```bash
# Interactive management menu
./gcloud-manage.sh

# View logs
gcloud run services logs read twenty-crm --region=$GCLOUD_REGION

# Get URL
gcloud run services describe twenty-crm \
  --region=$GCLOUD_REGION \
  --format="get(status.url)"
```

## Troubleshooting:

### "Billing not enabled" error
Visit: https://console.cloud.google.com/billing

### "Permission denied" error
```bash
gcloud auth login
gcloud auth application-default login
```

### See all resources
```bash
./gcloud-manage.sh
# Select option 13: View all resources
```

## Cost:

- **First 90 days:** $300 free credits
- **Monthly cost:** $62-117/month
- **Free tier:** Included for low traffic

## Delete Everything:

```bash
./gcloud-manage.sh
# Select option 14: Delete all resources
```

---

**Ready? Run these commands:**

```bash
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
gcloud auth login
export GCLOUD_PROJECT_ID="twenty-crm-$(date +%s)"
gcloud projects create $GCLOUD_PROJECT_ID
gcloud config set project $GCLOUD_PROJECT_ID
# Enable billing at console.cloud.google.com/billing
./deploy-gcloud.sh
```

🎉 **You're all set!**
