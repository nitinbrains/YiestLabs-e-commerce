import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

function General() {
    return (
        <React.Fragment>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary">
                        GENERAL INFORMATION
                    </Typography>
                    <div
                        style={{
                            borderTop: "solid 1.5px",
                            borderColor: "#CCCCCC",
                            marginBottom: 10
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="companyName"
                        name="companyName"
                        label="Company name"
                        fullWidth
                        autoComplete="cname"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="email"
                        name="email"
                        label="E-mail"
                        fullWidth
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="phone"
                        name="phone"
                        label="Phone"
                        fullWidth
                        autoComplete="phone"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="pass"
                        name="pass"
                        label="Password"
                        fullWidth
                        autoComplete="pass"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="cPass"
                        name="cPass"
                        label="Confirm Password"
                        fullWidth
                        autoComplete="cpass"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="category"
                        label="Category"
                        select
                        fullWidth
                        autoComplete="category"
                    >
                        <MenuItem value={1}>Retailer</MenuItem>
                        <MenuItem value={2}>Individual</MenuItem>
                        <MenuItem value={3}>Proffesional Brewery</MenuItem>
                        <MenuItem value={4}>Proffesional Winery</MenuItem>
                        <MenuItem value={5}>Proffesional Destillery</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="orderFrom"
                        label="Order From"
                        select
                        fullWidth
                        autoComplete="orderFrom"
                    >
                        <MenuItem value={1}>US Only</MenuItem>
                        <MenuItem value={2}>
                            US & Copenhagen (For Europe, No Homebrew)
                        </MenuItem>
                        <MenuItem value={3}>
                            US & Hong Kong (For Asia, No Homebrew)
                        </MenuItem>
                        <MenuItem value={4}>
                            US, Copenhagen, and Hong Kong
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="acContact"
                        name="acContact"
                        label="Accounting Contact"
                        fullWidth
                        autoComplete="acContact"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="acPhone"
                        name="acPhone"
                        label="Accounting Phone Number"
                        fullWidth
                        autoComplete="acPhone"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default General;
