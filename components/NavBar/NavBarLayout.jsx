import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "next/link";
import { messageActions } from "../../redux/actions/messageActions";
import SimpleSnackbar from "../Form/SimpleSnackbar";

class NavBarLayout extends Component {
    componentWillUnmount() {
        if( this.props.messages.networkRequestError != false ){
            this.props.hideNetworkError()
        }
    }
    render() {
        const { children, classes, theme } = this.props;

        return (
            <div className={classes.root}>

            <div
                style={{
                    height: 50,
                    width: "100%",
                    backgroundColor: "#fafafa",
                    position: "fixed",
                    zIndex: 1000
                }}
            />
                <AppBar
                    className={classes.appBar}
                >
                    <Toolbar>

                        <Link prefetch href="/">
                            <div className={classes.circle}>
                                <img
                                    src="../../static/images/logo_circle.png"
                                    height="130"
                                />
                            </div>
                        </Link>
                        <div style={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>


                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>

                <SimpleSnackbar
                    messageList={this.props.messages}
                    handleClose={() => this.props.hideNetworkError()}
                />

            </div>
        );
    }
}

const drawerWidth = 240;

const styles = theme => ({
    root: {
        zIndex: 1,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        width: "100%"
    },
    circle: {
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        left: 70,
        top: -60,
        padding: 10,
        margin: 20,
        width: 150,
        height: 150
    },
    appBar: {
        marginTop: 50,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        marginLeft: 56,
        [theme.breakpoints.up("sm")]: {
            marginLeft: 72
        },
        marginTop: 20,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
});

NavBarLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    messages: state.messages
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...messageActions }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(NavBarLayout));
