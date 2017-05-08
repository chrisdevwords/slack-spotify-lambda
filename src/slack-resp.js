const { response } = require('./util/lambda');


// response types
const TYPE_PRIVATE = 'ephemeral';
const TYPE_PUBLIC = 'in_channel';

// error messages
const INVALID_TOKEN = 'Token is invalid.';

// message templates
const CMD_NOT_SUPPORTED = 'Command not supported.';
const SHUFFLING = 'Spotify player is now shuffling.';
const NOT_SHUFFLING = 'Spotify player is no longer shuffling.';
const NONE_QUEUED = 'No tracks currently queued.';

const TRACK = ({ name, artist, requestedBy }) =>
    `"${name}" by ${artist} requested by ${requestedBy}`;

const VOLUME = vol => `Volume is at ${vol}`;

const VOLUME_SET = (vol, user) =>
    `Volume set to ${vol} by ${user}.`;

const CURRENT_PL = ({ title }) =>
    `Current Playlist is "${title}".`;

const PL_SET = ({ title }) =>
    `Current Playlist set to "${title}".`;

const ADDED  = (track, position) =>
    // eslint-disable-next-line babel/new-cap
    `${TRACK(track)} at position ${position}.`;

const NOW_PLAYING = track =>
    // eslint-disable-next-line babel/new-cap
    `Now playing ${TRACK(track)}.`;

const SKIPPED = (current, { name, requestedBy }) =>
    // eslint-disable-next-line babel/new-cap
    `Skipped "${name}" requested by ${requestedBy}. ${NOW_PLAYING(current)}`;

const ALBUM_ADDED = (position, { artist, name }, by) =>
    `Album "${name}" by ${artist} queued by ${by} at position ${position}`;

const PAUSED = track =>
    // eslint-disable-next-line babel/new-cap
    `Pausing ${TRACK(track)}.`;

const RESUMED = track =>
    // eslint-disable-next-line babel/new-cap
    `Resuming ${TRACK(track)}.`;

const SAID = (text, user) =>
    `${user} said "${text}".`;

const printQueue = tracks => tracks.map(TRACK).join('\n');

const QUEUE = tracks =>
    `${tracks.length} tracks queued... \n ${printQueue(tracks)}`;

function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}

module.exports = {
    TYPE_PRIVATE,
    TYPE_PUBLIC,
    INVALID_TOKEN,
    CMD_NOT_SUPPORTED,
    SHUFFLING,
    NOT_SHUFFLING,
    TRACK,
    CURRENT_PL,
    PL_SET,
    ADDED,
    NOW_PLAYING,
    SKIPPED,
    ALBUM_ADDED,
    PAUSED,
    RESUMED,
    QUEUE,
    NONE_QUEUED,
    VOLUME,
    VOLUME_SET,
    SAID,
    printQueue,
    slackResp
};
