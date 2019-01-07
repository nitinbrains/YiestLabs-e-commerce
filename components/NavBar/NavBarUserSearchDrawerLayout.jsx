import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

import { userActions } from "../../redux/actions/userActions";
import { messageActions } from "../../redux/actions/messageActions";
import SimpleSnackbar from "../Form/SimpleSnackbar";

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
                        position: "fixed"
                    }}
                />
                <AppBar
                    className={classNames(
                        classes.appBar,
                        this.state.openSearchBar && classes.appBarShiftSearch
                    )}
                >
                    <Toolbar>
                        <IconButton
                            onClick={this.handleUserBar}
                            className={classNames(
                                classes.menuButton,
                                !this.props.user.id && classes.hide
                            )}
                            color="inherit"
                            aria-label="Menu"
                        >
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
                                <img
                                    src="../../static/images/yeastman.png"
                                    height="30"
                                />
                            </IconButton>
                        </Link>
                        <Link prefetch href="/">
                            <div className={classes.circle}>
                                <img
                                    src="../../static/images/logo_circle.png"
                                    height="130"
                                />
                            </div>
                        </Link>
                        <div style={{ flexGrow: 1 }} />

                        <Link prefetch href="/">
                            <Button color="secondary">Yeastman Store</Button>
                        </Link>
                        <Link prefetch href="/calculator">
                            <Button color="secondary">Calculator</Button>
                        </Link>
                        <Button color="secondary">About Us</Button>

                        <Link prefetch href="/cart">
                            <IconButton color="inherit" aria-label="Menu">
                                <ShoppingCartIcon />
                            </IconButton>
                        </Link>

                        <IconButton
                            onClick={this.handleSearchBarOpen}
                            className={classNames(
                                classes.searchButton,
                                this.state.openSearchBar && classes.hide
                            )}
                            color="inherit"
                            aria-label="Menu"
                        >
                            <SearchIcon />
                        </IconButton>

                        <IconButton
                            onClick={this.handleSearchBarClose}
                            className={classNames(
                                classes.closeSearchButton,
                                !this.state.openSearchBar && classes.hide
                            )}
                            color="inherit"
                            aria-label="Menu"
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    onMouseEnter={this.handleUserBarHover}
                    onMouseLeave={this.handleUserBarHover}
                    classes={{
                        paper: classNames(
                            classes.drawerPaper,
                            !this.props.user.id && classes.hide,
                            !this.state.openUserBar &&
                                !this.state.openUserBarHover &&
                                classes.drawerPaperClose
                        )
                    }}
                >
                    <div
                        className={classes.toolbar}
                        style={{ marginTop: 35 }}
                    />
                    <List><SideBarItems/></List>
                    <Divider />
                </Drawer>

                <main
                    className={classNames(
                        classes.content,
                        !this.props.user.id && classes.contentNoUser,
                        {
                            [classes.contentShift]: this.state.openSearchBar,
                            [classes[`contentShift-search`]]: this.state
                                .openSearchBar
                        },
                        {
                            [classes.contentShift]: this.state.openUserBar,
                            [classes[`contentShift-user`]]: this.state
                                .openUserBar
                        }
                    )}
                >
                    <div className={classes.toolbar} />
                    {children}
                </main>

                <Drawer
                    variant="persistent"
                    SlideProps={{
                        unmountOnExit: true
                    }}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    anchor={"right"}
                    open={this.state.openSearchBar}
                >
                    <div className={classes.toolbar}>
                        <SearchIcon />
                        <TextField
                            id="search"
                            placeholder="Search"
                            type="search"
                            InputProps={{
                                disableUnderline: true
                            }}
                            className={classNames(classes.searchInput)}
                        />
                    </div>
                    <Divider />
                    <List>
                        <SearchBarItems />
                    </List>
                    <Divider />
                </Drawer>
                <SimpleSnackbar
                    show={this.props.messages.networkRequestError == false ? false : true}
                    message={this.props.messages.networkRequestError && this.props.messages.networkRequestError.message || ''}
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
    searchInput: {
        marginLeft: 10
    }
});

NavBarUserSearchDrawerLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    messages: state.messages
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...userActions, ...messageActions }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(NavBarUserSearchDrawerLayout));
