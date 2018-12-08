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

class AlternateSizes extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
    }
	}

  render() {
	return (
		<Card id="alternate-sizes">
			<CardHeader color="primary" className="card-header-down">
				<Typography color="secondary" variant="display1" align="center">
					Alternate Sizes
				</Typography>
			</CardHeader>
			<CardBody>
				<Grid container spacing={24}>
	        <Grid item xs={12}>
	        	<Grid container spacing={24}>
			        <Grid item xs={6}>
			        	<Typography className="content-text">
				          Pick different sizes and get your order sooner.<br/>
				          All the options below are in stock.
				         </Typography>
			        </Grid>
			        <Grid item xs={6}  dir="rtl">
			         	<div className="similar-strain-button"  > Check For Similar Strains</div>
			        </Grid>
			      </Grid>
	        </Grid>
	      </Grid>
				
				<Grid container spacing={24}>
	        <Grid item xs={12} className="two-options-item-block">
	        	<Grid container spacing={24}>
			        <Grid item xs={5}>
			          <OptionItem/>
			        </Grid>
			        <Grid item xs={2}>
			          <div className="items-separation"></div>
			        </Grid>
			        <Grid item xs={5}>
			          <OptionItem/>
			        </Grid>
			      </Grid>
	        </Grid>
	      </Grid>


	      <Grid container spacing={24}>
	        <Grid item xs={12} className="two-options-item-block">
	        	<Grid container spacing={24}>
			        <Grid item xs={5}>
			          <OptionItem/>
			        </Grid>
			        <Grid item xs={2}>
			          <div className="items-separation"></div>
			        </Grid>
			        <Grid item xs={5}>
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

AlternateSizes.propTypes = {
 
};

export default withStyles(styles)(AlternateSizes);
