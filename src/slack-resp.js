
import { response } from './util/lambda';

// response types
export const TYPE_PRIVATE = 'ephemeral';
export const TYPE_PUBLIC = 'in_channel';

// error messages
export const INVALID_TOKEN = 'Token is invalid.';

// message templates
export const CMD_NOT_SUPPORTED = 'Command not supported.';

export const TRACK = ({ name, artist, requestedBy }) =>
    `"${name}" by ${artist} requested by ${requestedBy}`;

export const CURRENT_PL = ({ title }) =>
    `Current Playlist is "${title}".`;

export const PL_SET = ({ title }) =>
    `Current Playlist set to "${title}".`;

export const ADDED  = (track, position) =>
    // eslint-disable-next-line babel/new-cap
    `${TRACK(track)} at position ${position}.`;

export const NOW_PLAYING = track =>
    // eslint-disable-next-line babel/new-cap
    `Now playing ${TRACK(track)}.`;

export const SKIPPED = (current, { name, requestedBy }) =>
    // eslint-disable-next-line babel/new-cap
    `Skipped "${name}" requested by ${requestedBy}. ${NOW_PLAYING(current)}`;

export function printQueue(tracks) {
    return tracks.map(track => `${TRACK(track)}\n`)
}

export const QUEUE = ({ tracks }) =>
    `${tracks.length} tracks queued... \n ${printQueue(tracks)}`;

export function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}

export default {}
