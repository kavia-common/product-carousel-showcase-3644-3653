#!/bin/bash
cd /home/kavia/workspace/code-generation/product-carousel-showcase-3644-3653/frontend_carousel_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

