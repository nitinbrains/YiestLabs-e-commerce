import React, {Component} from 'react'
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Link from "next/link";
import {withRouter} from 'next/router'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { compose } from "redux";
import { inventoryActions } from 'appRedux/actions/inventoryActions';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
// import YeastCard from "components/Store/Yeast/YeastCard";

// let subDataArr = [

//   {  // Ale
//     img: 'static/images/categories/Category-ale.jpg',
//     title: 'ALE STRAINS',
//     icon: 'static/images/icons/Ale-icon.svg',
//     color: "#FF9933",
//     _id: 1
//   },
//   {  // Lager
//     img: 'static/images/categories/Category-lager.jpg',
//     title: 'LARGER STRAINS',
//     icon: 'static/images/icons/Lager-icon.svg',
//     color: "#FFCC33",
//     _id: 2
//   },
//   {  // Wine
//     img: 'static/images/categories/Category-wine.jpg',
//     title: 'WINE MEAD & CIDER STRAINS',
//     icon: 'static/images/icons/Wine-icon.svg',
//     color: "#9966CC",
//     _id: 3
//   },
//   {  // Distilling
//     img: 'static/images/categories/Category-Distilling.jpg',
//     title: 'DISTILLING STRAINS',
//     icon: 'static/images/icons/Distilling-icon.svg',
//     color: "#6666CC",
//     _id: 4
//   },
//   {  // Belgian
//     img: 'static/images/categories/Category-belgian.jpg',
//     title: 'SPECIALIATY & BELGIAN STRAINS',
//     icon: 'static/images/icons/Belgian-icon.svg',
//     color: "#66CCCC",
//     _id: 5
//   },
//   {  // Wild Yeast
//     img: 'static/images/categories/Category-wild.jpg',
//     title: 'WILD YIEST & BACTERIA',
//     icon: 'static/images/icons/Wildyeast-icon.svg',
//     color: "#CC9966",
//     _id: 6
//   },
//   { // Vault
//     img: 'static/images/categories/Category-vault.jpg',
//     title: 'VAULT STRAINS',
//     icon: 'static/images/icons/Vault-icon.svg',
//     color: "#B3B3B3",
//     _id: 7
//   },
//   {  // All core
//     img: 'static/images/categories/Category-core.jpg',
//     title: 'ALL CORE STRAINS',
//     icon: 'static/images/icons/Ale-icon.svg',
//     color: '#FFF',
//     _id: 8
//   }
// ]

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

class SubCat extends Component {
  constructor(props) {
    super(props);
    this.state={
  //     categories: [{
  //       label: "Yeast",
  //       value: 0,
  //       checked: true,
  //       subCategories: [{
  //           label: 'ALE STRAINS',
  //           img: 'static/images/categories/Category-ale.jpg',
  //           icon: 'static/images/icons/Ale-icon.svg',
  //           value: 1,
  //           checked: true
  //       }, {
  //           label: 'LARGER STRAINS',
  //           img: 'static/images/categories/Category-lager.jpg',
  //           icon: 'static/images/icons/Lager-icon.svg',
  //           value: 2,
  //           checked: false
  //       }, {
  //           label: 'WINE MEAD & CIDER STRAINS',
  //           img: 'static/images/categories/Category-wine.jpg',
  //           icon: 'static/images/icons/Wine-icon.svg',
  //           value: 3,
  //           checked: false
  //       }, {
  //           label: 'DISTILLING STRAINS',
  //           img: 'static/images/categories/Category-Distilling.jpg',
  //           icon: 'static/images/icons/Distilling-icon.svg',
  //           value: 4,
  //           checked: false
  //       }, {
  //           label: 'SPECIALIATY & BELGIAN STRAINS',
  //           img: 'static/images/categories/Category-belgian.jpg',
  //           icon: 'static/images/icons/Belgian-icon.svg',
  //           value: 5,
  //           checked: false
  //       }, {
  //           label:  'WILD YIEST & BACTERIA',
  //           img: 'static/images/categories/Category-wild.jpg',
  //           icon: 'static/images/icons/Wildyeast-icon.svg',
  //           value: 6,
  //           checked: false
  //       }, {
  //           label: 'VAULT STRAINS',
  //           img: 'static/images/categories/Category-vault.jpg',
  //           icon: 'static/images/icons/Ale-icon.svg',
  //           value: 7,
  //           checked: false
  //       },
  //       {
  //         img: 'static/images/categories/Category-core.jpg',
  //         label: 'ALL CORE STRAINS',
  //         icon: 'static/images/icons/Ale-icon.svg',
  //         value:1,
  //         checked: false
  //       }]
  //   }, {
  //       label: "Enzymes & Nutrients",
  //       value: 8,
  //       checked: false,
  //       subCategories: [{
  //           label: "Enzymes",
  //           value: 9,
  //           checked: false
  //       }, {
  //           label: "Nutrients",
  //           value: 10,
  //           checked: false
  //       }]
  //   }, {
  //       label: "Analytical Lab Services",
  //       value: 12,
  //       checked: false
  //   }, {
  //       label: "Lab Supplies",
  //       value: 13,
  //       checked: false
  //   }, {
  //       label: "Education",
  //       value: 14,
  //       checked: false
  //   }, {
  //       label: "Gift Shop",
  //       value: 15,
  //       checked: false
  //   },
  //  ],
    selectedCategory: 0,
    selectedSubCategory: 1,
    searchText: ''
    }
  }

  onChange=(item)=>{
    this.props.changeCategory({category:item.value});
}

  render(){
    const { classes, category, router:{query}} = this.props;
    let {pageType, categoryId, subCategoryId} = query;
  return (
    <div className={classes.divCat}>
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={32}>
            {category.subCategories.map((v, i) => (
              <Grid key={i} item xs={3} >
               <Link href={`/?pageType=cards&&categoryId=${categoryId}&&subCategoryId=${v.value}&&tit=${v.label}`}>
                <div className={classes.imgBack} style={{
                  textAlign: 'center',
                  backgroundImage: `url(${v.img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  height: "200px",
                  width: 'auto',
                  
                }} onClick={()=>this.onChange(v)}>
                  <div className={classes.info} className={classes.divIcon}
                    className={classes.divIcon} >
                    <img className={classes.imgIcon} src={v.icon}></img>
                    <Typography
                      variant="subheading"
                      color="secondary"
                      className={classes.info}
                      className={classes.titleTypo}
                    >
                      {v.label}
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
}}

const mapStateToProps = state => {
  return {
      store: state.inventory,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(inventoryActions, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(compose(
  withStyles(styles, { withTheme: true })(
      SubCat
  )
))
)
