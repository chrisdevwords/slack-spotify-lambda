
import { response } from './util/lambda';

// response types
export const TYPE_PRIVATE = 'ephemeral';
export const TYPE_PUBLIC = 'in_channel';

// error messages
const INVALID_TOKEN = 'Token is invalid.';

// message templates
export const CMD_NOT_SUPPORTED = 'Command not supported.';

export const NOW_PLAYING = (track) =>
    `Now playing ${TRACK(track)}`;

export const SKIPPED = (current, skipped) =>
    `Skipped "${skipped.name}" requested by ${skipped.requestedBy}. ` +
        NOW_PLAYING(current);

export const TRACK = ({ name, artist, requestedBy }) =>
    `"${name}" by ${artist} requested by ${requestedBy}. `

export function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}

export default {}
