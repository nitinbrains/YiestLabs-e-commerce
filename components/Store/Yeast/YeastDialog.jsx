import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Router from 'next/router';
import axios from 'axios';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import LoadingIndicator from 'components/UI/LoadingIndicator';
import { cartActions } from "appRedux/actions/cartActions";
import { inventoryActions } from "appRedux/actions/inventoryActions";
import { parseAvailabilityResults } from "lib/InventoryUtils";
import { IN_STOCK, OUT_OF_STOCK } from "lib/Constants";

import WLHelper from "lib/WLHelper";

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
        icon: 'static/images/icons/wildyeast-icon.svg',
        color: "#CC9966"
    },
    "5": {  // Lager
        img: 'static/images/categories/Category-lager.jpg',
        icon: 'static/images/icons/Lager-icon.svg',
        color: "#FFCC33"
    },
    "6": {  // Wine
        img: 'static/images/categories/Category-wine.jpg',
        icon: 'static/images/icons/wine-icon.svg',
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
        icon: 'static/images/icons/vault-icon.svg',
        color: "#B3B3B3"
    }
}

function getIcon(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].icon;
    }
    catch(error) {
        console.log('error', salesCategory, error);
    }
}

function getColor(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].color;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};

const customFormValidation = Yup.object().shape({
    packaging: Yup.string().required('Required'),
    pack: Yup.string().nullable(),
    quantity: Yup.string().required('Required'),
});

class YeastDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: "1",
            packOptions: [
                { label: "Nano", value: "0" },
                { label: "1.5L", value: "1" },
                { label: "2L", value: "2" }
            ],
            pack: "0",
            packagingOptions: [],
            packaging: "pp",
            availability: null,
            isLoading: false,
            errors:{},
        };

        this.item = this.props.item;
    }

    componentWillMount() {
        if (this.item.volID[6]) {
            this.setState({ packaging: "6", pack: null });
        } else if (this.item.volID[0] && this.item.volID[2]) {
            if (this.item.purePitch) {
                this.setState({ packaging: "pp", pack: "0" });
            } else {
                this.setState({ packaging: "nl", pack: "0" });
            }
        } else if (this.item.volID[0]) {
            this.setState({ packaging: "0", pack: null });
        } else {
            this.setState({ packaging: "3", pack: null });
        }

        this.filterPackageTypes();
    }

    filterPackageTypes() {
        try {
            var PackageTypes = [
                { label: "1L Nalgene Bottle", value: "6" },
                { label: "PurePitch", value: "pp" },
                { label: "Nalgene Bottle", value: "nl" },
                { label: "Custom Pour", value: "3" },
                { label: "Homebrew", value: "4" },
                { label: "Slant", value: "5" },
                { label: "Yeast", value: "0" }
            ];

            var subsidiary = 2,
                FilteredPackageTypes = [];

            if (this.item.volID[6]) {
                FilteredPackageTypes.push(PackageTypes[0]);
            } else if (this.item.volID[0] && this.item.volID[2]) {
                if (this.item.purePitch) {
                    FilteredPackageTypes.push(PackageTypes[1]);
                } else {
                    FilteredPackageTypes.push(PackageTypes[2]);
                }
            } else if (this.item.volID[0]) {
                FilteredPackageTypes.push(PackageTypes[6]);
            }

            if (this.item.volID[3]) {
                FilteredPackageTypes.push(PackageTypes[3]);
            }

            if (this.item.volID[4] && subsidiary == 2) {
                FilteredPackageTypes.push(PackageTypes[4]);
            }

            if (this.item.volID[5]) {
                FilteredPackageTypes.push(PackageTypes[5]);
            }

            this.setState({ packagingOptions: FilteredPackageTypes });
        } catch (error) {
            console.log("error in filterPackageTypes", error);
        }
    }

    handleErrors = (field, err) => {
        let {errors} = this.state;
        errors[field] = err
        this.setState({errors})
    }

    checkQuantity = item => {
        try {
            var quantity = parseFloat(item.OrderDetailQty);

            if (isNaN(quantity) || quantity <= 0) {
                // TO-DO: Display message to user
                this.handleErrors('quantity', "Please enter a valid value for the quantity")
                console.log("Please enter a valid value for the quantity");
                return false;
            }

            // Wild Yeast must have mimimum 1L
            if (item.salesCategory == 4 && quantity < 1.0) {
                this.handleErrors('quantity', "Notice: The minimum quantity sold for Wild Yeast strains is 1L. Please adjust your quantity.")
                console.log(
                    "Notice",
                    "The minimum quantity sold for Wild Yeast strains is 1L. Please adjust your quantity."
                );
                return false;
            }

            // Custom Pour Strains
            if (item.type == 5) {
                // Vault strains must have minimum 1.5L Custom Pour
                if (item.salesCategory == 32) {
                    if (quantity < 1.5) {
                        // TO-DO: Display message to user
                        this.handleErrors('quantity', "Notice: The minimum quantity sold for Custom Pour Vault strains is 1.5L. Please adjust your quantity.")
                        console.log(
                            "Notice",
                            "The minimum quantity sold for Custom Pour Vault strains is 1.5L. Please adjust your quantity."
                        );
                        return false;
                    } else if ((parseFloat(quantity) / parseInt(quantity) != 1.0) && (parseFloat(quantity + 0.5) / parseInt(quantity + 0.5) != 1.0)) {
                        this.handleErrors('quantity', "Notice: Custom Pour Vault strains are sold in 0.5L increments. Please adjust your quantity.")
                        console.log(
                            "Notice",
                            "Custom Pour Vault strains are sold in 0.5L increments. Please adjust your quantity."
                        );
                        return false;
                    }
                }

                // Bacteria sold in 1L increments
                if (item.salesCategory == 4) {
                    if (parseFloat(quantity) / parseInt(quantity) != 1.0) {
                        quantity = Math.round(quantity);

                        // TO-DO: Display message to user
                        this.handleErrors('quantity', "Notice: Quantities for this strain must be in 1L increments, your value has been rounded accordingly. Please review your cart.")
                        console.log(
                            "Notice",
                            "Quantities for this strain must be in 1L increments, your value has been rounded accordingly. Please review your cart."
                        );
                    }
                }

                // All other custom pour strains sold in 0.5L increments
                else {
                  if ((parseFloat(quantity) / parseInt(quantity) != 1.0) && (parseFloat(quantity + 0.5) / parseInt(quantity + 0.5) != 1.0)) {
                      this.handleErrors('quantity', "Notice: Custom Pours are sold in 0.5L increments. Please adjust your quantity.")
                      console.log(
                          "Notice",
                          "Custom Pour Vault strains are sold in 0.5L increments. Please adjust your quantity."
                      );
                      return false;
                  }
                  /*
                    // This message isn't seen because the screen closes immediately. Just displaying a notice for now like for other errors.
                    if (parseFloat(quantity) / parseInt(quantity) != 1.0) {
                        if (quantity % 0.5 != 0) {
                            var decimal =
                                parseFloat(quantity) - parseInt(quantity);
                            if (decimal >= 0.75) {
                                quantity = Math.ceil(quantity);
                            } else if (decimal < 0.25) {
                                quantity = Math.floor(quantity);
                            } else {
                                quantity = parseInt(quantity) + 0.5;
                            }

                            // TO-DO: Display message to user
                            this.handleErrors('quantity', "Notice: Quantities for this strain must be in 0.5L increments, your value has been rounded accordingly. Please review your cart.")
                            console.log(
                                "Notice",
                                "Quantities for this strain must be in 0.5L increments, your value has been rounded accordingly. Please review your cart."
                            );
                        }
                    }
                    */
                }

                item.size = quantity;
                item.details = quantity + "L Custom Pour";
                item.OrderDetailQty = parseFloat(quantity);
            }

            // Non-custom pour strains must be in increments of 1
            else if (parseFloat(quantity) / parseInt(quantity) != 1.0) {
                this.handleErrors('quantity', "Quantity Error !!")
                return false;
            }

            return true;
        } catch (error) {
            this.handleErrors('quantity', `Could not check quantity ${error}`)
            console.log("Could not check quantity", error);
        }
    };

    addToCart = (values) => {
        const packaging = this.state.packaging;
        const pack = this.state.pack;
        const quantity = this.state.quantity;

        // Create cart item
        var cartItem = {};
        cartItem.Name = String(this.item.Name);
        cartItem.salesCategory = parseInt(this.item.salesCategory);
        cartItem.dispQuantity = parseInt(quantity);
        cartItem.OrderDetailQty = parseFloat(quantity);

        // PurePitch / 1L Nalgene bottle
        if (packaging == "pp" || packaging == "nl") {
            switch (pack) {
                // Nano
                case "0":
                    cartItem.MerchandiseID = this.item.volID[0];
                    cartItem.details = "Nano";
                    break;

                // 1.5L
                case "1":
                    cartItem.MerchandiseID = this.item.volID[1];
                    cartItem.details = "1.5L";
                    break;

                // 2L
                case "2":
                    cartItem.MerchandiseID = this.item.volID[2];
                    cartItem.details = "2L";
                    break;
                default:
                    this.handleErrors('pack', `cannot add to cart, ${item}, ${packaging}, ${pack}, ${quantity}`)
                    console.log("cannot add to cart", this.item, packaging, pack, quantity);
                    return;
            }

            if (this.item.purePitch) {
                cartItem.details = "PurePitch® " + cartItem.details;
            }

            cartItem.type = 1;
        } else {
            switch (packaging) {
                // Yeast
                case "0":
                    cartItem.MerchandiseID = this.item.volID[0];
                    cartItem.type = 3;
                    cartItem.details = "Yeast";
                    break;

                // Custom Pour
                case "3":
                    cartItem.MerchandiseID = this.item.volID[3];
                    cartItem.type = 5;
                    cartItem.dispQuantity = 1;
                    cartItem.size = parseFloat(quantity);
                    cartItem.details = quantity + "L Custom Pour";
                    cartItem.relatives = [];
                    var multipliers = [0.5, 1.5, 2];

                    for (var i = 0; i < 3; i++) {
                        if (this.item.volID[i]) {
                            var relative = {};
                            relative.id = parseInt(this.item.volID[i]);
                            if (isNaN(relative.id)) {
                                throw { message: "Invalid VolID Index! in Relatives", code: 0 };
                            }
                            relative.mult = multipliers[i];
                            cartItem.relatives.push(relative);
                        }
                    }
                    break;

                // Homebrew
                case "4":
                    cartItem.MerchandiseID = this.item.volID[4];
                    cartItem.type = 2;
                    cartItem.details = "Homebrew packs";
                    break;

                // Slant
                case "5":
                    cartItem.MerchandiseID = this.item.volID[5];
                    cartItem.type = 3;
                    cartItem.details = "Slants";
                    break;

                // 1L Nalgene Bottle
                case "6":
                    cartItem.MerchandiseID = this.item.volID[6];
                    cartItem.type = 1;
                    cartItem.details = "1L Nalgene Bottle";
                    break;
            }
        }

        if (this.checkQuantity(cartItem)) {
            this.props.addItem({ cartItem });
            this.props.closeDialog();
        }
    };

    checkAvailability = () => {

        const packaging = this.state.packaging;
        const pack = this.state.pack;
        let itemID;

        if (packaging == "pp" || packaging == "nl") {
            switch (pack) {
                // Nano
                case "0":
                    itemID = this.item.volID[0]
                    break;

                // 1.5L
                case "1":
                    itemID = this.item.volID[1];
                    break;

                // 2L
                case "2":
                    itemID = this.item.volID[2];
                    break;

                default:
                    return;
            }
        } else {
            switch (packaging) {
                // Homebrew
                case "4":
                    itemID = this.item.volID[4];
                    break;

                // Slant
                case "5":
                    itemID = this.item.volID[5];
                    break;

                // 1L Nalgene Bottle
                case "6":
                    itemID = this.item.volID[6];
                    break;

                // Distilling
                case "0":
                    itemID = this.item.volID[0]
                    break;

                // Vault
                case "3":
                    itemID = this.item.volID[3]
                    break;

                default:
                    return;

            }
        }

        this.setState({isLoading: true});
        axios.post('/get-item-availability', {itemID})
        .then(({ data: { availability, error}}) => {
            if(error) throw error;
            this.setState({availability: parseAvailabilityResults(availability)});
        })
        .catch(error => {
            console.log('error', error);
        })
        .finally(() => this.setState({isLoading: false}));
    }

    handleDialogClose() {
        this.props.closeDialog();
    };

    setPack = event => {
        this.setState({
            pack: event.target.value,
            availability: null
        });
    };

    setPackaging = event => {
        var packaging = event.target.value;
        var pack;

        if (packaging == "pp" || packaging == "nl") {
            pack = "0";
        }

        this.setState({
            packaging: event.target.value,
            pack: pack,
            availability: null
        });
    };

    changeQuantity = event => {
        this.setState({ quantity: event.target.value });
    };

    moveToCalculator = () => {
        Router.push(`/calculator?id=${this.item.volID[0]}`);
    }

    render()
    {
        const { classes } = this.props;
        const { errors, availability } = this.state;
        const spaceIndex = this.item.Name.indexOf(" ");
        const itemID = this.item.Name.substr(0, spaceIndex);
        const itemName = this.item.Name.substr(spaceIndex + 1);
        const error = errors.packaging || errors.pack || errors.quantity;

        return (
            <React.Fragment>
                <LoadingIndicator visible={this.state.isLoading} label={"Getting Availability"} />
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
                    <Grid
                        item
                        container
                        xs
                        style={{
                            display: "flex",
                            marginTop: -10,
                            marginBottom: 20
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item>
                            <Typography variant="h5">
                                {itemID} | {itemName}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs={2} md={1}>
                            <div
                                className={classes.circle}
                                style={{ backgroundColor: getColor(this.item.salesCategory)}}
                            >
                                <img
                                    src={getIcon(this.item.salesCategory)}
                                    height="20"
                                />
                            </div>
                        </Grid>
                        <Grid
                            item
                            container
                            xs={10}
                            md={11}
                            direction={"row"}
                            spacing={4}
                        >
                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography className="dialogVariant" >Attenuation:</Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                        style={{ color: getColor(this.item.salesCategory)}}
                                    >
                                        {this.item.attenuation}
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography  className="dialogVariant">Flocculation: </Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                        style={{ color: getColor(this.item.salesCategory)}}
                                    >
                                        {this.item.flocculation}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography  className="dialogVariant">Alcohol Tol.: </Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                        style={{ color: getColor(this.item.salesCategory)}}
                                    >
                                        {this.item.alcoholTol}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography  className="dialogVariant">Fermentation Temp: </Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                        style={{ color: getColor(this.item.salesCategory)}}
                                    >
                                        {this.item.optFermentTempF |
                                            this.item.optFermentTempC}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        className={classes.description}
                    >
                        <Grid item>
                            <Typography>{this.item.Description}</Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        style={{ marginTop: 20, color:  '#f68f32'}}
                    >
                        <Button onClick={this.moveToCalculator}>
                            <Grid item>
                                <Typography style={{ color: getColor(this.item.salesCategory) }}>How much do I need?</Typography>
                            </Grid>
                        </Button>
                    </Grid>

                    <Grid
                        item
                        container
                        style={{ marginTop: 5 }}
                        direction={"row"}
                        justify="center"
                    >
                        <Grid
                            item
                            xs
                            container
                            spacing={24}
                            direction={"row"}
                            justify="center"
                        >
                            {availability ?
                                <Typography className="flex-center" style={{color: availability == IN_STOCK ? "green" : "red"}}><p style={{textAlign:'center'}}>{availability}</p></Typography>
                            :
                                <Grid
                                    item
                                    xs
                                    container
                                    spacing={24}
                                    direction={"row"}
                                    justify="center"
                                >
                                    {/* <Grid item> */}
                                        <div className={classes.buttons}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.checkAvailability}
                                                className={classes.button}
                                            >
                                                Get Availability
                                            </Button>
                                        </div>
                                    {/* </Grid> */}
                                </Grid>
                            }
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        xs
                        container
                        spacing={24}
                        style={{ marginTop: 5, marginBottom: 10 }}
                        direction={"row"}
                    >
                        <Formik
                            initialValues={this.state}
                            validationSchema={customFormValidation}
                            onSubmit={values => this.addToCart(values)}
                        >
                            {({ values, handleChange }) => {
                                return(
                                    <Form className={classes.form}>
                                        <FormikErrorMessage error={error} />
                                        <Grid
                                            item
                                            xs
                                            container
                                            spacing={24}
                                            direction={"row"}
                                            justify="center"
                                            className={classes.paddingFix}
                                        >
                                            <Grid item xs={12} sm={4} md={4} className={classes.formFields} >
                                                <FormControl>
                                                    <InputLabel >Packaging</InputLabel>
                                                    <Select
                                                        value={this.state.packaging}
                                                        onChange={this.setPackaging}
                                                    >
                                                        {this.state.packagingOptions.map(
                                                            (option, i) => (
                                                                <MenuItem
                                                                    key={i}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            {this.state.pack && (
                                                <Grid item xs={12} sm={4} md={4} className={classes.formFields}>
                                                    <FormControl>
                                                        <InputLabel>Pack</InputLabel>
                                                        <Select
                                                            value={this.state.pack}
                                                            onChange={this.setPack}
                                                        >
                                                            {this.state.packOptions.map(
                                                                (option, i) => (
                                                                    <MenuItem
                                                                        key={i}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            )}
                                            {/* <Grid item>
                                              <form> */}
                                            <Grid item xs={12} sm={4} md={4} className={classes.formFields}>
                                                <TextField
                                                    id="quantity"
                                                    label="Quantity"
                                                    className={classes.quantity}
                                                    value={this.state.quantity}
                                                    onChange={this.changeQuantity}
                                                    type="number"
                                                    step={this.item.salesCategory == 32 || this.item.type == 5 ? "0.5" : "1"}
                                                    pattern={this.item.salesCategory == 32 || this.item.type == 5 ? "-?[0-9]*(\.[5]+)?" : ""}
                                                    error={
                                                      this.item.salesCategory == 32 ? ">= 1.5 in 0.5L increments"
                                                      : (this.item.type == 5 ? "0.5L increments" : "")
                                                    }
                                                />
                                                </Grid>
                                              {/* </form>
                                            </Grid> */}
                                            {/* <Grid
                                                item
                                                xs
                                                container
                                                spacing={24}
                                                direction={"row"}
                                                justify="center"
                                            > */}
                                                {/* <Grid item>
                                                    <div className={classes.buttons}>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                            className={classes.button}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                </Grid> */}
                                               
                                            {/* </Grid> */}
                                            
                                        </Grid>
                                        <Grid
                                            item
                                            xs
                                            container
                                            spacing={24}
                                            direction={"row"}
                                            justify="center"
                                        >
                                        <div className={classes.addButton}>
                                            <Button
                                                //className={classes.button}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                // className={classes.button}
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                      </Grid>
                                    </Form>
                                )
                            }
                        }
                        </Formik>
                    </Grid>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    info: {
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    },
    circle: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        padding: 5,
        width: 37,
        height: 37,
        [theme.breakpoints.down("sm")]: {
            width: 30,
            height: 30,
        }
    },
    formFields:{
        display:'block',
         marginTop:'15px',
        // marginLeft:'0px',
        [theme.breakpoints.down("xs")]: {
            display:'flex',
            justifyContent:'center',
            marginTop:'15px',
            marginLeft:'42px',
        }
    },
    buttons: {
        display: "flex",
        justifyContent: "center"
    },
    addButton:{
        display: "flex",
        justifyContent: "center",
        marginLeft:'42px',
        marginTop:'14px',
        // [theme.breakpoints.down("xs")]: {
        //     marginLeft:'16px',
        // }


    },
    button: {
        marginTop: theme.spacing.unit,
    },
    description:{
        textAlign:'center',
        marginTop:20
    },
    paddingFix:{
         paddingLeft:'unset',
         marginTop:'5px',
         [theme.breakpoints.between("sm", "xl")]: {
            paddingLeft:'100px',
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft:'0px',
        },
        
},
    close: { position: "absolute", right: 0, top: 0 },
    form:{
        width:'100%',
    }
});

YeastDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...inventoryActions, ...cartActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(YeastDialog));
