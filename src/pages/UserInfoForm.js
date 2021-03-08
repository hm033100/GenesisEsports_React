import React from 'react';
import Cookies from 'universal-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import service from '../service/UserService';
import { useHistory } from 'react-router-dom';


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
     * (WORK IN PROGRESS)
     * This is an asynchronos method that will put the properties in JSON format from the text boxes
     * and will call the edit user command from the User Service
     * @param {*} event 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("In handle submit");
        let json = JSON.stringify({
        "_id": _id,
        "firstName": props.firstName,
        "lastname": props.lastName,
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
                        onChange = {props.onChangeUsername}
                        value={props.username}
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
                        onChange = {props.onChangePassword}
                        value={props.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Edit Information
                    </Button>
                </form>
            </div>
        </Container>
    )

}




