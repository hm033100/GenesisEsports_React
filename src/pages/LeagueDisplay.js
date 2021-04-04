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
import HomePage from './HomePage';
import UserService from './../service/UserService';
import MatchService from '../service/MatchService';

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

export default function Component(props) {

    const [isLoading, setLoading] = useState();
    const [teams, setTeams] = useState([]);
    const [teamMatches, setTeamMatches] = useState([]);
    const classes = useStyles();
    const history = useHistory();

    let inLeague = false;
    let isOwner = false;

    const fetchData = async () => {
        let teams = await teamService.getAllTeams();
        let matches = await MatchService.getAllMatches();
        let teamArray = [];

        const matchesArray = matches.filter((match) => {
            if (match?.firstTeam._id === props?.user.team_id || match?.secondTeam._id === props?.user.team_id) {
                return match;
            }
        })

        setTeamMatches(matchesArray)


        for (let i = 0; i < props.league.teamsId.length; i++) {
            for (let j = 0; j < teams.length; j++) {
                if (teams[j]._id === props.league.teamsId[i]) {
                    teamArray.push(teams[j])
                }
            }
        }

        setTeams(teamArray)
    }

    const showTeamLeader = async (team) => {
        let json = JSON.stringify({
            "_id": team.ownerID
        })

        let status = await service.getUser(json)

        if (status !== "") {
            alert("Team Leader is Firstname: " + status.firstName + " ,and Username: " + status.username)
        }
    }

    const leaveLeague = async (league) => {
        let teamsArray = props.league.teamsId

        let newTeamsArray = [];

        for (let i = 0; i < teamsArray.length; i++) {
            if (teamsArray[i] !== props.user.team_id) {
                newTeamsArray?.push(teamsArray[i])
            }
        }

        let json = JSON.stringify({
            "_id": props.league._id,
            "leagueName": props.league.leagueName,
            "isFinished": props.league.isFinished,
            "isLocked": props.league.isLocked,
            "teamsId": newTeamsArray
        })

        if (props.league.isLocked) {
            alert("Cannot Leave League, the league has started!")
        } else {
            let status = await leagueService.createLeague(json)

            if (status !== "") {
                window.location.reload();
            } else {
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
            {props.user?.team_id !== "" ? (
                <div>
                    <Typography className={classes.header} align="center" variant="h4">
                        You are part of the {props.league.leagueName} League!<br></br>
                        Opponent Teams are listed below
                    </Typography>
                    <Grid container>
                        <Grid xs={2}></Grid>
                        <Grid className={classes.card}>
                            <Grid container spacing={2} direction='row'>
                                {teams?.map((team) =>
                                    <Grid item key={team?._id} >
                                        <Card className={classes.cardContent}>
                                            <CardContent >
                                                <Typography className={classes.pos} variant="h5">
                                                    Team Name: {team?.teamName}
                                                </Typography>
                                                <Typography className={classes.pos}>
                                                    Clubtag: {team?.clubTag}
                                                </Typography>
                                                <Typography className={classes.pos} variant="body2">
                                                    Wins: {team?.teamWins}, Losses: {team?.teamLosses}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={() => showTeamLeader(team)} variant="contained" color="primary" size="small">Show Team Leader</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    {props.league.isLocked ? (
                        <div>
                            <Typography className={classes.header} align="center" variant="h4">
                                Your teams matches are below!
                            </Typography>
                            <Grid container>
                                <Grid xs={2}></Grid>
                                <Grid className={classes.card}>
                                    <Grid container spacing={2} direction='row'>
                                        {teamMatches?.map((match) =>
                                            <Grid item key={match?._id} >
                                                <Card className={classes.cardContent}>
                                                    <CardContent >
                                                        <Typography className={classes.pos} variant="h5">
                                                            {match?.firstTeam.teamName} vs {match?.secondTeam.teamName}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    ) : (<div></div>)}
                    {props.user._id === props.team.ownerID ? (
                        <div>
                            <Button onClick={() => leaveLeague()} variant="contained" color="primary" size="small" className={classes.button}>Leave League</Button>
                        </div>
                    ) : (<div></div>)}
                </div>
            ) : (
                <div>
                    {history.push("/TeamInfo")}
                </div>
            )}
        </div>
    )
}
