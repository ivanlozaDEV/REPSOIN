#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias de Node.js
npm install
npm run build

# Instalar dependencias de Python usando pipenv
pipenv install
