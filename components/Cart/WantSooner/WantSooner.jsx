import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AlternateSizes from './AlternateSizes'
import SimilarStrains from './SimilarStrains'

class WantSooner extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'AlternateSizes'
    }
	}
	render() {
	    return (

	    		<div id='want-sooner-box'>
			<div >
	    <AppBar position="static">
	      <Tabs >
	        <Tab onClick={() => { this.setState({activeTab:'AlternateSizes'})}} label="ALTERNATE SIZES" />
	        <Tab  onClick={() => { this.setState({activeTab:'SimilarStrains'})}} label="SIMILAR STRAINS" />
	      </Tabs>
	      
	    </AppBar>
	    {this.state.activeTab == 'AlternateSizes' ? <AlternateSizes/> : <SimilarStrains/> }
	    
	   
	  </div>
	  </div>



        	
  	);
  }
}

const styles = theme => ({
});

WantSooner.propTypes = {
 
};

export default withStyles(styles)(WantSooner);
