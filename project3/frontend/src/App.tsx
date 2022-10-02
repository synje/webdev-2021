import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import ViewSong from './components/ViewSong';
import AddSong from './components/AddSong';
import DBList from './components/DBList'
import { ApolloClient, InMemoryCache, ApolloProvider, } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://it2810-30.idi.ntnu.no:3002/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <AddSong />
        <DBList />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default App;
