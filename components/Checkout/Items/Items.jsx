import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';

import SaleItem from './SaleItem';
import { orderActions } from '../../../redux/actions/orderActions';


class Items extends Component {
	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<Typography variant="title" gutterBottom>
					Order summary
				</Typography>

				<TextField
                    select
                    required
                    id="shippingOption"
                    name="shippingOption"
                    label="Shipping Option"
                    fullWidth
                    autoComplete="country"
                    value={this.props.checkout.selectedShippingOption}
                    onChange={(event) => this.props.setShippingOption(event.target.value)}
                >
                {this.props.checkout.shippingOptions.map((option, i) => (
                    <MenuItem
                        key={i}
                        value={option}
                    >
                        {option}
                    </MenuItem>
                ))}
                </TextField>

				<List>

					{this.props.checkout.items.map((item, i) => (
						<SaleItem key={i} item={item} index={i} />
					))}

					<ListItem className={classes.listItem}>
						<ListItemText primary="Item Subtotal" />
						<Typography variant="subheading" className={classes.total}>
							{this.props.checkout.itemSubtotal}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<ListItemText primary="Shipping Cost" />
						<Typography variant="subheading" className={classes.total}>
							{this.props.checkout.shippingSubtotal}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<ListItemText primary="Order Subtotal" />
						<Typography variant="subheading" className={classes.total}>
							{this.props.checkout.orderSubtotal}
						</Typography>
					</ListItem>
				</List>
			</React.Fragment>
		);
	}
}

const styles = theme => ({
	listItem: {
		padding: `${theme.spacing.unit}px 0`
	},
	total: {
		fontWeight: "700"
	},
	title: {
		marginTop: theme.spacing.unit * 2
	}
});

Items.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
	return {
		checkout: state.checkout
	}
}

const mapDispatchToProps = dispatch => bindActionCreators(orderActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Items));
