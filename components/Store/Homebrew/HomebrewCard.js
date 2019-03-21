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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


import { cartActions } from "appRedux/actions/cartActions";

const YeastElements = {
    "2": {
        img: 'static/images/categories/Category-core.jpg',
        color: '#FFF'
    },
    "3": {  // Ale
        img: 'static/images/categories/Category-ale.jpg',
        icon: 'static/images/icons/Ale-icon.svg',
        color: "#FF9933"
    },
    "4": {  // Wild Yeast
        img: 'static/images/categories/Category-wild.jpg',
        icon: 'static/images/icons/Wildyeast-icon.svg',
        color: "#CC9966"
    },
    "5": {  // Lager
        img: 'static/images/categories/Category-lager.jpg',
        icon: 'static/images/icons/Lager-icon.svg',
        color: "#FFCC33"
    },
    "6": {  // Wine
        img: 'static/images/categories/Category-wine.jpg',
        icon: 'static/images/icons/Wine-icon.svg',
        color: "#9966CC"
    },
    "7": {  // Distilling
        img: 'static/images/categories/Category-Distilling.jpg',
        icon: 'static/images/icons/Distilling-icon.svg',
        color: "#6666CC"
    },
    "8": {  // Belgian
        img: 'static/images/categories/Category-belgian.jpg',
        icon: 'static/images/icons/Belgian-icon.svg',
        color: "#66CCCC"
    },
    "32": { // Vault
        img: 'static/images/categories/Category-vault.jpg',
        icon: 'static/images/icons/Vault-icon.svg',
        color: "#B3B3B3"
    }
}

function getImage(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].img;
    }
    catch(error) {

    }
}

function getIcon(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].icon;
    }
    catch(error) {

    }
}

function getColor(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].color;
    }
    catch(error) {

        throw error;
    }
}

class HomebrewCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quantity: "1",
            hover: false,
            img: null,
            icon: null,
            color: null,
        };
        this.item = this.props.item;
    }

    handleItemHoverEnter = () => {
        this.setState({ hover: true });
    };

    handleItemHoverLeave = () => {
        this.setState({ hover: false });
    };

    checkQuantity = (cartItem) => {

        var quantity = parseFloat(cartItem.OrderDetailQty);

        if(isNaN(quantity) || quantity <= 0 ) {

            return false;
        }

        //  Must be in increments of 1
        else if ((parseFloat(quantity) / parseInt(quantity) != 1.0)) {
            return false;
        }

        return true;
    }

    changeQuantity = (event) => {
        this.setState({ quantity: event.target.value });
    }

    addToCart = () => {
        try {
            var quantity = this.state.quantity;
            var item = this.item;

            // Create cart item
            var cartItem = {};
            cartItem.Name = String(item.Name);
            cartItem.salesCategory = parseInt(item.salesCategory);
            cartItem.dispQuantity = parseInt(quantity);
            cartItem.OrderDetailQty = parseFloat(quantity);

            cartItem.MerchandiseID = item.volID[4];
            cartItem.type = 2;
            cartItem.details = "Homebrew packs";

            if (this.checkQuantity(cartItem)) {
                this.props.addItem({ cartItem });
                this.props.closeDialog();
            }
        } catch (error) {

        }
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
                md={4}
                lg={3}
                spacing={24}
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
                                    src={getIcon(this.props.item.salesCategory)}
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
                                        marginLeft: theme.spacing.unit * -2,
                                        marginRight: theme.spacing.unit * -2,
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
                                justify="center"
                            >
                                <Grid item >
                                    <TextField
                                        id="quantity"
                                        label="Quantity"
                                        className={classes.quantity}
                                        value={this.state.quantity}
                                        onChange={this.changeQuantity}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item>
                                    <div className={classes.buttons}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.addToCart}
                                            className={classes.button}
                                        >
                                            Add to Cart
                                        </Button>
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
        height: 230,
        cursor: "pointer"
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

HomebrewCard.propTypes = {
    classes: PropTypes.object.isurld,
    theme: PropTypes.object.isurld
};

const mapStateToProps = state => ({
    user: state.user,
    store: state.inventory
})

const mapDispatchToProps = dispatch => bindActionCreators({ ...cartActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(HomebrewCard));
