/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This Page will be used to Create a team as well as contain logic for the teams
 */

//Import all the necessary components for the page 
import React, { useState, useEffect } from "react";
import userService from "./../service/UserService";
import Cookies from 'universal-cookie';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Button } from '@material-ui/core';
import teamService from "./../service/TeamService";
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
        width: '100%', 
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

/**
 * The main function that will export the rendered HTML at the bottom
 * @param {} props - Variables that were passed to the page
 * @returns - HTML Page
 */
export default function Component(props) {

    //Define all the constants that will be used throghout the page
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState();
    const cookies = new Cookies();
    const _id = cookies.get('Id');
    const classes = useStyles();
    const [teamName, setTeamName] = useState('');
    const [clubTag, setClubTag] = useState('');
    let history = useHistory();

    //On change variables so that it will render when it is detected
    const onChangeTeamName = (event) => {
        setTeamName(event.target.value);
    }

    const onChangeClubTag = (event) => {
        setClubTag(event.target.value);
    }

    /**
     * FetchData will grab the user from the database
     */
    const fetchData = async () => {
        //Conver the user ID to json from the session
        let json = JSON.stringify({
            "_id": _id,
        });
        try {
            //set loading to true so that the information is rendered
            setLoading(true)
            //grab the user from the database and store it to the user constant
            const user = await userService.getUser(json)
            //set the user to the global constant
            setUser(user)
        } catch (e) {
            //if there are any errors log them
            console.log(e)
        } finally {
            //set loading to false so that the page is rendered
            setLoading(false)
        }
    }

    /**
     * This function will create a team and will set 
     * the current user as the team owner by setting the team_id and owner id
     * @param {*} event 
     */
    const handleSubmit = async (event) => {
        //prevent rendering 
        event.preventDefault();

        //Convert the team information to json 
        let json = JSON.stringify({
            "clubTag": clubTag,
            "ownerID": _id,
            "teamLosses": 0,
            "teamWins": 0,
            "teamName": teamName
        });

        //use the service to add the team to the database
        let status = await teamService.createTeam(json);

        //edit the user information so that the team ID is assigned
        //convert the information to JSON
        let jsonUser = JSON.stringify({
            "_id": _id,
            "team_id": status._id,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phoneNumber": user.phoneNumber,
            "game": user.game,
            "username": user.username,
            "password": user.password
        });

        //save the information to the database
        let statusUser = await userService.editUser(jsonUser);


        //if successful push to TeamInformation page
        if (statusUser !== "") {
            history.push("/TeamInfo")
        } else {
            //Else Display error
            alert("Failed to Create Team")
        }
    }

    //Method that will render the information for the page
    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            {isLoading ? (
                <div>
                    Loading Information...
                </div>
            ) : (
                <div>
                    <Typography align="center" variant="h4" style={{ marginTop: 40 }}>
                        Create your team {user?.firstName} !
                        <br></br>
                    </Typography>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <ValidatorForm onSubmit={handleSubmit} onError={errors => console.log(errors)}>
                                {/* TeamName Field */}
                                <TextValidator
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="teamName"
                                    label="Team Name"
                                    name="teamName"
                                    autoComplete="teamName"
                                    validators={['required', 'matchRegexp:^[a-zA-Z0-9]+$', 'matchRegexp:^.{4,32}$']}
                                    errorMessages={['This field is required', 'Can only contain letters and numbers', 'Must be 4 to 32 characters']}
                                    onChange={onChangeTeamName}
                                    value={teamName}
                                    autoFocus
                                />
                                {/* ClubTag Field */}
                                <TextValidator
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="clubTag"
                                    label="Club Tag"
                                    name="clubTag"
                                    autoComplete="clubTag"
                                    validators={['required', 'matchRegexp:^[a-zA-Z0-9]+$', 'matchRegexp:^.{3}$']}
                                    errorMessages={['This field is required', 'Can only contain letters and numbers', 'Must be 3 characters']}
                                    onChange={onChangeClubTag}
                                    value={clubTag}
                                    autoFocus
                                />
                                <TextField/>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Create Team
                                </Button>
                            </ValidatorForm>
                        </div>
                    </Container>
                </div>
            )}
        </div>
    )

}