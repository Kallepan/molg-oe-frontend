#!/bin/bash

export $(grep -v '^#' .env | xargs)

echo $DOCKER_REGISTRY_PASSWORD | docker login --username $DOCKER_REGISTRY_USERNAME --password-stdin

docker build -t kallepan/oe-frontend:dev -f Dockerfile.staging .
docker push kallepan/oe-frontend:dev

cd infrastructure/staging
kubectl delete deployment oe-frontend -n genetics
kubectl kustomize . > run.yaml
kubectl apply -f run.yaml