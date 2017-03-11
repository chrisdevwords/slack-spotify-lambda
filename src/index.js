

function handler(event, context, callback) {

    const { body } = event;

    callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            text: 'it works.',
            body: JSON.stringify(body)
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export {
    // eslint-disable-next-line import/prefer-default-export
    handler
}
