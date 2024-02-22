import React, { useState } from "react";
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from "native-base"
import AppNavigator from "./AppNavigator";
import store from './redux/store/store';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from "./redux/Api/apollo";

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs()


App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <Provider store={store}>
                <NativeBaseProvider>
                    <AppNavigator />
                </NativeBaseProvider>
            </Provider>
        </ApolloProvider>
    )
}

export default App
