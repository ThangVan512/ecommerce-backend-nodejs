'use strict'

const development ={
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDev',
        options: {
            maxPoolSize: 50,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
}

const production ={
    app: {
        port: process.env.PRO_APP_PORT || 3000,
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopPro',
        options: {
            maxPoolSize: 50,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
}
const config = { development,production}
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];