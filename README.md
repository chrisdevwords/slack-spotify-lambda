AWS Lambda for Spotify Local Slack Integration
========================================
An AWS Lambda to control local Spotify playback via Slack. Includes package script and [CircleCI](https://circleci.com) config.

[![CircleCI](https://circleci.com/gh/chrisdevwords/slack-spotify-lambda/tree/master.svg?style=shield)](https://circleci.com/gh/chrisdevwords/slack-spotify-lambda/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/chrisdevwords/slack-spotify-lambda/badge.svg?branch=master)](https://coveralls.io/github/chrisdevwords/slack-spotify-lambda?branch=master)
[![Dependency Status](https://david-dm.org/chrisdevwords/slack-spotify-lambda.svg)](https://david-dm.org/chrisdevwords/slack-spotify-lambda)
[![Dev Dependency Status](https://david-dm.org/chrisdevwords/slack-spotify-lambda/dev-status.svg)](https://david-dm.org/chrisdevwords/slack-spotify-lambda?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/chrisdevwords/slack-spotify-lambda/badge.svg)](https://snyk.io/test/github/chrisdevwords/slack-spotify-lambda)

Clone and run an instance of [Spotify Local](https://github.com/chrisdevwords/spotify-local) on a Mac mini and deploy this Lambda with the following Environmental variables:
```
SPOTIFY_LOCAL_URL=https://xxx.ngrok.io
SLACK_TOKEN=THE_TOKEN_YOUR_SLACK_APP_SENDS_IN_POST_BODY
```

Requirementsf
------------
* Requires Node v4.3.2 
* Package engine is set to strict to match [AWS Lambda Environment](https://aws.amazon.com/blogs/compute/node-js-4-3-2-runtime-now-available-on-lambda/)
* I recommend using [NVM](https://github.com/creationix/nvm)

## Running Tests
This project includes [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/). If you add to this, write more tests. And run them:
````
$ npm test
````

### Contributing
All code is transpiled from ES6 with Babel. The lint config is based on [AirBnB's eslint](https://www.npmjs.com/package/eslint-config-airbnb).
To lint the code run:
```
$ npm run lint
```

###Compiling For Upload
Make sure the bin directory has executable permissions:
````
$ chmod +x ./bin/build.sh
````
If this throws an error, trying using sudo:
```
$ sudo chmod +x .bin/build.sh
```

Transpile the ES6 and zip up the relevant files for upload by running:
````
$ npm run build
````
This should output files.zip to the project root for upload to the AWS Lambda Console.
