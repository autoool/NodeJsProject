function isEmpty(str) {
    if (undefined == str ||
        str == '' ||
        str == 'null' ||
        str == 'NULL') {
        return true;
    }else{
        return false;
    }
}

module.exports = {
    isEmpty
}