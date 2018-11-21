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

const YeastCardBackground = {
    "3": "url('../../../static/images/categories/Category-ale.jpg')",
    "4": "url('../../../static/images/categories/Category-wild.jpg')",
    "5": "url('../../../static/images/categories/Category-lager.jpg')",
    "6": "url('../../../static/images/categories/Category-wine.jpg')",
    "7": "url('../../../static/images/categories/Category-Distilling.jpg')",
    "8": "url('../../../static/images/categories/Category-belgian.jpg')",
    "32": "url('../../../static/images/categories/Category-vault.jpg')"
}

class YeastCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            img: null,
            color: null,
            img: YeastCardBackground[this.props.item.salesCategory]

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

        const spaceIndex = item.Name.indexOf(" ");
        const itemID = item.Name.substr(0, spaceIndex);
        const itemName = item.Name.substr(spaceIndex + 1);

        return (
            <Grid
                item
                xs={12}
                sm={6}
                md={3}
                spacing={24}
                onMouseEnter={this.handleItemHoverEnter}
                onMouseLeave={this.handleItemHoverLeave}
                onClick={this.props.onClick.bind(this, this.props.item)}
            >
                <div
                    className={classes.card}
                    style={
                        !this.state.hover
                            ? {
                                  backgroundImage: this.state.img,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover"
                              }
                            : { backgroundColor: "#fff" }
                    }
                >
                    {!this.state.hover ? (
                        <Grid
                            item
                            container
                            direction={"column"}
                            spacing={8}
                        >
                            <Grid item xs className={classes.info}>
                                <img
                                    src="../../static/images/icons/Ale-icon.svg"
                                    height="40"
                                />
                                <Typography variant="h5" color="secondary">
                                    {itemID}
                                </Typography>
                                <Typography
                                    variant="subheading"
                                    color="secondary"
                                >
                                    {itemName}
                                </Typography>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid
                            item
                            container
                            direction={"column"}
                            spacing={8}
                        >
                            <Grid item xs>
                                <Typography
                                    className={classes.info}
                                    variant="subtitle1"
                                    style={{color:this.state.color}}
                                >
                                    {itemID}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <div
                                    style={{
                                        backgroundColor: this.state.color,
                                        padding: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="secondary"
                                    >
                                        {itemName}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid
                                item
                                xs
                                container
                                direction={"row"}
                                spacing={8}
                            >
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>
                                            Fermentation Temp
                                        </Typography>
                                        <Typography style={{color:this.state.color}}>
                                            {item.optFermentTempF |
                                                item.optFermentTempF}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Flocculation</Typography>
                                        <Typography style={{color:this.state.color}}>
                                            {item.flocculation}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Alcohol Tol.</Typography>
                                        <Typography style={{color:this.state.color}}>
                                            {item.alcoholTol}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Attenuation</Typography>
                                        <Typography style={{color:this.state.color}}>
                                            {item.attenuation}
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
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: 200,
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
});

YeastCard.propTypes = {
    classes: PropTypes.object.isurld,
    theme: PropTypes.object.isurld
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
)(withStyles(styles, { withTheme: true })(YeastCard));
