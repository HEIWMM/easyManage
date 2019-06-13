function getUploadDirName() {
    const date = new Date();
    let month = Number.parseInt(date.getMonth()) + 1;
    month = month.toString().length > 1 ? month : `0${month}`;
    const dir = `${date.getFullYear()}${month}${date.getDate()}`;
    return dir;
}
const path = require('path');
const fs = require('fs');

function checkDirExist(p) {
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p);
    }
}
function getUploadFileExt(name) {
    let ext = name.split('.');
    return ext[ext.length - 1];
}
function getUploadFileName() {
    let date = new Date();
    let time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
    return time;
}
module.exports = {
    getUploadDirName,
    checkDirExist,
    getUploadFileExt,
    getUploadFileName
}