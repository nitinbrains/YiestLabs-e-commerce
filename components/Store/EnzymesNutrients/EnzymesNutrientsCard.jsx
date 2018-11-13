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


class EnzymesNutrientsCard extends Component {

    render() {

        const { classes, theme, item } = this.props;

        const spaceIndex = item.Name.indexOf(" ")
        const itemID = item.Name.substr(0, spaceIndex);
        const itemName = item.Name.substr(spaceIndex + 1)

        return (
            <Grid
                item
                spacing={24}
                onClick={this.props.onClick.bind(this, this.props.item)}
            >
                <Paper
                    className={classes.card}
                >
                    <Grid
                        item
                        container
                        direction={"column"}
                        xs
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs>
                            <Typography
                                variant="h3"
                                color="textPrimary"
                            >
                                {itemID}
                            </Typography>
                            <Typography
                                variant="subheading"
                                color="textPrimary"
                            >
                                {itemName}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
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


EnzymesNutrientsCard.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EnzymesNutrientsCard));
