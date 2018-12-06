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

class ResultItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
    }
	}

	render() {
		return (
			<div id="result-item">
					<NavBarLayout>
				<Card>
					<CardBody>
					
						<Grid container spacing={24}>
		        	<Grid item xs={12} className="item-heading">
		         		Name
		        	</Grid>
		      	</Grid>

		      	<Grid container spacing={24}>
		        	<Grid item xs={12} className="item-description">
		         		Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed
		         		Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed Total Liters Needed
		        	</Grid>
		      	</Grid>

		      	<Grid container spacing={24}>
		        	<Grid item xs={12} className="item-button">
		         		<FormButton text="ADD TO CART"/>
		        	</Grid>
		      	</Grid>
		      	</CardBody>
						</Card>
						</NavBarLayout>
					
			</div>
		);
	}
}

export default ResultItem