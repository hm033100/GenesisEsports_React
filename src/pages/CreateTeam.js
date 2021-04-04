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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Component(props) {

    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState();
    const cookies = new Cookies();
    const _id = cookies.get('Id');
    const classes = useStyles();
    const [teamName, setTeamName] = useState('');
    const [clubTag, setClubTag] = useState('');
    let history = useHistory();

    const onChangeTeamName = (event) => {
        setTeamName(event.target.value);
    }

    const onChangeClubTag = (event) => {
        setClubTag(event.target.value);
    }

    const fetchData = async () => {
        let json = JSON.stringify({
            "_id": _id,
        });
        try {
            setLoading(true)
            const user = await userService.getUser(json)
            setUser(user)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let json = JSON.stringify({
            "clubTag": clubTag,
            "ownerID": _id,
            "teamLosses": 0,
            "teamWins": 0,
            "teamName": teamName
        });

        let status = await teamService.createTeam(json);

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

        let statusUser = await userService.editUser(jsonUser);


        if (statusUser !== "") {
            history.push("/TeamInfo")
        } else {
            alert("Failed to Create Team")
        }
    }

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