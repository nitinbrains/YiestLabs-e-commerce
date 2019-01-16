import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Utils from "../../../lib/Utils";

import AddCard from "./AddCard";

// custom
import SalesLib from "../../../lib/SalesLib";
import { userActions } from "../../../redux/actions/userActions";

class ManageCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCard: false,
            card: {
                name: "",
                number: "",
                expireMonth: this.currentMonth,
                expireYear: this.currentYear
            },
            expirationDates: Utils.getExpirationDates()
        };
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    newCard = () => {
        this.setState({ newCard: true });
    };

    addNewCard = () => {
        this.props.addCreditCard(this.state.card);
        this.handleDialogCardClose();
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <DialogContent id="my-order-details">
                    <div className={classes.close}>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Menu"
                            onClick={() => this.handleDialogClose()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Grid style={{ padding: 10 }} container spacing={24}>
                        {this.props.user.cards.map((card, i) => (
                            <Grid item xs={12} sm={4}>
                                <div
                                    className={
                                        this.props.user.selectedCard.number ==
                                        card.number
                                            ? classes.cardBoxSelected
                                            : classes.cardBox
                                    }
                                >
                                    <Typography>{card.ccname}</Typography>
                                    <Typography>{card.ccnumber}</Typography>
                                    <Typography>
                                        {moment(card.ccexpire).format(
                                            "MM-YYYY"
                                        )}
                                    </Typography>
                                    {this.props.user.selectedCard.number !=
                                        card.number && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                this.props.setCreditCard(i)
                                            }
                                        >
                                            Select Card
                                        </Button>
                                    )}
                                </div>
                            </Grid>
                        ))}

                        {!this.state.newCard ? (
                            <Grid item xs={12}>
                                <Button onClick={this.newCard} color="primary">
                                    Add New Card
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <AddCard />
                                <Grid
                                    style={{ marginTop: 10 }}
                                    container
                                    justify="flex-end"
                                >
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.addNewCard}
                                        >
                                            Add Card
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    cardBox: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    },
    cardBoxSelected: {
        border: "solid 2px",
        borderColor: "#f28411",
        padding: theme.spacing.unit * 2
    },
    close: { position: "absolute", right: 0, top: 0 }
});

ManageCards.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        order: state.order
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ManageCards));
