#!/usr/bin/env bash

echo "SYNC SOURCES..."
rsync -avz --delete -e 'ssh' --exclude 'frontend' ./src ./package{,-lock}.json ya-cloud:/srv/alice-dev-backend

echo "INSTALLING DEPS..."
ssh ya-cloud "cd /srv/alice-dev-backend && npm install --only=prod"

echo "RESTARTING PM2..."
ssh ya-cloud "pm2 reload /srv/ecosystem.config.js --only alice-dev-backend --update-env"

echo "CHECKING..."
sleep 1
curl https://alice-skills.vitalets.xyz/alice-dev-backend/

echo ""
echo "DONE."
