
import { AppRegistry } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { name as appName } from './app.json';

const Root = () => (
  <Provider store={store}>
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
