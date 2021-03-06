import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import moment from 'moment';
import ItemPanel from "components/Checkout/Items/ItemPanel";
import { orderActions } from 'appRedux/actions/orderActions';
import { userActions } from "appRedux/actions/userActions";
import SalesLib from "lib/SalesLib";

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
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    }
});

function Review(props) {
    const { classes } = props;
    return (
        <React.Fragment>
            <Typography variant="h6" color="textPrimary">
                ORDER SUMMARY
            </Typography>
            <div className={classes.sectionTitleDivider} />
            <Grid item container direction="column" xs={12} sm={6}>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="title"
                        gutterBottom
                        className={classes.title}
                    >
                        User Detail
                    </Typography>
                    <Typography gutterBottom>{ props.user.username? props.user.username :  ''}</Typography>
                    <Typography gutterBottom>{ props.user.email && props.user.email }</Typography>
                    <Typography gutterBottom>{ props.user.phone && props.user.phone }</Typography>
                    <Typography gutterBottom>{ props.user.subsidiary && props.user.subsidiaryOptions.map(data => {
                        if(data.value == props.user.subsidiary){
                            return data.label
                        }
                    }) }</Typography>
                </Grid>
            </Grid>
            <Grid item container direction="column" xs={12} sm={12}>
                <Grid
                    container
                    spacing={12}
                >
                    <Typography
                        variant="title"
                        gutterBottom
                        className={classes.title}
                    >
                        Item List
                    </Typography>
                    {
                    !props.order.isLoading &&

                    <Grid item xs={12}>
                        <List>
                            {props.order.items.map((item, i) => (
                                <ItemPanel key={i} item={item} index={i} />
                            ))}
                        </List>
                    </Grid>
                    }
                </Grid>
            </Grid>

            <Grid item container direction="column" xs={12} sm={6}>
                    <Typography
                        variant="title"
                        gutterBottom
                        className={classes.title}
                    >
                        Payment details
                    </Typography>
                    {
                        props.user.card &&
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    Card Type
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    Visa
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    Card holder
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    {props.user.card.ccname}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    Card number
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    {props.user.card.ccnumber}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    Expiry date
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    {moment(props.user.card.ccexpire).format('MM/YYYY')}
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                </Grid>

            <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="title"
                        gutterBottom
                        className={classes.title}
                    >
                        Shipping Address
                    </Typography>
                    <Typography gutterBottom>{ props.user.username? props.user.username : ''}</Typography>

                    {props.user.shipping  && (
                            <div>
                                <Typography>
                                    {props.user.shipping.attn}
                                </Typography>
                                <Typography>
                                    {props.user.shipping.addressee}
                                </Typography>
                                <Typography>
                                    {props.user.shipping.address1}
                                </Typography>
                                <Typography>
                                    {props.user.shipping.address2}
                                </Typography>
                                <Typography>
                                    {props.user.shipping.address3}
                                </Typography>
                                <Typography>
                                    {props.user.shipping.city}, {props.user.shipping.countryid}, {props.user.shipping.zip}
                                </Typography>
                            </div>
                        )}
                </Grid>

                <Grid item xs={12} md={6}>
                        <Typography
                            variant="title"
                            gutterBottom
                            className={classes.title}
                        >
                            BILLING ADDRESS
                        </Typography>
                        <Typography >{ props.user.username? props.user.username :  ''}</Typography>
                        {props.user.billing  && (
                            <div>
                                <Typography>
                                    {props.user.billing.attn}
                                </Typography>
                                <Typography>
                                    {props.user.billing.addressee}
                                </Typography>
                                <Typography>
                                    {props.user.billing.address1}
                                </Typography>
                                <Typography>
                                    {props.user.billing.address2}
                                </Typography>
                                <Typography>
                                    {props.user.billing.address3}
                                </Typography>
                                <Typography>
                                    {props.user.billing.city}, {props.user.billing.countryid}, {props.user.billing.zip}
                                </Typography>
                            </div>
                        )}
                </Grid>

                <Grid item container direction="column" xs={12} sm={12}>
                <Grid
                    container
                    spacing={12}
                >
                    <Typography
                        variant="title"
                        gutterBottom
                        className={classes.title}
                    >
                        Order Price
                    </Typography>
                    {
                    !props.order.isLoading &&

                    <Grid item xs={12}>
                        <List>
                            <ListItem className={classes.listItem}>
                                <ListItemText primary="Item Subtotal" />
                                <Typography
                                    variant="subheading"
                                    color="primary"
                                    className={classes.total}
                                    >
                                    {SalesLib.CURRENCY_MAP[props.user.currency - 1].symbol}
                                    {props.order.itemSubtotal}
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <ListItemText primary="Shipping Cost" />
                                <Typography
                                    variant="subheading"
                                    color="primary"
                                    className={classes.total}
                                    >
                                    {SalesLib.CURRENCY_MAP[props.user.currency - 1].symbol}
                                    {props.order.shippingSubtotal}
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <ListItemText primary="Order Subtotal" />
                                <Typography
                                    variant="subheading"
                                    color="primary"
                                    className={classes.total}
                                    >
                                    {SalesLib.CURRENCY_MAP[props.user.currency - 1].symbol}
                                    {props.order.orderSubtotal}
                                </Typography>
                            </ListItem>
                        </List>
                    </Grid>
                    }
                </Grid>
            </Grid>

            </Grid>
        </React.Fragment>
    );
}

Review.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        order: state.order
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({...orderActions, ...userActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Review));
