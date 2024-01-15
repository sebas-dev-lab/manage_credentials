#!/bin/bash


echo "Dir: $(pwd)"
npm run migration:run
npm run start:local
