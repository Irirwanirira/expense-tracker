# Expense Tracker - Deployment Guide

This guide covers deployment options for the Expense Tracker application.

## Quick Start with Docker Compose

### Prerequisites
- Docker Desktop or Docker Engine installed
- Docker Compose installed

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repo>
   cd expense-tracker
   ```

2. **Create environment file**
   ```bash
   cp back-end/.env.example back-end/.env.local
   # Edit .env.local with your configuration
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Rebuild After Code Changes
```bash
docker-compose up --build -d
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f mongodb
docker-compose logs -f frontend
```

---

## Production Deployment

### Environment Variables (Production)

Create `.env` file with production values:

```
NODE_ENV=production
PORT=5000
DB_URL=mongodb+srv://[username]:[password]@[cluster].mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=[long-random-string-min-32-chars]
CORS_ORIGIN=https://yourdomain.com
```

### Docker Image Build

**Backend**
```bash
cd back-end
docker build -t expense-tracker-backend:latest .
docker tag expense-tracker-backend:latest myregistry/expense-tracker-backend:latest
docker push myregistry/expense-tracker-backend:latest
```

**Frontend**
```bash
cd front-end
docker build -t expense-tracker-frontend:latest .
docker tag expense-tracker-frontend:latest myregistry/expense-tracker-frontend:latest
docker push myregistry/expense-tracker-frontend:latest
```

### Kubernetes Deployment (Optional)

See `k8s/` directory for sample Kubernetes manifests.

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Docker Swarm (Alternative)

```bash
docker swarm init
docker stack deploy -c docker-compose.prod.yml expense-tracker
```

---

## CI/CD Pipeline

### GitHub Actions

The repository includes a CI/CD pipeline (`.github/workflows/ci-cd.yml`) that:

1. **On every push to main/phase-3-features:**
   - Runs TypeScript linting
   - Builds the project
   - Runs security audits
   - Builds Docker images

2. **On pull requests to main:**
   - Runs all above checks
   - Tests against multiple Node versions (18, 20)
   - Tests with MongoDB service

### Manual Trigger
```bash
# Push to trigger pipeline
git push origin main
```

---

## Health Checks

The application includes health check endpoints:

**Backend**
```bash
curl http://localhost:5000/health
# Response: {"status":"OK","message":"Server is running"}
```

---

## Database Backups

### MongoDB Backup
```bash
# Backup
docker exec expense-tracker-mongodb mongodump --uri mongodb://admin:password@localhost:27017 --out /backups

# Restore
docker exec expense-tracker-mongodb mongorestore --uri mongodb://admin:password@localhost:27017 /backups
```

---

## Scaling Considerations

### Load Balancing
- Use NGINX/HAProxy in front of multiple backend instances
- Configure DNS to round-robin between instances

### Database
- Consider MongoDB Atlas for managed database
- Implement connection pooling
- Enable read replicas for scaling read operations

### Caching
- Consider Redis for session/cache layer
- Cache reports generated in Phase 3 M4

### Monitoring
- Integrate with monitoring tools (DataDog, New Relic, Prometheus)
- Set up log aggregation (ELK Stack, Splunk)
- Configure alerts for critical metrics

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Verify connection
docker exec expense-tracker-mongodb mongosh -u admin -p password
```

### Backend Connection Issues
```bash
# Check backend logs
docker-compose logs backend

# Verify MongoDB URL in .env file
cat back-end/.env.local | grep DB_URL
```

### Performance Issues
1. Check database indexes: `db.transactions.getIndexes()`
2. Monitor query performance with MongoDB profiler
3. Review Docker resource limits
4. Check application logs for slow queries

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use strong JWT_SECRET** - Minimum 32 characters
3. **Enable HTTPS** - Use reverse proxy (NGINX) with SSL/TLS
4. **Database access** - Restrict MongoDB to internal network only
5. **CORS** - Set CORS_ORIGIN to specific domain in production
6. **Regular updates** - Keep dependencies updated (`npm audit fix`)
7. **Monitoring** - Monitor for unusual API patterns

---

## Support

For issues or questions about deployment:
1. Check CI/CD logs in GitHub Actions
2. Review Docker logs: `docker-compose logs`
3. Check database connectivity and indexes
4. Verify all environment variables are set correctly
