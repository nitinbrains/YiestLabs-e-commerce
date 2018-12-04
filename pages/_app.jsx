import React from 'react';
import App, { Container } from 'next/app';

// redux
import configureStore from '../redux/configureStore'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// material-ui
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../src/getPageContext';
import "../styles/main.scss"

class MyApp extends App {
	constructor(props) {
		super(props);
		this.pageContext = getPageContext();
	}

	pageContext = null;

	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}

	render() {
		const { Component, pageProps, reduxStore, persistor } = this.props;
		return (
			<Container>
				<Provider store={reduxStore}>
					<PersistGate loading={null} persistor={persistor}>
						{/* Wrap every page in Jss and Theme providers */}
						<JssProvider
							registry={this.pageContext.sheetsRegistry}
							generateClassName={this.pageContext.generateClassName}
						>
							{/* MuiThemeProvider makes the theme available down the React
									tree thanks to React context. */}
							<MuiThemeProvider
								theme={this.pageContext.theme}
								sheetsManager={this.pageContext.sheetsManager}
							>
								{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
								<CssBaseline />
								{/* Pass pageContext to the _document though the renderPage enhancer
										to render collected styles on server side. */}
								<Component pageContext={this.pageContext} {...pageProps} />
							</MuiThemeProvider>
						</JssProvider>
					</PersistGate>
				</Provider>
			</Container>
		);
	}
}

export default configureStore(MyApp)



