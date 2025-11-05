#!/bin/bash
cd /tmp/kavia/workspace/code-generation/cooking-to-do-list-manager-1-10/app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

