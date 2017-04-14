
export function parseFormString(str = '') {
    const parts = str.split('&');
    const data = {};
    parts.forEach((item) => {
        const [key, value] = item.split('=');
        data[key] = decodeURIComponent(value);
    });
    return data;
}

export function processRequestError(req) {
    if (req instanceof Error && req.name !== 'StatusCodeError') {
        throw req;
    }
    const { statusCode = 500, error } = req;
    const err = new Error(error.error.message);
    err.statusCode = statusCode || 500;
    throw err;
}

export default {}
