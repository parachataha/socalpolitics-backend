const bcrypt = require('bcryptjs');
require('dotenv').config();

const genPass = (password) => {
    let pass = bcrypt.hashSync(password, Number(process.env.SALT));
    return pass;
};

// console.log(genPass('12345'));

module.exports = genPass;
