import React, { Component } from "react";
import App, { Container } from "next/app";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#f28411",
      contrastText: "#fff"
    },
    secondary: {
      main: "#fff"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    }
  },
  typography: {}
});

export default class YeastMan extends App {

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <MuiThemeProvider theme={MuiTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MuiThemeProvider>
      </Container>
    );
  }
}
