const jwt = require('jsonwebtoken');

const getUser = (token)=>{
    try{
        if(token){
            return jwt.verify(token,'my-secret-from-env-file-in-prod' )
        }
        return null
    }catch(error){
        throw new Error('Auth-Failed')
    }
}

module.exports = getUser;