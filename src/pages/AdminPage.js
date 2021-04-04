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

export default function Component(props) {
    const [leagues, setLeagues] = useState([]);
    const classes = useStyles();
    const history = useHistory();
    const [teams, setTeams] = useState([]);
    const [viewLeague, setViewLeague] = useState(false);
    const [matches, setMatches] = useState([]);

    const fetchData = async () => {
        const leagues = await leagueService.getAllLeagues();
        setLeagues(leagues)

        const teams = await teamService.getAllTeams();
        setTeams(teams)

        let matches = await matchService.getAllMatches();
        setMatches(matches)
    }
    const lockLeague = async (league) => {
        let teamArray = []
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isFinished": league.isFinished,
            "isLocked": "true",
            "teamsId": league.teamsId
        })

        let status = leagueService.createLeague(json)
        for (let i = 0; i < league?.teamsId?.length; i++) {
            let json = JSON.stringify({
                "_id": league?.teamsId[i]
            })
            let team = await teamService?.getTeam(json)
            console.log(team)
            teamArray?.push(team)
        }
        setTeams(teamArray)

        for (let i = 0; i < teamArray.length; i++) {
            for (let j = i + 1; j < teamArray.length; j++) {
                let json = JSON.stringify({
                    "league": league,
                    "firstTeam": teamArray[i],
                    "secondTeam": teamArray[j],
                    "winnerTeam": null,
                    "gamePriority": [i].toString
                })

                await matchService.createMatch(json);
            }
        }



        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to lock League!")
        }

    };

    const finishLeague = async (league) => {
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isFinished": "true",
            "isLocked": "true",
            "teamsId": league.teamsId
        })

        let status = leagueService.createLeague(json)

        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to unlock League!")
        }

    };

    const deleteLeague = async (league) => {
        let json = JSON.stringify({
            "_id": league._id,
        })

        let status = leagueService.deleteLeague(json)

        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to unlock League!")
        }

    };

    const unlockLeague = async (league) => {
        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isFinished": league.isFinished,
            "isLocked": "false",
            "teamsId": league.teamsId
        })

        let status = leagueService.createLeague(json)

        for (let i = 0; i < matches.length; i++){
            let jsonDelete = JSON.stringify({
                "_id" : matches[i]._id
            });
            await matchService.deleteMatch(jsonDelete)
        }

        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to unlock League!")
        }

    };

    const setWinner = async (winningTeam, losingTeam, match) => {
        let tempWin;
        let tempLose;
        for (let i = 0; i < teams.length; i++){
            if (teams[i]._id === winningTeam._id){
                tempWin = teams[i]
            }
            if (teams[i]._id === losingTeam._id){
                tempLose = teams[i]
            }
        }

        let stringWin = tempWin.teamWins;
        let num = Number.parseInt(stringWin) + 1;

        let json = JSON.stringify({
            "_id" : winningTeam._id,
            "clubTag": winningTeam.clubTag,
            "ownerID": winningTeam.ownerID,
            "teamLosses": tempWin.teamLosses,
            "teamWins": num,
            "teamName": winningTeam.teamName
        });

        let status = await teamService.createTeam(json)

        let stringLoss = tempLose.teamLosses;
        let numLoss = Number.parseInt(stringLoss) + 1;

        let jsonLoss = JSON.stringify({
            "_id" : losingTeam._id,
            "clubTag": losingTeam.clubTag,
            "ownerID": losingTeam.ownerID,
            "teamLosses": numLoss,
            "teamWins": tempLose.teamWins,
            "teamName": losingTeam.teamName
        });

        let statusLoss = await teamService.createTeam(jsonLoss)

        let jsonMatch = JSON.stringify({
            "_id" : match._id,
            "league": match.league,
            "firstTeam": match.firstTeam,
            "secondTeam": match.secondTeam,
            "winnerTeam": winningTeam,
            "gamePriority": match.gamePriority
        })

        await matchService.createMatch(jsonMatch);

        if (statusLoss !== "") {
            window.location.reload();
        } else {
            alert("Failed to set the winner!")
        }

    };

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