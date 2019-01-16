import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Dialog from "@material-ui/core/Dialog";


import WLHelper from "../../../lib/WLHelper";
import WantSooner from "../../Cart/WantSooner/WantSooner";
import { orderActions } from "../../../redux/actions/orderActions";
import { cartActions } from '../../../redux/actions/cartActions';


class ItemPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            showWantSoonerDialog: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return {
            showWantSoonerDialog: nextProps.cart.showWantSooner,
        }
    }
    
    handleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    render() {
        const { classes, order } = this.props;
        return (
            <ExpansionPanel
                expanded={this.state.expanded}
                onChange={this.handleExpand}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color="primary" className={classes.heading}>
                        {this.props.item.Name}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={24}>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            style={{ textAlign: "center" }}
                        >
                            <img
                                className={classes.image}
                                src="/static/images/yeast.png"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={9}
                            container
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={4}>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    Location:
                                </Typography>
                                &nbsp;
                                <Typography
                                    color="primary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    {WLHelper.getWarehouse(
                                        this.props.item.Warehouse
                                    )}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    Ship Date:
                                </Typography>
                                &nbsp;
                                <Typography
                                    color="primary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    {this.props.item.shipDate.toDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    Delivery Date:
                                </Typography>
                                &nbsp;
                                <Typography
                                    color="primary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    {this.props.item.deliveryDate.toDateString()}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    Price:
                                </Typography>
                                &nbsp;
                                <Typography
                                    color="primary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    $ {this.props.item.pricePerUnit}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    Quantity:
                                </Typography>
                                &nbsp;
                                <Typography
                                    color="primary"
                                    variant="body1"
                                    style={{ display: "inline-block" }}
                                >
                                    {this.props.item.OrderDetailQty}
                                </Typography>
                            </Grid>
                            
                            <Grid container spacing={24}>
                                <Grid item xs={12} >
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                        style={{ display: "inline-block" }}
                                    >
                                        Details:
                                    </Typography>
                                    &nbsp;
                                </Grid>
                                <Grid item xs={12} >
                                    <Typography
                                        color="primary"
                                        variant="body1"
                                        style={{ display: "inline-block" }}
                                    >
                                        {this.props.item.details}
                                    </Typography>
                                </Grid> 
                            </Grid>                            


                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => { this.props.showWantSooner({activeTab : 'SimilarStrains'}) }}
                                    style={{marginRight:5, marginLeft:5}}
                                >
                                    Similar Strains
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => { this.props.showWantSooner({activeTab : 'AlternateSizes'}) }}
                                    style={{marginRight:5, marginLeft:5}}
                                >
                                    Alternate Sizes
                                </Button>

                                {order.selectedShippingOption ==
                                    "Custom" && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                            this.props.decrementShipDate(
                                                this.props.item
                                            )
                                        }
                                        style={{marginRight:5, marginLeft:5}}
                                    >
                                        Sooner
                                    </Button>
                                )}

                                {order.selectedShippingOption ==
                                    "Custom" && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                            this.props.incrementShipDate(
                                                this.props.item
                                            )
                                        }
                                        style={{marginRight:5, marginLeft:5}}
                                    >
                                        Later
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>

                <Dialog
                    open={this.state.showWantSoonerDialog}
                    onClose={() => {this.props.hideWantSooner()}}
                    aria-labelledby="form-dialog-title"
                    classes={{ paper: classes.dialogPaper }}
                >
                    <WantSooner {...this.props}/>
                </Dialog>
            </ExpansionPanel>
        );
    }
}

const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(17),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    image: {
        width: 200,
        marginRight: 10
    }
});

ItemPanel.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        order: state.order,
        cart: state.cart,
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...orderActions, ...cartActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ItemPanel));
