import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "next/router";
import _get from 'lodash/get';

import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { find, filter } from "lodash";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";

import NavBarUserSearchDrawerLayout from "components/NavBar/NavBarUserSearchDrawerLayout";
import LoadingIndicator from "components/UI/LoadingIndicator";
import YeastCard from "components/Store/Yeast/YeastCard";
import MainMenu from "components/Store/Menu/MainMenu";
import SubCat from "components/Store/Menu/SubCat";
import SalesLib from "lib/SalesLib";

import YeastDialog from "components/Store/Yeast/YeastDialog";
import EnzymesNutrientsCard from "components/Store/EnzymesNutrients/EnzymesNutrientsCard";
import EnzymesNutrientsDialog from "components/Store/EnzymesNutrients/EnzymesNutrientsDialog";
import ServicesCard from "components/Store/Services/ServicesCard";
import ServicesDialog from "components/Store/Services/ServicesDialog";
import LabSuppliesCard from "components/Store/LabSupplies/LabSuppliesCard";
import LabSuppliesDialog from "components/Store/LabSupplies/LabSuppliesDialog";
import EducationCard from "components/Store/Education/EducationCard";
import EducationDialog from "components/Store/Education/EducationDialog";
import GiftShopCard from "components/Store/GiftShop/GiftShopCard";
import GiftShopDialog from "components/Store/GiftShop/GiftShopDialog";
import HomebrewCard from "components/Store/Homebrew/HomebrewCard";
import FormButton from "components/Form/FormButton";
import AddHomebrewContainer from "components/Store/Homebrew/AddHomebrewContainer";
import SearchBarItems from "components/NavBar/SearchBarItems";
import { userActions } from "appRedux/actions/userActions";
import { messageActions } from "appRedux/actions/messageActions";

import withInventory from "hocs/inventory";
import isLoggedUser from "hocs/isLoggedUser";
import { filterItems } from "lib/InventoryUtils";

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            searchText: "",
            searchTextmobile:"",
            selectedMainCategory: null,
            selectedSubCategory: null,
            itemsToShow: [],
            isHomebrew: false
        };
    }

    componentWillMount() {
        const  { inventory: { items }} = this.props;

        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (_get(userInfo, 'id')) {
            this.props.setUserInfo({ userInfo });
        }

        this.setState({itemsToShow: items});
    }

    handleClickItem = item => {
        this.setState({ openDialog: true, item: item });
    };

    handleLeaveItem = () => {
        this.setState({ openDialog: false, item: null });
    };

    toggleHomebrew = (isHomebrew ) => {
        const { inventory: { items }, user } = this.props;
        const categoryFilter = (isHomebrew ? null : _get(this.state.selectedSubCategory, "value"));

        var itemsToShow = filterItems(items, categoryFilter, null, user, isHomebrew);
        this.setState({ isHomebrew, itemsToShow });
    }

    searchItem = searchText => {
        const { inventory: { items }, user } = this.props;
        const { isHomebrew } = this.state;

        if (searchText) {
            const itemsToShow = filterItems(items, null, searchText, user, isHomebrew);
            this.setState({ searchText, itemsToShow });
        }
    };


                       // To be refactored according to Dimitri's code for store

    // onValuechange=(e)=>{
    //     this.setState({
    //         [e.target.name]:e.target.value
    //     },()=>{
    //         let searchmobile=this.state.searchTextmobile;
    //         const {
    //             router: { query }
    //         } = this.props;
    //         var { categoryId = 0, subCategoryId = 1, pageType } = query;
    //         this.setState({ selectedCategory: categoryId });
    //         this.setState({ selectedSubCategory: subCategoryId });
    
    //         if (searchmobile != "") {
    //             this.props.searchInventory({ category: categoryId, search:searchmobile });
    //         } else if (pageType === "cards" && searchmobile === "" && !subCategoryId) {
    //             this.props.changeCategory({ category: categoryId });
    //         } else {
    //             this.props.changeCategory({ category: subCategoryId });
    //         }
    //     }) 
    //   }

    changeMainCategory = selectedMainCategory => {
        const { inventory: { items }, user } = this.props;
        const { isHomebrew } = this.state;

        const value = _.get(selectedMainCategory, "value");
        const subCategories = _.get(selectedMainCategory, "subCategories");

        var selectedSubCategory = null;

        if ( !subCategories ){
            selectedSubCategory = selectedMainCategory;
        }

        var itemsToShow = filterItems(items, value, null, user, isHomebrew);
        this.setState({ selectedMainCategory, selectedSubCategory, itemsToShow });
    }

    changeSubCategory = selectedSubCategory => {
        const { inventory: { items }, user } = this.props;
        const { isHomebrew } = this.state;

        const value = _.get(selectedSubCategory, "value");

        var itemsToShow = filterItems(items, value, null, user, isHomebrew);
        this.setState({ selectedSubCategory, itemsToShow });
    }


    getCard = (item, i) => {
        if (this.state.isHomebrew) {
            return <HomebrewCard key={i} item={item} />;
        } else if (item) {
            // Yeast (core + vault)
            if (SalesLib.SALESCATEGORY[0].includes(parseInt(item.salesCategory)) || item.salesCategory == 32) {
                return <YeastCard key={i} item={item} onClick={this.handleClickItem} />;
            }

            // Enzymes & Nutrients
            else if (SalesLib.SALESCATEGORY[8].includes(parseInt(item.salesCategory))) {
                return <EnzymesNutrientsCard key={i} item={item} onClick={this.handleClickItem} />;
            }

            // Services
            else if (SalesLib.SALESCATEGORY[11].includes(parseInt(item.salesCategory))) {
                return <ServicesCard key={i} item={item} onClick={this.handleClickItem} />;
            }

            // Lab Supplies
            else if (SalesLib.SALESCATEGORY[13].includes(parseInt(item.salesCategory))) {
                return <LabSuppliesCard key={i} item={item} onClick={this.handleClickItem} />;
            }

            // Education
            else if (SalesLib.SALESCATEGORY[14].includes(parseInt(item.salesCategory))) {
                return <EducationCard key={i} item={item} onClick={this.handleClickItem} />;
            }

            // Gift Shop
            else if (SalesLib.SALESCATEGORY[15].includes(parseInt(item.salesCategory))) {
                return <GiftShopCard key={i} item={item} onClick={this.handleClickItem} />;
            }
        }
    };

    getDialogContent = item => {
        if (item) {
            // Yeast
            if (SalesLib.SALESCATEGORY[0].includes(parseInt(item.salesCategory))) {
                return <YeastDialog item={item} closeDialog={this.handleLeaveItem} />;
            }

            // Enzymes & Nutrients
            else if (SalesLib.SALESCATEGORY[8].includes(parseInt(item.salesCategory))) {
                return <EnzymesNutrientsDialog item={item} closeDialog={this.handleLeaveItem} />;
            }

            // Services
            else if (SalesLib.SALESCATEGORY[11].includes(parseInt(item.salesCategory))) {
                return <ServicesDialog item={item} closeDialog={this.handleLeaveItem} />;
            }

            // Lab Supplies
            else if (SalesLib.SALESCATEGORY[13].includes(parseInt(item.salesCategory))) {
                return <LabSuppliesDialog item={item} closeDialog={this.handleLeaveItem} />;
            }

            // Education
            else if (SalesLib.SALESCATEGORY[14].includes(parseInt(item.salesCategory))) {
                return <EducationDialog item={item} closeDialog={this.handleLeaveItem} />;
            }

            // Gift Shop
            else if (SalesLib.SALESCATEGORY[15].includes(parseInt(item.salesCategory))) {
                return <GiftShopDialog item={item} closeDialog={this.handleLeaveItem} />;
            }
        }

        return <React.Fragment />;
    };

    categoryBack() {
      this.setState({searchText: null});
      if (!this.state.selectedSubCategory || this.state.selectedSubCategory == this.state.selectedMainCategory) {
          this.changeMainCategory(null);
      } else {
          this.changeSubCategory(null);
      }
    }

    render() {

        let { classes } = this.props;
        const {
            selectedMainCategory,
            selectedSubCategory,
            searchText,
            isHomebrew,
            itemsToShow
        } = this.state;

        var sectionTitle, sectionColor, pageContent;
        if ( selectedSubCategory || searchText || isHomebrew ) {

            let cardsNode = [];
            itemsToShow.map((item, i)=>{
                cardsNode.push(this.getCard(item, i))
            })

            pageContent = (
                <Grid className={classes.store} container spacing={24}>{cardsNode}</Grid>
            );

            if (selectedSubCategory) {
                sectionTitle = selectedSubCategory.label;
                sectionColor = selectedSubCategory.color;
            }
        }
        else if ( selectedMainCategory ) {
            pageContent = (
                <SubCat mainCategory={selectedMainCategory} changeSubCategory={this.changeSubCategory} />
            );

            sectionTitle = selectedMainCategory.label;
            sectionColor = selectedMainCategory.color;
        }
        else {
            pageContent = (
                <MainMenu changeMainCategory={this.changeMainCategory} />
            )
        }

        return (
            <NavBarUserSearchDrawerLayout inputVal={this.state.searchText} handleSearch={searchData => this.searchItem(searchData)}>

                  <Grid item xs={1} dir="ltr">
                        <FormButton className='back-button' text="Back" onClick={() => this.categoryBack()} />
                    </Grid>
                <Grid container spacing={8} id="professional-homebrew-switch">
                    <Grid item xs={6} dir="rtl">
                        <FormButton className={`form-button-small-size ${isHomebrew ? "form-button-active" : ""}`} text="Professional" onClick={() => this.toggleHomebrew(false)} />
                    </Grid>
                    <Grid item xs={6} dir="ltr">
                        <FormButton className={`form-button-small-size ${isHomebrew ? "" : "form-button-active"}`} text="Homebrew" onClick={() => this.toggleHomebrew(true)} />
                    </Grid>
                </Grid>

                <div className="searchmobile">
                     <div className={classes.searchIconmobile}>
                       <SearchIcon />
                     </div>
                <InputBase
                     placeholder="Search…"
                     name="searchTextmobile"
                     classes={{
                     root: classes.inputRootmobile,
                     input: classes.inputInputmobile,
                     }}
                     value={this.state.searchTextmobile}
                    //  onChange={e=>this.onValuechange(e)}
                   />
               </div>

                {sectionTitle && (
                    <div className={classes.sectionTitleDiv}>
                        <span className={classes.sectionTitleSpan} style={{ color: sectionColor }} />
                        <span className={classes.titText}>{sectionTitle}</span>
                        <span className={classes.sectionTitleSpan} style={{ color: sectionColor }} />
                    </div>
                )}

                {pageContent}

                <LoadingIndicator visible={this.props.loading.isLoading && this.props.loading.type == "loadingInventory"} label={"Loading Inventory"} />
                <Dialog open={this.state.openDialog} onClose={this.handleLeaveItem} aria-labelledby="form-dialog-title">
                    {this.getDialogContent(this.state.item)}
                </Dialog>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    store: {
        [theme.breakpoints.up("md")]: {
            paddingLeft: 50,
            paddingRight: 50
        },
        [theme.breakpoints.up("lg")]: {
            paddingLeft: 100,
            paddingRight: 100
        },
        [theme.breakpoints.up("xl")]: {
            paddingLeft: 150,
            paddingRight: 150
        }
    },
    sectionTitleDiv: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        width: "88%",
        margin: "auto",
        marginBottom: "60px",
        marginTop: "70px",
        marginTop: "70px",
        [theme.breakpoints.down('sm')]: {
            width: "100%"
        }
    },
    sectionTitleSpan: {
        width: "42%",
        height: "2px",
        display: "block",
        borderWidth: "1px",
        borderStyle: "solid"
    },
    titText: {
        width: "16%",
        textAlign: "center",
        [theme.breakpoints.down('xs')]: {
            fontSize:'12px',
            width: "38%"
        }
    },
    searchInput: {
        marginLeft: 10
    },
    search: {
        padding: "5px",
        marginTop: "1vw"
    },
    divider: {
        margin: "10px auto"
    },

    searchIconmobile: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRootmobile: {
        color: 'inherit',
        width: '100%',
      },
      inputInputmobile: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        // [theme.breakpoints.up('md')]: {
        //   width: 200,
        // },
      }
     
});

Store.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        messages: state.messages,
        loading: state.loading,
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...userActions, ...messageActions }, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(compose(withStyles(styles, { withTheme: true })(withInventory(Store))))
);
