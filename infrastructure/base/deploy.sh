#!/bin/bash

VERSION=1.1.0

export $(grep -v '^#' ../../.env | xargs)

echo $DOCKER_REGISTRY_PASSWORD | docker login --username $DOCKER_REGISTRY_USERNAME --password-stdin

cd ../../.
docker build -t kallepan/oe-frontend:${VERSION} .
docker push kallepan/oe-frontend:${VERSION}

cd infrastructure/base
kubectl kustomize . > run.yaml
sed -i "s/IMAGE_TAG/${VERSION}/g" run.yaml
kubectl apply -f run.yaml