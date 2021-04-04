/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
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
 */
export default function ButtonAppBar() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState();
  const [user, setUser] = useState();

  const cookies = new Cookies();
  const _id = cookies.get('Id');

  const fetchData = async () => {
    let json = JSON.stringify({
      "_id": _id,
    });
    try {
      setLoading(true)
      const user = await userService.getUser(json)
      setUser(user)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  let navbar;

  if (window.location.pathname === "/LoginRegister") {
    navbar =
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Genesis Esports
          </Typography>
        </Toolbar>
      </AppBar>
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
