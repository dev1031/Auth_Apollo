const User  = require('./../../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const resolvers = {
    Query :{
        currentUser :(parent, args , { user } , info)=>{
            if(!user){
                throw new Error('Not-Authenticated')
            }
            let currentUser = {
                id: user.id,
                username : user.name
            }
            return currentUser;
        }
    },
    
    Mutation:{
        register :async(_ , { username , password }, context , info)=>{
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await new User({
                username : username , 
                password : hashedPassword
            });
            await user.save();
            return user
        },
        login:async(_,{ username , password }, context , info)=>{
            const user = await User.findOne({ username : username});
            if(!user){
                throw new Error('Invalid Login')
            };
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
              throw new Error('Invalid Login') 
            }
            const token = jwt.sign({
                  id: user.id,
                  name: user.username
                },
                'my-secret-from-env-file-in-prod',
                {
                  expiresIn: '30d'
                },
              );
              return { token , user }
        }
    }
  };

module.exports = resolvers;  