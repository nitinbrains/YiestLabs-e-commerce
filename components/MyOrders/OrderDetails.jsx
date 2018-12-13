import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import FormButton from "../Form/FormButton";

class OrderDetails extends Component {
    handleDialogClose() {
        this.props.closeDialog();
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <React.Fragment>
                <DialogContent>
                    <div className={classes.close}>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Menu"
                            onClick={() => this.handleDialogClose()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className={classes.card}>
                        <div
                            style={{
                                position: "absolute",
                                top: -15,
                                left: 20,
                                backgroundColor: "#fff",
                                paddingLeft: 10,
                                paddingRight: 10
                            }}
                        >
                            <Typography variant="h6" color="textPrimary">
                                Order # 2625434
                            </Typography>
                        </div>
                        <Grid container spacing={24}>
                            <Grid item container spacing={24}>
                                <Grid item>
                                    <img
                                        className={classes.image}
                                        src="/static/images/yeast.png"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    spacing={8}
                                >
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                        >
                                            SUMMARY
                                        </Typography>
                                        <div
                                            style={{
                                                borderTop: "solid 1.5px",
                                                borderColor: "#CCCCCC"
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        direction="row"
                                        justify="space-between"
                                        xs={12}
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            container
                                            direction="column"
                                        >
                                            <Grid item xs>
                                                <div
                                                    style={{ display: "flex" }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#FF9933"
                                                        }}
                                                    >
                                                        Company:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography>
                                                        This is a test company
                                                    </Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs>
                                                <div
                                                    style={{ display: "flex" }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#FF9933"
                                                        }}
                                                    >
                                                        Ordered from:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography>
                                                        White Labs Inc
                                                    </Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs>
                                                <div
                                                    style={{ display: "flex" }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#FF9933"
                                                        }}
                                                    >
                                                        Order date:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography>
                                                        2/2/2018
                                                    </Typography>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            container
                                            direction="column"
                                            alignItems="flex-start"
                                        >
                                            <Grid item xs>
                                                <div
                                                    style={{ display: "flex" }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#FF9933"
                                                        }}
                                                    >
                                                        Order total:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography>
                                                        $0.00
                                                    </Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs>
                                                <div
                                                    style={{ display: "flex" }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#FF9933"
                                                        }}
                                                    >
                                                        Order status:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography>
                                                        Shipped
                                                    </Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs>
                                                <div
                                                    style={{ display: "flex" }}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "#FF9933"
                                                        }}
                                                    >
                                                        Tracking #:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography>0</Typography>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item container spacing={8}>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                        >
                                            ITEMS
                                        </Typography>
                                        <div
                                            style={{
                                                borderTop: "solid 1.5px",
                                                borderColor: "#CCCCCC"
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        container
                                        direction="column"
                                        alignItems="center"
                                    >
                                        <Grid item xs>
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <Typography
                                                    style={{ color: "#FF9933" }}
                                                >
                                                    Item
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <Typography>
                                                    California Yeast
                                                </Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                        container
                                        direction="column"
                                        alignItems="center"
                                    >
                                        <Grid item xs>
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <Typography
                                                    style={{ color: "#FF9933" }}
                                                >
                                                    Quantity
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <Typography>2</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                        container
                                        direction="column"
                                        alignItems="center"
                                    >
                                        <Grid item xs>
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <Typography
                                                    style={{ color: "#FF9933" }}
                                                >
                                                    Price
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <Typography>$2.29</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item container spacing={8}>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                        >
                                            PAYMENT/SHIPPING
                                        </Typography>
                                        <div
                                            style={{
                                                borderTop: "solid 1.5px",
                                                borderColor: "#CCCCCC"
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        container
                                        direction="column"
                                        spacing={8}
                                    >
                                        <Grid item xs>
                                            <Typography
                                                style={{
                                                    color: "#FF9933"
                                                }}
                                            >
                                                Billing Address:
                                            </Typography>
                                            <Typography>Line 1</Typography>
                                            <Typography>Line 2</Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <div style={{ display: "flex" }}>
                                                <Typography
                                                    style={{
                                                        color: "#FF9933"
                                                    }}
                                                >
                                                    Card holder:
                                                </Typography>
                                                &nbsp;
                                                <Typography>Name</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div style={{ display: "flex" }}>
                                                <Typography
                                                    style={{
                                                        color: "#FF9933"
                                                    }}
                                                >
                                                    Card number:
                                                </Typography>
                                                &nbsp;
                                                <Typography>
                                                    **** **** **** 0009
                                                </Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        container
                                        direction="column"
                                        spacing={8}
                                    >
                                        <Grid item xs>
                                            <div style={{ display: "flex" }}>
                                                <Typography
                                                    style={{
                                                        color: "#FF9933"
                                                    }}
                                                >
                                                    Ship date:
                                                </Typography>
                                                &nbsp;
                                                <Typography>1/1/1</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div style={{ display: "flex" }}>
                                                <Typography
                                                    style={{
                                                        color: "#FF9933"
                                                    }}
                                                >
                                                    Expected delivery date:
                                                </Typography>
                                                &nbsp;
                                                <Typography>1/1/1</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div style={{ display: "flex" }}>
                                                <Typography
                                                    style={{
                                                        color: "#FF9933"
                                                    }}
                                                >
                                                    Ship method:
                                                </Typography>
                                                &nbsp;
                                                <Typography>UPS</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div style={{ display: "flex" }}>
                                                <Typography
                                                    style={{
                                                        color: "#FF9933"
                                                    }}
                                                >
                                                    Ship total:
                                                </Typography>
                                                &nbsp;
                                                <Typography>$1.23</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        container
                                        direction="column"
                                        spacing={8}
                                    >
                                        <Grid item xs>
                                            <Typography
                                                style={{
                                                    color: "#FF9933"
                                                }}
                                            >
                                                Billing Address:
                                            </Typography>
                                            <Typography>Line 1</Typography>
                                            <Typography>Line 2</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                container
                                xs
                                direction="row"
                                justify="flex-end"
                            >

                            <Grid item>
                                <div classNames={classes.buttons}>
                                    <Button variant="outlined" color="primary">
                                        Resend Invoice
                                    </Button>
                                </div>
                                <FormButton text="Resend Invoice"/>
                            </Grid>
                            <Grid item>
                                <div classNames={classes.buttons} style={{marginLeft:20}}>
                                    <Button variant="contained" color="primary">
                                        Repeat Order
                                    </Button>
                                </div>
                                <FormButton text="Repeat Order"/>
                            </Grid>

                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    card: {
        position: "relative",
        border: "solid 1px",
        borderColor: "#CCCCCC",
        margin: 10,
        padding: theme.spacing.unit * 2
    },
    image: {
        width: 150,
        marginRight: 10,
        textAlign: "center"
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    close: { position: "absolute", right: 0, top: 0 }
});

OrderDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderDetails);
