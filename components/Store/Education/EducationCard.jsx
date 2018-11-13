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


class EducationCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        }
    }

    handleItemHoverEnter = () => {
        this.setState({hover: true});
    }

    handleItemHoverLeave = () => {
        this.setState({hover: false});
    }
    
    render() {

        const { classes, theme, item } = this.props;

        return (
            <Grid
                item
                spacing={24}
                onMouseEnter={this.handleItemHoverEnter}
                onMouseLeave={this.handleItemHoverLeave}
                onClick={this.props.onClick.bind(this, this.props.item)}
            >
                <Paper
                    className={classes.card}
                >
                {!this.state.hover ? (
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
                                {item.Name}
                            </Typography>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid
                        item
                        xs
                        container
                        direction={"column"}
                        spacing={8}
                        justify="flex-end"
                    >
                        <Grid item xs>
                            <div className={classes.info}>
                                <Typography>Class Location</Typography>
                                <Typography>{item.tagLocation}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs>
                            <div className={classes.info}>
                                <Typography>Flocculation</Typography>
                                <Typography>{item.tagDate}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                )}
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


EducationCard.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EducationCard));
