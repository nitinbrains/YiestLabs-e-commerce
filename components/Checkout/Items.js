import React from "react";
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";

const products = [
	{ name: "California Ale Yeast", desc: "Purepitch", price: "$234.99" }
];
const addresses = [
	"1 Material-UI Drive",
	"Reactville",
	"Anytown",
	"99999",
	"USA"
];

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

function Items(props) {
	const { classes } = props;
	return (
		<React.Fragment>
			<Typography variant="title" gutterBottom>
				Order summary
			</Typography>
			<List disablePadding>
				{props.checkout.items.map(item => (
					<ListItem className={classes.listItem} key={item.name}>
						<ListItemText primary={item.Name} secondary={item.desc} />
						<Typography variant="body2">{`\$${item.pricePerUnit}`}</Typography>
					</ListItem>
				))}
				<ListItem className={classes.listItem}>
					<ListItemText primary="Item Subtotal" />
					<Typography variant="subheading" className={classes.total}>
						{props.checkout.itemSubtotal}
					</Typography>
				</ListItem>
				<ListItem className={classes.listItem}>
					<ListItemText primary="Shipping Cost" />
					<Typography variant="subheading" className={classes.total}>
						{props.checkout.shippingSubtotal}
					</Typography>
				</ListItem>
				<ListItem className={classes.listItem}>
					<ListItemText primary="Order Subtotal" />
					<Typography variant="subheading" className={classes.total}>
						{props.checkout.orderSubtotal}
					</Typography>
				</ListItem>
			</List>
		</React.Fragment>
	);
}

Items.propTypes = {
	classes: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
	return {
		checkout: state.checkout
	}
}

const mapDispatchToProps = dispatch => {
		return {
				login: (username, password) => dispatch({ type: "LOGIN_REQUEST", username, password}),
				getInventory: (category, getAll) => dispatch({ type: "STORE_REQUEST", category, getAll}),
				addCartItem: (item, volIdIndex, quantity) => dispatch({type: "ADD_TO_CART", item, volIdIndex, quantity}),
				changeQuantity: (index, quantity) => dispatch({type: "CHANGE_QUANTITY", index, quantity}),
				deleteFromCart: (index) => dispatch({type: "DELETE_FROM_CART", index})
		};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Items));
