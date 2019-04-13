import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ReceiptIcon from "@material-ui/icons/Receipt";
import FeedbackIcon from "@material-ui/icons/Feedback";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import Dialpad from "@material-ui/icons/Dialpad";
import Group from "@material-ui/icons/Group";
import Home from "@material-ui/icons/Home";
import { withStyles } from "@material-ui/core/styles";

import { userActions } from "appRedux/actions/userActions";

class SideBarItems extends Component {
    render() {
        const { classes, theme } = this.props
        return(
            <div>
                <Link prefetch href="/myaccount">
                    <ListItem button>
                        <ListItemIcon>
                            <AccountBoxIcon />
                        </ListItemIcon>

                        <ListItemText primary="My Account" />
                    </ListItem>
                </Link>
                <Link prefetch href="/myorders">
                    <ListItem button>
                        <ListItemIcon>
                            <ReceiptIcon />
                        </ListItemIcon>

                        <ListItemText primary="My Orders" />
                    </ListItem>
                </Link>

                <a href="mailto:mwhite@whitelabs.com?subject=YMO%202.0%20Feedback" style={{ textDecoration: "none" }}>
                  <ListItem button>
                      <ListItemIcon>
                          <FeedbackIcon />
                      </ListItemIcon>
                      <ListItemText primary="Give Feedback" />
                  </ListItem>
                </a>

         <Link prefetch href="/">
        <ListItem className={classes.applinks}>
            <ListItemIcon>
                <Home />
            </ListItemIcon>
            <ListItemText primary="Store" />
        </ListItem>
        </Link>

         <Link prefetch href="/calculator">
        <ListItem className={classes.applinks}>
            <ListItemIcon>
                <Dialpad />
            </ListItemIcon>
            <ListItemText primary="Calculator" />
        </ListItem>
        </Link>
        <Link prefetch href="/">
        <ListItem className={classes.applinks}>
            <ListItemIcon>
                <Group />
            </ListItemIcon>
            <ListItemText primary="About Us" />
        </ListItem>
        </Link>

        <ListItem button onClick={() => {this.props.userLogout()}}>
            <ListItemIcon>
                <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
        </ListItem>
    </div>
        )
    }
}

const styles = theme => ({
    applinks:{
        display: "none",
        [theme.breakpoints.down("sm")]: {
            display: "flex"
        }
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(SideBarItems));
