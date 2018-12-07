import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from '@material-ui/core/Card';
import CardBody from "../UI/Card/CardBody.jsx";
import Grid from '@material-ui/core/Grid';

// custom
import FormButton from '../Form/FormButton'

class ResultItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
    }
	}

	render() {
		return (
			
					
				<Card className="result-item-card">
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
		         		<FormButton text="ADD TO CART" onClick={() => {}}/>
		        	</Grid>
		      	</Grid>
		      	</CardBody>
						</Card>
						
					
			
		);
	}
}

export default ResultItem