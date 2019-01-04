import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import Utils from "../../../lib/Utils";

// custom
import SalesLib from "../../../lib/SalesLib";
import { userActions } from "../../../redux/actions/userActions";

class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            card: {
                name: "",
                number: "",
                expireMonth: this.currentMonth,
                expireYear: this.currentYear
            },
            expirationDates: Utils.getExpirationDates()
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardName"
                            label="Name on card"
                            fullWidth
                            value={this.state.card.name}
                            onChange={event =>
                                this.setState({
                                    card: {
                                        ...this.state.card,
                                        name: event.target.value
                                    }
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardNumber"
                            label="Card number"
                            fullWidth
                            value={this.state.card.number}
                            onChange={event =>
                                this.setState({
                                    card: {
                                        ...this.state.card,
                                        number: event.target.value
                                    }
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            required
                            id="expireMonth"
                            name="expireMonth"
                            label="Month"
                            fullWidth
                            autoComplete={this.currentMonth}
                            value={this.state.card.expireMonth}
                            onChange={event =>
                                this.setState({
                                    card: {
                                        ...this.state.card,
                                        expireMonth: event.target.value
                                    }
                                })
                            }
                        >
                            <MenuItem value="0">1</MenuItem>
                            <MenuItem value="1">2</MenuItem>
                            <MenuItem value="2">3</MenuItem>
                            <MenuItem value="3">4</MenuItem>
                            <MenuItem value="4">5</MenuItem>
                            <MenuItem value="5">6</MenuItem>
                            <MenuItem value="6">7</MenuItem>
                            <MenuItem value="7">8</MenuItem>
                            <MenuItem value="8">9</MenuItem>
                            <MenuItem value="9">10</MenuItem>
                            <MenuItem value="10">11</MenuItem>
                            <MenuItem value="11">12</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            required
                            id="expireYear"
                            name="expireYear"
                            label="Year"
                            fullWidth
                            autoComplete={this.currentYear}
                            value={this.state.card.expireYear}
                            onChange={event =>
                                this.setState({
                                    card: {
                                        ...this.state.card,
                                        expireYear: event.target.value
                                    }
                                })
                            }
                        >
                            {this.state.expirationDates.map((date, i) => {
                                return (
                                    <MenuItem key={i} value={date.year}>
                                        {date.year}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    addressBox: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    }
});

AddCard.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        checkout: state.checkout
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AddCard));
