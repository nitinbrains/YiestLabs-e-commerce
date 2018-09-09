import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { SideBarItems } from "./SideBarItems";

class NavBarUserSearchDrawerLayout extends Component {
    state = {
        openUserBar: false,
        openUserBarHover: false,
        openSearchBar: false
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

    render() {
        const { children, classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <AppBar
                    className={classNames(
                        classes.appBar,
                        this.state.openSearchBar && classes.appBarShiftSearch
                    )}
                    position="absolute"
                >
                    <Toolbar>
                        <IconButton
                            onClick={this.handleUserBar}
                            className={classNames(classes.menuButton)}
                            color="inherit"
                            aria-label="Menu"
                        >
                            <MenuIcon />
                        </IconButton>

                        <div className={classes.logo}>
                            <img
                                src="../../static/images/logoHeader.png"
                                height="40"
                            />
                        </div>

                        <Button color="secondary">Store</Button>
                        <Button color="secondary">Calculator</Button>
                        <Button color="secondary">About Us</Button>

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
                            !this.state.openUserBar &&
                                !this.state.openUserBarHover &&
                                classes.drawerPaperClose
                        )
                    }}
                >
                    <div className={classes.toolbar} />
                    <List>{SideBarItems}</List>
                    <Divider />
                </Drawer>

                <main
                    className={classNames(
                        classes.content,
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
                    <List>COMING SOON!</List>
                    <Divider />
                </Drawer>
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
    logo: {
        flexGrow: 1
    },
    appBar: {
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
        marginTop: 10,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
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

export default withStyles(styles, { withTheme: true })(
    NavBarUserSearchDrawerLayout
);
