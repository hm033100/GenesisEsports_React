import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import ProgressBar from './../components/ProgressBar';
import Button from '@material-ui/core/Button';
import service from './../service/UserService';
import teamService from './../service/TeamService';
import { Grid } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

function percentage(partialValue, totalValue) {
    var num;
    if (partialValue === 0 && totalValue === 0) {
        num = 0
    } else {
        num = (100 * partialValue) / totalValue;
        num = Math.round(num);
    }
    return num;
}

//Styles needed for the page
const useStyles = makeStyles({
    root: {
        minWidth: 275,
        align: 'center',
    },
    card: {
        minWidth: 100,
        maxWidth: 700,
        height: "70%",
        marginTop: 50,
        margnRight: 500,
        marginLeft: 50,
        backgroundColor: "#3f50b5"
    },
    userCard: {
        minWidth: 300,
        maxWidth: 700,
        height: "70%",
        marginTop: 50,
        margnRight: 500,
        marginLeft: 50,
        backgroundColor: "#3f50b5",
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px hsl(240deg 7% 97%)",
    },
    membersCard: {
        minWidth: 2000,
        maxWidth: 700,
        height: 500,
        marginTop: 50,
        margnRight: 500,
        marginLeft: 50,
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
    },
    button: {
        size: "large",
        float: 'right',
        maxWidth: 200,
        padding: 20,
        marginRight: 100,
        marginTop: 200,
        variant: "contained",
        color: "primary",
        justifycontent: 'center'
    },
    header: {
        marginTop: 50
    },
    content: {
        marginRight: 100
    },
    noMaxWidth: {
        maxWidth: 'none',
    },
   
});

export default function Component(props) {
    let classes = useStyles();
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamOwner, setTeamOwner] = useState(false);

    var wins = parseInt(props.team.teamWins);
    var losses = parseInt(props.team.teamLosses);
    var total = wins + losses;

    const leaveTeam = async (teamId) => {
        console.log("TeamID", teamId);

        let json = JSON.stringify({
            "_id": props.user._id,
            "team_id": "",
            "firstName": props.user.firstName,
            "lastName": props.user.lastName,
            "email": props.user.email,
            "phoneNumber": props.user.phoneNumber,
            "game": props.user.game,
            "username": props.user.username,
            "password": props.user.password
        });

        let status = await service.editUser(json);

        console.log("Status", status)

        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to Leave to Team!")
        }

    };

    const ownerLeaveTeam = async (teamId) => {

        let json = JSON.stringify({
            "_id": props.user._id,
            "team_id": "",
            "firstName": props.user.firstName,
            "lastName": props.user.lastName,
            "email": props.user.email,
            "phoneNumber": props.user.phoneNumber,
            "game": props.user.game,
            "username": props.user.username,
            "password": props.user.password
        });

        let status = await service.editUser(json);

        let users = await service.getAllUsers();
        const userArray = users.filter((user) => {
            if (user.team_id === props.team._id) {
                return user;
            }
        })

        let nextOwnerID;

        for (let i = 0; i < userArray.length; i++){
            if(userArray[i].team_id === props.team._id){
                nextOwnerID = userArray[i]._id;
                break;
            }
        }

        let teamJson = JSON.stringify({
            "_id" : props.team._id,
            "ownerID" : nextOwnerID,
            "teamName" : props.team.teamName,
            "clubTag" : props.team.clubTag,
            "teamWins" : props.team.teamWins,
            "teamLosses" : props.team.teamLosses
        })

        teamService.createTeam(teamJson);

        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to Leave to Team!")
        }

    };

    const deleteTeam = async (teamId) => {

        let status;

        for (let i = 0; i < teamMembers.length; i++){
            let json = JSON.stringify({
                "_id": teamMembers[i]._id,
                "team_id": "",
                "firstName": teamMembers[i].firstName,
                "lastName": teamMembers[i].lastName,
                "email": teamMembers[i].email,
                "phoneNumber": teamMembers[i].phoneNumber,
                "game": teamMembers[i].game,
                "username": teamMembers[i].username,
                "password": teamMembers[i].password
            });

            status = await service.editUser(json);
        }

        let json = JSON.stringify({
            "_id" : props.team._id,
        })

        await teamService.deleteTeam(json);
        

        if (status !== "") {
            window.location.reload();
        } else {
            alert("Failed to Delete Team!")
        }

    };

    const fetchData = async () => {
        let users = await service.getAllUsers();
        const userArray = users.filter((user) => {
            if (user.team_id === props.team._id) {
                return user;
            }
        })
        
        if (props.user._id === props.team.ownerID){
            setTeamOwner(true)
            alert("You are team owner!")
        }
        setTeamMembers(userArray)
    };

    useEffect(() => {
        fetchData();
    }, []);

    let buttons;
    if (teamOwner === false){
        buttons =
        <Button onClick={() => leaveTeam()} size="large" variant="contained" color="primary" className={classes.button}>
            Leave Team
        </Button>
    } else {
        buttons = 
        <div>
            <Button onClick={() => ownerLeaveTeam()} size="large" variant="contained" color="primary" className={classes.button}>
                Leave Team
            </Button>
            <Button onClick={() => deleteTeam()} size="large" variant="contained" color="primary" className={classes.button}>
                Delete Team
            </Button>
        </div>
    }

    return (
        <div>
            <Card className={classes.card} >
                    <Typography align="center" variant="h4" style={{ marginTop: 40, color: "#FFFFFF" }}>
                        This is your team information, {props.user.firstName}
                        <br></br>
                    </Typography>
                <Typography variant="h5" style={{ marginTop: 10, marginBottom: 40, color: "#FFFFFF", paddingLeft: 100 }}>
                    Team Name: {props.team.teamName}
                    <br></br>
                        Clubtag: {props.team.clubTag}
                    <br></br>
                        Losses: {losses}
                    <br></br>
                        Wins: {wins}
                </Typography>
            </Card>
            <Card className={classes.card} >
                <Typography align="center" variant="h4" style={{ marginTop: 40, color: "#FFFFFF" }} >
                    Team Win Ratio
                </Typography>
                <ProgressBar
                    bgcolor="#FFFFFF"
                    completed={percentage(wins, total)}
                />
            </Card>
            <Card className={classes.membersCard} >
                <Tooltip title={<h1 style={{ color: "white" }}>Firstname | GamerTag</h1>}>
                    <Typography align="center" variant="h4" style={{ marginTop: 40, color: "#FFFFFF" }} >
                        Team Members
                    </Typography>
                </Tooltip>
                <Grid container justify = "flex-start" direction="row">     
                    {teamMembers.map(member => (
                        <Grid item>
                            <Card className={classes.userCard} >              
                                <Typography align="center" variant="h4" style={{ color: "#FFFFFF" }} >
                                    {member.firstName} | {member.username} 
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {buttons}
            </Card>
        </div>
    )
}

