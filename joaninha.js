function isValidHexadecimalColor(hexadecimalString) {
    const validCharacters = ["a", "b", "c", "d", "e", "f","1","2","3","4","5","6","7","8","9"];

    for(let i = 1; i < hexadecimalString.length; i++) {
        if(!validCharacters.includes(hexadecimalString[i].toLowerCase())) return false;
    }

    const conditions = [
        hexadecimalString.length === 4 || hexadecimalString.length === 7,
        hexadecimalString[0] === '#',
    ]

    for(condition of conditions) { if(!condition) return false; }

    return true;
}
