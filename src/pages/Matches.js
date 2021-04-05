/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This Page will display the league that the user is in as well as the matches that are in the league
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
import leagueService from './../service/LeagueService';
import LeagueDisplay from "./LeagueDisplay";

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

//Cookies (session) - The session used to grab the user and show their information
const cookies = new Cookies();
const _id = cookies.get('Id');

/**
 * This is the function that will return the page 
 * as well as take in props that will have logic 
 * coded in to display the league and teams
 * @param {*} props - Variables
 * @returns - HTML Page
 */
export default function Component(props) {

    //Decleare all the constants necessary for the page
    const [data, setData] = useState();
    const [userTeam, setUserTeam] = useState();
    const [leagues, setLeagues] = useState([]);
    const [isLoading, setLoading] = useState();
    const [teams, setTeams] = useState([]);
    const classes = useStyles();
    const history = useHistory();

    //set up booleans that are going to be used to show different information 
    let inLeague = false;
    let isOwner = false;

    //variable to store the teams in the league
    let teamLeague;

    /**
     * Fetch data will grab teams, matches as well as filter through the
     * matches to only assign th e ones respecitve to the user
     */
    const fetchData = async () => {

        //Convert the user id from session to JSON 
        let json = JSON.stringify({
            "_id": _id,
        });
        try {
            //set loading to true so that the data gets rendered
            setLoading(true)

            //get the user from the session id
            const user = await service.getUser(json)

            //store the user in the global user variable
            setData(user)

            //if the user team id is not empty
            if (user.team_id !== "") {

                //convert the users team id to json
                let teamJson = JSON.stringify({
                    "_id": user.team_id
                })

                //grab the team from the database
                const team = await teamService.getTeam(teamJson)

                //store it in a global variable
                setUserTeam(team)
            }

            //use the league service to grab all the leagues in the database
            const leagues = await leagueService.getAllLeagues()
            //set the leagues to the league state variable
            setLeagues(leagues)

        } catch (e) {
            //if there are errors console log 
            console.log(e)
        } finally {
            //set loading to false so that the page will render
            setLoading(false)
        }
    }

    //loop the leagues
    for (let i = 0; i < leagues.length; i++) {
        //loop through the team IDs of the league
        for (let j = 0; j < leagues[i]?.teamsId.length; j++) {
            //if the user team ID is equal to the leagues team id
            if (userTeam._id === leagues[i]?.teamsId[j]) {
                //set the in league to true
                inLeague = true;
                //store the league to the users team league
                teamLeague = leagues[i];
                //break
                break;
            }
        }
    }

    //if the id of the user is equal to the team owner id
    if (data?._id === userTeam?.ownerID) {
        //set is owner to true
        isOwner = true;
    }


    /**
     * This function will let a team join a league by taking in
     * the league that the owner chooses to join 
     * @param {} league 
     */
    const joinLeague = async (league) => {
        //set teams array as the teams id array from the league that is sent in
        let teamsArray = league.teamsId

        //push the current users team ID to the teams array
        teamsArray.push(userTeam._id)

        //convert the league informaton to JSON and replace the teamsId variable to the 
        //new teams ID that we pushed the team in
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isLocked": league.isLocked,
            "isFinished" : league.isFinished,
            "teamsId": teamsArray
        })

        //if the league is locked the action will not be able to perform
        if (league.isLocked) {
            //alert the user
            alert("Cannot Join League because it has already started!")
        } else {
            //else push the new league to the database
            let status = await leagueService.createLeague(json)

            //if the status is okay refresh the page
            if (status !== "") {
                window.location.reload();
            } else {
                //else display the error to the user
                alert("Failed to join League!")
            }
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
            {data?.team_id !== "" ? (
                <div>
                    {isOwner ? (
                        <div>
                            {inLeague ? (
                                <div>
                                    <LeagueDisplay
                                        user={data}
                                        team={userTeam}
                                        league={teamLeague}
                                        inLeague={inLeague}
                                        isOwner={isOwner}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <Typography className={classes.header} align="center" variant="h4">
                                        View Leagues below and Join!
                                    </Typography>
                                    <Grid container>
                                        <Grid xs={2}></Grid>
                                        <Grid className={classes.card}>
                                            <Grid container spacing={2} direction='row'>
                                                {leagues?.map((league) =>
                                                    <Grid item key={league._id} >
                                                        <Card className={classes.cardContent}>
                                                            <CardContent >
                                                                <Typography className={classes.pos} variant="h5">
                                                                    League Name: {league.leagueName}
                                                                </Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <Button onClick={() => joinLeague(league)} variant="contained" color="primary" size="small">Join League</Button>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {inLeague ? (
                                <div>
                                    <LeagueDisplay
                                        user={data}
                                        team={userTeam}
                                        league={teamLeague}
                                        inLeague={inLeague}
                                        isOwner={isOwner}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <Typography className={classes.header} align="center" variant="h4">
                                        Your team has not joined a team yet!<br></br>
                                        Available leagues are below if you want to tell your team leader about one!
                                    </Typography>
                                    <Grid container>
                                        <Grid xs={2}></Grid>
                                        <Grid className={classes.card}>
                                            <Grid container spacing={2} direction='row'>
                                                {leagues?.map((league) =>
                                                    <Grid item key={league._id} >
                                                        <Card className={classes.cardContent}>
                                                            <CardContent >
                                                                <Typography className={classes.pos} variant="h5">
                                                                    League Name: {league.leagueName}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {history.push("/TeamInfo")}
                </div>
            )}
        </div>
    )
}