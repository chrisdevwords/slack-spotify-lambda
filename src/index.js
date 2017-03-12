
import { response } from './util/lambda';
import { parseFormString } from './util/parse';
import { process, setAPIRoot } from './commands';
import testEnv from './test-env-config';


const TYPE_PRIVATE = 'ephemeral';
const TYPE_PUBLIC = 'in_channel';

const INVALID_TOKEN = 'Token is invalid.';

function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}


function handler(event, context, callback) {

    let slackToken;

    console.log('***', JSON.stringify(process.env));

    try {
        slackToken = process.env.SLACK_TOKEN;
        setAPIRoot(process.env.SPOTIFY_LOCAL_URL);
    } catch (err) {
        slackToken = testEnv.SLACK_TOKEN;
        setAPIRoot(testEnv.SPOTIFY_LOCAL_URL);
    }

    const {
        command,
        text,
        token,
        user_name
    } = parseFormString(event.body);

    if (token !== slackToken) {
        callback(null,
            slackResp(
                INVALID_TOKEN,
                401,
                TYPE_PRIVATE
            )
        );
    } else {
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
