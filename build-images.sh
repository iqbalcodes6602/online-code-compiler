#!/usr/bin/env bash
set -e

DOCKER_USER="iqbalcodes6602"
PROJECT="occ"

# Folder → Service mappings
FOLDERS=("proxy")
SERVICES=("nginx")

for i in "${!FOLDERS[@]}"; do
  FOLDER="${FOLDERS[$i]}"
  SERVICE="${SERVICES[$i]}"
  IMAGE="$DOCKER_USER/$PROJECT-$SERVICE:latest"

  echo "🔨 Building $IMAGE for linux/amd64,linux/arm64..."

  docker buildx build \
    --platform linux/amd64,linux/arm64 \
    -t "$IMAGE" \
    "./$FOLDER" \
    --push
done

echo "✅ All multi-arch images built and pushed successfully!"
