
import request from 'request-promise-native';
import {
    CMD_NOT_SUPPORTED,
    NOW_PLAYING,
    SKIPPED,
    ADDED,
    ALBUM_ADDED,
    CURRENT_PL,
    PL_SET,
    QUEUE,
    SHUFFLING,
    NOT_SHUFFLING,
    PAUSED,
    RESUMED,
} from './slack-resp';

let _apiRoot;

export const isAlbumLink = link =>
    link.includes(':album:') || link.includes('/album/');

export function setAPIRoot(url) {
    _apiRoot = url;
}

export function playTrack(track, requestedBy) {
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

export function queueTrack(track, requestedBy) {
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

export function queueAlbum(link, requestedBy) {
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

export function skipTrack() {
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

export function getPlaying() {
    return getPlayingTrack()
        .then(({ track }) =>
            // eslint-disable-next-line babel/new-cap
            NOW_PLAYING(track)
        );
}

export function getQueue() {
    const uri = `${_apiRoot}/api/spotify/queue`;
    return request
        .get({
            uri,
            json: true
        })
        .then(({ tracks }) => {
            if (!tracks.length) {
                return 'No tracks currently queued.';
            }
            // eslint-disable-next-line babel/new-cap
            return QUEUE(tracks);
        });
}

export function getPlaylist() {
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

export function setPlaylist(playlist) {
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

export function toggleShuffle() {
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

export function pause() {
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

export function resume() {
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

export function exec({ text, user_name, command }) {

    let error;

    switch (command) {
        case '/play':
            return playTrack(text, user_name);
        case '/add':
            if (isAlbumLink(text)) {
                return queueAlbum(text, user_name)
            }
            return queueTrack(text, user_name);
        case '/skip':
            return skipTrack();
        case '/playing':
            return getPlaying();
        case '/queue':
            return getQueue();
        case '/shuffle':
            return toggleShuffle();
        case '/pause':
            return pause();
        case '/resume':
            return resume();
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

export default {};
