import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Router from "next/router";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { orderActions } from 'appRedux/actions/orderActions';
import { cartActions } from 'appRedux/actions/cartActions';

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

function OrderPlaced(props) {
    const { classes } = props;

    const backToStore = () => {
        sessionStorage.setItem('orderComplete', 'yes');
        props.clearCart();
        Router.push('/')
    }

    return (
        <React.Fragment>
            <Typography variant="h6" color="textPrimary">
                ORDER PLACED
            </Typography>
            <div className={classes.sectionTitleDivider} />
            <Grid item container direction="column" xs={12} sm={6}>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="title"
                        gutterBottom
                        className={classes.title}
                    >
                        Your order has been placed. 
                    </Typography>
                    <Button variant="contained" color="primary" className={classes.button} onClick={backToStore}>
                        Back to Store
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

OrderPlaced.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        order: state.order
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({...orderActions, ...cartActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(OrderPlaced));
