import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

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
import MainMenu from "components/Store/MainMenuCard/MainMenu";
import SubCat from "components/Store/MainMenuCard/SubCat";
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

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialog: false
        };
    }

    componentWillMount() {
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
    getCard = (item, i) => {
        if (this.props.store.isHomebrew) {
            return <HomebrewCard key={i} item={item} />;
        } else if (item) {
            // Yeast
            if (SalesLib.SALESCATEGORY[0].includes(parseInt(item.salesCategory))) {
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
        return <div />;
    };

    render() {
        const { classes, theme, message, messages } = this.props;
        let isHomebrew = this.props.store.isHomebrew;

        // isHomebrew = true
        return (
            <NavBarUserSearchDrawerLayout>
                <MainMenu/>
                <SubCat/>
                <LoadingIndicator visible={this.props.loading.isLoading && this.props.loading.type == "loadingInventory"} label={"Loading Inventory"} />
                <Grid container spacing={8} id="professional-homebrew-switch">
                    <Grid item xs={6} dir="rtl">
                        <FormButton className={`form-button-small-size ${isHomebrew ? "form-button-active" : ""}`} text="Professional" onClick={() => this.props.switchToProfessional()} />
                    </Grid>
                    <Grid item xs={6} dir="ltr">
                        <FormButton className={`form-button-small-size ${isHomebrew ? "" : "form-button-active"}`} text="Homebrew" onClick={() => this.props.switchToHomebrew()} />
                    </Grid>
                </Grid>
                {!isHomebrew && (
                    <div>
                        <Divider variant="inset" className={classes.divider} />
                        <Grid container spacing={24} className={classes.store}>
                            <SearchBarItems />
                        </Grid>
                        <Divider variant="inset" className={classes.divider} />
                    </div>
                )}
                {isHomebrew ? (
                    <AddHomebrewContainer items={this.props.store.itemsToShow} />
                ) : (
                    <Grid className={classes.store} container spacing={24}>
                        {this.props.store.itemsToShow.map((item, i) => {
                            return this.getCard(item, i);
                        })}

                        <Dialog open={this.state.openDialog} onClose={this.handleLeaveItem} aria-labelledby="form-dialog-title">
                            {this.getDialogContent(this.state.item)}
                        </Dialog>
                    </Grid>
                )}
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
        loading: state.loading
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...userActions, ...messageActions }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(compose(
    withStyles(styles, { withTheme: true })(
        withInventory(Store)
    )
));
