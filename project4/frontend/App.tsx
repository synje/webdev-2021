import React from 'react'
import { Dimensions, ImageBackground, LogBox, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { ToggleView } from './components/ToggleView'

export const client = new ApolloClient({
  uri: 'http://it2810-30.idi.ntnu.no:3002/graphql',
  cache: new InMemoryCache()
})

export default function App() {
  return (
    <View style={styles.main}>
      <ImageBackground source={require('./assets/bakgrunn.jpg')} resizeMode="cover" resizeMethod='scale' style={styles.image} >
        <Provider store={store}>
          <ApolloProvider client={client}>
            <View style={styles.toggle}>
              <PaperProvider theme={theme}>
                <ToggleView />
              </PaperProvider>
            </View>
          </ApolloProvider>
        </Provider>
      </ImageBackground>
    </View>
  )
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#004643',
    accent: '#E0F5E2',
    background: '#E0F5E2',
    text: '#0c1618',
    placeholder: '#0c1618'
  },
}

const styles = StyleSheet.create({
  main: {
    height: Dimensions.get('window').height + 20,
    width: '100%',
    display: 'flex',
    position: 'absolute',
  },
  toggle: {
    height: '100%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height + 20,
  }
})


// Suppresses known and fixed(!) errors and warnings that still show up in console
const backup = console.error;
console.error = function filterErrors(msg: any) {
  const supressedErrors = ['Warning: Each child in a list'];
  if (!supressedErrors.some(entry => msg.includes(entry))) {
    backup.apply(console);
  }
}

const backupW = console.warn;
console.warn = function filterWarnings(msg: any) {
  const supressedWarnings = ['Animated: `useNativeDriver` is not supported', "The updateQuery callback ofr fetchMore is deprecated"];
  if (!supressedWarnings.some(entry => msg.includes(entry))) {
    backupW.apply(console);
  }
};

// Ignore log notification by message on device
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications on device
LogBox.ignoreAllLogs();