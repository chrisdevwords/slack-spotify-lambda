
import request from 'request-promise-native';

export const CMD_NOT_SUPPORTED = 'Command not supported.';

let _apiRoot;

export function setAPIRoot(url) {
    _apiRoot = url;
}

export function exec({ text, user_id, command }) {

    switch(command) {
        case '/play':
            return playTrack(text, user_id);
        case '/add':
            return queueTrack(text, user_id);
        case '/skip':
            return skipTrack();
        case '/playing':
            return getPlaying();
        case '/queue':
            return getQueue();
        default:
            const error = new Error(CMD_NOT_SUPPORTED);
            error.statusCode = 400;
            return Promise.reject(error);
    }
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
        .then((resp) => {
            return resp;
        });
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
        .then((resp) => {
            return resp;
        });
}

export function skipTrack() {
    const uri = `${_apiRoot}/api/spotify/playing`;
    return request
        .delete({
            uri,
            json: true
        })
        .then((resp) => {
            return resp;
        });

}

export function getPlaying() {
    const uri = `${_apiRoot}/api/spotify/playing/`;
    return request
        .get({
            uri,
            json: true
        })
        .then((resp) => {
            return resp;
        });
}

export function getQueue() {
    const uri = `${_apiRoot}/api/spotify/queue`;
    return request
        .get({
            uri,
            json: true
        })
        .then((resp) => {
            return resp;
        });
}

export default {};
