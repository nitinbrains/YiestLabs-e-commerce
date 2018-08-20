import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppBar from "../components/NavBar/NavBar";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#f28411"
        },
        text: {
            secondary: "#FFF"
        }
    },
    typography: {}
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <React.Fragment>
                    <CssBaseline />
                    <AppBar />
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}
export default App;
