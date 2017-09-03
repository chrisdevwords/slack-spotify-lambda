const { parseFormString } = require('./util/parse');
const { exec, setAPIRoot } = require('./commands');
const radio = require('./radio');
const {
    slackResp,
    INVALID_TOKEN,
    TYPE_PRIVATE
} = require('./slack-resp');


function handler(event, context, callback) {

    const {
        SLACK_TOKEN,
        SPOTIFY_LOCAL_URL,
        SPOTIFY_USER_ACCESS_TOKEN,
        RADIO_LAMBDA
    } = process.env;

    const {
        command,
        text,
        token,
        response_url,
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
        radio.setAccessToken(SPOTIFY_USER_ACCESS_TOKEN);
        radio.setFunctionARN(RADIO_LAMBDA);
        exec({ command, text, user_name, response_url })
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

module.exports = {
    handler
};
