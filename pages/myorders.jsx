import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import PageContainer from '../components/UI/PageContainer';
import OrderDetails from "../components/MyOrders/OrderDetails";

class MyOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false
        }
    }

    handleOrderDetails = (item) => {
        this.setState({ openDialog: true });
    }

    handleLeaveOrderDetails = () => {
        this.setState({ openDialog: false });
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <PageContainer heading="MY ORDERS" id="cart-box">
                    
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <div className={classes.card}>
                            <div style={{position:'absolute', top:-15, left:20, backgroundColor:"#fafafa", paddingLeft:10, paddingRight:10}}>
                                <Typography
                                    variant="h6"
                                    color="textPrimary"
                                >
                                    Order # 2625434
                                </Typography>
                            </div>
                                <Grid item container>
                                    <Grid item>
                                        <img
                                            className={classes.image}
                                            src="/static/images/yeast.png"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm
                                        container
                                        direction="column"
                                        style={{marginTop:20}}
                                    >
                                        <Grid item xs>
                                            <Typography
                                                variant="overline"
                                                color="textPrimary"
                                            >
                                                Shiip date is 10/01/2018
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            container
                                            item
                                            spacing={24}
                                            direction="row"
                                        >
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={this.handleOrderDetails}
                                                >
                                                    Order Details
                                                </Button>
                                            </Grid>
                                            <Grid
                                                container
                                                item
                                                spacing={24}
                                                justify="flex-end"
                                            >
                                                <Grid item xs={12} md={2}>
                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                "#f28411",
                                                            borderRadius: 7,
                                                            padding: 2,
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            color="secondary"
                                                        >
                                                            Closed
                                                        </Typography>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>                   

                    <Dialog
                        open={this.state.openDialog}
                        onClose={this.handleLeaveOrderDetails}
                        maxWidth={'lg'}
                    >
                        <OrderDetails closeDialog={this.handleLeaveOrderDetails}/>
                    </Dialog>
                </PageContainer>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    container: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.up("md")]: {
            marginLeft: 50,
            marginRight: 50
        },
        [theme.breakpoints.up("lg")]: {
            marginLeft: 100,
            marginRight: 100
        },
        [theme.breakpoints.up("xl")]: {
            marginLeft: 150,
            marginRight: 150
        }
    },
    title: {
        backgroundColor: "#FF9933",
        padding: 5,
        marginBottom: theme.spacing.unit * 4,
        textAlign: "center",
        marginLeft: theme.spacing.unit * -4,
        marginRight: theme.spacing.unit * -4
    },
    hide: {
        display: "none"
    },
    card: {
        position:'relative',
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    },
    image: {
        width: 170,
        marginRight: 10,
        textAlign: "center"
    },
    quantity: {
        width: 50,
        marginRight: 20
    }
});

MyOrders.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MyOrders);
