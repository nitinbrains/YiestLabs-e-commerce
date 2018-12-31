import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

import AddCard from "./AddCard";

class ManageCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCard: false
        };
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    newCard = () => {
        this.setState({ newCard: true });
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
                        <Grid item sm={4} xs={12}>
                            <div className={classes.cardBoxSelected}>
                                <Grid item container xs spacing={8}>
                                    <Grid item>
                                        <Typography>Name on Card</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            **** **** **** 0098
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>10/22</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                        >
                                            Select Card
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <Grid item sm={4} xs={12}>
                            <div className={classes.cardBox}>
                                <Grid item container xs spacing={8}>
                                    <Grid item>
                                        <Typography>Name on Card</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            **** **** **** 0098
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>10/22</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                        >
                                            Select Card
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

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

export default withStyles(styles)(ManageCards);
