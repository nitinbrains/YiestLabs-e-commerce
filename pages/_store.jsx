import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "next/router";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { find, filter } from "lodash";
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
import SearchIcon from "@material-ui/icons/Search";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";

import SalesLib from "lib/SalesLib";
import NavBarUserSearchDrawerLayout from "components/NavBar/NavBarUserSearchDrawerLayout";
import LoadingIndicator from "components/UI/LoadingIndicator";
import YeastCard from "components/Store/Yeast/YeastCard";
import MainMenu from "components/Store/Menu/MainMenu";
import SubCat from "components/Store/Menu/SubCat";

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
const dataArr = [
    {
        id: 0,
        title: "CORE YEAST STRAINS",
        img: "static/images/categories/Category-core.jpg",
        page: "sub",
        value: 0,
        color: "#95b95e",
        subCategories: [
            {
                label: "ALE STRAINS",
                img: "static/images/categories/Category-ale.jpg",
                icon: "static/images/icons/Ale-icon.svg",
                value: 1,
                checked: true,
                salesCategory: 2,
                color: "#f68f32"
            },
            {
                label: "LARGER STRAINS",
                img: "static/images/categories/Category-lager.jpg",
                icon: "static/images/icons/Lager-icon.svg",
                value: 2,
                salesCategory: 2,
                checked: false,
                color: "#f7ac31"
            },
            {
                label: "WINE MEAD & CIDER STRAINS",
                img: "static/images/categories/Category-wine.jpg",
                icon: "static/images/icons/Wine-icon.svg",
                value: 3,
                salesCategory: 2,
                checked: false,
                color: "#af81ca"
            },
            {
                label: "DISTILLING STRAINS",
                img: "static/images/categories/Category-Distilling.jpg",
                icon: "static/images/icons/Distilling-icon.svg",
                value: 4,
                salesCategory: 10,
                checked: false,
                color: "#5251a1"
            },
            {
                label: "SPECIALIATY & BELGIAN STRAINS",
                img: "static/images/categories/Category-belgian.jpg",
                icon: "static/images/icons/Belgian-icon.svg",
                value: 5,
                salesCategory: 28,
                checked: false,
                color: "#5ed1d1"
            },
            {
                label: "WILD YIEST & BACTERIA",
                img: "static/images/categories/Category-wild.jpg",
                icon: "static/images/icons/Wildyeast-icon.svg",
                value: 6,
                salesCategory: 20,
                checked: false,
                color: "#daab77"
            },
            {
                label: "VAULT STRAINS",
                img: "static/images/categories/Category-vault.jpg",
                icon: "static/images/icons/Vault-icon.svg",
                value: 7,
                salesCategory: 23,
                checked: false,
                color: "#c4bab4"
            }
        ]
    },
    {
        title: "ENZYMES & NUTRIENTS",
        img: "static/images/categories/Category-ale.jpg",
        page: "sub",
        value: 8,
        id: 8,
        subCategories: [
            {
                img: "static/images/categories/Category-vault.jpg",
                icon: "static/images/icons/Ale-icon.svg",
                label: "Enzymes",
                value: 9,
                checked: false,
                color: "#95b95e"
            },
            {
                img: "static/images/categories/Category-vault.jpg",
                icon: "static/images/icons/Ale-icon.svg",
                label: "Nutrients",
                value: 10,
                checked: false,
                color: "#95b95e"
            }
        ]
    },
    {
        title: "ANALYTICAL LAB SERVICES",
        img: "static/images/categories/Category-belgian.jpg",
        page: "sub",
        // value:12,
        id: 12,
        color: "#95b95e"
    },
    {
        img: "static/images/categories/Category-wild.jpg",
        page: "sub",
        title: "LAB SUPPLIES",
        // value: 13,
        id: 13,
        checked: false,
        color: "#95b95e"
    },
    {
        title: "EDUCATION",
        img: "static/images/categories/Category-wine.jpg",
        page: "sub",
        // value:14,
        id: 14,
        color: "#95b95e"
    },
    {
        title: "GIFT SHOP",
        img: "static/images/categories/Category-vault.jpg",
        page: "sub",
        // value:15,
        id: 15,
        color: "#95b95e"
    }
];

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            searchText: "",
            selectedCategory: 0,
            selectedSubCategory: 1
        };
    }

    componentWillMount() {

        let {
            router: {
                query: { pageType, categoryId, subCategoryId }
            }
        } = this.props;

        let legendCategory, legendSubcategory;

        if(categoryId) {
            legendCategory = dataArr.find(m => m.id == categoryId);
            if(legendCategory) {
                if (subCategoryId && legendCategory.subCategories) {
                    legendSubcategory = legendCategory.subCategories.find(m => m.value == subCategoryId);
                    if (legendSubcategory) {
                        this.props.changeCategory({category: subCategoryId});
                        this.setState({selectedCategory: legendCategory, selectedSubCategory: legendSubcategory});
                    }
                    
                }
                else {
                    this.props.changeCategory({category: categoryId});
                    this.setState({selectedCategory: legendCategory, selectedSubCategory: legendSubcategory});
                }
                
            }
        }

        let isUserLoggedIn = sessionStorage.getItem("isLoggedin");
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if (isUserLoggedIn && userInfo) {
            this.props.setUserInfo({ userInfo });
        }
    }

    handleClickItem = item => {
        this.setState({ openDialog: true, item: item });
    };

    handleLeaveItem = () => {
        this.setState({ openDialog: false, item: null });
    };

    handleSearchCall = search => {
        const {
            router: { query }
        } = this.props;
        var { categoryId = 0, subCategoryId = 1, pageType } = query;

        this.setState({ selectedCategory: categoryId });
        this.setState({ selectedSubCategory: subCategoryId });
        this.setState({ searchText: search });

        if (search != "") {
            this.props.searchInventory({ category: categoryId, search });
        } else if (pageType === "cards" && search === "" && !subCategoryId) {
            this.props.changeCategory({ category: categoryId });
        } else {
            this.props.changeCategory({ category: subCategoryId });
        }
    };

    getCard = (item, i) => {
        if (this.props.store.isHomebrew) {
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

    render() {
        let {
            classes,
            router: {
                query: { pageType, categoryId, subCategoryId }
            },
            inventory: { isHomebrew }
        } = this.props;

        let legendCategory, legendCategoryTitle, legendCategoryColor, legendSubcategory, legendSubcategoryTitle, legendSubcategoryColor

        if(categoryId) {
            legendCategory = dataArr.find(m => m.id == categoryId);
            if(legendCategory) {
                if (subCategoryId && legendCategory.subCategories) {
                    legendSubcategory = legendCategory.subCategories.find(m => m.value == subCategoryId);
                    if (legendSubcategory) {
                        legendSubcategoryTitle = legendSubcategory.label;
                        legendSubcategoryColor = legendSubcategory.color;
                    }
                    
                }
                else {
                    legendCategoryTitle = legendCategory.title;
                    legendCategoryColor = legendCategory.color;
                }
                
            }
        }

        let pageContent = <MainMenu dataArr={dataArr} />;

        if (this.state.searchText != "") {
            let cardsNode = [];
            this.props.store.itemsToShow &&
                this.props.store.itemsToShow.map((item, i) => {
                    cardsNode.push(this.getCard(item, i));
                });
            pageContent = (
                <Grid className={classes.store} container spacing={24}>
                    {cardsNode}
                </Grid>
            );
        }

        let page = <MainMenu dataArr={dataArr}  />;
        if(pageType === 'sub'&& categoryId){
            let category = find(dataArr, {id:Number(categoryId)})
            page = <SubCat category={category}/>;
        } else if (pageType === 'cards' && categoryId && subCategoryId){
            let cardsNode = [];
            this.props.store.itemsToShow.map((item, i)=>{
                cardsNode.push(this.getCard(item, i))
            })
            
            page = <Grid className={classes.store} container spacing={24}>{cardsNode}</Grid>
        } else if (pageType === 'cards' && categoryId){
            let cardsNode = [];
            this.props.store.itemsToShow.map((item, i) => {
                cardsNode.push(this.getCard(item, i));
            });

            pageContent = (
                <Grid className={classes.store} container spacing={24}>
                    {cardsNode}
                </Grid>
            );
        } else if (pageType === "cards" && legendCategory) {
            let cardsNode = [];
            this.props.store.itemsToShow.map((item, i) => {
                cardsNode.push(this.getCard(item, i));
            });
            pageContent = (
                <Grid className={classes.store} container spacing={24}>
                    {cardsNode}
                </Grid>
            );
        }

        return (
            <NavBarUserSearchDrawerLayout inputVal={this.state.searchText} handleSearch={searchData => this.handleSearchCall(searchData)}>
                
                <Grid container spacing={8} id="professional-homebrew-switch">
                    <Grid item xs={6} dir="rtl">
                        <FormButton className={`form-button-small-size ${isHomebrew ? "form-button-active" : ""}`} text="Professional" onClick={() => this.props.switchToProfessional()} />
                    </Grid>
                    <Grid item xs={6} dir="ltr">
                        <FormButton className={`form-button-small-size ${isHomebrew ? "" : "form-button-active"}`} text="Homebrew" onClick={() => this.props.switchToHomebrew()} />
                    </Grid>
                </Grid>

                {legendCategoryTitle && pageType != "sub" ? (
                    <div className={classes.titDiv}>
                        <span className={classes.titSpan1} style={{ color: legendCategoryColor }} />
                        <span className={classes.titText}>{legendCategoryTitle}</span>
                        <span className={classes.titSpan1} style={{ color: legendCategoryColor }} />
                    </div>
                ) : null}

                {legendSubcategoryTitle ? (
                    <div className={classes.titDiv}>
                        <span className={classes.titSpan2} style={{ color: legendSubcategoryColor }} />
                        <span className={classes.titText}>{legendSubcategoryTitle}</span>
                        <span className={classes.titSpan2} style={{ color: legendSubcategoryColor }} />
                    </div>
                ) : null}

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
    titDiv: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        width: "88%",
        margin: "auto",
        marginBottom: "60px",
        marginTop: "70px"
    },
    titSpan1: {
        width: "42%",
        height: "2px",
        display: "block",
        borderWidth: "1px",
        borderStyle: "solid"
    },
    titSpan2: {
        width: "42%",
        height: "2px",
        display: "block",
        borderWidth: "1px",
        borderStyle: "solid"
    },
    titText: {
        width: "16%",
        textAlign: "center"
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
