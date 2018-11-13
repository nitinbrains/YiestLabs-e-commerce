import React from "react";
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";

const addresses = ["Sudwerk", "Davis", "California", "95616", "USA"];
const payments = [
	{ name: "Card type", detail: "Visa" },
	{ name: "Card holder", detail: "Tom Brady" },
	{ name: "Card number", detail: "xxxx-xxxx-xxxx-5555" },
	{ name: "Expiry date", detail: "06/2023" }
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

function Review(props) {
	const { classes } = props;
	return (
		<React.Fragment>
			<Typography variant="title" gutterBottom>
				Order summary
			</Typography>
			<Grid container spacing={16}>
				<Grid item xs={12} sm={6}>
					<Typography variant="title" gutterBottom className={classes.title}>
						Shipping
					</Typography>
					<Typography gutterBottom>Tom Brady</Typography>
					<Typography gutterBottom>{addresses.join(", ")}</Typography>
				</Grid>
				<Grid item container direction="column" xs={12} sm={6}>
					<Typography variant="title" gutterBottom className={classes.title}>
						Payment details
					</Typography>
					<Grid container>
						{payments.map(payment => (
							<React.Fragment key={payment.name}>
								<Grid item xs={6}>
									<Typography gutterBottom>{payment.name}</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography gutterBottom>{payment.detail}</Typography>
								</Grid>
							</React.Fragment>
						))}
					</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

Review.propTypes = {
	classes: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
    return {
        user: state.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Review));
