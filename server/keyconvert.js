const fs = require('fs');
const key = fs.readFileSync('../../zap-shift-737f5-firebase-adminsdk-fbsvc-f47138e57a.json', 'utf8')
const base64 = Buffer.from(key).toString('base64')
console.log(base64)