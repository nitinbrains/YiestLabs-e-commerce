import React from 'react'
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Link from "next/link";

let dataArr = [
    {
        title: 'CORE YIEST STRAINS',
        img: '../../../static/images/categories/Category-core.jpg',
        page:'sub',
        id: 1
    },
    {
        title: 'ENZYMES & NUTRIENTS',
        img: '../../../static/images/categories/Category-ale.jpg',
        page:'sub',
        id: 2
    },
    {
        title: 'ANALYTICAL LAB SERVICES',
        img: '../../../static/images/categories/Category-wild.jpg',
        page:'sub',
        id: 3
    },
    {
        title: 'EDUCATION',
        img: '../../../static/images/categories/Category-wine.jpg',
        page:'sub',
        id: 4
    },
    {
        title: 'GIFT SHOP',
        img: '../../../static/images/categories/Category-vault.jpg',
        page:'sub',
        id: 5
    }
]

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
        margin: 'auto', width: '50%'
        , height: '100%', display: 'flex', alignItems: 'center', textAlign: 'center'
    }
});


const MainMenu = (props) => {
    const { classes } = props;

    return (
        <div style={{ marginTop: '5%' }}>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={16}>
                        {dataArr.map((v, i) => (
                            <Grid key={i} item item xs={2} spacing={8}>
                                <Link href={`/?page=${v.page}`}>
                                    <div style={{
                                        textAlign: 'center',
                                        backgroundImage: `url(${v.img})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        height: "490px",
                                        width: "100%"
                                    }}>
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
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(styles)(MainMenu);