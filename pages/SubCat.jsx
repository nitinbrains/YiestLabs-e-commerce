import React from 'react'
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Link from "next/link";

let subDataArr = [

  {  // Ale
    img: '../../../static/images/categories/Category-ale.jpg',
    title: 'ALE STRAINS',
    icon: '../../../static/images/icons/Ale-icon.svg',
    color: "#FF9933",
    _id: 1
  },
  {  // Lager
    img: '../../../static/images/categories/Category-lager.jpg',
    title: 'LARGER STRAINS',
    icon: '../../../static/images/icons/Lager-icon.svg',
    color: "#FFCC33",
    _id: 2
  },
  {  // Wine
    img: '../../../static/images/categories/Category-wine.jpg',
    title: 'WINE MEAD & CIDER STRAINS',
    icon: '../../../static/images/icons/Wine-icon.svg',
    color: "#9966CC",
    _id: 3
  },
  {  // Distilling
    img: '../../../static/images/categories/Category-Distilling.jpg',
    title: 'DISTILLING STRAINS',
    icon: '../../../static/images/icons/Distilling-icon.svg',
    color: "#6666CC",
    _id: 4
  },
  {  // Belgian
    img: '../../../static/images/categories/Category-belgian.jpg',
    title: 'SPECIALIATY & BELGIAN STRAINS',
    icon: '../../../static/images/icons/Belgian-icon.svg',
    color: "#66CCCC",
    _id: 5
  },
  {  // Wild Yeast
    img: '../../../static/images/categories/Category-wild.jpg',
    title: 'WILD YIEST & BACTERIA',
    icon: '../../../static/images/icons/Wildyeast-icon.svg',
    color: "#CC9966",
    _id: 6
  },
  { // Vault
    img: '../../../static/images/categories/Category-vault.jpg',
    title: 'VAULT STRAINS',
    icon: '../../../static/images/icons/Vault-icon.svg',
    color: "#B3B3B3",
    _id: 7
  },
  {  // All core
    img: '../../../static/images/categories/Category-core.jpg',
    title: 'ALL CORE STRAINS',
    icon: '../../../static/images/icons/Ale-icon.svg',
    color: '#FFF',
    _id: 8
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
  titleTypo: {
    textShadow: '0px 1px, 1px 0px, 1px 1px', letterSpacing: '2px', textAlign: 'left'
  },
  divIcon: {
    margin: 'auto', width: '80%', padding: '0 10% 0 10%'
    , height: '100%', display: 'flex', alignItems: 'center', textAlign: 'center'
  },
  imgIcon: {
    width: '30%',maxHeight: '55px',
    marginRight: '12px'
  },
  divCat: {
    width: '75%',
    margin: '-16px auto', marginTop: '8%'
  }
});


const SubCat = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divCat}>
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={32}>
            {subDataArr.map((v, i) => (
              <Grid key={i} item xs={3} >
               <Link href={`/?_id=${v._id}`}>
                <div className={classes.imgBack} style={{
                  textAlign: 'center',
                  backgroundImage: `url(${v.img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  height: "200px",
                  width: 'auto',
                  
                }}>
                  <div className={classes.info} className={classes.divIcon}
                    className={classes.divIcon} >
                    <img className={classes.imgIcon} src={v.icon}></img>
                    <Typography
                      variant="subheading"
                      color="secondary"
                      className={classes.info}
                      className={classes.titleTypo}
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

export default withStyles(styles)(SubCat);