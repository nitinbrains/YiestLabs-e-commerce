import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

let timer;

class Store extends Component {
    state = {
        hoverItem: false,
        hoverItem2: false,
        timer: null
    };

    handleItemHover = () => {
        timer = setTimeout(
            function() {
                this.setState({ hoverItem: true });
            }.bind(this),
            500
        );
    };

    handleItemHoverLeave = () => {
        clearTimeout(timer);
        this.setState({ hoverItem: false });
    };

    handleItemHover2 = () => {
        timer = setTimeout(
            function() {
                this.setState({ hoverItem2: true });
            }.bind(this),
            500
        );
    };

    handleItemHoverLeave2 = () => {
        clearTimeout(timer);
        this.setState({ hoverItem2: false });
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <Grid container spacing={24} className={classes.itemRow}>
                    <Grid
                        item
                        xs={this.state.hoverItem ? 6 : 3}
                        spacing={24}
                        className={this.state.hoverItem2 && classes.hide}
                        onMouseEnter={this.handleItemHover}
                        onMouseLeave={this.handleItemHoverLeave}
                    >
                        <Paper
                            elevation={this.state.hoverItem ? 5 : 1}
                            className={classNames(
                                classes.card,
                                this.state.hoverItem && classes.cardHover
                            )}
                        >
                            <Grid item xs>
                                <Typography
                                    variant="subheading"
                                    color="textPrimary"
                                >
                                    ITEM 1
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                style={{ marginTop: 5 }}
                                container
                                direction={
                                    this.state.hoverItem ? "row" : "column"
                                }
                                spacing={8}
                            >
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>
                                            68F - 73F | 20C - 23C
                                        </Typography>
                                        <Typography>
                                            Fermentation Temp.
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>Medium</Typography>
                                        <Typography>Flocculation</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>High</Typography>
                                        <Typography>Alcohol Tol.</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>73.0% - 80%</Typography>
                                        <Typography>Attenuation</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                            <div
                                className={
                                    !this.state.hoverItem && classes.hide
                                }
                            >
                                <Grid
                                    item
                                    container
                                    direction={"column"}
                                    spacing={8}
                                    style={{ marginTop: 5 }}
                                >
                                    <Grid item>
                                        <Typography>
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Sed
                                            volutpat ut est sed convallis. Morbi
                                            dictum rhoncus risus, et
                                            pellentesque ante dictum et.
                                            Maecenas ultricies dictum consequat.
                                            Aliquam non facilisis metus. Duis eu
                                            sollicitudin augue, ut ultrices
                                            augue. Aliquam eu metus nec turpis
                                            tristique condimentum eget ut arcu.
                                            Duis quis ex nec orci maximus
                                            elementum ac a erat. Nam massa leo,
                                            placerat sit amet gravida ac,
                                            euismod non elit. Nam a ultrices
                                            dolor, nec mollis purus.
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    container
                                    spacing={24}
                                    style={{ marginTop: 5 }}
                                    direction={"row"}
                                >
                                    <Grid
                                        item
                                        xs
                                        container
                                        spacing={24}
                                        direction={"row"}
                                        justify="flex-start"
                                    >
                                        <Grid item>
                                            <FormControl>
                                                <InputLabel>
                                                    Packaging
                                                </InputLabel>
                                                <Select
                                                    value={1}
                                                    name="packaging"
                                                >
                                                    <MenuItem value={1}>
                                                        Purepitch
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        Twenty
                                                    </MenuItem>
                                                    <MenuItem value={30}>
                                                        Thirty
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <FormControl>
                                                <InputLabel>Pack</InputLabel>
                                                <Select value={1} name="pack">
                                                    <MenuItem value={1}>
                                                        Nano
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        1.5L
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="quantity"
                                                label="Quantity"
                                                className={classes.quantity}
                                                value={1}
                                                type="number"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs
                                        container
                                        spacing={24}
                                        direction={"row"}
                                        justify="flex-end"
                                    >
                                        <Grid item>
                                            <Button variant="contained">
                                                ADD TO CART
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={3} spacing={24}>
                        <Paper className={classes.card}>
                            <Grid item xs>
                                <Typography
                                    variant="subheading"
                                    color="textPrimary"
                                >
                                    ITEM 2
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                container
                                style={{ marginTop: 5 }}
                                direction={"column"}
                                spacing={8}
                            >
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>
                                            68F - 73F | 20C - 23C
                                        </Typography>
                                        <Typography>
                                            Fermentation Temp.
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>Medium</Typography>
                                        <Typography>Flocculation</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>High</Typography>
                                        <Typography>Alcohol Tol.</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>73.0% - 80%</Typography>
                                        <Typography>Attenuation</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3} spacing={24}>
                        <Paper className={classes.card}>
                            <Grid item xs>
                                <Typography
                                    variant="subheading"
                                    color="textPrimary"
                                >
                                    ITEM 3
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                container
                                style={{ marginTop: 5 }}
                                direction={"column"}
                                spacing={8}
                            >
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>
                                            68F - 73F | 20C - 23C
                                        </Typography>
                                        <Typography>
                                            Fermentation Temp.
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>Medium</Typography>
                                        <Typography>Flocculation</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>High</Typography>
                                        <Typography>Alcohol Tol.</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>73.0% - 80%</Typography>
                                        <Typography>Attenuation</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid
                        item
                        xs={this.state.hoverItem2 ? 6 : 3}
                        spacing={24}
                        onMouseEnter={this.handleItemHover2}
                        onMouseLeave={this.handleItemHoverLeave2}
                    >
                        <Paper
                            elevation={this.state.hoverItem2 ? 5 : 1}
                            className={classes.card}
                        >
                            <Grid item xs>
                                <Typography
                                    variant="subheading"
                                    color="textPrimary"
                                >
                                    ITEM 4
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                container
                                style={{ marginTop: 5 }}
                                direction={
                                    this.state.hoverItem2 ? "row" : "column"
                                }
                                spacing={8}
                            >
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>
                                            68F - 73F | 20C - 23C
                                        </Typography>
                                        <Typography>
                                            Fermentation Temp.
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>Medium</Typography>
                                        <Typography>Flocculation</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>High</Typography>
                                        <Typography>Alcohol Tol.</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.info}>
                                        <Typography>73.0% - 80%</Typography>
                                        <Typography>Attenuation</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                            <div
                                className={
                                    !this.state.hoverItem2 && classes.hide
                                }
                            >
                                <Grid
                                    item
                                    container
                                    direction={"column"}
                                    spacing={8}
                                    style={{ marginTop: 5 }}
                                >
                                    <Grid item>
                                        <Typography>
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Sed
                                            volutpat ut est sed convallis. Morbi
                                            dictum rhoncus risus, et
                                            pellentesque ante dictum et.
                                            Maecenas ultricies dictum consequat.
                                            Aliquam non facilisis metus. Duis eu
                                            sollicitudin augue, ut ultrices
                                            augue. Aliquam eu metus nec turpis
                                            tristique condimentum eget ut arcu.
                                            Duis quis ex nec orci maximus
                                            elementum ac a erat. Nam massa leo,
                                            placerat sit amet gravida ac,
                                            euismod non elit. Nam a ultrices
                                            dolor, nec mollis purus.
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    container
                                    spacing={24}
                                    style={{ marginTop: 5 }}
                                    direction={"row"}
                                >
                                    <Grid
                                        item
                                        xs
                                        container
                                        spacing={24}
                                        direction={"row"}
                                        justify="flex-start"
                                    >
                                        <Grid item>
                                            <FormControl>
                                                <InputLabel>
                                                    Packaging
                                                </InputLabel>
                                                <Select
                                                    value={1}
                                                    name="packaging"
                                                >
                                                    <MenuItem value={1}>
                                                        Purepitch
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        Twenty
                                                    </MenuItem>
                                                    <MenuItem value={30}>
                                                        Thirty
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <FormControl>
                                                <InputLabel>Pack</InputLabel>
                                                <Select value={1} name="pack">
                                                    <MenuItem value={1}>
                                                        Nano
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        1.5L
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="quantity"
                                                label="Quantity"
                                                className={classes.quantity}
                                                value={1}
                                                type="number"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs
                                        container
                                        spacing={24}
                                        direction={"row"}
                                        justify="flex-end"
                                    >
                                        <Grid item>
                                            <Button variant="contained">
                                                ADD TO CART
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    card: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: 290,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    cardHover: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    itemRow: {
        height: 300
    },
    info: {
        alignItems: "center",
        padding: 5,
        backgroundColor: "#e4e4e4",
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    }
});

Store.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Store);
