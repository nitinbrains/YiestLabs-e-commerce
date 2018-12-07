import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from '@material-ui/core/Card';
import CardBody from "../../UI/Card/CardBody.jsx";
import Grid from '@material-ui/core/Grid';

class OptionItem extends React.Component {
    render() {
        return (
        	<Card className="option-item-card">
					<CardBody>
					
						<Grid container spacing={24}>
		        	<Grid item xs={12} className="item-heading">
		         		OPTION 1
		        	</Grid>
		      	</Grid>

		      	<Grid container spacing={24}>
		        	<Grid item xs={12} className="item-heading">
		         		WLPLPL001 ALE YEAST
		        	</Grid>
		      	</Grid>

		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Quantity:
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		1
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Price Per Quantity:
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		$85.17
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Ship Date:
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		Monday 10/28/18
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Adressee:
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		WL Ashville
		        	</Grid>
		      	</Grid>
		      	<Grid container spacing={24} className="summary-others">
		        	<Grid item xs={6}>
		         		Total Group Cost:
		        	</Grid>
		        	<Grid item xs={6} dir="rtl">
		         		$85.17
		        	</Grid>
		      	</Grid>
					
		      	</CardBody>
						</Card>
        );
    }
}

const styles = theme => ({
});

OptionItem.propTypes = {
 
};

export default withStyles(styles)(OptionItem);
