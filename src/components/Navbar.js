/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 */

 //necessary imports for the project
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
  } else {
    navbar =
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Genesis Esports
            <Button href="/TeamInfo" color="inherit">Teams</Button>
            <Button href="/UserInfo" color="inherit">My Info</Button>
            <Button href="/Matches" color="inherit">Matches</Button>
          </Typography>
          <Button href="/LoginRegister" color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
  }

  return (
    <div className={classes.root}>
      {navbar}
    </div>
  );
}
