import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'; // Redux+API fetch que vai substituir o axios
import { App } from './App';
import { store } from './_helpers';

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);