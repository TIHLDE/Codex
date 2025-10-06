#!/usr/bin/env bash

set -e

################################
# CONFIGURATION
# Change these values as needed
DOMAIN="codex.tihlde.org"
PORT=5000
ENV_FILE_PATH=".env"
################################

COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_NAME="$DOMAIN:$COMMIT_HASH"

echo "-> Loading env variables from .env file into shell"
export $(grep -v '^#' .env | xargs)

echo "-> Building new Docker image"
docker build --build-arg NEXT_PUBLIC_ALLOWED_GROUP_SLUGS=$NEXT_PUBLIC_ALLOWED_GROUP_SLUGS --no-cache -t $IMAGE_NAME .

echo "-> Stopping and removing old container"
docker rm -f $DOMAIN || true

echo "-> Starting new container"
docker run --env-file $ENV_FILE_PATH -p $PORT:3000 --name $DOMAIN --restart unless-stopped -d $IMAGE_NAME
