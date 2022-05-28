const bcrypt = require('bcryptjs')
const data = {
    users:[
        {
            username:'AswinS',
            email:'aswins@gmail.com',
            password:bcrypt.hashSync('4444',10),
            isBlocked:false
        },
        {
            username:'Ashish',
            email:'ashish@gmail.com',
            password:bcrypt.hashSync('4444',10),
            isBlocked:false
        },
    ]
}

module.exports =  data