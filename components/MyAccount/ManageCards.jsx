import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import moment from "moment";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import AddCard from "./AddCard";

import { userActions } from 'appRedux/actions/userActions';

class ManageCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCard: false,
            cardHover: null,
            confirmation: false
        };
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    newCard = () => {
        this.setState({ newCard: true });
    };

    closeNewCard = () => {
        this.setState({ newCard: false });
    };

    handleCardHover = i => {
        this.setState({ cardHover: i });
    };

    handleCardLeaveHover = () => {
        this.setState({ cardHover: null });
    };

    handleConfirmation = card => {
        this.setState({
            confirmation: true,
            deleteCard: card
        });
    };

    handleNo = () => {
        this.setState({
            confirmation: false
        });
    };

    handleYes = () => {
        const creditCard = this.state.deleteCard;
        this.props.deleteCreditCard({ creditCard });
        this.setState({
            confirmation: false
        });
    };

    setDefaultCreditCard = creditCard => {
        if (!creditCard.default) {
            this.props.setDefaultCreditCard({ creditCard });
        }
    };

    render() {
        const { classes, user } = this.props;
        return (
            <React.Fragment>
                <DialogContent id="my-order-details">
                <div className="main-block">
                <div className="order-number">
                <Typography variant="h6" color="textPrimary">
                MANAGE CREDIT CARDS
                </Typography>
                </div>
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
                    <Grid
                        item
                        container
                        xs
                        style={{
                            display: "flex",
                            marginTop: -10,
                            marginBottom: 10
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item xs={12}>
                            {/* <Typography variant="h6" color="textPrimary">
                                MANAGE CREDIT CARDS
                            </Typography>
                            <div className={classes.sectionTitleDivider} /> */}
                        </Grid>
                    </Grid>
                    <Grid style={{ padding: 20 }} container spacing={24}>
                        {user.otherCards.map((card, i) => (
                            <Grid item sm={4} xs={12}>
                                <div
                                    className={
                                        this.props.user.card.ccnumber ==
                                        card.ccnumber
                                            ? classes.cardBoxSelected
                                            : classes.cardBox
                                    }
                                    onMouseEnter={() => this.handleCardHover(i)}
                                    onMouseLeave={this.handleCardLeaveHover}
                                >
                                    <div
                                        className={classNames(
                                            classes.deleteIcon,
                                            this.state.cardHover != i &&
                                                classes.hide
                                        )}
                                    >
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            aria-label="Menu"
                                            onClick={e => {
                                                this.handleConfirmation(card);
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </div>
                                    <Grid
                                        item
                                        container
                                        xs
                                        spacing={8}
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12}>
                                            <Typography>
                                                {card.ccname}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {card.ccnumber}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {moment(card.ccexpire).format(
                                                    "MM-YYYY"
                                                )}
                                            </Typography>
                                        </Grid>

                                        {this.props.user.card.ccnumber !=
                                            card.ccnumber &&
                                            !this.props.checkout && (
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{bottom:2}}
                                                        className={classNames(
                                                            this.state
                                                                .cardHover !=
                                                                i &&
                                                                classes.hide
                                                        )}
                                                        onClick={() =>
                                                            this.setDefaultCreditCard(
                                                                card
                                                            )
                                                        }
                                                    >
                                                        Make Default
                                                    </Button>
                                                </Grid>
                                            )}

                                        {this.props.checkout && (
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{bottom:2}}
                                                    onClick={() =>
                                                        this.props.setCreditCard(
                                                            i
                                                        )
                                                    }
                                                >
                                                    Select
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
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
                                <AddCard
                                    {...this.props}
                                    closeNewCard={this.closeNewCard}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Dialog open={this.state.confirmation}>
                        <DialogTitle id="alert-dialog-title">
                            Are you sure you want to delete this card?
                        </DialogTitle>
                        <DialogContent />
                        <DialogActions>
                            <Button color="primary" onClick={this.handleNo}>
                                No
                            </Button>
                            <Button
                                color="primary"
                                autoFocus
                                onClick={this.handleYes}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                    </div>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    cardBox: {
        position: "relative",
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        height: 150
    },
    cardBoxSelected: {
        position: "relative",
        border: "solid 2px",
        borderColor: "#f28411",
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        height: 150
    },
    close: { position: "absolute", right: 0, top: 0 },
    deleteIcon: { position: "absolute", right: -25, top: -25 },
    hide: {
        display: "none"
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    }
});

ManageCards.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ManageCards));
