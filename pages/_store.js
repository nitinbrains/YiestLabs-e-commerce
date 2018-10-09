import React, { Component } from "react";
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import ItemsLg from "../components/Store/ItemsLg";

class Store extends Component {

    componentWillMount()
    {
        try
        {
            this.props.getInventory(0);
            var UserInfo = {
                billaddress1: "964 Court Lane",
                billaddress2: "",
                billaddress3: "",
                billaddressee: "Home",
                billattn: "",
                billcity: "Concord",
                billcountryid: "US",
                billid: 1743060,
                billzip: "94518",
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
                shipaddress1: "One way",
                shipaddress2: "",
                shipaddress3: "",
                shipaddressee: "",
                shipattn: "Attn",
                shipcity: "City",
                shipcountryid: "US",
                shipid: 1743261,
                shipmethod: "2842",
                shipzip: "94518",
                subsidiary: "2",
                terms: "10",
                vat: "",
                version: "2.3.7"
            };

            this.props.setUserInfo(UserInfo);
        }   
        catch(err)
        {
            console.log(err);
        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <ItemsLg items={this.props.store.items.slice(0, 25)}/>
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


const mapStateToProps = (state) => {
    return {
        user: state.user,
        store: state.store
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch({ type: "LOGIN_REQUEST", username, password}),
        getInventory: (index, getAll) => dispatch({ type: "STORE_REQUEST", index, getAll}),
        setUserInfo: (UserInfo) => dispatch({type: "SET_USER_INFO", UserInfo})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Store));
