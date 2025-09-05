#!/usr/bin/env bash

set -e

echo "-> Pulling latest changes from remote"
git fetch

echo "-> Hard resetting on origin/main"
git reset --hard origin/main

echo "-> Loading env variables from .env file into shell"
export $(grep -v '^#' .env | xargs)

echo "-> Building new Docker image"
docker build --build-arg NEXT_PUBLIC_ALLOWED_GROUP_SLUGS=$NEXT_PUBLIC_ALLOWED_GROUP_SLUGS -t codex.tihlde.org .

echo "-> Stopping and removing old container"
docker rm -f codex.tihlde.org

echo "-> Starting new container"
docker run --env-file .env -p 5000:3000 --name codex.tihlde.org --restart unless-stopped -d codex.tihlde.org
