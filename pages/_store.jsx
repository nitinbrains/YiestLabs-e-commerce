import React, { Component } from "react";
import { compose } from "redux";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

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


import SalesLib from '../lib/SalesLib';
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import LoadingIndicator from '../components/UI/LoadingIndicator';
import YeastCard from '../components/Store/Yeast/YeastCard';
import YeastDialog from '../components/Store/Yeast/YeastDialog';
import EnzymesNutrientsCard from '../components/Store/EnzymesNutrients/EnzymesNutrientsCard';
import EnzymesNutrientsDialog from '../components/Store/EnzymesNutrients/EnzymesNutrientsDialog';
import ServicesCard from '../components/Store/Services/ServicesCard';
import ServicesDialog from '../components/Store/Services/ServicesDialog';
import LabSuppliesCard from '../components/Store/LabSupplies/LabSuppliesCard';
import LabSuppliesDialog from '../components/Store/LabSupplies/LabSuppliesDialog';
import EducationCard from '../components/Store/Education/EducationCard';
import EducationDialog from '../components/Store/Education/EducationDialog';
import GiftShopCard from '../components/Store/GiftShop/GiftShopCard';
import GiftShopDialog from '../components/Store/GiftShop/GiftShopDialog';

import User from '../lib/User'
import withInventory from "../hocs/inventory";

class Store extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false
        }
    }

    componentWillMount() {
        var userInfo = {
            billing: {
                address1: "123 My Way",
                address2: "",
                address3: "",
                addressee: "Home",
                attn: "",
                city: "Concord",
                countryid: "US",
                id: 1743060,
                zip: "94518",
            },
            cards: [
                {ccexpire: "2022-12-01T08:00:00.000Z", ccname: "Joe Discovery", ccnumber: "************1117", default: true, id: 38421, type: "3"}
            ],
            cardsToRemove: [],
            category: "2",
            companyname: "XAbove It All YM TEST",
            connectedaccounts: [
                {internalid: 43148, subsidiary: "White Labs Inc", subsidiaryid: "2"},
                {internalid: 863039, subsidiary: "White Labs Hong Kong", subsidiaryid: "5"},
                {internalid: 1184976, subsidiary: "White Labs Copenhagen ApS", subsidiaryid: "7"}
            ],
            currency: "1",
            email: "dkonecny@whitelabs.com",
            get: true,
            id: 43148,
            otherAddresses: [
                {address1: "One way", address2: "", address3: "", addressee: "", attn: "Attn", city: "City", countryid: "US", defaultBill: false, defaultShip: true, id: 1743261, zip: "94518"}
            ],
            phone: "7142995620",
            shipping: {
                address1: "One way",
                address2: "",
                address3: "",
                addressee: "",
                attn: "Attn",
                city: "City",
                countryid: "US",
                id: 1743261,
                zip: "94518"
            },
            shipmethod: "2789",
            subsidiary: 2,
            terms: "10",
            vat: "",
            version: "2.3.7"
        };

        userInfo = User.setUser(userInfo);
        this.props.setUserInfo({ userInfo });
    }

    handleClickItem = (item) => {
        this.setState({ openDialog: true, item: item });
    }

    handleLeaveItem = () => {
        this.setState({ openDialog: false, item: null });
    }

    getCard = (item, i) => {

        if(item) {
            // Yeast
            if(SalesLib.SALESCATEGORY[0].includes(parseInt(item.salesCategory))) {
                return <YeastCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Enzymes & Nutrients
            else if(SalesLib.SALESCATEGORY[8].includes(parseInt(item.salesCategory))) {
                return <EnzymesNutrientsCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Services
            else if(SalesLib.SALESCATEGORY[11].includes(parseInt(item.salesCategory))) {
                return <ServicesCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Lab Supplies
            else if(SalesLib.SALESCATEGORY[13].includes(parseInt(item.salesCategory))) {
                return <LabSuppliesCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Education
            else if(SalesLib.SALESCATEGORY[14].includes(parseInt(item.salesCategory))) {
                return <EducationCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Gift Shop
            else if(SalesLib.SALESCATEGORY[15].includes(parseInt(item.salesCategory))) {
                return <GiftShopCard key={i} item={item} onClick={this.handleClickItem} />
            }
        }
    }

    getDialogContent = (item) => {

        if(item) {
            // Yeast
            if(SalesLib.SALESCATEGORY[0].includes(parseInt(item.salesCategory))) {
                return <YeastDialog item={item} closeDialog={this.handleLeaveItem}/>
            }

            // Enzymes & Nutrients
            else if(SalesLib.SALESCATEGORY[8].includes(parseInt(item.salesCategory))) {
                return <EnzymesNutrientsDialog item={item} closeDialog={this.handleLeaveItem}/>
            }

            // Services
            else if(SalesLib.SALESCATEGORY[11].includes(parseInt(item.salesCategory))) {
                return <ServicesDialog item={item} closeDialog={this.handleLeaveItem}/>
            }

            // Lab Supplies
            else if(SalesLib.SALESCATEGORY[13].includes(parseInt(item.salesCategory))) {
                return <LabSuppliesDialog item={item} closeDialog={this.handleLeaveItem}/>
            }

            // Education
            else if(SalesLib.SALESCATEGORY[14].includes(parseInt(item.salesCategory))) {
                return <EducationDialog item={item} closeDialog={this.handleLeaveItem}/>
            }

            // Gift Shop
            else if(SalesLib.SALESCATEGORY[15].includes(parseInt(item.salesCategory))) {
                return <GiftShopDialog item={item} closeDialog={this.handleLeaveItem}/>
            }

        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <Grid className={classes.store} container spacing={24}>
                    {this.props.store.itemsToShow.map((item, i) => {
                        return this.getCard(item, i)
                    })}

                    <Dialog
                        open={this.state.openDialog}
                        onClose={this.handleLeaveItem}
                        aria-labelledby="form-dialog-title"
                    >
                        {this.getDialogContent(this.state.item)}
                    </Dialog>

                </Grid>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    store: {
        [theme.breakpoints.up("md")]: {
            paddingLeft: 50,
            paddingRight: 50,
        },
        [theme.breakpoints.up("lg")]: {
            paddingLeft: 100,
            paddingRight: 100,
        },
        [theme.breakpoints.up("xl")]: {
            paddingLeft: 150,
            paddingRight: 150,
        }
    }
});

Store.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles, { withTheme: true }),
    withInventory,
)(Store);
