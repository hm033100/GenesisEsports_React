/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This file is the navbar that is used in the app
 */

//necessary imports for the project
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import userService from "./../service/UserService";

//Styles for the navbar
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));




/**
 * This function returns the Navbar to the page. 
 * @returns - HTML Page
 */
export default function ButtonAppBar() {

  //Initialize variables that will be used in this page
  const classes = useStyles();
  const [isLoading, setLoading] = useState();
  const [user, setUser] = useState();

  //Initialize the cookies for the page
  const cookies = new Cookies();
  const _id = cookies.get('Id');

  /**
     * fetchData() - Async call that will grab all the necessary data for this page
     */
  const fetchData = async () => {
    //Grab the ID from the session and convert it to json
    let json = JSON.stringify({
      "_id": _id,
    });

    try {
      //Page is loading while grabbing the data
      setLoading(true)
      //use the json data in the user service to get the user by id
      //store it in the user global variable
      const user = await userService.getUser(json)
      setUser(user)
    } catch (e) {
      //If there are errors log them
      console.log(e)
    } finally {
      //set loading to false so the page is rendered
      setLoading(false)
    }
  }

  //Use effect will render the data
  useEffect(() => {
    fetchData();
  }, []);

  //Create a navabar variable to store the different navbars based on the users session
  let navbar;

  //if the navbar is in login register return the LoginRegister Navbar
  if (window.location.pathname === "/LoginRegister") {
    navbar =
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Genesis Esports
          </Typography>
        </Toolbar>
      </AppBar>
  //If the user id is the Adming user id return the navbar with the admin permissions
  } else if (user?._id === "6068a18c4ad5801e4d72ee21") {
    navbar =
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Button href="/HomePage" color="inherit">Genesis Esports</Button>
          <Button href="/TeamInfo" color="inherit">Teams</Button>
          <Button href="/UserInfo" color="inherit">My Info</Button>
          <Button href="/Matches" color="inherit">Matches</Button>
        </Typography>
        <Button href="/AdminPage" color="inherit">Admin</Button>
        <Button href="/LoginRegister" color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  //Else return normal user navbar
  } else {
    navbar =
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button href="/HomePage" color="inherit">Genesis Esports</Button>
            <Button href="/TeamInfo" color="inherit">Teams</Button>
            <Button href="/UserInfo" color="inherit">My Info</Button>
            <Button href="/Matches" color="inherit">Matches</Button>
          </Typography>
          <Button href="/LoginRegister" color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
  }

  

  //Return the HTML to the app
  return (
    <div>
      {isLoading ? (
        <div>
          Loading Information...
        </div>
      ) : (
        <div className={classes.root}>
          {navbar}
        </div>
      )}
    </div>
  )
}
