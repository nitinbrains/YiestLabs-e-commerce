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
        openDialogAddress: false,
        useCard: false,
        newCard: false,
        newAddress: false
    };

    handleNewCard = () => {
        this.setState({ newCard: !this.state.newCard });
    };

    handleUseCard = () => {
        this.setState({ useCard: !this.state.useCard });
    };

    handleDialogCardOpen = () => {
        this.setState({ openDialogCard: true });
    };

    handleDialogCardClose = () => {
        this.setState({ openDialogCard: false, newCard: false });
    };

    handleNewAddress = () => {
        this.setState({ newAddress: true });
    };

    handleDialogAddressOpen = () => {
        this.setState({ openDialogAddress: true });
    };

    handleDialogAddressClose = () => {
        this.setState({ openDialogAddress: false, newAddress: false });
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

                                    {this.state.newCard ? (
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
                                    {this.state.newCard && (
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
                                                name="newCard"
                                                onChange={this.handleUseCard}
                                            />
                                        }
                                        label="Use Credit Card"
                                    />
                                </Grid>
                            </Grid>

                            {this.state.useCard && (
                                <div>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        onClick={this.handleDialogCardOpen}
                                    >
                                        Select Card
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
                                                    <Paper
                                                        className={
                                                            classes.paper
                                                        }
                                                    >
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
                                                            className={
                                                                classes.button
                                                            }
                                                        >
                                                            Select Card
                                                        </Button>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Paper
                                                        className={
                                                            classes.paper
                                                        }
                                                    >
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
                                                            className={
                                                                classes.button
                                                            }
                                                        >
                                                            Select Card
                                                        </Button>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Paper
                                                        className={
                                                            classes.paper
                                                        }
                                                    >
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
                                                            className={
                                                                classes.button
                                                            }
                                                        >
                                                            Select Card
                                                        </Button>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            {this.state.newCard ? (
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
                                                onClick={
                                                    this.handleDialogCardClose
                                                }
                                                color="primary"
                                            >
                                                Cancel
                                            </Button>
                                            {this.state.newCard && (
                                                <Button
                                                    onClick={
                                                        this
                                                            .handleDialogCardClose
                                                    }
                                                    color="primary"
                                                >
                                                    Confirm Changes
                                                </Button>
                                            )}
                                        </DialogActions>
                                    </Dialog>
                                </div>
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
                <Typography
                    style={{ marginTop: 15 }}
                    variant="title"
                    gutterBottom
                >
                    Billing address
                </Typography>
                <div>
                    <Typography>Address Line 1</Typography>
                    <Typography>Address Line 2</Typography>
                    <Typography>Address Line 3</Typography>
                    <Typography>City</Typography>
                    <Typography>Country, State</Typography>
                    <Typography>ZIP Code</Typography>

                    <Button
                        style={{ marginTop: 10 }}
                        onClick={this.handleDialogAddressOpen}
                    >
                        Change Shipping Address
                    </Button>
                    <Dialog
                        open={this.state.openDialogAddress}
                        onClose={this.handleDialogAddressClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">
                            Shipping addresses
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={24}>
                                <Grid item xs={4}>
                                    <Paper className={classes.paper}>
                                        <Typography>Address Line 1</Typography>
                                        <Typography>Address Line 2</Typography>
                                        <Typography>Address Line 3</Typography>
                                        <Typography>City</Typography>
                                        <Typography>Country, State</Typography>
                                        <Typography>ZIP Code</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        >
                                            Select Address
                                        </Button>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className={classes.paper}>
                                        <Typography>Address Line 1</Typography>
                                        <Typography>Address Line 2</Typography>
                                        <Typography>Address Line 3</Typography>
                                        <Typography>City</Typography>
                                        <Typography>Country, State</Typography>
                                        <Typography>ZIP Code</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        >
                                            Select Address
                                        </Button>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className={classes.paper}>
                                        <Typography>Address Line 1</Typography>
                                        <Typography>Address Line 2</Typography>
                                        <Typography>Address Line 3</Typography>
                                        <Typography>City</Typography>
                                        <Typography>Country, State</Typography>
                                        <Typography>ZIP Code</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        >
                                            Select Address
                                        </Button>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {this.state.newAddress ? (
                                <Grid container spacing={24}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="attention"
                                            name="attention"
                                            label="Attention"
                                            fullWidth
                                            autoComplete="attention"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="addresse"
                                            name="addresse"
                                            label="Addresse"
                                            fullWidth
                                            autoComplete="addresse"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="address1"
                                            name="address1"
                                            label="Address line 1"
                                            fullWidth
                                            autoComplete="address-line1"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="addiress2"
                                            name="addiress2"
                                            label="Address line 2"
                                            fullWidth
                                            autoComplete="address-line2"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="addiress3"
                                            name="addiress3"
                                            label="Address line 3"
                                            fullWidth
                                            autoComplete="address-line3"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="city"
                                            name="city"
                                            label="City"
                                            fullWidth
                                            autoComplete="address-level2"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="zip"
                                            name="zip"
                                            label="Zip / Postal code"
                                            fullWidth
                                            autoComplete="postal-code"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="country"
                                            name="country"
                                            label="Country"
                                            fullWidth
                                            autoComplete="country"
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleNewAddress}
                                    className={classes.button}
                                >
                                    New Address
                                </Button>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.handleDialogAddressClose}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={this.handleDialogAddressClose}
                                color="primary"
                            >
                                Confirm Changes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
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
