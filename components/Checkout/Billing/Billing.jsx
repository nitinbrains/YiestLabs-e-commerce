import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import WLHelper from "../../../lib/WLHelper";
import SalesLib from "../../../lib/SalesLib";
import Utils from '../../../lib/Utils';

class Billing extends Component {
    constructor(props) {
        super(props);
        this.currentMonth = new Date().getMonth().toString();
        this.currentYear = new Date().getFullYear().toString();
        this.state = {
            terms: "",
            openDialogCard: false,
            openDialogAddress: false,
            addCard: false,
            newAddress: false,
            billing: {
                attn: "",
                addresee: "",
                address1: "",
                address2: "",
                address3: "",
                city: "",
                countryid: "US",
                zip: ""
            },
            card: {
                name: '',
                number: '',
                expireMonth: this.currentMonth,
                expireYear: this.currentYear,
            },
            expirationDates: Utils.getExpirationDates()
        };
    }


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

    addNewAddress = () => {
        this.props.addBillAddress(this.state.billing);
        this.handleDialogAddressClose();
    }

    selectBillAddress = (i) => {
        this.props.setBillAddress(i);
        this.handleDialogAddressClose();

    }

    addNewCard = () => {
        this.props.addCreditCard(this.state.card);
        this.handleDialogCardClose();
    }

    selectCard = (i) => {
        this.props.setCreditCard(i);
        this.handleDialogCardClose();
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="title" gutterBottom>
                    Payment
                </Typography>

                {WLHelper.getPaymentTerm(this.state.terms) == "Credit Card" || WLHelper.getPaymentTerm(this.state.terms) == "None" ? (
                    this.props.user.selectedCard.id ? (
                        <div>
                            <Typography>{this.props.user.selectedCard.name}</Typography>
                            <Typography>{this.props.user.selectedCard.number}</Typography>
                            <Typography>{this.props.user.selectedCard.expireMonth} / {this.props.user.selectedCard.expireYear}</Typography>
                            <Typography>{this.props.user.selectedCard.type}</Typography>
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
                                <DialogTitle id="form-dialog-title">Cards</DialogTitle>
                                <DialogContent>
                                <div className={classes.close}>
                                    <IconButton
                                        color="inherit"
                                        size="small"
                                        aria-label="Menu"
                                        onClick={this.handleDialogCardClose}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                                    <Grid container spacing={24}>

                                       {this.props.user.cards.map((card, i) => (
                                           <Grid item xs={12} sm={4}>
                                               <Paper className={classes.paper}>
                                                   <Typography variant="body2">{card.name}</Typography>
                                                   <Typography>{card.number}</Typography>
                                                   <Typography>{card.expireMonth} / {card.expireYear}</Typography>
                                                   <Button
                                                       variant="contained"
                                                       color="primary"
                                                       className={classes.button}
                                                   >
                                                       Select Card
                                                   </Button>
                                               </Paper>
                                           </Grid>
                                       ))}
                                   </Grid>


                                    {this.state.newCard ? (
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
                                                    <MenuItem
                                                        key={i}
                                                        value={date.year}
                                                    >
                                                        {date.year}
                                                    </MenuItem>
                                                );
                                            })}
                                            </TextField>

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
                                    <Button onClick={this.handleDialogCardClose} color="primary">
                                        Cancel
                                    </Button>
                                    {this.state.newCard && (
                                        <Button
                                            onClick={() => this.addNewCard()}
                                            color="primary"
                                        >
                                            Confirm Changes
                                        </Button>
                                    )}
                                </DialogActions>
                            </Dialog>
                        </div>
                    ) : (
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
                                    <MenuItem
                                        key={i}
                                        value={date.year}
                                    >
                                        {date.year}
                                    </MenuItem>
                                );
                            })}
                            </TextField>
                            <Grid item xs={12}>
                                <Button
                                    onClick={() => this.addNewCard()}
                                    color="primary"
                                >
                                    Add New Card
                                </Button>
                            </Grid>
                        </Grid>
                    )
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

                    {this.state.useCard &&
                        (this.props.user.selectedCard.id ? (
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
                                    <DialogTitle id="form-dialog-title">Cards</DialogTitle>
                                    <DialogContent>
                                    <div className={classes.close}>
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            aria-label="Menu"
                                            onClick={this.handleDialogCardClose}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                        <Grid container spacing={24}>
                                        {this.props.user.cards.map((card, i) => {
                                            <Grid item xs={12} sm={4}>
                                                <Paper className={classes.paper}>
                                                    <Typography variant="body2">
                                                        {card.number}
                                                    </Typography>
                                                    <Typography variant="body2">{card.name}</Typography>
                                                    <Typography>{card.number}</Typography>
                                                    <Typography>{card.expireMonth} / {card.expireYear}</Typography>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        className={classes.button}
                                                    >
                                                        Select Card
                                                    </Button>
                                                </Paper>
                                            </Grid>;
                                        })}
                                        </Grid>

                                        {this.state.newCard ? (
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
                                                        <MenuItem
                                                            key={i}
                                                            value={date.year}
                                                        >
                                                            {date.year}
                                                        </MenuItem>
                                                    );
                                                })}
                                                </TextField>
                                                <Grid item xs={12}>
                                                    <Button
                                                        onClick={() => this.addNewCard()}
                                                        color="primary"
                                                    >
                                                        Add New Card
                                                    </Button>
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
                                        <MenuItem
                                            key={i}
                                            value={date.year}
                                        >
                                            {date.year}
                                        </MenuItem>
                                    );
                                })}
                                </TextField>
                                <Grid item xs={12}>
                                    <Button
                                        onClick={() => this.addNewCard()}
                                        color="primary"
                                    >
                                        Add New Card
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                )}

                <Typography
                    style={{ marginTop: 15 }}
                    variant="title"
                    gutterBottom
                >
                    Billing Address
                </Typography>
                {this.props.user.billing.id ? (
                    <div>
                        <Typography>{this.props.user.billing.attn}</Typography>
                        <Typography>{this.props.user.billing.addressee}</Typography>
                        <Typography>{this.props.user.billing.address1}</Typography>
                        <Typography>{this.props.user.billing.address2}</Typography>
                        <Typography>{this.props.user.billing.address3}</Typography>
                        <Typography>{this.props.user.billing.city}</Typography>
                        <Typography>{this.props.user.billing.countryid}</Typography>
                        <Typography>{this.props.user.billing.zip}</Typography>

                        <Button
                            style={{ marginTop: 10 }}
                            onClick={this.handleDialogAddressOpen}
                        >
                            Change Billing Address
                        </Button>
                        <Dialog
                            open={this.state.openDialogAddress}
                            onClose={this.handleDialogAddressClose}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                Billing addresses
                            </DialogTitle>
                            <DialogContent>
                            <div className={classes.close}>
                                <IconButton
                                    color="inherit"
                                    size="small"
                                    aria-label="Menu"
                                    onClick={this.handleDialogAddressClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                                <Grid container spacing={24}>
                                {this.props.user.otherAddresses.map((address, i) => (
                                    <Grid item sm={4} xs={12}>
                                        <Paper className={classes.paper}>
                                            <Typography>{address.address1}</Typography>
                                            <Typography>{address.address2}</Typography>
                                            <Typography>{address.address3}</Typography>
                                            <Typography>{address.city}</Typography>
                                            <Typography>{address.countryid}</Typography>
                                            <Typography>{address.zip}</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                onClick={() => this.selectBillAddress(i)}
                                            >
                                                Select Address
                                            </Button>
                                        </Paper>
                                    </Grid>
                                ))}
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
                                                value={this.state.billing.attn}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            attn: event.target.value
                                                        }
                                                    })
                                                }
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
                                                value={this.state.billing.addressee}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            addressee: event.target.value
                                                        }
                                                    })
                                                }
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
                                                value={this.state.billing.address1}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            address1: event.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addiress2"
                                                name="addiress2"
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                                value={this.state.billing.address2}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            address2: event.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addiress3"
                                                name="addiress3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                                value={this.state.billing.address3}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            address3: event.target.value
                                                        }
                                                    })
                                                }
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
                                                value={this.state.billing.city}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            city: event.target.value
                                                        }
                                                    })
                                                }
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
                                                value={this.state.billing.zip}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            zip: event.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                required
                                                id="country"
                                                name="country"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                                value={this.state.billing.countryid}
                                                onChange={event =>
                                                    this.setState({
                                                        billing: {
                                                            ...this.state.billing,
                                                            countryid: event.target.value
                                                        }
                                                    })
                                                }
                                            >
                                            {SalesLib.COUNTRY_MAP.map((country, i) => {
                                                return (
                                                    <MenuItem
                                                        key={country.CountryCode}
                                                        value={country.CountryCode}
                                                    >
                                                        {country.CountryName}
                                                    </MenuItem>
                                                );
                                            })}
                                            </TextField>
                                        </Grid>
                                        <DialogActions>
                                            <Button
                                                onClick={() => this.setState({ newAddress: false })}
                                                color="primary"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => this.addNewAddress()}
                                                color="primary"
                                            >
                                                Confirm Changes
                                            </Button>
                                        </DialogActions>
                                    </Grid>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.setState({ newAddress: true })}
                                        className={classes.button}
                                    >
                                        New Address
                                    </Button>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="attention"
                                name="attention"
                                label="Attention"
                                fullWidth
                                autoComplete="attention"
                                value={this.state.billing.attn}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            attn: event.target.value
                                        }
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="addressee"
                                name="addressee"
                                label="Addressee"
                                fullWidth
                                autoComplete="addressee"
                                value={this.state.billing.addressee}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            addressee: event.target.value
                                        }
                                    })
                                }
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
                                value={this.state.billing.address1}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            address1: event.target.value
                                        }
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="addiress2"
                                name="addiress2"
                                label="Address line 2"
                                fullWidth
                                autoComplete="address-line2"
                                value={this.state.billing.address2}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            address2: event.target.value
                                        }
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="addiress3"
                                name="addiress3"
                                label="Address line 3"
                                fullWidth
                                autoComplete="address-line3"
                                value={this.state.billing.address3}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            address3: event.target.value
                                        }
                                    })
                                }
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
                                value={this.state.billing.city}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            city: event.target.value
                                        }
                                    })
                                }
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
                                value={this.state.billing.zip}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            zip: event.target.value
                                        }
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                required
                                id="country"
                                name="country"
                                label="Country"
                                fullWidth
                                autoComplete="country"
                                value={this.state.billing.countryid}
                                onChange={event =>
                                    this.setState({
                                        billing: {
                                            ...this.state.billing,
                                            countryid: event.target.value
                                        }
                                    })
                                }
                            >
                            {SalesLib.COUNTRY_MAP.map((country, i) => {
                                return (
                                    <MenuItem
                                        key={country.CountryCode}
                                        value={country.CountryCode}
                                    >
                                        {country.CountryName}
                                    </MenuItem>
                                );
                            })}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={() => this.addNewAddress()}
                                color="primary"
                            >
                                Add New Address
                            </Button>
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
    },
    close: { position: "absolute", right: 0, top: 0 }
});

Billing.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        checkout: state.checkout
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setBillAddress: index => dispatch({ type: "SET_BILL_ADDRESS", index }),
        addBillAddress: address => dispatch({ type: "ADD_BILL_ADDRESS", address }),
        setCreditCard: index => dispatch({type: "SET_CREDIT_CARD", index}),
        addCreditCard: card => dispatch({type: "ADD_CREDIT_CARD", card})
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Billing));
