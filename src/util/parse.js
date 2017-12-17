function parseFormString(str = '') {
    const parts = str.split('&');
    const data = {};
    parts.forEach((item) => {
        const [key, value] = item.split('=');
        data[key] = decodeURIComponent(value);
    });
    return data;
}

function extractFromUri(uri, property) {
    const arr = uri.split(':');
    const propIndex = arr.indexOf(property);
    if (propIndex === -1) {
        return undefined;
    }
    return arr[propIndex + 1];
}


module.exports = {
    parseFormString,
    extractFromUri
};
