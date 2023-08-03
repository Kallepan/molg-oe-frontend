#!/bin/bash

VERSION=v2

export $(grep -v '^#' ../../.env | xargs)

echo $DOCKER_REGISTRY_PASSWORD | docker login --username $DOCKER_REGISTRY_USERNAME --password-stdin

cd ../../.
docker build -t kallepan/oe-frontend:${VERSION} .
docker push kallepan/oe-frontend:${VERSION}

cd infrastructure/base
kubectl --kubeconfig $KUBECONFIG kustomize . > run.yaml
sed -i "s/IMAGE_TAG/${VERSION}/g" run.yaml
kubectl --kubeconfig $KUBECONFIG apply -f run.yaml