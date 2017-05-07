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

Requirements
------------
* Requires Node v6.10 
* Package engine is set to strict to match [AWS Lambda Environment](https://aws.amazon.com/about-aws/whats-new/2017/03/aws-lambda-supports-node-js-6-10/)
* I recommend using [NVM](https://github.com/creationix/nvm)

## Slash Commands
Add the following commands to your Slack app in order to control an instance of [Spotify Local](https://github.com/chrisdevwords/spotify-local).
When adding the slash commands to Slack be sure to point all commands at a POST endpoint for the Lambda's corresponding API Gateway. 

### What's currently playing?
```
/playing
```

### Skip the track that's currently playing. Be nice.
```
/skip
```

### Add a track to the queue.
``` 
/add [spotify track id, uri or http link]
```

### Print the list of queued tracks.
```
/queue
```

### Get or set the default playlist.
``` 
# sets the playlist
/playlist [spotify playlist id, uri or http link]

# gets the playlist
/playlist
```

### Plays a song immediately.
``` 
/play [spotify track id, uri or http link]
```

### Toggle shuffle of playlist playback. 
```
/shuffle
```

### Pause the music. 
```
/pause
```

### Resume the music. 
```
/resume
```

### Get or set the volume to a number between 0 and 100.
``` 
# sets the volume
/volume 0

# gets the playlist
/volume
```

## Running Tests
This project includes [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/). If you add to this, write more tests. And run them:
````
$ npm test
````

### Contributing
The lint config is based on [AirBnB's eslint](https://www.npmjs.com/package/eslint-config-airbnb).
To lint the code run:
```
$ npm run lint
```

### Compiling For Upload
Make sure the bin directory has executable permissions:
````
$ chmod +x ./bin/build.sh
````
If this throws an error, trying using sudo:
```
$ sudo chmod +x .bin/build.sh
```

Zip up the source code and runtime dependencies for upload by running:
````
$ npm run build
````
This should output files.zip to the project root for upload to the AWS Lambda Console.
