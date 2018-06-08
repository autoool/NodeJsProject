module.exports = {
   
    miniProgram:{
        appId:'wxb412102b28ce469a',
        appSecret:'a4b319046c5cf81df7fd6dd77acf4474',
        templateId:'Q7W_mRgF_v4vlPCKpjcm579GylXciYDfp-ir9GJvHUA',
        openUrl:'https://api.weixin.qq.com/sns/jscode2session?',
        assceetokenuUrl:'https://api.weixin.qq.com/cgi-bin/token?',
        sendmessageUrl:'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?',
    },
    mongo: {
        development: {
            connectionString: 'mongodb://root:root@localhost:27017/nutcommunity',
        },
        production: {
            connectionString: 'mongodb://community01:DBxwNQx7@ds014118.mlab.com:14118/community01',
        },
    },
    mysql:{
        development:{
            host:'localhost',
            user:'root',
            password:'sam',
            database:'nutcommunity'
        },
        production:{
            host:'localhost',
            user:'root',
            password:'sam',
            database:'nutcommunity'
        }
    }
};