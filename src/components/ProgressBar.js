/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This is a component used to display a team Win Rate in TeamInfo.js
 */

//Import React
import React from "react";

//Create a Porgressbar and set all the CSS for it
const ProgressBar = (props) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
        height: 20,
        maxWidth: 700,
        backgroundColor: "lightBlue",
        borderRadius: 50,
        margin: 50
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right'
    }

    const labelStyles = {
        padding: 5,
        color: '#3f50b5',
        fontWeight: 'bold'
    }

    //Return the HTML to the app
    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;