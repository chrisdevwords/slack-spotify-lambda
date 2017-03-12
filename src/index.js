
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

    const {
        command,
        text,
        token,
        user_name
    } = parseFormString(event.body);

    if (token !== SLACK_TOKEN) {
        callback(null,
            slackResp(
                INVALID_TOKEN,
                401,
                TYPE_PRIVATE
            )
        );
    } else {
        setAPIRoot(SPOTIFY_LOCAL_URL);
        process({ command, text, user_name })
            .then((message) => {
                callback(null,
                    slackResp(message)
                );
            })
            .catch(({ message, statusCode = 500 }) => {
                callback(null,
                    slackResp(message, statusCode, TYPE_PRIVATE)
                );
            });
    }
}

export {
    // eslint-disable-next-line import/prefer-default-export
    handler
}
