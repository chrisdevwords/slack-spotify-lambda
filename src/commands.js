
import request from 'request-promise-native';
import {
    CMD_NOT_SUPPORTED,
    NOW_PLAYING,
    SKIPPED,
    ADDED,
    CURRENT_PL,
    PL_SET,
    QUEUE
} from './slack-resp';

let _apiRoot;

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

export function getPlaying() {

    const uri = `${_apiRoot}/api/spotify/playing/`;

    return request
        .get({
            uri,
            json: true
        })
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
        });
}

export function exec({ text, user_name, command }) {

    let error;

    switch (command) {
        case '/play':
            return playTrack(text, user_name);
        case '/add':
            return queueTrack(text, user_name);
        case '/skip':
            return skipTrack();
        case '/playing':
            return getPlaying();
        case '/queue':
            return getQueue();
        case '/shuffle':
            return toggleShuffle();
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
