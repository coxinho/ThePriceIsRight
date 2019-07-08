import React from 'react';
import { Redirect, Route } from 'react-router-dom';

// Rota privada utilizada para validar que o utilizador está logado
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)