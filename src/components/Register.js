/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This file is responsible to show the Register component in the LoginRegister page.
 */

//Necessary imports for the application
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

//Styles needed for the page
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/**
 * This function will create the classes and styles needed for the register component
 * as well as hold use the props sent to it. Button will call the UserService for th user to register.
 * @param {*} props 
 */
export default function Component(props) {
  const classes = useStyles();

  const classes = useStyles();

  let history = useHistory();

  const handleSubmit = async (event) => {
    let json = JSON.stringify({
      "firstName": "",
      "lastname": "",
      "email": "",
      "phoneNumber": "",
      "game": "",
      "username": props.username_login,
      "password": props.password_login
    });

    let status = await service.register(json);
    event.preventDefault();

    //if there is a result go to homepage
    if (status != ""){
      history.push("/HomePage")
    } else {
      alert("Failed to Login/Register!")
    }

  //The view that is returned: Next revision will have all these inputs with data validation 
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate>
        {/* Firstname Field */}
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstname"
            label="Firstname"
            name="firstname"
            autoComplete="firstname"
            autoFocus
            onChange = {props.onChangeFirstName}
            value={props.firstName}
          />
          {/* Lastname Field */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastname"
            label="Lastname"
            name="lastname"
            autoComplete="lastname"
            autoFocus
            onChange = {props.onChangeLastName}
            value={props.lastName}

          />
          {/* Email Field */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange = {props.onChangeEmail}
            value={props.email}
          />
          {/* PhoneNumber Field */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phonenumber"
            label="Phone Number"
            name="phonenumber"
            autoComplete="phonenumber"
            autoFocus
            onChange = {props.onChangePhoneNumber}
            value={props.phoneNumber}
          />
          {/* Game Field */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="game"
            label="Game"
            name="game"
            autoComplete="game"
            autoFocus
            onChange = {props.onChangeGame}
            value={props.game}
          />
          {/* Username Field */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange = {props.onChangeUsernameRegister}
            value={props.username_register}
          />
          {/* Password Field and will contain password type */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange = {props.onChangePasswordRegister}
            value={props.password_register}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.handleSubmit}
          >
            Register
          </Button>
        </form>
      </div>
    </Container>
  );
}
}