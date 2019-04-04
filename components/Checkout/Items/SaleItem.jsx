import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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


import Utils from 'lib/Utils';
import { orderActions } from 'appRedux/actions/orderActions';


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
        const { classes, item } = this.props;

        return (
            <div>
                <ListItem button className={classes.listItem} onClick={this.handleExpandClick}>
                    <ListItemText primary={item.Name} secondary={this.props.item.desc} />
                    <Typography variant="body2">{`\$${item.pricePerUnit}`}</Typography>
                </ListItem>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <ListItem>
                            <ListItemText primary="Location" />
                            <Typography component="p">{Utils.getWarehouse(item.Warehouse)}</Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ship Date" />
                            <Typography component="p">{item.shipDate.toDateString()}</Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Delivery/Pickup Date" />
                            <Typography component="p">{item.deliveryDate.toDateString()}</Typography>
                        </ListItem>

                        {order.selectedShippingOption == "Custom"  && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.props.decrementShipDate(item)}
                                className={classes.button}
                            >
                                Sooner
                            </Button>
                        )}

                        {order.selectedShippingOption == "Custom"  && (
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
		order: state.order
	}
}

const mapDispatchToProps = dispatch => bindActionCreators(orderActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SaleItem));
