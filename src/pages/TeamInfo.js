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

  //size="large" float="right" variant="contained" color="primary"
/*Cookies (session) - Define the session in order to grab the id,
 in order to set the ID to Json and make a call to the api to get
 the user information
*/
const cookies = new Cookies();
const _id = cookies.get('Id');

export default function Component(props) {
    const classes = useStyles();

    //Data constant to store the data retrieved from the REST call
    const[data, setData] = useState();
    //Loading constant to determine if the data was recieved from the call
    const[isLoading, setLoading] = useState();
    const[teams, setTeams] = useState([]);

    /*Grab the User information in JSON format from the database
      using a service call.
    */
    const fetchData = async () => {
        let json = JSON.stringify({
            "_id": _id,
        });
        try {
            setLoading(true)
            const user = await service.getUser(json)
            setData(user)
            const fetchTeams = await teamService.getAllTeams()
            setTeams(fetchTeams)
        } catch (e){
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    // const joinTeam = async (teamId) => {
    //     console.log("TeamID", teamId)
    // };

    const joinTeam = async (teamId) => {
        console.log("TeamID", teamId);
        
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

        let status = await service.editUser(json);

        console.log("Status", status)

        if (status !== ""){
            window.location.reload();
        } else {
            alert("Failed to Add to Team!")
        }
        
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div>
                    Loading Information...
                </div>
            ) : data?.team_id  ? (
                <div>
                    User Information {data?.firstName}
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
                                            <Card className={classes.root}>
                                                <CardContent>
                                                    <Typography variant="h5">
                                                        Team Name: {team.teamName}
                                                    </Typography>
                                                    <Typography className={classes.pos} color="textSecondary">
                                                        Clubtag: {team.clubTag}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Wins: {team.teamWins}, Losses: {team.teamLosses}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button onClick={() => joinTeam(team._id)} size="small">Join Team</Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button size="large" variant="contained" color="primary" className={classes.button}>
                                Create Team
                            </Button>
                        </div>
            )}
        </div>
    )

}