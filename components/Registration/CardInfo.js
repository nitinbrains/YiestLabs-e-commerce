import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

function CardInfo() {
    return (
        <React.Fragment>
            <Typography variant="title" gutterBottom>
                Credit Card Information
            </Typography>
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
                        id="expDate"
                        label="Expiration date"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        required
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default CardInfo;
