import express from 'express';
import { graphqlHTTP } from 'express-graphql'
import mongoose from 'mongoose'

import rootScheme from './rootSchema'
import rootResolver from './rootResolver';
require('dotenv').config({path: './db.env'})

/**
 * Set up app with express
 */
const app = express();

/**
 * Sets headers for the app call to html. This is to avoid getting stopped by CORS
 */
app.use((req: any, res: any, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
     return res.sendStatus(200);
  }
 next();
 });

 /**
  * Sets up the graphQL backend with schema and resolver
  */
app.use('/graphql', graphqlHTTP({
  schema: rootScheme,
  rootValue: rootResolver,
  graphiql: true
}))

/**
 * Connects to MongoDB database on VM
 */
mongoose.connect(`mongodb://it2810:gjest3-30@it2810-30.idi.ntnu.no:27017/it2810?authSource=it2810`).then(() => {
  app.listen(3002, "0.0.0.0", )
  console.log('Connected')
}).catch(err => {
  console.log(err);
  throw err
})
