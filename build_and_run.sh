#!/bin/bash
set -e

echo "🚀 Building all microservices..."
mvn clean package -DskipTests

echo "🐳 Starting Docker containers..."
docker-compose up --build -d

echo "✅ Deployment started! Access API Gateway at http://localhost:8090"
echo "Check services with: docker-compose ps"
