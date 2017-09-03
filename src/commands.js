const request = require('request-promise-native');

const {
    CMD_NOT_SUPPORTED,
    NOW_PLAYING,
    SKIPPED,
    ADDED,
    ALBUM_ADDED,
    CURRENT_PL,
    PL_SET,
    QUEUE,
    INVALID_NUMBER,
    QUEUE_CLEARED,
    DEQUEUED,
    NONE_QUEUED,
    SHUFFLING,
    NOT_SHUFFLING,
    PAUSED,
    RESUMED,
    VOLUME,
    VOLUME_SET,
    SOMEONE_ELSE_IS_TALKING
} = require('./slack-resp');


let _apiRoot;

const isAlbumLink = link =>
    link.includes(':album:') || link.includes('/album/');

function setAPIRoot(url) {
    _apiRoot = url;
}

function playTrack(track, requestedBy) {
    const uri = `${_apiRoot}/api/spotify/playing`;
    const body = {
        track,
        requestedBy
    };
    return request
        .post({
            uri,
            body,
            json: true
        })
        .then(resp =>
            // eslint-disable-next-line babel/new-cap
            NOW_PLAYING(resp.track)
        );
}

function queueTrack(track, requestedBy) {
    const uri = `${_apiRoot}/api/spotify/queue`;
    const body = {
        track,
        requestedBy
    };
    return request
        .post({
            uri,
            body,
            json: true
        })
        .then(resp =>
            // eslint-disable-next-line babel/new-cap
            ADDED(resp.track, resp.position)
        );
}

function queueAlbum(link, requestedBy) {
    const uri = `${_apiRoot}/api/spotify/queue/album`;
    const body = {
        album: link,
        requestedBy
    };
    return request
        .post({
            uri,
            body,
            json: true
        })
        .then(({ album, position }) =>
            // eslint-disable-next-line babel/new-cap
            ALBUM_ADDED(position, album, requestedBy)
        );
}

function skipTrack() {
    const uri = `${_apiRoot}/api/spotify/playing`;
    return request
        .delete({
            uri,
            json: true
        })
        .then(({ currentTrack, skippedTrack }) =>
            // eslint-disable-next-line babel/new-cap
            SKIPPED(currentTrack, skippedTrack)
        );

}

function getPlayingTrack() {
    return request
        .get({
            uri:`${_apiRoot}/api/spotify/playing/`,
            json: true
        });
}

function getPlaying() {
    return getPlayingTrack()
        .then(({ track }) =>
            // eslint-disable-next-line babel/new-cap
            NOW_PLAYING(track)
        );
}

function getQueue() {
    const uri = `${_apiRoot}/api/spotify/queue`;
    return request
        .get({
            uri,
            json: true
        })
        .then(({ tracks }) => {
            if (!tracks.length) {
                return NONE_QUEUED;
            }
            // eslint-disable-next-line babel/new-cap
            return QUEUE(tracks);
        });
}

function deQueue(trackNumber, user) {
    const index = trackNumber - 1;
    const uri = `${_apiRoot}/api/spotify/queue/${index}`;
    return request
        .delete({
            uri,
            json: true
        })
        .then(({ track }) =>
            DEQUEUED(track, user)
        );
}

function clearQueue(user) {
    const uri = `${_apiRoot}/api/spotify/queue`;
    return request
        .delete({
            uri,
            json: true
        })
        .then(({ tracks }) => {
            if (tracks.length) {
                return QUEUE_CLEARED(tracks, user);
            }
            return NONE_QUEUED;
        });
}

function getPlaylist() {
    const uri = `${_apiRoot}/api/spotify/playlist`;
    return request
        .get({
            uri,
            json: true
        })
        .then(({ playlist }) =>
            // eslint-disable-next-line babel/new-cap
            CURRENT_PL(playlist)
        );
}

function setPlaylist(playlist) {
    const uri = `${_apiRoot}/api/spotify/playlist`;
    const body = { playlist }
    return request
        .post({
            uri,
            body,
            json: true
        })
        .then(resp =>
            // eslint-disable-next-line babel/new-cap
            PL_SET(resp.playlist)
        );
}

function toggleShuffle() {
    const uri = `${_apiRoot}/api/spotify/shuffle`;
    return request
        .post({
            uri,
            json: true
        })
        .then(({ shuffling }) => {
            if (shuffling) {
                return SHUFFLING;
            }
            return NOT_SHUFFLING;
        });
}

function pause() {
    return getPlayingTrack()
        .then(({ track }) =>
            request
                .post({
                    uri: `${_apiRoot}/api/spotify/pause`,
                    json: true,
                    body: {
                        paused: true
                    }
                })
                // eslint-disable-next-line babel/new-cap
                .then(() => PAUSED(track))
        );
}

function resume() {
    return getPlayingTrack()
        .then(({ track }) =>
            request
                .post({
                    uri: `${_apiRoot}/api/spotify/pause`,
                    json: true,
                    body: {
                        paused: false
                    }
                })
                // eslint-disable-next-line babel/new-cap
                .then(() => RESUMED(track))
        );
}

function getVolume() {
    const uri = `${_apiRoot}/api/os/volume`;
    return request
        .get({
            uri,
            json: true
        })
        .then(({ volume }) =>
            VOLUME(volume)
        );
}

function setVolume(volume, user) {
    const uri = `${_apiRoot}/api/os/volume`;
    return request
        .post({
            uri,
            json: true,
            body: {
                volume
            }
        })
        .then(resp =>
            VOLUME_SET(resp.volume, user)
        );
}

function say(text) {
    const uri = `${_apiRoot}/api/os/speech`;
    return request
        .post({
            uri,
            json: true,
            body: {
                message: text.split('+').join(' ')
            }
        })
        .then(() => '')
        .catch((err) => {
            if (err.statusCode === 429) {
                return SOMEONE_ELSE_IS_TALKING
            }
            return Promise.reject(err);
        })
}

function radio(text, responseUri) {

}


function exec({ text, user_name, command, response_url }) {

    let error;

    switch (command) {
        case '/play':
            return playTrack(text, user_name);
        case '/add':
            if (isAlbumLink(text)) {
                return queueAlbum(text, user_name)
            }
            return queueTrack(text, user_name);
        case '/volume':
            if (text.trim().length && !isNaN(text)) {
                return setVolume(text, user_name);
            }
            return getVolume();
        case '/skip':
            return skipTrack();
        case '/playing':
            return getPlaying();
        case '/queue':
            return getQueue();
        case '/dequeue':
            if (isNaN(text)) {
                if (text.toLowerCase().trim() === 'all') {
                    return clearQueue(user_name)
                }
                error = new Error(INVALID_NUMBER(text));
                error.statusCode = 400;
                return Promise.reject(error);
            }
            return deQueue(text, user_name);

        case '/shuffle':
            return toggleShuffle();
        case '/pause':
            return pause();
        case '/resume':
            return resume();
        case '/say':
            return say(text);
        case '/playlist':
            if (text) {
                return setPlaylist(text);
            }
            return getPlaylist();
        default:
            error = new Error(CMD_NOT_SUPPORTED);
            error.statusCode = 400;
            return Promise.reject(error)
    }
}

module.exports = {
    setAPIRoot,
    exec
};
