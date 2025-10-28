const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function encodeBase62(num) {
    if (num === 0) return '000000';
    let result = '';
    while (num > 0) {
        result = BASE62_CHARS[num % 62] + result;
        num = Math.floor(num / 62);
    }
    // Pad with leading '0's to make it 6 characters
    while (result.length < 6) {
        result = '0' + result;
    }
    return result;
}

module.exports = { encodeBase62 };
