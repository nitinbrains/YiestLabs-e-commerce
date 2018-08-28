import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";

const products = [
  { name: "California Ale Yeast", desc: "Purepitch", price: "$234.99" }
];
const addresses = [
  "1 Material-UI Drive",
  "Reactville",
  "Anytown",
  "99999",
  "USA"
];

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`
  },
  total: {
    fontWeight: "700"
  },
  title: {
    marginTop: theme.spacing.unit * 2
  }
});

function Items(props) {
  const { classes } = props;
  return (
    <React.Fragment>
      <Typography variant="title" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {products.map(product => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} secondary={product.desc} />
            <Typography variant="body2">{product.price}</Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subheading" className={classes.total}>
            $34.06
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

Items.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Items);
