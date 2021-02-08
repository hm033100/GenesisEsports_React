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
import User from './components/User';
import LoginRegister from './pages/LoginRegister';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { EntryContext } from './context/EntryContext.js';

/**
 * This is the application that runs in the React Frontend
 */
function App() {

  //Define the entry ID and set context 
  const [entryId, setEntryContext] = React.useState("Null");

  //Return a path with router and switches so it is easy for the developer to make calls.
  return (
    <EntryContext.Provider value={[entryId, setEntryContext]}>
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
          </Switch>
      </Router>
    </EntryContext.Provider>
  );

  /**
   * TESTING PURPOSES: IGNORE
   */
  // User.username = "hermesmimini";
  // User.password = "Mesi1234";

  // return (
  //   <div className="App">
  //     <Navbar/>
  //     <LoginRegister/>
  //   </div>
  // );
}

export default App;
