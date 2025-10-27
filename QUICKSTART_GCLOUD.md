# Twenty CRM - Google Cloud Quick Start

Deploy Twenty CRM to Google Cloud in 3 simple steps!

## Prerequisites

1. **Install Google Cloud SDK:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. **Login to Google Cloud:**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Set your project:**
   ```bash
   export GCLOUD_PROJECT_ID="your-project-id"
   export GCLOUD_REGION="us-central1"
   gcloud config set project $GCLOUD_PROJECT_ID
   ```

## Deploy in 1 Command

```bash
./deploy-gcloud.sh
```

That's it! ✨

The script will:
- ✅ Enable all required APIs
- ✅ Create PostgreSQL database (Cloud SQL)
- ✅ Create Redis instance (Memorystore)
- ✅ Build Docker image
- ✅ Deploy to Cloud Run
- ✅ Configure networking

**Time:** ~15-20 minutes

## Access Your App

After deployment completes, visit the URL shown:
```
https://twenty-crm-xxxxx.us-central1.run.app
```

## What Gets Created

| Resource | Service | Purpose |
|----------|---------|---------|
| Cloud Run | App hosting | Runs Twenty CRM |
| Cloud SQL | PostgreSQL | Database |
| Memorystore | Redis | Caching |
| VPC Connector | Networking | Private connectivity |
| Secret Manager | Secrets | Secure credentials |

## Cost

**Estimated:** $62-117/month

- Cloud Run: $10-50
- Cloud SQL: $10-15
- Redis: $37
- Networking: $5-10

## Customize

Edit `deploy-gcloud.sh` to change:
- Region (default: us-central1)
- Instance sizes
- Scaling parameters

## Troubleshooting

**View logs:**
```bash
gcloud run services logs read twenty-crm --region=$GCLOUD_REGION
```

**Redeploy:**
```bash
./deploy-gcloud.sh
```

**Delete everything:**
```bash
gcloud run services delete twenty-crm --region=$GCLOUD_REGION
gcloud sql instances delete twenty-db
gcloud redis instances delete twenty-redis --region=$GCLOUD_REGION
```

## Full Documentation

See [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md) for:
- Manual deployment steps
- Environment configuration
- Advanced settings
- Security best practices
- Complete troubleshooting guide

## Support

- **Issues:** https://github.com/twentyhq/twenty/issues
- **Docs:** [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md)

---

**Happy deploying! 🚀**
