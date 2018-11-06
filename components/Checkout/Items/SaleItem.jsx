import React, { Component } from "react";
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Collapse from '@material-ui/core/Collapse';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";


import Utils from '../../../lib/Utils';

class SaleItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

	render() {
        const { classes } = this.props;

        return (
            <div>
                <ListItem button className={classes.listItem} onClick={this.handleExpandClick}>
                    <ListItemText primary={this.props.item.Name} secondary={this.props.item.desc} />
                    <Typography variant="body2">{`\$${this.props.item.pricePerUnit}`}</Typography>
                </ListItem>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <ListItem>
                            <ListItemText primary="Location" />
                            <Typography component="p">{Utils.getWarehouse(this.props.item.Warehouse)}</Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ship Date" />
                            <Typography component="p">{this.props.item.shipDate.toDateString()}</Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Delivery Date" />
                            <Typography component="p">{this.props.item.deliveryDate.toDateString()}</Typography>
                        </ListItem>

                        {this.props.checkout.selectedShippingOption == "Custom"  && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.props.decrementShipDate(this.props.item)}
                                className={classes.button}
                            >
                                Sooner
                            </Button>
                        )}

                        {this.props.checkout.selectedShippingOption == "Custom"  && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.props.incrementShipDate(this.props.item)}
                                className={classes.button}
                            >
                                Later
                            </Button>
                        )}


                    </CardContent>
                </Collapse>
            </div>

        )
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
	},
    button: {
		marginTop: theme.spacing.unit * 3,
		marginLeft: theme.spacing.unit
	}
});

SaleItem.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
	return {
		checkout: state.checkout
	}
}

const mapDispatchToProps = dispatch => {
		return {
			incrementShipDate: (item) => dispatch({type: "INCREMENT_SHIP_DATE", item}),
            decrementShipDate: (item) => dispatch({type: "DECREMENT_SHIP_DATE", item})
		};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SaleItem));
