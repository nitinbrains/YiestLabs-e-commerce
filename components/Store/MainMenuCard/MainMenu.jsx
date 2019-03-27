import React, {Component} from 'react'
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Link from "next/link";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { inventoryActions } from 'appRedux/actions/inventoryActions';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import Router from 'next/router'
const styles = theme => ({
    root: {
        flexGrow: 1,
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
        width: 300,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    typoTitle: {
        fontWeight: 'bolder', textShadow: '0px 1px, 1px 0px, 1px 1px', letterSpacing: '2px'
    },
    divTitle: {
        margin: 'auto', width: 'auto', justifyContent:'center'
        , height: '100%', display: 'flex', alignItems: 'center', textAlign: 'center'
    }
});


class MainMenu extends Component {
    onChange=(item)=>{
        const {categoryId}=this.props;
        this.props.changeCategory({category:item.id});
        if(item.subCategories){
             Router.push(`/?pageType=${item.page}&&categoryId=${item.id}`)
        }else{
             Router.push(`/?pageType=cards&&categoryId=${item.id}`)
        }
    }
    render(){
        const { classes, dataArr } = this.props;
    return (
        <div style={{ marginTop: '5%' }}>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={16}>
                        {dataArr.map((v, i) => (
                            <Grid key={i} item item xs={12} sm={6} md={4} lg={2}  spacing={8}>
                                <div style={{
                                    textAlign: 'center',
                                    backgroundImage: `url(${v.img})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    height: "490px",
                                    width: "100%"
                                }} onClick={()=>this.onChange(v)}>
                                    <div className={classes.divTitle}>
                                        <Typography
                                            variant="title"
                                            color="secondary"
                                            className={classes.info}
                                            className={classes.typoTitle}
                                        >
                                            {v.title}
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
}

const mapStateToProps = state => {
    return {
        store: state.inventory,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(inventoryActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withStyles(styles, { withTheme: true })(MainMenu)));