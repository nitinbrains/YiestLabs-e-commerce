import React, { Component } from "react";
import App, { Container } from "next/app";

// redux
import configureStore from '../redux/configureStore'
import { Provider } from 'react-redux'

// material-ui
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from 'react-jss/lib/JssProvider';

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

class YeastMan extends App {

	render() {
		const { Component, pageProps, reduxStore } = this.props;

		return (
			<Container>
				<Provider store={reduxStore}>
					<JssProvider>
						<MuiThemeProvider theme={MuiTheme}>
							<CssBaseline />
							<Component {...pageProps} />
						</MuiThemeProvider>
					</JssProvider>
				</Provider>
			</Container>


		);
	}
}

export default configureStore(YeastMan)
