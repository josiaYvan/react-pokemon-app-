import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthentificationService from '../services/authentification-service';

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={(props) => {
    const isAuthenticated = AuthentificationService.isAuthentificated; //regarde si il y a un user connecté
    if (!isAuthenticated) {    
      return <Redirect to={{ pathname: '/login' }} /> //rediriger vers la page login si non connecté
    }
  
    return <Component {...props} /> //sinon rediriger vers la page demandées
  }} />
);
  
export default PrivateRoute;