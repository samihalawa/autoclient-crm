# 🚀 Twenty CRM - Google Cloud Deployment Package

Complete, production-ready deployment solution for Twenty CRM on Google Cloud Platform.

## 📦 Package Contents

```
twenty-crm-clone/
├── Dockerfile.cloudrun         # Optimized Cloud Run Dockerfile
├── deploy-gcloud.sh           # Automated deployment script ⚡
├── gcloud-manage.sh           # Management & operations tool 🛠️
├── cloudbuild.yaml            # CI/CD configuration
├── .env.gcloud.template       # Environment variables template
├── .dockerignore              # Docker build exclusions
├── DEPLOY_GCLOUD.md           # Complete deployment guide 📖
├── QUICKSTART_GCLOUD.md       # Quick start guide 🏃
├── DEPLOYMENT_SUMMARY.md      # Package overview
└── GCLOUD_README.md           # This file
```

## 🎯 What You Get

### Automated Deployment
- ✅ One-command deployment (`./deploy-gcloud.sh`)
- ✅ Complete infrastructure setup (PostgreSQL, Redis, VPC)
- ✅ Production-ready configuration
- ✅ Security best practices built-in
- ✅ Auto-scaling enabled

### Infrastructure
- **Cloud Run**: Serverless app hosting with auto-scaling
- **Cloud SQL**: PostgreSQL 16 database
- **Memorystore**: Redis cache for performance
- **VPC Connector**: Secure private networking
- **Secret Manager**: Encrypted credential storage

### Management Tools
- Interactive CLI menu (`./gcloud-manage.sh`)
- View logs, status, and metrics
- Scale resources on-demand
- Database backups
- Service restart
- Resource cleanup

## ⚡ Quick Start (3 Steps)

### 1. Install Google Cloud SDK

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud auth login
```

### 2. Set Project

```bash
export GCLOUD_PROJECT_ID="your-project-id"
export GCLOUD_REGION="us-central1"
gcloud config set project $GCLOUD_PROJECT_ID
```

### 3. Deploy

```bash
./deploy-gcloud.sh
```

**Time: 15-20 minutes** | **Cost: $62-117/month**

## 📚 Documentation

| File | Purpose | When to Use |
|------|---------|-------------|
| [QUICKSTART_GCLOUD.md](./QUICKSTART_GCLOUD.md) | 3-step deployment | First-time users |
| [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md) | Complete guide | Detailed instructions |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | Package overview | Understanding the package |
| [.env.gcloud.template](./.env.gcloud.template) | Config reference | Environment setup |

## 🛠️ Management

After deployment, use the management script:

```bash
./gcloud-manage.sh
```

**Features:**
- View service status and logs
- Update environment variables
- Scale resources (CPU, memory, instances)
- Database backups
- Service restart
- View costs
- Delete resources

## 💰 Cost Breakdown

| Service | Monthly Cost | Purpose |
|---------|--------------|---------|
| Cloud Run | $10-50 | App hosting |
| Cloud SQL | $10-15 | PostgreSQL database |
| Memorystore | $37 | Redis cache |
| VPC & Networking | $5-10 | Private connectivity |
| Cloud Build | $0-5 | CI/CD builds |
| **Total** | **$62-117** | |

**Free trial:** $300 credits for 90 days

## 🔧 Common Operations

### View Logs
```bash
gcloud run services logs read twenty-crm --region=us-central1
```

### Get Service URL
```bash
gcloud run services describe twenty-crm \
  --region=us-central1 \
  --format="get(status.url)"
```

### Update Environment Variable
```bash
gcloud run services update twenty-crm \
  --region=us-central1 \
  --set-env-vars="KEY=VALUE"
```

### Scale Service
```bash
gcloud run services update twenty-crm \
  --region=us-central1 \
  --min-instances=2 \
  --max-instances=20
```

### Redeploy
```bash
./deploy-gcloud.sh
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Internet (HTTPS)                    │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│        Cloud Load Balancer                  │
│              (Automatic)                    │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│          Cloud Run                          │
│    (Twenty CRM Frontend + Backend)          │
│    • Auto-scaling: 1-10 instances           │
│    • 2GB RAM, 2 CPU                         │
│    • Health checks enabled                  │
└─────┬───────────────┬───────────────────────┘
      │               │
      │               ▼
      │    ┌─────────────────────┐
      │    │  Cloud SQL          │
      │    │  PostgreSQL 16      │
      │    │  • Private IP       │
      │    │  • Auto backups     │
      │    └─────────────────────┘
      │
      ▼
┌─────────────────────┐
│  Memorystore        │
│  Redis 7.0          │
│  • 1GB memory       │
│  • Private IP       │
└─────────────────────┘
```

## 🔒 Security Features

- ✅ Non-root Docker containers
- ✅ Private database connectivity (no public IPs)
- ✅ Encrypted secrets (Secret Manager)
- ✅ VPC private networking
- ✅ HTTPS only (automatic SSL)
- ✅ Cloud IAM access control
- ✅ Regular security updates

## 🚦 Deployment Options

### Option 1: Automated (Recommended)
```bash
./deploy-gcloud.sh
```
- ⏱️ Time: 15-20 minutes
- 🎯 Difficulty: Easy
- ✅ Best for: Quick deployment

### Option 2: Manual Step-by-Step
Follow [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md)
- ⏱️ Time: 30-40 minutes
- 🎯 Difficulty: Advanced
- ✅ Best for: Learning, customization

### Option 3: CI/CD Pipeline
Use `cloudbuild.yaml` with GitHub/GitLab
- ⏱️ Time: Setup once, auto-deploy always
- 🎯 Difficulty: Intermediate
- ✅ Best for: Teams, production

## 🎨 Customization

### Scale Up (Production)
```bash
# High-traffic configuration
gcloud run services update twenty-crm \
  --memory=4Gi \
  --cpu=4 \
  --min-instances=3 \
  --max-instances=50
```

### Scale Down (Development)
```bash
# Cost-optimized configuration
gcloud run services update twenty-crm \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3
```

### Custom Domain
```bash
gcloud run domain-mappings create \
  --service=twenty-crm \
  --domain=crm.yourdomain.com \
  --region=us-central1
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

### Service Won't Start
```bash
# Check service logs
gcloud run services logs read twenty-crm \
  --region=us-central1 \
  --limit=100
```

### Database Connection Issues
```bash
# Verify Cloud SQL instance
gcloud sql instances describe twenty-db

# Check VPC connector
gcloud compute networks vpc-access connectors describe \
  twenty-vpc-connector --region=us-central1
```

### Test Locally
```bash
docker build -f Dockerfile.cloudrun -t twenty-test .
docker run -p 8080:8080 -e PORT=8080 twenty-test
# Visit: http://localhost:8080
```

## 📊 Monitoring

### View Service Metrics
```bash
# In Google Cloud Console:
# Cloud Run → twenty-crm → Metrics
```

### Set Up Alerts
```bash
# Create log-based alert for errors
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL \
  --display-name="Twenty CRM Errors" \
  --condition-threshold-value=10
```

### Cost Monitoring
```bash
# View current month costs
gcloud billing projects describe $GCLOUD_PROJECT_ID
```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Rebuild and redeploy
./deploy-gcloud.sh
```

### Database Backup
```bash
# Manual backup
gcloud sql backups create --instance=twenty-db

# View backups
gcloud sql backups list --instance=twenty-db
```

### Update Database
```bash
# Increase storage
gcloud sql instances patch twenty-db \
  --database-flags=max_connections=200
```

## 🗑️ Cleanup

### Delete Everything
```bash
# Interactive deletion
./gcloud-manage.sh
# Select option 14

# Or manual deletion
gcloud run services delete twenty-crm --region=us-central1
gcloud sql instances delete twenty-db
gcloud redis instances delete twenty-redis --region=us-central1
```

## ✅ Pre-Deployment Checklist

- [ ] Google Cloud SDK installed
- [ ] Authenticated (`gcloud auth login`)
- [ ] Project created with billing enabled
- [ ] Region selected (default: us-central1)
- [ ] Domain ready (optional)
- [ ] OAuth credentials (optional)

## 📞 Support & Resources

- **Twenty CRM:** https://github.com/twentyhq/twenty
- **Documentation:** https://twenty.com/developers
- **Google Cloud Docs:** https://cloud.google.com/run/docs
- **Issues:** https://github.com/twentyhq/twenty/issues
- **Discord:** https://discord.gg/twenty

## 🙏 Credits

- **Twenty CRM Team:** https://twenty.com
- **Google Cloud Platform:** https://cloud.google.com
- **Deployment Package:** Created for easy Google Cloud deployment

---

**Package Version:** 1.0.0  
**Last Updated:** October 2025  
**Compatible:** Twenty CRM v0.2.1+  
**License:** AGPL-3.0

---

## 🎉 Ready to Deploy?

Choose your path:

1. **Fastest:** [QUICKSTART_GCLOUD.md](./QUICKSTART_GCLOUD.md) - 3 steps, 15 minutes
2. **Complete:** [DEPLOY_GCLOUD.md](./DEPLOY_GCLOUD.md) - Full guide with all options
3. **Overview:** [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Package details

**Happy deploying! 🚀**

