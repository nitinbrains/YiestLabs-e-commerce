import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

function Shipping() {
    return (
        <React.Fragment>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary">
                        SHIPPING ADDRESS
                    </Typography>
                    <div
                        style={{
                            borderTop: "solid 1.5px",
                            borderColor: "#CCCCCC",
                            marginBottom: 10
                        }}
                    />
                </Grid>
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
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                name="saveAsBilling"
                                value="yes"
                            />
                        }
                        label="Use this address as billing address"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Shipping;
