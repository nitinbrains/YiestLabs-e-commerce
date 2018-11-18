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

class YeastDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: "0",
            packOptions: [
                { label: "Nano", value: "0" },
                { label: "1.5L", value: "1" },
                { label: "2L", value: "2" }
            ],
            pack: "",
            packagingOptions: [],
            packaging: ""
        };

        this.item = this.props.item;
    }

    componentWillMount() {
        if (this.item.volID[6]) {
            this.setState({ packaging: "6", pack: "6" });
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
        } catch (err) {
            console.log("error in filterPackageTypes", err);
        }
    }

    addToCart = (item, nonYeast = false) => {
        try {
            var volIdIndex;
            // var quantity = parseFloat(this.state.quantity);
            var quantity = parseFloat(2);

            if (!nonYeast) {
                var instance = this;

                if (quantity == 0) {
                    quantity = 1;
                }

                if (quantity == "" || isNaN(parseFloat(quantity))) {
                    console.log("Please enter a valid value for the quantity");
                    return;
                }

                var volIdIndex;
                if (!nonYeast) {
                    // var packagingType = this.state.packaging.value;

                    // if(packagingType == 'pp')
                    // {
                    //     volIdIndex = parseInt(this.state.pack.value);
                    // }
                    // else if(packagingType == "3")
                    // {
                    //     volIdIndex = 3;
                    // }
                    // else
                    // {
                    //     volIdIndex = parseInt(packagingType);
                    // }

                    volIdIndex = 2;
                } else {
                    volIdIndex = 0;
                }

                if (parseInt(quantity) < 0) {
                    quantity = 1;
                }

                // Wild Yeast must have mimimum 1L
                if (item.salesCategory == 4 && quantity < 1.0) {
                    console.log(
                        "Notice",
                        "The minimum quantity sold for Wild Yeast strains is 1L. Please adjust your quantity"
                    );
                    return;
                }

                // Custom Pour Strains
                if (volIdIndex == 3) {
                    // Vault strains must have minimum 1.5L Custom Pour
                    if (item.salesCategory == 32 && quantity < 1.5) {
                        console.log(
                            "Notice",
                            "The minimum quantity sold for Custom Pour Vault strains is 1.5L. Please adjust your quantity"
                        );
                        return;
                    }

                    // Bacteria sold in 1L increments
                    if (
                        item.strainCategory == 32 ||
                        item.strainCategory == 33
                    ) {
                        if (parseFloat(quantity) / parseInt(quantity) != 1.0) {
                            quantity = Math.round(quantity);
                            console.log(
                                "Notice",
                                "Quantities for this strain must be in 1L increments, your value has been rounded accordingly. Please review your cart."
                            );
                        }
                    }

                    // All other custom pour strains sold in 0.5L increments
                    else {
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

                                console.log(
                                    "Notice",
                                    "Quantities for this strain must be in 0.5L increments, your value has been rounded accordingly. Please review your cart."
                                );
                            }
                        }
                    }
                }
            } else {
                volIdIndex = this.state.selectedType.value;
            }

            this.props.addItem({ item, volIdIndex, quantity });
            this.props.closeDialog();
        } catch (error) {
            console.log("Could not add item to cart", error);
        }
    };

    setPack = event => {
        this.setState({ pack: event.target.value });
    };

    setPackaging = event => {
        var packaging = event.target.value;
        var pack;

        if (packaging == "pp" || packaging == "nl") {
            pack = "0";
        }

        this.setState({ packaging: event.target.value, pack: pack });
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <React.Fragment>
                <DialogTitle id="form-dialog-title">
                    {this.item.Name}
                </DialogTitle>
                <DialogContent>
                    <Grid container wrap="nowrap" spacing={8}>
                        <Grid item xs={1}>
                            <div className={classes.circle}>
                                <img
                                    src="../../static/images/icons/Ale-icon.svg"
                                    height="20"
                                />
                            </div>
                        </Grid>
                        <Grid
                            item
                            container
                            xs
                            direction={"column"}
                            spacing={4}
                        >
                            <Grid item xs justify="center">
                                <Typography>
                                        Attenuation: {this.item.attenuation} |
                                        Flocculation: {this.item.flocculation} |
                                        Alcohol Tol.: {this.item.alcoholTol} |
                                </Typography>
                            </Grid>
                            <Grid item xs direction={"row"}>
                                <Typography>
                                    Fermentation Temp:{" "}
                                    {this.item.optFermentTempF |
                                        this.item.optFermentTempF}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        style={{ marginTop: 20 }}
                    >
                        <Grid item>
                            <Typography>{this.item.Description}</Typography>
                        </Grid>
                    </Grid>
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
                                <FormControl>
                                    <InputLabel>Packaging</InputLabel>
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
                                <Grid item>
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
                    <Button onClick={this.addToCart} color="primary">
                        Add to Cart
                    </Button>
                </DialogActions>
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
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#85FFC7",
        borderRadius: "50%",
        padding: 5,
        width: 37,
        height: 37
    }
});

YeastDialog.propTypes = {
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
)(withStyles(styles, { withTheme: true })(YeastDialog));
