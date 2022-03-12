import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import {  StoreProvider } from './Store';


ReactDOM.render(
    <StoreProvider>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </StoreProvider>
    ,
    document.getElementById('root'));
