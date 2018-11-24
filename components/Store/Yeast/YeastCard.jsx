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

const YeastCardElements = {
    "2": {img: '../../../static/images/categories/Category-core.jpg', color: '#FFF'},
    "3": {img: '../../../static/images/categories/Category-ale.jpg', color: "#FF9933"},
    "4": {img: '../../../static/images/categories/Category-wild.jpg', color: "#CC9966"},
    "5": {img: '../../../static/images/categories/Category-lager.jpg', color: "#FFCC33"},
    "6": {img: '../../../static/images/categories/Category-wine.jpg', color: "#9966CC"},
    "7": {img: '../../../static/images/categories/Category-Distilling.jpg', color: "#6666CC"},
    "8": {img: '../../../static/images/categories/Category-belgian.jpg', color: "#66CCCC"},
    "32": {img: '../../../static/images/categories/Category-vault.jpg', color: "#B3B3B3"}
}

function getImage(salesCategory)
{
    try
    {
        return YeastCardElements[parseInt(salesCategory)].img;
    }
    catch(err)
    {
        console.log('error', salesCategory, err);
    }
}

function getColor(salesCategory)
{
    try
    {
        return YeastCardElements[parseInt(salesCategory)].color;
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
}

class YeastCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            img: null,
            color: null,
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
                onClick={this.props.onClick.bind(this, this.props.item)}
            >
                <div
                    className={classes.card}
                    onMouseEnter={this.handleItemHoverEnter}
                    onMouseLeave={this.handleItemHoverLeave}
                    style={
                        !this.state.hover
                            ? {
                                  backgroundImage: `url(${getImage(this.props.item.salesCategory)})`,
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
                                style={{ marginTop: 30 }}
                            >
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
                        <Grid item container direction={"column"} spacing={8}>
                            <Grid item xs>
                                <Typography
                                    className={classes.info}
                                    variant="subtitle1"
                                    style={{color: getColor(this.props.item.salesCategory)}}
                                >
                                    {itemID}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <div
                                    style={{
                                        backgroundColor: getColor(this.props.item.salesCategory),
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
                                        <Typography style={{color:getColor(this.props.item.salesCategory)}}>
                                            {item.optFermentTempF |
                                                item.optFermentTempF}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Flocculation</Typography>
                                        <Typography style={{color:getColor(this.props.item.salesCategory)}}>
                                            {item.flocculation}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Alcohol Tol.</Typography>
                                        <Typography style={{color:getColor(this.props.item.salesCategory)}}>
                                            {item.alcoholTol}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Attenuation</Typography>
                                        <Typography style={{color:getColor(this.props.item.salesCategory)}}>
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
