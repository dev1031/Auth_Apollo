const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema/schema');
const resolvers= require('./graphql/resolvers/resolvers');
const mongoose = require('mongoose');
const getUser = require('./auth/auth');
const PORT = 4000

 mongoose.connect('mongodb://localhost:27017/ApolloAuth', 
{   
useNewUrlParser: true , 
useUnifiedTopology: true    
} ,()=>{
try{
    console.log('DataBase Is Connected Now')
}catch(error){
    throw new Error(error)
}
}); 

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context : ({req})=>{
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1]
    const user = getUser(token)
    return { user }
  } 
});

const app = express();
server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);


