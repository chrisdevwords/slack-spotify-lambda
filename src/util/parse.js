
export function parseFormString(str = '') {
    const parts = str.split('&');
    const data = {};
    parts.forEach((item) => {
        const [key, value] = item.split('=');
        data[key] = decodeURIComponent(value);
    });
    return data;
}

export default {}
