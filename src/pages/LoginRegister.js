/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 *  This file will display the LoginRegister Page to the user which will allow the user to enter their information
 *  it will call ther UserService after an action has been chosen
 */

//Imports necessery for the file
import Login from './../components/Login';
import Register from './../components/Register';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';

export default function LoginRegister(props){

  //Create Constants for logging in (Username and Password)
  const[username_login, setLoginUsername] = useState('');
  const[password_login, setLoginPassword] = useState('');

  //Create Constants for registering (Everything)
  const[username_register, setRegisterUsername] = useState('');
  const[password_register, setRegisterPassword] = useState('');
  const[email, setEmail] = useState('');
  const[phoneNumber, setPhoneNumber] = useState('');
  const[game, setGame] = useState('');
  const[firstName, setFirstName] = useState('');
  const[lastName, setLastName] = useState('');

  //Setup on change constants in order to allow user to type in textbox
  const onChangeUsernameLogin = (event) => {
    setLoginUsername(event.target.value);
  }

  const onChangePasswordLogin = (event) => {
    setLoginPassword(event.target.value);
  }

  const onChangeUsernameRegister = (event) => {
    setRegisterUsername(event.target.value);
  }

  const onChangePasswordRegister = (event) => {
    setRegisterPassword(event.target.value);
  }

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  }

  const onChangePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  }

  const onChangeGame = (event) => {
    setGame(event.target.value);
  }

  const onChangeFirstName = (event) => {
    setFirstName(event.target.value);
  }

  const onChangeLastName = (event) => {
    setLastName(event.target.value);
  }
    //Return function that will return the Register and Login Grid with the components insid
    return(
      //define grid container
        <Grid container justify="center">
        <Grid item xs={12} md={6}>
          <Register
            //set up variables for the input boxes
            firstName = {firstName}
            onChangeFirstName = {onChangeFirstName}
            lastName = {lastName}
            onChangeLastName = {onChangeLastName}
            email = {email}
            onChangeEmail = {onChangeEmail}
            phoneNumber = {phoneNumber}
            onChangePhoneNumber = {onChangePhoneNumber}
            game = {game}
            onChangeGame = {onChangeGame}
            username_register = {username_register}
            onChangeUsernameRegister = {onChangeUsernameRegister}
            password_register = {password_register}
            onChangePasswordRegister = {onChangePasswordRegister}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Login
          //set up variables for the input boxes
            username_login = {username_login}
            onChangeUsernameLogin = {onChangeUsernameLogin}
            password_login = {password_login}          
            onChangePasswordLogin = {onChangePasswordLogin}   
          />
        </Grid>
      </Grid>
    );
}