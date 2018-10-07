import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
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

class ItemsLg extends Component {
    state = {
        hoverItem: null,
        hideItem: null,
        timer: null
    };

    handleItemHover = i => () => {
        // timer = setTimeout(
        //     function() {
                var index1 = i + 1;
                var index2 = i + 2;
                var index3 = i - 1;
                var hideItem;
                if (i % 4 == 0){
                    hideItem = i + 3;
                } else if (index1 % 4 == 0) {
                    hideItem = i - 3;
                } else if (index2 % 4 == 0) {
                    hideItem = i - 2;
                } else if (index3 % 4 == 0) {
                    hideItem = i + 2;
                }

                this.setState({ hoverItem: i, hideItem: hideItem });
        //     }.bind(this),
        //     500
        // );
    };

    handleItemHoverLeave = () => {
    //     clearTimeout(timer);
        this.setState({ hoverItem: null, hideItem: null });
    };

    render() {
        const { classes, theme, items } = this.props;

        return (
            <Grid container spacing={24}>
                {items.map((item, i) => (
                    <Grid
                        item
                        xs={this.state.hoverItem == i ? 6 : 3}
                        spacing={24}
                        className={this.state.hideItem == i && classes.hide}
                        onMouseEnter={this.handleItemHover(i)}
                        onMouseLeave={this.handleItemHoverLeave}
                        key={i}
                    >
                        <Paper
                            elevation={this.state.hoverItem == i ? 5 : 1}
                            className={classNames(
                                classes.card,
                                this.state.hoverItem == i && classes.cardHover
                            )}
                        >
                            <Grid item xs>
                                <Typography
                                    variant="subheading"
                                    color="textPrimary"
                                >
                                    {item.Name}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs
                                style={{ marginTop: 5, }}
                                container
                                direction={
                                    this.state.hoverItem == i ? "row" : "column"
                                }
                                spacing={8}
                                justify="flex-end"
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
                                    this.state.hoverItem != i && classes.hide
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
                ))}
            </Grid>
        );
    }
}

const styles = theme => ({
    card: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: "100%",
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

ItemsLg.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ItemsLg);
