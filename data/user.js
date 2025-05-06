const bcrypt = require('bcryptjs')

const Users = [
    {
        name: 'admin',
        email:'admin@example.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true,
        createdAt: new Date,
        updatedAt: new Date
    },
    {
        name: 'Ajit Pal',
        email:'ajitpal@example.com',
        password: bcrypt.hashSync('123456',10),
        createdAt: new Date,
        updatedAt: new Date

    },{
        name: 'user',
        email: 'user@example.com',
        password: bcrypt.hashSync('123456',10),
        createdAt: new Date,
        updatedAt: new Date

    }


];

module.exports = Users;

