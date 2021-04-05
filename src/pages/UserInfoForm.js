import React from 'react';
import Cookies from 'universal-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import service from '../service/UserService';
import { useHistory } from 'react-router-dom';
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

//Cookies (session) - The session used to grab the user and show their information
const cookies = new Cookies();
const _id = cookies.get('Id');

/**
 * This method is a component method as a form to be used as a placeholder for the user information display
 * Work In Progress - (the user will be able to edit the text boxes and be able to edit their information)
 * @param {*} props 
 * @returns 
 */
export default function Component(props) {

    //Implement the style class with the defined CSS
    const classes = useStyles();
    //Variable to push the page 
    let history = useHistory();

    /**
     * This is an asynchronos method that will put the properties in JSON format from the text boxes
     * and will call the edit user command from the User Service
     * @param {*} event 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        let json = JSON.stringify({
        "_id": _id,
        "team_id": props.teamID,
        "firstName": props.firstName,
        "lastName": props.lastName,
        "email": props.email,
        "phoneNumber": props.phoneNumber,
        "game": props.game,
        "username": props.username,
        "password": props.password
        });

        //Call the API and store data in status
        let status = await service.editUser(json);

        //if there is a result go to homepage
        if (status !== ""){
            history.push("/UserInfo")
        } else {
            alert("Failed to Edit User!")
        }
    }

    /**
     * Return the form to be rendered
     */
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper} >
            <ValidatorForm onSubmit={handleSubmit} onError={errors => console.log(errors)}>
                    {/* Firstname Field */}
                    <TextValidator
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
                        onChange = {props.onChangeFirstName}
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
                        onChange = {props.onChangeLastName}
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
                        onChange = {props.onChangeEmail}
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
                        onChange = {props.onChangePhoneNumber}
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
                        onChange = {props.onChangeGame}
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
                        onChange = {props.onChangeUsername}
                        value={props.username}
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
                        onChange = {props.onChangePassword}
                        value={props.password}
                    />
                    <TextField/>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Edit Information
                    </Button>
                </ValidatorForm>
            </div>
        </Container>
    )

}




