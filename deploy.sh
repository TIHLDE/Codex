#!/usr/bin/env bash

set -e

echo "-> Loading env variables from .env file into shell"
export $(grep -v '^#' .env | xargs)

COMMIT_HASH=$(git rev-parse --short HEAD)

echo "-> Building new Docker image"
docker build --no-cache --build-arg NEXT_PUBLIC_ALLOWED_GROUP_SLUGS=$NEXT_PUBLIC_ALLOWED_GROUP_SLUGS -t codex.tihlde.org:$COMMIT_HASH .

echo "-> Stopping and removing old container"
docker rm -f codex.tihlde.org

echo "-> Starting new container"
docker run --env-file .env -p 5000:3000 --name codex.tihlde.org --restart unless-stopped -d codex.tihlde.org:$COMMIT_HASH

