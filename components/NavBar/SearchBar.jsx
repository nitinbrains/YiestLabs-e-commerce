import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
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
import SideBarItems from "./SideBarItems";

class SearchBar extends Component {
    state = {
        openUserBar: false,
        openSearchBar: true
    };

    handleUserBar = () => {
        if (this.state.openUserBar == false) {
            this.setState({ openUserBar: true });
        } else {
            this.setState({ openUserBar: false });
        }
    };

    handleSearchBarOpen = () => {
        this.setState({ openSearchBar: true });
    };

    handleSearchBarClose = () => {
        this.setState({ openSearchBar: false });
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <div>
            <main className={classes.content}>
                <div className={classes.searchToolbar} />
                <Typography>{"Welcome to White Labs"}</Typography>
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
                <List><SideBarItems/></List>
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
    appBarShiftUser: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
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
    closeSearchButton: {
        color: "white",
        marginLeft: -12,
        marginRight: -20
    },
    hide: {
        display: "none"
    },
    drawerPaper: {
        position: "relative",
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
    searchDrawerPaper: {
        position: "relative",
        width: drawerWidth
    },
    searchToolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3
    },
    searchInput: {
        marginLeft: 10
    }
});

SearchBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SearchBar);
