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
import FormMultipleSelectbox from '../../Form/FormMultipleSelectbox';

class SimilarStrains extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			options: [
										{label:'Liter', value:'L'},
										{label:'US Gallon', value:'SGAL'},
										{label:'UK Gallon', value:'KGAL'},
									],
			multipleOptionsSelected: []
    }
	}

	_renderItems = ( ) => {
		let items = this.props.items;
		let itemChunks = _.chunk( items, 2 );
		return _.map( itemChunks, ( options, i ) => {
			return (
				<Grid key={i} container spacing={24}>
					<Grid item xs={12} className="two-options-item-block">
						<Grid container spacing={24}>
			        {
			        	_.map( options, ( option, k ) => {
			        		return (
			        			<Grid key={k} className="option-parent-block" item xs={6}>
			          			<OptionItem/>
			        			</Grid>
			        		)
			        	})
			        }
			      </Grid>
					</Grid>
				</Grid>
			)
		})
	}

	handleChange = event => {
    this.setState({ multipleOptionsSelected: event.target.value });
  };
  

  render() {

	return (
		<Card id="similar-strains">
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
			        	<Typography className="content-text">
				          Select the style of beer that you are trying to make. The more styles you select the more options you will be offered.
				         </Typography>
			        </Grid>
			        <Grid item xs={6}  >
			        	<FormMultipleSelectbox
			        		value={this.state.multipleOptionsSelected}
			        		options={this.state.options}
			        		onChange={this.handleChange}
			        		className="style-of-beer"
			        	/>
			        </Grid>
			      </Grid>
	        </Grid>
	      </Grid>
				{this._renderItems()}	
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
