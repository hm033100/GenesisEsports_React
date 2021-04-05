/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This page will display the team information to the user 
 * based on what team ID that they have, using the map react function
 * the members of the team will also be shown. There is logical code to
 * display team information. 
 */

//Import all the necessary components for the page 
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
import matchService from './../service/MatchService';



//Styles needed for the page
const useStyles = makeStyles({
    root: {
        minWidth: 275,
        align: 'center',
    },
    card: {
        width: "33%",
        height: 300,
        paddingRight: 100,
        marginTop: 50,
        margnRight: 50,
        marginLeft: 50,
        backgroundColor: "#3f50b5"
    },
    matchCard: {
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
        marginLeft: 150,
        alignContent: "center",
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

/**
 * This function will take in the total games played and games won
 * for the team and use math logic to convert to a percentage that is displayed
 * on a bar
 * @param {} partialValue - The games won for the team
 * @param {*} totalValue - The total games played
 * @returns - Integer - Percentage 
 */
function percentage(partialValue, totalValue) {
    //create a num variable 
    var num;

    //if toatal agmes and games won are 0 num is 0
    //NOTE - this logic is to avoid spring errors
    if (partialValue === 0 && totalValue === 0) {
        num = 0
    } else {
        //else multiply and divide to get the percentage
        num = (100 * partialValue) / totalValue;
        //round
        num = Math.round(num);
    }
    return num;
}

/**
 * The function that takes the props of a user and team and 
 * wil display. 
 * @param {*} props - User/Team
 * @returns 
 */
export default function Component(props) {

    //states used throughout the website
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamOwner, setTeamOwner] = useState(false);
    const [teamMatches, setTeamMatches] = useState([]);

    //declear variables that are used for logic
    let classes = useStyles();
    var wins = parseInt(props.team.teamWins);
    var losses = parseInt(props.team.teamLosses);
    var total = wins + losses;

    /**
     * This function is for when a user wants to leave the team that they are in
     * and it uses the team id sent that will be removed using a service call
     * @param {} teamId - Users Team ID
     */
    const leaveTeam = async (teamId) => {

        //convert the user information to json and removce the team id
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

        //Call the service to edit the user and save to the database
        let status = await service.editUser(json);

        //If successful refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //else alert the user for the error
            alert("Failed to Leave to Team!")
        }

    };

    /**
     * This function is for when a user leaves a team and the user is the owner
     * the owner id of the team is going to be set to a user in the team
     * @param {} teamId 
     */
    const ownerLeaveTeam = async (teamId) => {

        //convert the user information to json and disinclude the team id
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

        //run the service to make changes in the database
        let status = await service.editUser(json);

        //grab all the users from the database
        let users = await service.getAllUsers();
        //filter through the users 
        const userArray = users.filter((user) => {
            //if the users team id is equal to the team id
            if (user.team_id === props.team._id) {
                //return that user which will be stored in the users array
                return user;
            }
        })

        //define a variable where the next owner id is stored
        let nextOwnerID;

        //loop through the user array
        for (let i = 0; i < userArray.length; i++) {
            //if the users team id is equal to the team id
            if (userArray[i].team_id === props.team._id) {
                //set the user as the next owner
                nextOwnerID = userArray[i]._id;
                //break
                break;
            }
        }

        //convert the team information to json with the new team owner id
        let teamJson = JSON.stringify({
            "_id": props.team._id,
            "ownerID": nextOwnerID,
            "teamName": props.team.teamName,
            "clubTag": props.team.clubTag,
            "teamWins": props.team.teamWins,
            "teamLosses": props.team.teamLosses
        })

        //store the team to the database by using the service
        teamService.createTeam(teamJson);

        //if there are no errors refresh the page
        if (status !== "") {
            window.location.reload();
        } else {
            //else display the error to the user
            alert("Failed to Leave to Team!")
        }

    };

    /**
     * This function will delete the team from the database 
     * and remove all the users from the team
     * @param {} teamId 
     */
    const deleteTeam = async (teamId) => {

        //status which is the response that is used below
        let status;

        //loop through the team members 
        for (let i = 0; i < teamMembers.length; i++) {

            //convert all the users to json while looping and remove the team id
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

            //call the service to change all the users in the database
            status = await service.editUser(json);
        }

        //convert the team id to json
        let json = JSON.stringify({
            "_id": props.team._id,
        })

        //using the json team id delete the team
        await teamService.deleteTeam(json);


        //if there are no errors 
        if (status !== "") {
            //refresh the page
            window.location.reload();
        } else {
            //else show the errors
            alert("Failed to Delete Team!")
        }

    };

    /**
    * Fecth data will grab the users from the database and store them in an array
    * it will determine the team members as well as alert the user if they are the owner
    * of the team 
    * 
    */
    const fetchData = async () => {
        //grab all the users from the database
        let users = await service.getAllUsers();

        //grab all the matches from the database
        let matches = await matchService.getAllMatches();

        //loop through the matches and grab the matches that has this teams id
        const matchesArray = matches.filter((match) => {
            if (match.firstTeam._id === props.team._id || match.secondTeam._id === props.team._id) {
                return match;
            }
        })

        //filter through the user 
        const userArray = users.filter((user) => {
            //store in user array the users with team id of the team
            if (user.team_id === props.team._id) {
                //store user
                return user;
            }
        })

        //if the current user has team id equal to the team owner id
        if (props.user._id === props.team.ownerID) {
            //set team owner as true
            setTeamOwner(true)
            //alert the user that they are team owner
            alert("You are team owner!")
        }
        //store team members in the state variable
        setTeamMembers(userArray)
        setTeamMatches(matchesArray)
    };

    /**
     * This method will call the asynchronous call in order for the page to render after
     * the data is recieved fromt the API Call
     */
    useEffect(() => {
        fetchData();
    }, []);

    console.log("Matches", teamMatches)

    //variable of buttons that are going to be rendered in the teams
    let buttons;
    //if the user is not an owner
    if (teamOwner === false) {
        //set the button to be a regular button
        buttons =
            <Button onClick={() => leaveTeam()} size="large" variant="contained" color="primary" className={classes.button}>
                Leave Team
        </Button>
    } else {
        //else add on top another button called delete team for the team owner
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
            <div style={{ display: "flex", paddingRight: 50 }}>
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
                <Card className={classes.card}>
                    {teamMatches.length !== 0 ? (
                        <div>
                            <Typography align="center" variant="h4" style={{ marginTop: 40, color: "#FFFFFF" }}>
                                Upcoming Match
                                <br></br>
                            </Typography>
                            <Typography variant="h3" style={{ justifyContent: "center", marginTop: 40, textAlign: "center", color: "#FFFFFF" }}>
                                {teamMatches[0]?.firstTeam?.teamName} vs {teamMatches[0]?.secondTeam?.teamName}
                            </Typography>
                        </div>
                    ) : (
                        <div>
                            <Typography align="center" variant="h4" style={{ marginTop: 40, color: "#FFFFFF" }}>
                                    Upcoming Match
                                    <br></br>
                                </Typography>
                                <  Typography variant="h3" style={{ justifyContent: "center", marginTop: 40, textAlign: "center", color: "#FFFFFF" }}>
                                No Matches Coming Up
                            </Typography>
                        </div>
                )}

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
            </div>
            <Card className={classes.membersCard} >
                <Tooltip title={<h1 style={{ color: "white" }}>Firstname | GamerTag</h1>}>
                    <Typography align="center" variant="h4" style={{ marginTop: 40, color: "#FFFFFF" }} >
                        Team Members
                    </Typography>
                </Tooltip>
                <Grid container justify="flex-start" direction="row">
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

