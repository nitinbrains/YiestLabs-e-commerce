import React, { Component } from "react";
import { connect } from "react-redux";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import ItemsLg from "../components/Store/ItemsLg";
import ItemsXs from "../components/Store/ItemsXs";

class Store extends Component {
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
