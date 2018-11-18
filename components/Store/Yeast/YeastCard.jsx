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

class YeastCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            img: null
        };
    }

    componentWillMount() {
        switch (this.props.item.salesCategory) {
            case "3":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-ale.jpg')"
                });
                break;
            case "5":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-lager.jpg')"
                });
                break;
            case "6":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-wine.jpg')"
                });
                break;
            case "7":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-Distilling.jpg')"
                });
                break;
            case "8":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-belgian.jpg')"
                });
                break;
            case "4":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-wild.jpg')"
                });
                break;
            case "32":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-vault.jpg')"
                });
                break;
            case "3":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-ale.jpg')"
                });
                break;
            case "50":
                this.setState({
                    img:
                        "url('../../../static/images/categories/Category-ale.jpg')"
                });
                break;
            default:
        }
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
                            xs
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
                            xs
                            container
                            direction={"column"}
                            spacing={8}
                        >
                            <Grid item xs>
                                <Typography
                                    className={classes.info}
                                    variant="subtitle1"
                                    color="primary"
                                >
                                    {itemID}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <div
                                    style={{
                                        backgroundColor: "#f28411",
                                        padding: 3,
                                        textAlign: "center"
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
                                        <Typography color="primary">
                                            {item.optFermentTempF |
                                                item.optFermentTempF}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Flocculation</Typography>
                                        <Typography color="primary">
                                            {item.flocculation}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Alcohol Tol.</Typography>
                                        <Typography color="primary">
                                            {item.alcoholTol}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.info}>
                                        <Typography>Attenuation</Typography>
                                        <Typography color="primary">
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
        ...theme.mixins.gutters(),
        border: "solid 1px",
        borderColor: "#CCCCCC",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: 250,
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
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    }
});

YeastCard.propTypes = {
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
)(withStyles(styles, { withTheme: true })(YeastCard));
