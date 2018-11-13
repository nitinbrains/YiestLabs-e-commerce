import React, { Component } from "react";
import { connect } from "react-redux";
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

class Store extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false
        }
    }

    componentWillMount() {
        try {
            var UserInfo = {
                billing: {
                    address1: "964 Court Lane",
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
                    {expireMonth: '11', expireYear: '2022', name: "Joe Discovery", number: "************1117", default: true, id: 38421, type: "3"},
                    {expireMonth: '9', expireYear: '2020', name: "Dimitar Vasilev", number: "************6470", default: false, id: 6868, type: "3"}
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
                    {address1: "One way", address2: "", address3: "", addressee: "", attn: "Attn", city: "City", countryid: "US", defaultBill: false, defaultShip: true, id: 1743261, zip: "94518"},
                    {address1: "964 Court Lane", address2: "", address3: "", addressee: "", attn: "Attn", city: "SumCity", countryid: "US", defaultBill: false, defaultShip: false, id: 12345, zip: "94518"}
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

            this.props.setUserInfo(UserInfo);

            this.props.getInventory();

        } catch (err) {
            console.log(err);
        }
    }

    handleClickItem = (item) => {
        this.setState({ openDialog: true, item: item });
    }

    handleItemLeave = () => {
        this.setState({ openDialog: false });
    }

    getCard = (item, i) => {

        if(item) {
            // Yeast
            if(SalesLib.SALESCATEGORY[0].includes(item.salesCategory)) {
                return <YeastCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Enzymes & Nutrients
            else if(SalesLib.SALESCATEGORY[8].includes(item.salesCategory)) {
                return <EnzymesNutrientsCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Services
            else if(SalesLib.SALESCATEGORY[11].includes(item.salesCategory)) {
                return <ServicesCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Lab Supplies
            else if(SalesLib.SALESCATEGORY[13].includes(item.salesCategory)) {
                return <LabSuppliesCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Education
            else if(SalesLib.SALESCATEGORY[14].includes(item.salesCategory)) {
                return <EducationCard key={i} item={item} onClick={this.handleClickItem} />
            }

            // Gift Shop
            else if(SalesLib.SALESCATEGORY[15].includes(item.salesCategory)) {
                return <GiftShopCard key={i} item={item} onClick={this.handleClickItem} />
            }
        }
    }

    getDialogContent = (item) => {

        if(item) {
            // Yeast
            if(SalesLib.SALESCATEGORY[0].includes(item.salesCategory)) {
                return <YeastDialog item={item} />
            }

            // Enzymes & Nutrients
            else if(SalesLib.SALESCATEGORY[8].includes(item.salesCategory)) {
                return <EnzymesNutrientsDialog item={item} />
            }

            // Services
            else if(SalesLib.SALESCATEGORY[11].includes(item.salesCategory)) {
                return <ServicesDialog item={item} />
            }

            // Lab Supplies
            else if(SalesLib.SALESCATEGORY[13].includes(item.salesCategory)) {
                return <LabSuppliesDialog item={item} />
            }

            // Education
            else if(SalesLib.SALESCATEGORY[14].includes(item.salesCategory)) {
                return <EducationDialog item={item} />
            }

            // Gift Shop
            else if(SalesLib.SALESCATEGORY[15].includes(item.salesCategory)) {
                return <GiftShopDialog item={item} />
            }
        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <Grid container spacing={24}>
                    {this.props.store.itemsToShow.map((item, i) => {
                        return this.getCard(item, i)
                    })}

                    <Dialog
                        open={this.state.openDialog}
                        onClose={this.handleItemLeave}
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
    hide: {
        display: "none"
    }
});

Store.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        store: state.store
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getInventory: (search) => dispatch({ type: "STORE_REQUEST", search}),
        setUserInfo: (UserInfo) => dispatch({type: "SET_USER_INFO", UserInfo})
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withStyles(styles, { withTheme: true })(Store)));
