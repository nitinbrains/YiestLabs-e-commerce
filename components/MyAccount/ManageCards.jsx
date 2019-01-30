import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import moment from 'moment';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";

import AddCard from "./AddCard";
import { userActions } from '../../redux/actions/userActions';

class ManageCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCard: false
        };
    }

    componentWillMount(){
        console.log('user', this.props.user);
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

    render() {
        const { classes, user } = this.props;
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
                        {user.cards.map((card, i) => (
                            <Grid item sm={4} xs={12}>
                                <div
                                    className={
                                        this.props.user.selectedCard.ccnumber ==
                                        card.ccnumber
                                            ? classes.cardBoxSelected
                                            : classes.cardBox
                                    }
                                >
                                    <Grid item container xs spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography>{card.ccname}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {card.ccnumber}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{moment(card.ccexpire).format("MM-YYYY")}</Typography>
                                        </Grid>

                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => this.props.setCreditCard(i)}
                                            >
                                                Select Card
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        ))}

                        {!this.state.newCard ? (
                            <Grid item xs={12}>
                                <Button
                                    onClick={this.newCard}
                                    color="primary"
                                >
                                    Add New Card
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <AddCard {...this.props} closeNewCard={this.closeNewCard} />
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
        user: state.user
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ManageCards));
