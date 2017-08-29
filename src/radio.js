const request = require('request-promise-native');
const { extractFromUri } = require('./util/parse')

const API_BASE = 'https://api.spotify.com/v1';
const ERROR_EXPIRED_TOKEN = 'Spotify User Access token ' +
    'is expired or invalid. ' +
    'Please check the Spotify host machine.';
const ERROR_INVALID_TRACK_URI = 'Please provide a uri ' +
    'for a valid Spotify track.';
const TRACK_ENDPOINT = id =>
    `${API_BASE}/tracks/${id}`;

module.exports = {

    ERROR_INVALID_TRACK_URI,
    ERROR_EXPIRED_TOKEN,

    handleStatusCodeError(err) {
        if (err.error) {
            let message;
            switch (err.statusCode) {
                case 404:
                case 400:
                    message = ERROR_INVALID_TRACK_URI;
                    break;
                case 401:
                    message = ERROR_EXPIRED_TOKEN;
                    break;
                default:
                    message = err.error.error.message;
            }
            const error = Error(message);
            error.statusCode = err.statusCode;
            throw error;
        }
        return Promise.reject(err)
    },

    getTrackInfo(trackId, accessToken) {
        return request
            .get({
                uri: TRACK_ENDPOINT(trackId),
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                json: true
            })
            .then(({ artists, name, popularity }) => ({
                name,
                artist:  artists
                    .map(a => a.name)
                    .join(', '),
                artistIds: artists
                    .map(a => a.id),
                popularity,
                id: trackId
            }))
            .catch(this.handleStatusCodeError);

    },

    createRadioStation(text, accessToken, responseUrl) {

    }
};
