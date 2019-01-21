import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creditCard : {
                id: '',
                ccnumber: '',
                ccname: '',
                ccexpire: '',
                cccvc:'',
                type: '',
                default: false
            }
        };
    }

    addCard = () => {
        const { creditCard } = this.state;
        const { user } = this.props;
        user.cards.push(creditCard)
        this.props.addCreditCard(creditCard)
        this.props.closeNewCard()

    }

    render() {
        const { classes } = this.props;
        const { creditCard } = this.state;
        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardName"
                            value={creditCard.ccname}
                            onChange={(e)=>{ this.setState({ creditCard: { ...this.state.creditCard, ccname: e.target.value } }) }}
                            label="Name on card"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cardNumber"
                            value={creditCard.ccnumber}
                            onChange={(e)=>{ this.setState({ creditCard: { ...this.state.creditCard, ccnumber: e.target.value } }) }}
                            label="Card number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="expDate"
                            value={creditCard.ccexpire}
                            onChange={(e)=>{ this.setState({ creditCard: { ...this.state.creditCard, ccexpire: e.target.value } }) }}
                            label="Expiry date"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cvv"
                            label="CVV"
                            value={creditCard.cccvc}
                            onChange={(e)=>{ this.setState({ creditCard: { ...this.state.creditCard, cccvc: e.target.value } }) }}
                            helperText="Last three digits on signature strip"
                            fullWidth
                        />
                    </Grid>
                      <Grid
                            style={{ marginTop: 10 }}
                            container
                            justify="flex-end"
                        >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.addCard}
                                >
                                    Add Card
                                </Button>
                            </Grid>
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

export default withStyles(styles)(AddCard);
