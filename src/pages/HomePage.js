/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This is the homepage that will display a welcome message.
 */

//Necessary imports for the page
import React, { useState, useEffect } from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Cookies from 'universal-cookie';
import { makeStyles } from '@material-ui/core/styles';
import LeagueDisplay from './LeagueDisplay';
import UserService from '../service/UserService';

//Styles needed for the page
const useStyles = makeStyles({
  root: {
      minWidth: 275,
      align: 'center',
  },
  card: {
      minWidth: 275,
      align: 'center',
      marginTop: 50
  },
  cardContent: {
      minWidth: 275,
      align: 'center',
      marginTop: 50,
      backgroundColor: "#3f50b5"
  },
  bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
  },
  title: {
      fontSize: 14,
  },
  pos: {
      marginBottom: 12,
      marginTop: 10,
      color: "#FFFFFF"
  },
  button: {
      size: "large",
      float: 'right',
      padding: 20,
      marginRight: 100,
      marginTop: 500,
      marginBottom: 100,
      variant: "contained",
      color: "primary",
      justifycontent: 'center'
  },
  header: {
      marginTop: 50
  }
});


//set up themes and session
let theme = createMuiTheme();
theme = responsiveFontSizes(theme);
const cookies = new Cookies();



/**
 * Main page that will display the theme of the website
 * @returns HTLM Page
 */
export default function ResponsiveFontSizes() {

  //declear the variables used in the page
  const classes = useStyles();
  const [user, setUser] = useState();

  /**
     * FetchData will grab the user from the database
     */
  const fetchData = async () => {
    //convert the ID from the session to JSON
    let json = JSON.stringify({
      "_id" : cookies.get("Id")
    })

    //grab the user from the database and store it in tempuser
    const tempUser = await UserService.getUser(json);
    //set the user to the global variable
    setUser(tempUser)
  }

  //Method that will render the information for the page
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Typography className={classes.header} align="center" variant="h4">
        Hello, {user?.username} thank you for joining Genesis Esports!
        </Typography>
      </ThemeProvider>
    </div>
  );
}