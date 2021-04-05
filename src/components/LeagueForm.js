/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 4.0
 *  Sprint 4: 04/04/2021
 *
 * 
 * This is the form class for League where the admin uses to create the league.
 */


/**
 * All the imports required for this file
 */
import React, { useState, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import leagueService from './../service/LeagueService';

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
 * This is the function that initializes the page
 * @param {*} props - Variables that come from the page that calls this component
 * @returns - HTML Page
 */
export default function Component(props) {

    //Initialize variables that will be used in this page
    const classes = useStyles();
    const [leagues, setLeagues] = useState([]);
    const [leagueName, setLeagueName] = useState();

    //On change constants to re-render the changes
    const onChangeLeagueName = (event) => {
        setLeagueName(event.target.value);
    }

    /**
     * fetchData() - Async call that will grab all the necessary data for this page
     */
    const fetchData = async () => {
        //Create a constant called leagues where the leagues will be stored
        //Call the leagueService and get all leagues
        const leagues = await leagueService.getAllLeagues();
        //set the leages to the global constant
        setLeagues(leagues)
    }

    /**
     * This function will create a league with the prop variables sent to it
     * @param {*} event - Event that will fire rendering 
     */
    const handleSubmit = async (event) => {
        //Prevent event re-rendering
        event.preventDefault();

        //Put all the league variables in json format
        let json = JSON.stringify({
            "leagueName" : leagueName,
            "isLocked" : "false",
            "isFinished" : "false",
            "teamsId" : []
        })

        //Call the leagueService to override/create in the database
        //NOTE - mongodb save upserts data no need for edit
        let status = leagueService.createLeague(json);

        //if there is a result refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //Else give error to user
            alert("Failed to Create League")
        }
    }

    //Call use effect to render the data
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Typography align="center" variant="h4" style={{ marginTop: 40 }}>
                Create a League!
                        <br></br>
            </Typography>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <ValidatorForm onSubmit={handleSubmit} onError={errors => console.log(errors)}>
                        {/* LeagueName Field */}
                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="leagueName"
                            label="League Name"
                            name="leagueName"
                            autoComplete="leagueName"
                            validators={['required', 'matchRegexp:^[a-zA-Z0-9]+$', 'matchRegexp:^.{4,32}$']}
                            errorMessages={['This field is required', 'Can only contain letters and numbers', 'Must be 4 to 32 characters']}
                            onChange={onChangeLeagueName}
                            value={leagueName}
                            autoFocus
                        />
                        <TextField />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Create League
                                </Button>
                    </ValidatorForm>

                </div>
            </Container>
        </div>
    )
}