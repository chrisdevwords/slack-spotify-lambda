
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

function response(body, statusCode = 200, headers = DEFAULT_HEADERS) {
    return {
        statusCode,
        headers,
        body: JSON.stringify(
            Object.assign({ statusCode }, body)
        )
    }
}

module.exports = {
    response
};
