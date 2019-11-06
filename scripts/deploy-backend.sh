#!/usr/bin/env bash

echo "COPY SOURCES..."
rsync -avz --delete -e 'ssh' ./src/back ./src/shared ./package{,-lock}.json ya-cloud:/srv/alice-dev-backend

echo "INSTALLING DEPS..."
ssh ya-cloud "cd /srv/alice-dev-backend && npm ci --only=prod"

echo "RESTARTING PM2..."
ssh ya-cloud "pm2 reload /srv/ecosystem.config.js --only alice-dev-backend --update-env"

echo "PING..."
ping https://alice-skills.vitalets.xyz/alice-dev-backend

echo "DONE."
