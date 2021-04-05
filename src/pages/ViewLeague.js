/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This will allow the user to make a league view 
 */

//Import all the necessary components for the page 
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
 * The class will be a form with league name and data validation
 * @param {*} props 
 * @returns 
 */
export default function Component(props) {

    //state variables necessary for the page
    const classes = useStyles();
    const [leagues, setLeagues] = useState([]);
    const [leagueName, setLeagueName] = useState();

    //on change function to notice when the user is rendering
    const onChangeLeagueName = (event) => {
        setLeagueName(event.target.value);
    }

    //Fetch data will grab all the leagues and store them to the state variable
    const fetchData = async () => {
        const leagues = await leagueService.getAllLeagues();
        setLeagues(leagues)
    }

    /**
     * Handle submit function that will render after the admin creates a league
     */
    const handleSubmit = async (event) => {
        //stop default rendering from event
        event.preventDefault();

        //convert the league information to json with the changes
        let json = JSON.stringify({
            "_id" : props.league._id,
            "leagueName" : leagueName,
            "isLocked" : props.league.isLocked,
            "matches" : props.league.matches
        })

        //run the service command to create the league
        let status = leagueService.createLeague(json);

        //if sucessful refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //else notify the user of the error
            alert("Failed to Create League")
        }
    }

    /**
     * This method will call the asynchronous call in order for the page to render after
     * the data is recieved fromt the API Call
     */
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
                            value={props.viewLeague.leagueName}
                            autoFocus
                        />
                        <TextField />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Edit League
                        </Button>
                    </ValidatorForm>

                </div>
            </Container>
        </div>
    )
}