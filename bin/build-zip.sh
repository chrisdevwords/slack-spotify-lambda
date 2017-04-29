#!/bin/bash
rm -rf files.zip
mkdir files
cp ./package.json ./files/
cp -r ./src ./files
cd ./files && npm i --production
zip files.zip -r ./node_modules ./src ./package.json
mv files.zip ../
cd ../
rm -rf ./files
