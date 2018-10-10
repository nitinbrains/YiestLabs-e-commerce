import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class Cart extends Component {
    render() {
        const { classes, theme } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Card className={classes.card}>
                            <div
                                style={{ backgroundColor: "#f28411", width: 7 }}
                            />
                            <CardMedia
                                className={classes.image}
                                image="/static/images/yeast.jpg"
                            />
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography
                                        variant="display1"
                                        color="textPrimary"
                                    >
                                        ITEM NAME
                                    </Typography>
                                </CardContent>
                                <CardContent className={classes.content}>
                                    <TextField
                                        id="quantity"
                                        label="Quantity"
                                        className={classes.quantity}
                                        value={1}
                                        type="number"
                                    />
                                    <Button variant="contained">DELETE</Button>
                                </CardContent>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    },
    card: {
        display: "flex"
    },
    image: {
        width: 150
    },
    quantity: {
        width: 50,
        marginRight: 20
    },
    details: {
        display: "flex",
        flexDirection: "column"
    }
});

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Cart);
