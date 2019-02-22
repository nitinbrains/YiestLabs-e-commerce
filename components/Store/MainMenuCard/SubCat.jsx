import React from 'react'
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';

let subDataArr=[
    {
        img: '../../../static/images/categories/Category-core.jpg',
        title:'ALL CORE STRAINS',
        icon:'../../../static/images/icons/Ale-icon.svg',
        color: '#FFF',
        id:1
    },
    {  // Ale
        img: '../../../static/images/categories/Category-ale.jpg',
        title:'ALE STRAINS',
        icon: '../../../static/images/icons/Ale-icon.svg',
        color: "#FF9933",
        id:2
    },
     {  // Wild Yeast
        img: '../../../static/images/categories/Category-wild.jpg',
        title:'WILD YIEST & BACTERIA',
        icon: '../../../static/images/icons/Wildyeast-icon.svg',
        color: "#CC9966",
        id:3
    },
     {  // Lager
        img: '../../../static/images/categories/Category-lager.jpg',
        title:'LARGER STRAINS',
        icon: '../../../static/images/icons/Lager-icon.svg',
        color: "#FFCC33",
        id:4
    },
     {  // Wine
        img: '../../../static/images/categories/Category-wine.jpg',
        title:'WINE MEAD & CIDER STRAINS',
        icon: '../../../static/images/icons/Wine-icon.svg',
        color: "#9966CC",
        id:5
    },
     {  // Distilling
        img: '../../../static/images/categories/Category-Distilling.jpg',
        title:'DISTILLING STRAINS',
        icon: '../../../static/images/icons/Distilling-icon.svg',
        color: "#6666CC",
        id:6
    },
     {  // Belgian
        img: '../../../static/images/categories/Category-belgian.jpg',
        title:'SPECIALIATY & BELGIAN STRAINS',
        icon: '../../../static/images/icons/Belgian-icon.svg',
        color: "#66CCCC",
        id:7
    },
    { // Vault
        img: '../../../static/images/categories/Category-vault.jpg',
        title:'VAULT STRAINS',
        icon: '../../../static/images/icons/Vault-icon.svg',
        color: "#B3B3B3",
        id:8
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
  });


 const SubCat=(props)=> {
 const { classes } = props;
    
  return (
    <div>
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={32}>
            {subDataArr.map((v,i)=>(
              <Grid key={i} item xs={3} >
                <div  style={{textAlign:'center',
                           backgroundImage: `url(${v.img})`,
                           backgroundRepeat: "no-repeat",
                           backgroundSize: "cover",
                           height: "230px",
                           width: "100%"
                           }}>
                           <div style={{margin:'auto',width:'80%',paddingLeft:'15%'
                           ,height:'100%',display:'flex',alignItems:'center',textAlign:'center'}} className={classes.info}>
                           <img style={{width:'20%', height:'50%',marginRight:'10px'}} src={v.icon}></img>
                <Typography
                  variant="headline"
                  color="secondary"
                  className={classes.info}
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

export default withStyles(styles)(SubCat);