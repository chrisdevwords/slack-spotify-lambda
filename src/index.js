
import { response } from './util/lambda';
import { parseFormString } from './util/parse';
import { process, setAPIRoot } from './commands';
import testEnv from './test-env-config';


const TYPE_PRIVATE = 'ephemeral';
const TYPE_PUBLIC = 'in_channel';

const INVALID_TOKEN = 'Token is invalid.'

const ENV = process.env || testEnv;

const { SLACK_TOKEN, SPOTIFY_LOCAL_URL } = ENV;

function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}

function handler(event, context, callback) {

    try {

        const {
            SLACK_TOKEN
        } = process.env;

        const {
            command,
            text,
            token,
            user_name
        } = parseFormString(event.body);

        if (token !== SLACK_TOKEN) {
            return callback(null,
                slackResp(`Token: "${token}" is invalid.`, 401, TYPE_PRIVATE)
            );
        }

        // todo "route" to a handler based on command
        // eslint-disable-next-line camelcase
        const message = `${user_name} requested to ${command} ${text}`;

        return callback(null,
            slackResp(message)
        );

    } catch (err) {
        return callback(null,
            slackResp(err.message, 500)
        );
    }
}

export {
    // eslint-disable-next-line import/prefer-default-export
    handler
}
