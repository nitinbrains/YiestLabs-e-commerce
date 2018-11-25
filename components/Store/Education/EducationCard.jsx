import React, { Component } from "react";
import { connect } from "react-redux";

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
            hover: false
        };
    }

    handleItemHoverEnter = () => {
        this.setState({ hover: true });
    };

    handleItemHoverLeave = () => {
        this.setState({ hover: false });
    };

    render() {
        const { classes, theme, item } = this.props;


        return (
            <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                spacing={24}
                onClick={this.props.onClick.bind(this, this.props.item)}
            >
                <div
                    className={classes.card}
                    onMouseEnter={this.handleItemHoverEnter}
                    onMouseLeave={this.handleItemHoverLeave}
                    style={
                        !this.state.hover
                            ? {
                                  backgroundImage: `url('../../../static/images/categories/Category-core.jpg')`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover"
                              }
                            : { backgroundColor: "#fff" }
                    }
                >
                    {!this.state.hover ? (
                        <Grid item container spacing={8}>
                            <Grid
                                item
                                xs={12}
                                className={classes.info}
                                style={{ marginTop: 45 }}
                            >
                                <Typography variant="h5" color="secondary">
                                    {item.Name}
                                </Typography>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid item container direction={"column"} spacing={8}>
                            <Grid item xs={12}>
                                <div
                                    style={{
                                        backgroundColor: "#66CCCC",
                                        padding: 1,
                                        textAlign: "center",
                                        marginLeft: theme.spacing.unit * -2,
                                        marginRight: theme.spacing.unit * -2
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="secondary"
                                    >
                                        {item.Name}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid
                                item
                                xs
                                container
                                direction={"row"}
                                spacing={8}
                                justify="center"
                            >
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Class Location</Typography>
                                        <Typography
                                            style={{ color: "#66CCCC" }}
                                        >
                                            {item.tagLocation}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Date</Typography>
                                        <Typography
                                            style={{ color: "#66CCCC" }}
                                        >
                                            {item.tagDate}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </div>
            </Grid>
        );
    }
}

const styles = theme => ({
    card: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2,
        height: 230
    },
    cardHover: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    info: {
        textAlign: "center"
    },
    name: {
        padding: 3,
        marginLeft: theme.spacing.unit * -2,
        marginRight: theme.spacing.unit * -2,
        textAlign: "center"
    }
});

EducationCard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addCartItem: (item, volIdIndex, quantity) =>
            dispatch({ type: "ADD_TO_CART", item, volIdIndex, quantity })
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(EducationCard));
