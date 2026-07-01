#!/bin/bash

set -e

echo "=================================="
echo "Starting Deployment..."
echo "=================================="

# Go to project directory
cd /home/ubuntu/rgh-backend

echo "Stopping existing containers..."
docker compose down

echo "Building latest Docker images..."
docker compose build --no-cache

echo "Starting containers..."
docker compose up -d

echo "Waiting for application..."
sleep 30

echo "Checking container status..."
docker ps

echo "Deployment completed successfully."
