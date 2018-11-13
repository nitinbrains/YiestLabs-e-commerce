import React, { Component } from "react";
import { connect} from 'react-redux';

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

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class LabSuppliesDialog extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            quantity: '0',
        };

        this.item = this.props.item;
    }

    addToCart = () => {
        // this.props.addCartItem();
        this.props.handleItemLeave();
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <React.Fragment>
                <DialogTitle id="form-dialog-title">
                    {this.item.Name}
                </DialogTitle>
                <DialogContent>
                    <Grid
                        item
                        xs
                        container
                        spacing={24}
                        style={{ marginTop: 5 }}
                        direction={"row"}
                    >
                        <Grid
                            item
                            xs
                            container
                            spacing={24}
                            direction={"row"}
                            justify="flex-start"
                        >
                            <Grid item>
                                <TextField
                                    id="quantity"
                                    label="Quantity"
                                    className={classes.quantity}
                                    value={this.state.quantity}
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.addToCart}
                        color="primary"
                    >
                        Add to Cart
                    </Button>
                </DialogActions>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    card: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: "100%",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    cardHover: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    info: {
        alignItems: "center",
        padding: 5,
        backgroundColor: "#e4e4e4",
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    }
});

LabSuppliesDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        inventory: state.inventory
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addCartItem: (item, volIdIndex, quantity) => dispatch({type: "ADD_TO_CART", item, volIdIndex, quantity}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(LabSuppliesDialog));
