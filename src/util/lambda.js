
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

function response(body, statusCode = 200, headers = {}) {
    return {
        statusCode,
        headers: Object.assign({}, DEFAULT_HEADERS, headers),
        body: JSON.stringify(
            Object.assign({ statusCode }, body)
        )
    }
}

module.exports = {
    response
};
