import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

class Billing extends React.Component {
    state = {
        terms: "cc",
        openDialogCard: false,
        openDialogAdress: false,
        addCard: false
    };

    handleNewCard = () => {
        this.setState({ addCard: !this.state.addCard });
    };

    handleDialogCardOpen = () => {
        this.setState({ openDialogCard: true });
    };

    handleDialogCardClose = () => {
        this.setState({ openDialogCard: false, addCard: false });
    };

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="title" gutterBottom>
                    Payment
                </Typography>
                {this.state.terms ? (
                    this.state.terms == "cc" ? (
                        <div>
                            <Typography variant="body2">Credit Card</Typography>
                            <Typography>Your Payment</Typography>
                            <Typography>Information</Typography>
                            <Button
                                style={{ marginTop: 10 }}
                                onClick={this.handleDialogCardOpen}
                            >
                                Change Card
                            </Button>
                            <Dialog
                                open={this.state.openDialogCard}
                                onClose={this.handleDialogCardClose}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">
                                    Cards
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} sm={4}>
                                            <Paper className={classes.paper}>
                                                <Typography variant="body2">
                                                    Credit Card
                                                </Typography>
                                                <Typography>
                                                    Your Payment
                                                </Typography>
                                                <Typography>
                                                    Information
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                >
                                                    Select Card
                                                </Button>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Paper className={classes.paper}>
                                                <Typography variant="body2">
                                                    Credit Card
                                                </Typography>
                                                <Typography>
                                                    Your Payment
                                                </Typography>
                                                <Typography>
                                                    Information
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                >
                                                    Select Card
                                                </Button>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Paper className={classes.paper}>
                                                <Typography variant="body2">
                                                    Credit Card
                                                </Typography>
                                                <Typography>
                                                    Your Payment
                                                </Typography>
                                                <Typography>
                                                    Information
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                >
                                                    Select Card
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {this.state.addCard ? (
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    required
                                                    id="cardName"
                                                    label="Name on card"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    required
                                                    id="cardNumber"
                                                    label="Card number"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    required
                                                    id="expDate"
                                                    label="Expiry date"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    required
                                                    id="cvv"
                                                    label="CVV"
                                                    helperText="Last three digits on signature strip"
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNewCard}
                                            className={classes.button}
                                        >
                                            New Card
                                        </Button>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={this.handleDialogCardClose}
                                        color="primary"
                                    >
                                        Cancel
                                    </Button>
                                    {this.state.addCard && (
                                        <Button
                                            onClick={this.handleDialogCardClose}
                                            color="primary"
                                        >
                                            Confirm Changes
                                        </Button>
                                    )}
                                </DialogActions>
                            </Dialog>
                        </div>
                    ) : (
                        <div>
                            <Typography variant="body2">NET10</Typography>
                            <Typography>Your Payment</Typography>
                            <Typography>Information</Typography>
                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                                name="addCard"
                                                onChange={this.handleNewCard}
                                            />
                                        }
                                        label="Add a Credit Card"
                                    />
                                </Grid>
                            </Grid>
                            {this.state.addCard && (
                                <Grid container spacing={24}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            required
                                            id="cardName"
                                            label="Name on card"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            required
                                            id="cardNumber"
                                            label="Card number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            required
                                            id="expDate"
                                            label="Expiry date"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            required
                                            id="cvv"
                                            label="CVV"
                                            helperText="Last three digits on signature strip"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                    )
                ) : (
                    <Grid container spacing={24}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cardName"
                                label="Name on card"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cardNumber"
                                label="Card number"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="expDate"
                                label="Expiry date"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cvv"
                                label="CVV"
                                helperText="Last three digits on signature strip"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2
    },
    button: {
        marginTop: 10
    }
});

Billing.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Billing);
