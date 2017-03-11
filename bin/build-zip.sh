#!/bin/bash
rm -rf files.zip
mkdir files
cp ./package.json ./files/
cp -r ./dist ./files
cd ./files && npm i --production
zip files.zip -r ./node_modules ./dist ./package.json
mv files.zip ../
cd ../
rm -rf ./files
