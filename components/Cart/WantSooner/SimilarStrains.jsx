import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import NavBarLayout from "../../NavBar/NavBarLayout";
import Card from "../../UI/Card/Card.jsx";
import CardBody from "../../UI/Card/CardBody.jsx";
import CardHeader from "../../UI/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

import OptionItem from './OptionItem';

class SimilarStrains extends React.Component {
     render() {
	return (
		<Card id="alternate-sizes">
			<CardHeader color="primary" className="card-header-down">
				<Typography color="secondary" variant="display1" align="center">
					Similar Strains
				</Typography>
			</CardHeader>
			<CardBody>
				<Grid container spacing={24}>
	        <Grid item xs={12}>
	        	<Grid container spacing={24}>
			        <Grid item xs={6}>
			          <OptionItem/>
			        </Grid>
			        <Grid item xs={6}>
			          <OptionItem/>
			        </Grid>
			      </Grid>

	          
	        </Grid>
	      </Grid>
			
			</CardBody>
		</Card>
		);
	}
}

const styles = theme => ({
});

SimilarStrains.propTypes = {
 
};

export default withStyles(styles)(SimilarStrains);
