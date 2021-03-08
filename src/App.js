/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This is where the entire application is ran. 
 */

 //Necessary imports for the application
import './App.css';
import React from 'react';
import LoginRegister from './pages/LoginRegister';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UserInfo from './pages/UserInfo'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/**
 * This is the application that runs in the React Frontend
 */
export default function App() {

  //Return a path with router and switches so it is easy for the developer to make calls.
  return (
      <Router>
          <Switch>
            <Route exact path="/HomePage">
              <Navbar/>
              <HomePage/>
            </Route>
            <Route exact path="/LoginRegister">
              <Navbar/>
              <LoginRegister/>
            </Route>
            <Route exact path="/Login">
              <Navbar/>
              <LoginRegister/>
            </Route>
            <Route exact path="/Register">
              <Navbar/>
              <LoginRegister/>
            </Route>
            <Route exact path="/UserInfo">
              <Navbar/>
              <UserInfo/>
            </Route>
          </Switch>
      </Router>
  );
}

