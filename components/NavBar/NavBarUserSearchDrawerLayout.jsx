import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import InputBase from "@material-ui/core/InputBase";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SideBarItems from "./SideBarItems";
import SearchBarItems from "./SearchBarItems";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Badge from "@material-ui/core/Badge";

import { userActions } from "appRedux/actions/userActions";
import { messageActions } from "appRedux/actions/messageActions";
import SimpleSnackbar from "components/Form/SimpleSnackbar";
import Banner from "components/UI/Banner";
import isLoggedUser from "hocs/isLoggedUser";
import { cartActions } from "appRedux/actions/cartActions";

class NavBarUserSearchDrawerLayout extends Component {
    state = {
        openUserBar: false,
        openUserBarHover: false,
        openSearchBar: false,
        isLoggedIn: true
    };

    handleUserBar = () => {
        this.setState({ openUserBar: !this.state.openUserBar });
    };

    handleUserBarHover = () => {
        this.setState({ openUserBarHover: !this.state.openUserBarHover });
    };

    handleSearchBarOpen = () => {
        this.setState({ openSearchBar: true });
    };

    handleSearchBarClose = () => {
        this.setState({ openSearchBar: false });
    };
    handleClose = () => {
        this.props.unsavedUserClose();
    };

    componentWillUnmount() {
        if (this.props.messages.snackbar != false) {
            this.props.hideSnackbar();
        }
    }

    render() {
        const { children, classes, theme, messages } = this.props;
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
                <AppBar className={classNames(classes.appBar, this.state.openSearchBar && classes.appBarShiftSearch)}>
                    <Toolbar>
                        <IconButton onClick={this.handleUserBar} className={classNames(classes.menuButton, !this.props.user.id && classes.hide)} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>

                        <Link prefetch href="/login">
                            <IconButton
                                className={classNames(
                                    classes.menuButton,
                                    this.props.user.id && classes.hide
                                )}
                                color="inherit"
                                aria-label="Login"
                            >
                            <AccountCircleIcon />

                            </IconButton>
                        </Link>
                        <Link prefetch href="/">
                            <div className={classes.circle}>
                                <img src="static/images/logo_circle.png" height="130" className={classes.logoImg} />
                            </div>
                        </Link>
                        <div style={{ flexGrow: 1 }} />

                        <Link prefetch href="/">
                            <Button color="secondary">
                            <img
                                src="static/images/yeastman.png"
                                height="30"
                            /> Store</Button>
                        </Link>
                        <Link prefetch href="/calculator">
                            <Button color="secondary">Calculator</Button>
                        </Link>
                        <Button color="secondary">About Us</Button>

                        <Link prefetch href="/cart">
                            <IconButton color="inherit" aria-label="Menu">
                                <Badge color="secondary" badgeContent={this.props.cart.items.length} className={classes.margin} classes={{ badge: classes.badge }}>
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Link>

                        <IconButton color="inherit" aria-label="Menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            id="search"
                            placeholder="Search"
                            type="search"
                            name="searchText"
                            value={this.props.searchText}
                            onChange={e => this.props.handleSearch(e.target.value)}
                            classes={{
                                root: classes.inputRoot
                            }}
                        />
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    onMouseEnter={this.handleUserBarHover}
                    onMouseLeave={this.handleUserBarHover}
                    classes={{
                        paper: classNames(classes.drawerPaper, !this.props.user.id && classes.hide, !this.state.openUserBar && !this.state.openUserBarHover && classes.drawerPaperClose)
                    }}
                >
                    <div className={classes.toolbar} style={{ marginTop: 35 }} />
                    <List>
                        <SideBarItems />
                    </List>
                    <Divider />
                </Drawer>

                <main
                    className={classNames(
                        classes.content,
                        !this.props.user.id && classes.contentNoUser,
                        {
                            [classes.contentShift]: this.state.openSearchBar,
                            [classes[`contentShift-search`]]: this.state.openSearchBar
                        },
                        {
                            [classes.contentShift]: this.state.openUserBar,
                            [classes[`contentShift-user`]]: this.state.openUserBar
                        }
                    )}
                >
                    <div className={classes.toolbar} />
                    <div className={classes.alertWrapper}>
                        <Banner />
                    </div>
                    {children}
                </main>

                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={true}
                    open={this.props.user.isUnsaved}
                    autoHideDuration={2000}
                    onClose={this.handleClose}
                    ContentProps={{
                        "aria-describedby": "message-id"
                    }}
                    message={<span id="message-id">{"Deleting Unsaved Changes from my account page"}</span>}
                    action={[
                        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={e => this.handleClose()}>
                            <CloseIcon />
                        </IconButton>
                    ]}
                />

                <SimpleSnackbar messageList={messages.snackbar || []} handleClose={() => this.props.hideSnackbar()} />
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
    appBar: {
        marginTop: 50,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShiftSearch: {
        marginRight: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 8px",
        ...theme.mixins.toolbar
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
    logoImg: {
        cursor: "pointer"
    },
    menuButton: {
        color: "white",
        marginLeft: -12,
        marginRight: 20
    },
    searchButton: {
        color: "white",
        marginRight: 20
    },
    closeSearchButton: {
        color: "white",
        marginRight: -20
    },
    hide: {
        display: "none"
    },
    drawerPaper: {
        marginTop: 50,
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing.unit * 9
        }
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
    contentNoUser: {
        marginLeft: 0
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    "contentShift-search": {
        marginRight: drawerWidth
    },
    "contentShift-user": {
        marginLeft: drawerWidth
    },
    close: {
        padding: theme.spacing.unit / 2
    },
    alertWrapper: {
        marginTop: "50px"
    },
    inputRoot: {
        color: "inherit",
        width: "10%"
    },
    inputInput: {
        width: "50%"
    }
});

NavBarUserSearchDrawerLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    cart: state.cart,
    messages: state.messages
});

const mapDispatchToProps = dispatch => bindActionCreators({ ...userActions, ...messageActions }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(NavBarUserSearchDrawerLayout));
