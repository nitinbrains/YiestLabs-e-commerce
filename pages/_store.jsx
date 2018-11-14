import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import { userActions } from '../redux/actions/userActions';
import { inventoryActions } from '../redux/actions/inventoryActions';

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import ItemsLg from "../components/Store/ItemsLg";
import ItemsXs from "../components/Store/ItemsXs";

import User from '../lib/User'

class Store extends Component {
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
            shipmethod: "2842",

            subsidiary: "2",
            terms: "10",
            vat: "",
            version: "2.3.7"
        };
        // userInfo.shipMethods = [];
        // userInfo.selectedCard = {
        //     id: '',
        //     ccnumber: '',
        //     ccname: '',
        //     ccexpire: '',
        //     type: '',
        //     default: false
        // };
        userInfo = User.setUser(userInfo);
        this.props.setUserInfo({ userInfo });
        this.props.getInventory();
        // this.props.userLogin({ username: 'above', password: 'test' });
    }

    render() {
        const { classes, theme } = this.props;
        if (isWidthUp("sm", this.props.width)) {
            return (
                <NavBarUserSearchDrawerLayout>
                    <ItemsLg items={this.props.store.itemsToShow.slice(0, 25)} />
                </NavBarUserSearchDrawerLayout>
            );
        }

        if (isWidthUp("xs", this.props.width)) {
            return (
                <NavBarUserSearchDrawerLayout>
                    <ItemsXs items={this.props.store.itemsToShow.slice(0, 25)} />
                </NavBarUserSearchDrawerLayout>
            );
        }
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

const mapStateToProps = state => ({
    user: state.user,
    store: state.inventory
})

const mapDispatchToProps = dispatch => bindActionCreators({ ...userActions, ...inventoryActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withStyles(styles, { withTheme: true })(Store)));
