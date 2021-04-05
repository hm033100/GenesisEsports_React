/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This component is used to display Team information uniquely
 */

//Complete all necessary imports for the page
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

//create the styles use and store into useStyles
const useStyles = makeStyles({
  root: {
    minWidth: 275,
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
  },
});

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function SimpleCard({teamName, clubTag, teamWins, teamLosses}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">
          {teamName}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {clubTag}
        </Typography>
        <Typography variant="body2">
            Wins: {teamWins}, Losses: {teamLosses}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}