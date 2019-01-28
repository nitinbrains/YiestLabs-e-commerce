import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from '@material-ui/core/CircularProgress';
import ItemPanel from "./ItemPanel";
import { orderActions } from "../../../redux/actions/orderActions";

class Items extends Component {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                {
                    this.props.loading.isLoading && this.props.loading.type == 'prepareOrder' ?
                        <Grid
                        container
                        justify="center"
                        alignItems="center"
                        spacing={24}
                        >
                            <CircularProgress size={50} />
                        </Grid>
                    :
                        <Grid
                        container
                        justify="center"
                        alignItems="center"
                        spacing={24}
                        >
                            <Grid item xs={12} md={9}>
                                <Typography variant="h6" color="textPrimary">
                                    ITEMS
                                </Typography>
                                <div className={classes.sectionTitleDivider} />
                            </Grid>

                            <Grid item xs={12} md={3} style={{textAlign: "center"}}>
                                <TextField
                                    select
                                    required
                                    id="shippingOption"
                                    name="shippingOption"
                                    label="Shipping Option"
                                    variant="outlined"
                                    autoComplete="country"
                                    fullWidth
                                    value={this.props.order.selectedShippingOption}
                                    onChange={event =>
                                        this.props.setShippingOption(event.target.value)
                                    }
                                    >
                                    {this.props.order.shippingOptions.map(
                                        (option, i) => (
                                            <MenuItem key={i} value={option}>
                                                {option}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <List>
                                    {this.props.order.items.map((item, i) => (
                                        <ItemPanel key={i} item={item} index={i} />
                                    ))}

                                    <ListItem className={classes.listItem}>
                                        <ListItemText primary="Item Subtotal" />
                                        <Typography
                                            variant="subheading"
                                            color="primary"
                                            className={classes.total}
                                            >
                                            {this.props.order.itemSubtotal}
                                        </Typography>
                                    </ListItem>
                                    <ListItem className={classes.listItem}>
                                        <ListItemText primary="Shipping Cost" />
                                        <Typography
                                            variant="subheading"
                                            color="primary"
                                            className={classes.total}
                                            >
                                            {this.props.order.shippingSubtotal}
                                        </Typography>
                                    </ListItem>
                                    <ListItem className={classes.listItem}>
                                        <ListItemText primary="Order Subtotal" />
                                        <Typography
                                            variant="subheading"
                                            color="primary"
                                            className={classes.total}
                                            >
                                            {this.props.order.orderSubtotal}
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                }                
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    },
    listItem: {
        padding: `${theme.spacing.unit}px 0`,
		paddingRight: 20,
		paddingLeft: 20,
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

const mapStateToProps = state => {
    return {
        order: state.order,
        loading: state.loading
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(orderActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Items));
