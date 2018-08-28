import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class Store extends Component {
  render() {
    const { classes, theme } = this.props;

    return (
      <NavBarUserSearchDrawerLayout>
        <Card className={classes.card}>
          <CardBody>
            <Grid container spacing={24}>
              <Grid item xs={5}>
                <Typography variant="display1" color="textPrimary">
                  WLP001 CALIFORNIA ALE YEAST
                </Typography>
              </Grid>
              <Grid item xs container spacing={24} justify="flex-end">
                <Grid item>
                  <div className={classes.info}>
                    <Typography>68F - 73F | 20C - 23C</Typography>
                    <Typography>Fermentation Temp.</Typography>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.info}>
                    <Typography>Medium</Typography>
                    <Typography>Flocculation</Typography>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.info}>
                    <Typography>High</Typography>
                    <Typography>Alcohol Tol.</Typography>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.info}>
                    <Typography>73.0% - 80%</Typography>
                    <Typography>Attenuation</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={24}>
              <Grid item xs={5}>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  volutpat ut est sed convallis. Morbi dictum rhoncus risus, et
                  pellentesque ante dictum et. Maecenas ultricies dictum
                  consequat. Aliquam non facilisis metus. Duis eu sollicitudin
                  augue, ut ultrices augue. Aliquam eu metus nec turpis
                  tristique condimentum eget ut arcu. Duis quis ex nec orci
                  maximus elementum ac a erat. Nam massa leo, placerat sit amet
                  gravida ac, euismod non elit. Nam a ultrices dolor, nec mollis
                  purus.
                </Typography>
              </Grid>
              <Grid
                item
                xs
                container
                spacing={24}
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <FormControl>
                    <InputLabel>Packaging</InputLabel>
                    <Select value={1} name="packaging">
                      <MenuItem value={1}>Purepitch</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel>Pack</InputLabel>
                    <Select value={1} name="pack">
                      <MenuItem value={1}>Nano</MenuItem>
                      <MenuItem value={20}>1.5L</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField
                    id="quantity"
                    label="Quantity"
                    className={classes.quantity}
                    value={1}
                    type="number"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={24}>
              <Grid item xs={5} />
              <Grid
                item
                xs
                container
                spacing={24}
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <Button variant="contained">ADD TO CART</Button>
                </Grid>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </NavBarUserSearchDrawerLayout>
    );
  }
}

const styles = theme => ({
  card: {
    marginTop: -10
  },
  item: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  info: {
    alignItems: "center",
    padding: 5,
    backgroundColor: "#e4e4e4",
    textAlign: "center"
  },
  quantity: {
    width: 50
  }
});

Store.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Store);
