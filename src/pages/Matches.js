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

    const [data, setData] = useState();
    const [userTeam, setUserTeam] = useState();
    const [leagues, setLeagues] = useState([]);
    const [isLoading, setLoading] = useState();
    const [teams, setTeams] = useState([]);
    const classes = useStyles();
    const history = useHistory();
    let inLeague = false;
    let isOwner = false;
    let teamLeague;

    const fetchData = async () => {
        let json = JSON.stringify({
            "_id": _id,
        });
        try {
            setLoading(true)
            const user = await service.getUser(json)
            setData(user)

            if (user.team_id !== "") {
                let teamJson = JSON.stringify({
                    "_id": user.team_id
                })
                const team = await teamService.getTeam(teamJson)
                setUserTeam(team)
            }

            const leagues = await leagueService.getAllLeagues()
            setLeagues(leagues)

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    for (let i = 0; i < leagues.length; i++) {
        for (let j = 0; j < leagues[i]?.teamsId.length; j++) {
            if (userTeam._id === leagues[i]?.teamsId[j]) {
                inLeague = true;
                teamLeague = leagues[i];
                break;
            }
        }
    }

    if (data?._id === userTeam?.ownerID) {
        isOwner = true;
    }


    const joinLeague = async (league) => {
        let teamsArray = league.teamsId
        teamsArray.push(userTeam._id)

        let json = JSON.stringify({
            "_id": league._id,
            "leagueName": league.leagueName,
            "isLocked": league.isLocked,
            "isFinished" : league.isFinished,
            "teamsId": teamsArray
        })

        if (league.isLocked) {
            alert("Cannot Join League because it has already started!")
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