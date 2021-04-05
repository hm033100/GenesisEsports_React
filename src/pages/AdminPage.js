/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This Page is the AdminView and will hold adming side functionality
 */

//Import all the necessary components for the page 
import React, { useState, useEffect } from "react";
import leagueService from './../service/LeagueService';
import matchService from './../service/MatchService';
import teamService from "./../service/TeamService";
import LeagueForm from './../components/LeagueForm';
import ViewLeague from './ViewLeague';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

//Devine the CSS styles that are going to be used and store in use styles
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

/**
 * The class function will take in the props necessary and will perform logic 
 * to the backend as described in the function.
 * @param {*} props - Will recieve User, League and Team props
 * @returns HTML Page
 */
export default function Component(props) {

    //Decleare all the constants necessary for the page
    const [leagues, setLeagues] = useState([]);
    const classes = useStyles();
    const history = useHistory();
    const [teams, setTeams] = useState([]);
    const [viewLeague, setViewLeague] = useState(false);
    const [matches, setMatches] = useState([]);

    /**
     * FetchData will grab all the leagues, teams and matches from the database
     * by usinge the respective services
     */
    const fetchData = async () => {
        const leagues = await leagueService.getAllLeagues();
        setLeagues(leagues)

        const teams = await teamService.getAllTeams();
        setTeams(teams)

        let matches = await matchService.getAllMatches();
        setMatches(matches)
    }

    /**
     * This function will recieve a league and will "lock it", it will take in
     * all the teams that were sent and by using looping will generate matches and store
     * to the database
     * @param {*} league - The league for which matches will be created
     */
    const lockLeague = async (league) => {
        //Temporary team array 
        let teamArray = []

        //Convert the league to json
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isFinished": league.isFinished,
            "isLocked": "true",
            "teamsId": league.teamsId
        })

        //edit the league to have isLocked to true
        let status = leagueService.createLeague(json)

        //Loop through the league to grab the IDs
        for (let i = 0; i < league?.teamsId?.length; i++) {
            //Convert the IDs to Json
            let json = JSON.stringify({
                "_id": league?.teamsId[i]
            })
            //Grab the team by using the service 
            let team = await teamService?.getTeam(json)

            //push the team to the team array
            teamArray?.push(team)
        }

        //save the teams to the global array
        setTeams(teamArray)

        //Create the matches by looping through all the teams
        for (let i = 0; i < teamArray.length; i++) {
            //Set the incrimenter to i + 1 so that no duplicate matches are created
            for (let j = i + 1; j < teamArray.length; j++) {
                //Convert the information to JSON
                let json = JSON.stringify({
                    "league": league,
                    "firstTeam": teamArray[i],
                    "secondTeam": teamArray[j],
                    "winnerTeam": null,
                    "gamePriority": [i].toString
                })
                //With the JSON information create a match object and store to the database
                await matchService.createMatch(json);
            }
        }

        //If the status is not empty refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //else display the error 
            alert("Failed to lock League!")
        }

    };

    /**
     * This function will take in a league variable
     * and set that league to finish so that a winner can be displayed
     * @param {*} league 
     */
    const finishLeague = async (league) => {

        //Convert the league information to json by editing the isFinished and locking the league
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isFinished": "true",
            "isLocked": "true",
            "teamsId": league.teamsId
        })

        //Save the league to the database
        let status = leagueService.createLeague(json)

        //If save is succesful refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //Else display error to the user
            alert("Failed to unlock League!")
        }

    };

    /**
     * This function will take in a league variable and then delete it
     * by using the league service
     * @param {*} league - League that has to be deleted
     */
    const deleteLeague = async (league) => {

        //Convert the ID of the delete league to JSON
        let json = JSON.stringify({
            "_id": league._id,
        })

        //Delete all the Matches related to this league by looping through 
        for (let i = 0; i < matches.length; i++){
            //Convert the IDs of the matches to JSON
            let jsonDelete = JSON.stringify({
                "_id" : matches[i]._id
            });
            
            //Use Service to delete the match
            if(matches[i].league._id === league._id) { 
                await matchService.deleteMatch(jsonDelete)
            }
               
        }

        //once matches are deleted delete the league
        let status = leagueService.deleteLeague(json)

        //If successful refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //Else display error message
            alert("Failed to delete League!")
        }

    };

    /**
     * This function will unlock the league for more teams to join
     * it will delete the matches so that new ones will be made
     * @param {} league - League that will be unlocked
     */
    const unlockLeague = async (league) => {

        //Convert the league information to json and set the isLocked to false
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isFinished": league.isFinished,
            "isLocked": "false",
            "teamsId": league.teamsId
        })

        //Save the changes to the database
        let status = leagueService.createLeague(json)

        //Delete all the Matches related to this league by looping through 
        for (let i = 0; i < matches.length; i++){
            //Convert the IDs of the matches to JSON
            let jsonDelete = JSON.stringify({
                "_id" : matches[i]._id
            });
            //Use Service to delete the match
            if(matches[i].league._id === league._id) { 
                await matchService.deleteMatch(jsonDelete)
            }
        }

        //If successful refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //Else display error message
            alert("Failed to unlock League!")
        }

    };

    /**
     * This function will take in the winning team, losing team and match
     * it will increment the wins and losses for the respective team as well as
     * store the winning team in the match object
     * 
     * @param {*} winningTeam - Winning Team
     * @param {*} losingTeam  - Losing Team
     * @param {*} match - Match that was played
     */
    const setWinner = async (winningTeam, losingTeam, match) => {

        //Create temp variables for win and loss
        let tempWin;
        let tempLose;

        //loop through the teams
        for (let i = 0; i < teams.length; i++){
            //Store the winning team in temp win
            if (teams[i]._id === winningTeam._id){
                tempWin = teams[i]
            }
            //Store the losing team in temp lose
            if (teams[i]._id === losingTeam._id){
                tempLose = teams[i]
            }
        }

        //create a string variable to store the current wins
        let stringWin = tempWin.teamWins;
        //Conver to integer and and add the win 
        let num = Number.parseInt(stringWin) + 1;

        //Convert all the data to JSON and edit the team wins 
        let json = JSON.stringify({
            "_id" : winningTeam._id,
            "clubTag": winningTeam.clubTag,
            "ownerID": winningTeam.ownerID,
            "teamLosses": tempWin.teamLosses,
            "teamWins": num,
            "teamName": winningTeam.teamName
        });

        //Use the team service to edit the team to the database
        let status = await teamService.createTeam(json)

        //create a string variable to store the current losses
        let stringLoss = tempLose.teamLosses;
        //Conver to integer and and add the loss
        let numLoss = Number.parseInt(stringLoss) + 1;

        //Convert all the data to JSON and edit the team losses
        let jsonLoss = JSON.stringify({
            "_id" : losingTeam._id,
            "clubTag": losingTeam.clubTag,
            "ownerID": losingTeam.ownerID,
            "teamLosses": numLoss,
            "teamWins": tempLose.teamWins,
            "teamName": losingTeam.teamName
        });

        //Use the team service to edit the team to the database
        let statusLoss = await teamService.createTeam(jsonLoss)

        //Convert the match information to json and edit the winning team
        let jsonMatch = JSON.stringify({
            "_id" : match._id,
            "league": match.league,
            "firstTeam": match.firstTeam,
            "secondTeam": match.secondTeam,
            "winnerTeam": winningTeam,
            "gamePriority": match.gamePriority
        })

        //Save the match to the database by using the service
        await matchService.createMatch(jsonMatch);

        //if there are no errors refresh the page
        if (statusLoss !== "") {
            window.location.reload();
        } else {
            //else display error
            alert("Failed to set the winner!")
        }

    };

    //Method that will render the information for the page
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            { leagues[0] ? (
                <div>
                    <Typography className={classes.header} align="center" variant="h4">
                        View Leagues Below in Admin Mode!
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
                                                <div>
                                                    {league.isLocked ? (
                                                        <Button onClick={() => unlockLeague(league)} variant="contained" color="primary" size="small">Unlock League</Button>
                                                    ) : (
                                                        <Button onClick={() => lockLeague(league)} variant="contained" color="primary" size="small">Lock League</Button>
                                                    )}
                                                </div>
                                                <div>
                                                    {league.isFinished ? (
                                                        <Button onClick={() => deleteLeague(league)} variant="contained" color="primary" size="small">Delete League</Button>
                                                    ) : (
                                                        <Button onClick={() => finishLeague(league)} variant="contained" color="primary" size="small">Finish League</Button>
                                                    )}
                                                </div>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Typography className={classes.header} align="center" variant="h4">
                            These are all the matches below!
                        </Typography>
                        <Grid container>
                            <Grid xs={2}></Grid>
                            <Grid className={classes.card}>
                                <Grid container spacing={2} direction='row'>
                                    {matches?.map((match) =>
                                        <Grid item key={match?._id} >
                                            <Card className={classes.cardContent}>
                                                <CardContent >
                                                    <Typography className={classes.pos} variant="h5">
                                                        {match?.firstTeam.teamName} vs {match?.secondTeam.teamName}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <div>
                                                    {match?.winnerTeam ? (
                                                        <Button variant="contained" color="primary" size="small">{match?.winnerTeam.teamName} Won</Button>
                                                    ) : (
                                                        <div>
                                                            <Button onClick={() => setWinner(match.firstTeam, match.secondTeam, match)} variant="contained" color="primary" size="small">{match.firstTeam.teamName} Wins</Button>
                                                            <Button onClick={() => setWinner(match.secondTeam, match.firstTeam, match)} variant="contained" color="primary" size="small">{match.secondTeam.teamName} Wins</Button>
                                                        </div>
                                                    )}
                                                    </div>
                                                    
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    <Button href="/CreateLeague" size="large" variant="contained" color="primary" className={classes.button}>
                        Create League
                </Button>
                </div>
            ) : (
                <div>
                </div>
            )}
        </div>
    )
}