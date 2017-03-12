
import { parseFormString } from './util/parse';
import { exec, setAPIRoot } from './commands';
import {
    slackResp,
    INVALID_TOKEN,
    TYPE_PRIVATE,
    TYPE_PUBLIC
} from './slack-resp';

function handler(event, context, callback) {

    const {
        SLACK_TOKEN,
        SPOTIFY_LOCAL_URL
    } = process.env;

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
        exec({ command, text, user_name })
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
