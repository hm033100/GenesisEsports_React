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
import React from 'react';
import service from './../service/UserService';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

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
  let history = useHistory();
  const cookies = new Cookies();



  const handleSubmit = async (event) => {
    event.preventDefault();
    let json = JSON.stringify({
      "team_id": "",
      "firstName": props.firstName,
      "lastName": props.lastName,
      "email": props.email,
      "phoneNumber": props.phoneNumber,
      "game": props.game,
      "username": props.username_register,
      "password": props.password_register
    });

    let users = await service.getAllUsers();
    let isDuplicate = false;

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === props.username_register) {
        isDuplicate = true;
      }
    }

    if (isDuplicate !== true) {
      let status = await service.registerUser(json);
      cookies.set('Id', status._id, { path: '/' })
      cookies.set('username', status.username, { path: '/' })
      cookies.set('password', status.password, { path: '/' })
    }


    //if there is a result go to homepage
    if (isDuplicate !== true) {
      history.push("/HomePage")
    } else {
      alert("Failed to Login/Register! Username is already taken!")
    }
  }

  //The view that is returned: Next revision will have all these inputs with data validation 
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <ValidatorForm onSubmit={handleSubmit} onError={errors => console.log(errors)}>
          {/* Firstname Field */}
          <TextValidator
            error=""
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstname"
            label="Firstname"
            name="firstname"
            autoComplete="firstname"
            autoFocus
            validators={['required', 'matchRegexp:^[a-zA-Z]+$', 'matchRegexp:^.{2,15}$']}
            errorMessages={['This field is required', 'Can only contain letters', 'Must be 2 to 15 characters']}
            onChange={props.onChangeFirstName}
            value={props.firstName}
          />
          {/* Lastname Field */}
          <TextValidator
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastname"
            label="Lastname"
            name="lastname"
            autoComplete="lastname"
            autoFocus
            validators={['required', 'matchRegexp:^[a-zA-Z]+$', 'matchRegexp:^.{2,15}$']}
            errorMessages={['This field is required', 'Can only contain letters', 'Must be 2 to 15 characters']}
            onChange={props.onChangeLastName}
            value={props.lastName}

          />
          {/* Email Field */}
          <TextValidator
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            validators={['required', 'isEmail']}
            errorMessages={['This field is required', 'Invalid email']}
            onChange={props.onChangeEmail}
            value={props.email}
          />
          {/* PhoneNumber Field */}
          <TextValidator
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phonenumber"
            label="Phone Number"
            name="phonenumber"
            autoComplete="phonenumber"
            autoFocus
            validators={['required', 'matchRegexp:^[0-9]+$', 'matchRegexp:^.{9,32}$']}
            errorMessages={['This field is required', 'Can only contain numbers', 'Must be 9 to 32 characters']}
            onChange={props.onChangePhoneNumber}
            value={props.phoneNumber}
          />
          {/* Game Field */}
          <TextValidator
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="game"
            label="Game"
            name="game"
            autoComplete="game"
            autoFocus
            validators={['required', 'matchRegexp:^[a-zA-Z0-9]+$', 'matchRegexp:^.{2,32}$']}
            errorMessages={['This field is required', 'Can only contain letters and numbers', 'Must be 8 to 32 characters']}
            onChange={props.onChangeGame}
            value={props.game}
          />
          {/* Username Field */}
          <TextValidator
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            validators={['required', 'matchRegexp:^[a-zA-Z0-9]+$', 'matchRegexp:^.{4,32}$']}
            errorMessages={['This field is required', 'Can only contain letters and numbers', 'Must be 4 to 32 characters']}
            onChange={props.onChangeUsernameRegister}
            value={props.username_register}
          />
          {/* Password Field and will contain password type */}
          <TextValidator
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            validators={['required', 'matchRegexp:^.{8,32}$', 'matchRegexp:^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|).{8,32}$']}
            errorMessages={['This field is required', 'Must be 8 to 32 characters', 'Minimum of one uppercase, lowercase, number, and symbol']}
            onChange={props.onChangePasswordRegister}
            value={props.password_register}
          />
          <TextField/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </ValidatorForm>
      </div>
    </Container>
  );
}