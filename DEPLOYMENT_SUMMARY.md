# Twenty CRM - Google Cloud Deployment Summary

Complete deployment package for deploying Twenty CRM to Google Cloud Platform.

## 📦 What's Included

### Deployment Files

| File | Purpose | Size |
|------|---------|------|
| `Dockerfile.cloudrun` | Optimized multi-stage Docker build for Cloud Run | 2.6KB |
| `deploy-gcloud.sh` | Automated deployment script | 6.4KB |
| `cloudbuild.yaml` | Cloud Build CI/CD configuration | 2.0KB |
| `.env.gcloud.template` | Environment variables template | 3.1KB |
| `.dockerignore` | Docker build exclusions | Updated |
| `DEPLOY_GCLOUD.md` | Complete deployment guide | 11KB |
| `QUICKSTART_GCLOUD.md` | Quick start guide | 2.2KB |

## 🚀 Quick Deploy

### Option 1: Automated (Recommended)

```bash
# 1. Set your project ID
export GCLOUD_PROJECT_ID="your-project-id"
export GCLOUD_REGION="us-central1"

# 2. Run deployment script
./deploy-gcloud.sh
```

**Time:** ~15-20 minutes
**Complexity:** ⭐️ Easy

### Option 2: Manual Deployment

Follow step-by-step instructions in [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md)

**Time:** ~30-40 minutes
**Complexity:** ⭐️⭐️⭐️ Advanced

## 📋 Prerequisites

1. **Google Cloud SDK installed:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   ```

2. **Authenticated:**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Project created and billing enabled**

## 🏗️ Infrastructure Created

The deployment creates:

```
┌─────────────────────────────────────┐
│      Google Cloud Project           │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐                  │
│  │  Cloud Run   │ ← Users          │
│  │  (Frontend + │                  │
│  │   Backend)   │                  │
│  └──────┬───────┘                  │
│         │                          │
│         ├─────→ ┌──────────────┐   │
│         │       │  Cloud SQL   │   │
│         │       │ (PostgreSQL) │   │
│         │       └──────────────┘   │
│         │                          │
│         ├─────→ ┌──────────────┐   │
│         │       │ Memorystore  │   │
│         │       │   (Redis)    │   │
│         │       └──────────────┘   │
│         │                          │
│         └─────→ ┌──────────────┐   │
│                 │ VPC Connector│   │
│                 │  (Networking)│   │
│                 └──────────────┘   │
│                                     │
│  ┌──────────────┐                  │
│  │Secret Manager│                  │
│  │  (Secrets)   │                  │
│  └──────────────┘                  │
│                                     │
└─────────────────────────────────────┘
```

## 💡 Key Features

### Docker Optimization
- ✅ Multi-stage build (3 stages)
- ✅ Layer caching for faster builds
- ✅ Production-optimized Node.js image
- ✅ Non-root user for security
- ✅ Health checks built-in

### Cloud Run Configuration
- ✅ Auto-scaling (1-10 instances)
- ✅ 2GB RAM, 2 CPU allocation
- ✅ Private networking via VPC
- ✅ Secret management integration
- ✅ PostgreSQL via Cloud SQL proxy
- ✅ Redis via private IP

### CI/CD Ready
- ✅ Cloud Build integration
- ✅ Automatic image builds
- ✅ Git-based deployments
- ✅ Environment-based configuration

## 📊 Cost Breakdown

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| Cloud Run | 2GB RAM, 2 CPU, auto-scale | $10-50 |
| Cloud SQL | PostgreSQL 16, db-f1-micro | $10-15 |
| Memorystore | Redis 7.0, 1GB | $37 |
| VPC Connector | Standard networking | $5-10 |
| Cloud Build | ~10 builds/month | $0-5 |
| **Total** | | **$62-117** |

**Free tier available** for first 90 days: ~$300 credits

## 🔧 Configuration Options

### Scale Up (Production)

```bash
# Increase resources
gcloud run services update twenty-crm \
    --memory=4Gi \
    --cpu=4 \
    --min-instances=2 \
    --max-instances=20

# Upgrade database
gcloud sql instances patch twenty-db \
    --tier=db-custom-2-7680
```

### Scale Down (Testing)

```bash
# Reduce costs
gcloud run services update twenty-crm \
    --memory=1Gi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=3
```

## 🔒 Security Features

- ✅ Non-root Docker container
- ✅ Secret Manager for credentials
- ✅ Private networking (VPC)
- ✅ No public database IPs
- ✅ HTTPS only (automatic)
- ✅ Cloud IAM integration

## 📚 Documentation

| Guide | Description | Audience |
|-------|-------------|----------|
| [QUICKSTART_GCLOUD.md](./QUICKSTART_GCLOUD.md) | 3-step quick start | Beginners |
| [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md) | Complete deployment guide | All users |
| [.env.gcloud.template](./.env.gcloud.template) | Environment config reference | Developers |

## 🛠️ Common Operations

### View Logs
```bash
gcloud run services logs read twenty-crm --region=us-central1
```

### Update Environment Variables
```bash
gcloud run services update twenty-crm \
    --region=us-central1 \
    --set-env-vars="KEY=VALUE"
```

### Redeploy
```bash
./deploy-gcloud.sh
```

### Delete Everything
```bash
gcloud run services delete twenty-crm --region=us-central1
gcloud sql instances delete twenty-db
gcloud redis instances delete twenty-redis --region=us-central1
gcloud compute networks vpc-access connectors delete twenty-vpc-connector --region=us-central1
```

## 🐛 Troubleshooting

### Check Service Status
```bash
gcloud run services describe twenty-crm --region=us-central1
```

### View Build Logs
```bash
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

### Database Connection
```bash
gcloud sql instances describe twenty-db
```

### Test Local Build
```bash
docker build -f Dockerfile.cloudrun -t twenty-test .
docker run -p 8080:8080 -e PORT=8080 twenty-test
```

## ✅ Deployment Checklist

Before deploying:
- [ ] Google Cloud SDK installed
- [ ] Authenticated with gcloud
- [ ] Project created with billing enabled
- [ ] Region selected (default: us-central1)
- [ ] Environment variables configured

After deployment:
- [ ] Service URL accessible
- [ ] Database connected
- [ ] Redis working
- [ ] Logs showing no errors
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled (optional)

## 🎯 Next Steps

1. **Access your application** at the Cloud Run URL
2. **Set up custom domain** (see [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md))
3. **Configure OAuth** for Google/Microsoft login
4. **Enable Cloud Storage** for file uploads
5. **Set up monitoring** and alerts
6. **Configure backups** for database

## 📞 Support

- **Twenty CRM GitHub:** https://github.com/twentyhq/twenty
- **Google Cloud Docs:** https://cloud.google.com/run/docs
- **Issues:** Open an issue on the Twenty GitHub repo

## 🙏 Credits

- **Twenty CRM:** https://twenty.com
- **Google Cloud Platform:** https://cloud.google.com

---

**Deployment Package Version:** 1.0
**Last Updated:** October 2025
**Compatible with:** Twenty CRM v0.2.1+

---

**Ready to deploy? Start with [QUICKSTART_GCLOUD.md](./QUICKSTART_GCLOUD.md)! 🚀**
