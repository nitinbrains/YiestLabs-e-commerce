import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../NavBar/NavBarLayout";
import Card from "../UI/Card/Card.jsx";
import CardBody from "../UI/Card/CardBody.jsx";
import CardHeader from "../UI/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

// custom
import Alert from '../UI/Alert';
import FormTextbox from '../Form/FormTextbox'
import FormSelectbox from '../Form/FormSelectbox'
import FormButton from '../Form/FormButton'
import FormCheckbox from '../Form/FormCheckbox'

class ResultSummary extends Component {

	constructor(props) {
		super(props);
		this.state = {
    }
	}

	render() {
		return (
			<NavBarLayout>
				<Card>
					<CardBody>
						<Grid container spacing={24}>
		        	<Grid item xs={12} className="summary-heading">
		         		Result Summary
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-total">
		        	<Grid item xs={6}>
		         		Total Liters Needed:
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		1
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Nano (0.5L):
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		0.5
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Nano (1.5L):
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		0.5
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Nano (2L): 
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		0
		        	</Grid>
		      	</Grid>
					

						
					</CardBody>
					
				</Card>
				</NavBarLayout>
		);
	}
}

export default ResultSummary