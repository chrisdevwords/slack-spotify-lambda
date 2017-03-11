
import { response } from './util/lambda';

const TYPE_PRIVATE = 'ephemeral';
const TYPE_PUBLIC = 'in_channel';

function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}

function handler(event, context, callback) {

    const { body } = event;
    const { command, text, token } = JSON.parse(body);
    // eslint-disable-next-line camelcaseå
    const user = body.user_name;

    if (token !== process.env.SLACK_TOKEN) {
        return callback(null,
            slackResp(`Token: "${token}" is invalid.`, 401, TYPE_PRIVATE)
        );
    }

    // todo "route" to a handler based on command
    const message = `${user} requested to ${command} ${text}`;

    return callback(null,
        slackResp(message)
    );
}

export {
    // eslint-disable-next-line import/prefer-default-export
    handler
}
