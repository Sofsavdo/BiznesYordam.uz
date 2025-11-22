#!/bin/bash
cd "$(dirname "$0")"
export NODE_ENV=development
export PORT=5000
exec npm run dev
