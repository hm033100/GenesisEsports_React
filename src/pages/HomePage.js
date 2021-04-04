/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This class is currently a testing class just to show that the Login and Register functions work fine.
 */

//Necessary imports for the page
import React, { useState, useEffect } from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Cookies from 'universal-cookie';
import { makeStyles } from '@material-ui/core/styles';
import LeagueDisplay from './LeagueDisplay';
import UserService from '../service/UserService';

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


let theme = createMuiTheme();
theme = responsiveFontSizes(theme);
const cookies = new Cookies();




export default function ResponsiveFontSizes() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [user, setUser] = useState();

  const fetchData = async () => {
    let json = JSON.stringify({
      "_id" : cookies.get("Id")
    })
    const tempUser = await UserService.getUser(json);
    setUser(tempUser)
  }

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