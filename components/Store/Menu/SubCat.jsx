import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Link from "next/link";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose } from "redux";
import { inventoryActions } from "appRedux/actions/inventoryActions";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

class SubCat extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, mainCategory, changeSubCategory } = this.props;

        return (
            <div className={classes.divCat}>
                <Grid container className={classes.root} spacing={16}>
                    <Grid item xs={12}>
                        <Grid container className={classes.demo} justify="center" spacing={32}>
                            {mainCategory.subCategories.map(category => (
                                <Grid key={category.value} item xs={3} style={{ minWidth: "300px" }}>
                                    <div
                                        className={classes.imgBack}
                                        style={{
                                            textAlign: "center",
                                            backgroundImage: `url(${category.img})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "cover",
                                            height: "200px",
                                            width: "auto",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => changeSubCategory(category)}
                                    >
                                        <div className={classes.info} className={classes.divIcon} className={classes.divIcon}>
                                            <img className={classes.imgIcon} src={category.icon} />
                                            <Typography variant="subheading" color={category.label == "Vault Strains" ? "#000000" : "secondary"}
                                            className={classes.info} className={classes.titleTypo}>
                                                {category.label}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    card: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2,
        height: 230
    },
    info: {
        textAlign: "center"
    },
    name: {
        padding: 3,
        marginLeft: theme.spacing.unit * -2,
        marginRight: theme.spacing.unit * -2,
        textAlign: "center"
    },
    paper: {
        height: 490,
        width: 300
    },
    control: {
        padding: theme.spacing.unit * 2
    },
    titleTypo: {
        textShadow: "0px 1px, 1px 0px, 1px 1px",
        letterSpacing: "2px",
        textAlign: "left"
    },
    divIcon: {
        margin: "auto",
        width: "80%",
        padding: "0 10% 0 10%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        textAlign: "center"
    },
    imgIcon: {
        width: "30%",
        maxHeight: "55px",
        marginRight: "12px"
    },
    divCat: {
        width: "75%",
        margin: "-16px auto",
        marginTop: "8%"
    }
});

const mapStateToProps = state => {
    return {
        store: state.inventory
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(inventoryActions, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(compose(withStyles(styles, { withTheme: true })(SubCat)))
);
