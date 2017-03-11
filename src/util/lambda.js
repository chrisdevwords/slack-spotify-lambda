
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

export function response(body, statusCode = 200, headers = DEFAULT_HEADERS) {
    return {
        statusCode,
        headers,
        body: JSON.stringify(
            Object.assign({ statusCode }, body)
        )
    }
}

export default {}
