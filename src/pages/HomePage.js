/*  Hermes Mimini
 *  CST-452: Professor Mark Reha
 *  Version 1.0
 *  Sprint 2: 02/07/2021
 * 
 * This class is currently a testing class just to show that the Login and Register functions work fine.
 */

 //Necessary imports for the page
import React from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export default function ResponsiveFontSizes() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Typography variant="h3">Thank you for joining Genesis Esports!</Typography>
        <Typography variant="h4">New features will be coming soon.</Typography>
      </ThemeProvider>
    </div>
  );
}