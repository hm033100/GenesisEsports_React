/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This Page will display if the user is not part of the team by using 
 * respective logic to that and will provide the page to create a team if the 
 * user wants to.
 */

//Import all the necessary components for the page 
import Cookies from 'universal-cookie';
import service from './../service/UserService';
import teamService from './../service/TeamService';
import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import TeamInfoForm from './TeamInfoForm';
import { useHistory } from "react-router-dom";

//Define the CSS styles that are going to be used and store in use styles
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

/*Cookies (session) - Define the session in order to grab the id,
 in order to set the ID to Json and make a call to the api to get
 the user information
*/
const cookies = new Cookies();
const _id = cookies.get('Id');

/**
 * 
 * @param {*} props 
 * @returns 
 */
export default function Component(props) {

    //define variables that are used for design and routing
    const classes = useStyles();
    const history = useHistory();

    //Data constant to store the data retrieved from the REST call
    const [data, setData] = useState();
    //Loading constant to determine if the data was recieved from the call
    const [isLoading, setLoading] = useState();
    const [teams, setTeams] = useState([]);
    const [userTeam, setUserTeam] = useState();

    /*Grab the User information in JSON format from the database
      using a service call.
    */
    const fetchData = async () => {

        //convert the session user id to json
        let json = JSON.stringify({
            "_id": _id,
        });
        try {
            //set loading to true so that the infromation is rendered first
            setLoading(true)

            //store the user in a temporary constant
            const user = await service.getUser(json)

            //store the user in the global state
            setData(user)

            //grab all the teams from the database
            const fetchTeams = await teamService.getAllTeams()

            //store the teams in the state variable
            setTeams(fetchTeams)

            //if the users team id is not empty
            if (user.team_id !== "") {
                //convert the users team id to json
                let teamJson = JSON.stringify({
                    "_id": user.team_id
                });

                //using the teams id grab the team by id
                const fetchTeam = await teamService.getTeam(teamJson)
                //set the team to the state variable
                setUserTeam(fetchTeam)
            }
        } catch (e) {
            //display the errors
            console.log(e)
        } finally {
            //set the loading to false so that the page renders
            setLoading(false)
        }
    }

    /**
     * this function will redirect the user to the create team 
     * page if they choose to make a team
     */
    const createTeamRoute = () => {
        history.push("/CreateTeam");
    }

    /**
     * This function will let the user join a team that is owned by another user
     * it takes in the team id of the team that they want to join
     * @param {*} teamId 
     */
    const joinTeam = async (teamId) => {
        //convert the user info to json and add in the team id that the user wants to join
        let json = JSON.stringify({
            "_id": _id,
            "team_id": teamId,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "email": data.email,
            "phoneNumber": data.phoneNumber,
            "game": data.game,
            "username": data.username,
            "password": data.password
        });

        //edt the user by calling the service
        let status = await service.editUser(json);

        //if there are no issues refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //else display error to user
            alert("Failed to Add to Team!")
        }

    };

    /**
     * This method will call the asynchronous call in order for the page to render after
     * the data is recieved fromt the API Call
     */
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div>
                    Loading Information...
                </div>
            ) : data?.team_id ? (
                <div>
                    <TeamInfoForm
                        team={userTeam}
                        user={data}
                    />
                </div>
            ) : (
                <div>
                    <Typography className={classes.header} align="center" variant="h4">
                        You are currently not part of a team, join one below or create your own!
                    </Typography>
                    <Grid container>
                        <Grid xs={2}></Grid>
                        <Grid className={classes.card}>
                            <Grid container spacing={2} direction='row'>
                                {teams?.map((team) =>
                                    <Grid item key={team._id} >
                                        <Card className={classes.cardContent}>
                                            <CardContent >
                                                <Typography className={classes.pos} variant="h5">
                                                    Team Name: {team.teamName}
                                                </Typography>
                                                <Typography className={classes.pos}>
                                                    Clubtag: {team.clubTag}
                                                </Typography>
                                                <Typography className={classes.pos} variant="body2">
                                                    Wins: {team.teamWins}, Losses: {team.teamLosses}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button variant="contained" color="primary" onClick={() => joinTeam(team._id)} size="small">Join Team</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button onClick={() => createTeamRoute()} size="large" variant="contained" color="primary" className={classes.button}>
                        Create Team
                    </Button>
                </div>
            )}
        </div>
    )

}