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
                <ItemsLg items={this.props.inventory.items.slice(0, 25)}/>
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
        inventory: state.inventory
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch({ type: "LOGIN_REQUEST", username, password}),
        getInventory: (category, getAll) => dispatch({ type: "STORE_REQUEST", category, getAll})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Store));
