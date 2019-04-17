
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withInventory from "hocs/inventory";
import Router from 'next/router';
import { compose } from "redux";
import { withRouter } from "next/router";
import Link from "next/link";
import axios from 'axios';


import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import DialogContent from "@material-ui/core/DialogContent";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import LoadingIndicator from '../components/UI/LoadingIndicator';
import { cartActions } from "appRedux/actions/cartActions";
import { inventoryActions } from "appRedux/actions/inventoryActions";
import { parseAvailabilityResults } from "../lib/InventoryUtils";
import { IN_STOCK, OUT_OF_STOCK } from "../lib/Constants";

import WLHelper from "lib/WLHelper";



const YeastElements = {
    "2": {
        img: 'static/images/categories/Category-core.jpg',
        color: '#FFF'
    },
    "3": {  // Ale
        img: 'static/images/categories/Category-ale.jpg',
        icon: 'static/images/icons/Ale-icon.svg',
        color: "#FF9933"
    },
    "4": {  // Wild Yeast
        img: 'static/images/categories/Category-wild.jpg',
        icon: 'static/images/icons/wildyeast-icon.svg',
        color: "#CC9966"
    },
    "5": {  // Lager
        img: 'static/images/categories/Category-lager.jpg',
        icon: 'static/images/icons/Lager-icon.svg',
        color: "#FFCC33"
    },
    "6": {  // Wine
        img: 'static/images/categories/Category-wine.jpg',
        icon: 'static/images/icons/wine-icon.svg',
        color: "#9966CC"
    },
    "7": {  // Distilling
        img: 'static/images/categories/Category-Distilling.jpg',
        icon: 'static/images/icons/Distilling-icon.svg',
        color: "#6666CC"
    },
    "8": {  // Belgian
        img: 'static/images/categories/Category-belgian.jpg',
        icon: 'static/images/icons/Belgian-icon.svg',
        color: "#66CCCC"
    },
    "32": { // Vault
        img: 'static/images/categories/Category-vault.jpg',
        icon: 'static/images/icons/vault-icon.svg',
        color: "#B3B3B3"
    }
}

function getIcon(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].icon;
    }
    catch(error) {
        console.log('error', salesCategory, error);
    }
}

function getColor(salesCategory) {
    try {
        return YeastElements[parseInt(salesCategory)].color;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}



class Yiestparam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availability: null,
        };
    }

    componentDidMount(){
        
    }

    moveToCalculator = () => {
        Router.push(`/calculator?id=${this.item.volID[0]}`);
    }


    render() {
        const{classes}=this.props;
        const {
            router: { query }
        } = this.props;
        let { item } = query;
        const{items}=this.props.inventory
        let filteredItem=items.find(v=>v.partNum===item)
        console.log(filteredItem,'filtereditem')
        console.log(filteredItem && filteredItem.Name,'pppppppppp')
        return (
            <React.Fragment>
                 <Grid
                        item
                        container
                        xs
                        style={{
                            display: "flex",
                            marginTop: -10,
                            marginBottom: 20
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item>
                            <Typography variant="h5">
                                {filteredItem && filteredItem.Name}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs={2} md={1}>
                            <div
                                className={classes.circle}
                                style={{ backgroundColor: getColor(filteredItem && filteredItem.salesCategory)}}
                            >
                                <img
                                    src={getIcon(filteredItem && filteredItem.salesCategory)}
                                    height="20"
                                />
                            </div>
                        </Grid>
                        <Grid
                            item
                            container
                            xs={10}
                            md={11}
                            direction={"row"}
                            spacing={4}
                        >
                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography className="dialogVariant" >Attenuation:</Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                        style={{ color: getColor(filteredItem && filteredItem.salesCategory)}}
                                    >
                                        {filteredItem && filteredItem.attenuation}
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography  className="dialogVariant">Flocculation: </Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                        style={{ color: getColor(filteredItem && filteredItem.salesCategory)}}
                                    >
                                        {filteredItem && filteredItem.flocculation}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography  className="dialogVariant">Alcohol Tol.: </Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                         style={{ color: getColor(filteredItem && filteredItem.salesCategory)}}
                                    >
                                        {filteredItem && filteredItem.alcoholTol}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ display: "flex" }}>
                                    <Typography  className="dialogVariant">Fermentation Temp: </Typography>
                                    &nbsp;
                                    <Typography
                                     className="dialogVariant"
                                         style={{ color: getColor(filteredItem && filteredItem.salesCategory)}}
                                    >
                                        {filteredItem && filteredItem.optFermentTempF |
                                           filteredItem &&  filteredItem.optFermentTempC}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>

                     <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        className={classes.description}
                    >
                        <Grid item>
                            <Typography>{filteredItem && filteredItem.Description}</Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        style={{ marginTop: 20, color:  '#f68f32'}}
                    >
                        <Button onClick={this.moveToCalculator}>
                            <Grid item>
                                <Typography style={{ color: getColor(filteredItem && filteredItem.salesCategory) }}>How much do I need?</Typography>
                            </Grid>
                        </Button>
                    </Grid>

                    <Grid
                        item
                        container
                        style={{ marginTop: 5 }}
                        direction={"row"}
                        justify="center"
                    >
                        <Grid
                            item
                            xs
                            container
                            spacing={24}
                            direction={"row"}
                            justify="center"
                        >
                            {availability ?
                                <Typography className="flex-center" style={{color: availability == IN_STOCK ? "green" : "red"}}><p style={{textAlign:'center'}}>{availability}</p></Typography>
                            :
                                <Grid
                                    item
                                    xs
                                    container
                                    spacing={24}
                                    direction={"row"}
                                    justify="center"
                                >
                                    {/* <Grid item> */}
                                        <div className={classes.buttons}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.checkAvailability}
                                                className={classes.button}
                                            >
                                                Get Availability
                                            </Button>
                                        </div>
                                    {/* </Grid> */}
                                </Grid>
                            }
                        </Grid>
                    </Grid>
            </React.Fragment>
        );
    }
}


const styles = theme => ({
    info: {
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    },
    circle: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        padding: 5,
        width: 37,
        height: 37,
        [theme.breakpoints.down("sm")]: {
            width: 30,
            height: 30,
        }
    },
    formFields:{
        display:'block',
         marginTop:'15px',
        // marginLeft:'0px',
        [theme.breakpoints.down("xs")]: {
            display:'flex',
            justifyContent:'center',
            marginTop:'15px',
            marginLeft:'42px',
        }
    },
    buttons: {
        display: "flex",
        justifyContent: "center"
    },
    addButton:{
        display: "flex",
        justifyContent: "center",
        marginLeft:'42px',
        marginTop:'14px',
        // [theme.breakpoints.down("xs")]: {
        //     marginLeft:'16px',
        // }


    },
    button: {
        marginTop: theme.spacing.unit,
    },
    description:{
        textAlign:'center',
        marginTop:20
    },
    paddingFix:{
         paddingLeft:'unset',
         marginTop:'5px',
         [theme.breakpoints.between("sm", "xl")]: {
            paddingLeft:'100px',
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft:'0px',
        },
        
},
    close: { position: "absolute", right: 0, top: 0 },
    form:{
        width:'100%',
    }
});

const mapStateToProps = state => {
    return {
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...inventoryActions, ...cartActions}, dispatch);

    export default withRouter(
        connect(
            mapStateToProps,
            mapDispatchToProps
        )(compose(withStyles(styles, { withTheme: true })(withInventory(Yiestparam))))
    );
    




