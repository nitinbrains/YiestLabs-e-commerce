import React, { Component } from "react";
import { connect } from "react-redux";

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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class ServicesCard extends Component {
    render() {
        const { classes, theme, item } = this.props;

        const spaceIndex = item.Name.indexOf(" ");
        const itemID = item.Name.substr(0, spaceIndex);
        const itemName = item.Name.substr(spaceIndex + 1);

        return (
            <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                spacing={24}
                onClick={this.props.onClick.bind(this, this.props.item)}
            >
                <div
                    className={classes.card}
                    onMouseEnter={this.handleItemHoverEnter}
                    onMouseLeave={this.handleItemHoverLeave}
                    style={{
                        backgroundImage: `url('../../../static/images/categories/Category-core.jpg')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                    }}
                >
                    <Grid item container spacing={8}>
                        <Grid
                            item
                            xs={12}
                            className={classes.info}
                            style={{ marginTop: 60 }}
                        >
                            <Typography variant="h5" color="secondary">
                                {itemID}
                            </Typography>
                            <Typography variant="subheading" color="secondary">
                                {itemName}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        );
    }
}

const styles = theme => ({
    card: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2,
        height: 230
    },
    cardHover: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    info: {
        textAlign: "center"
    },
    name: {
        padding: 3,
        marginLeft: theme.spacing.unit * -2,
        marginRight: theme.spacing.unit * -2,
        textAlign: "center"
    }
});

ServicesCard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addCartItem: (item, volIdIndex, quantity) =>
            dispatch({ type: "ADD_TO_CART", item, volIdIndex, quantity })
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ServicesCard));
