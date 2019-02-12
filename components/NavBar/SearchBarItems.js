import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from "@material-ui/core/Checkbox";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from "@material-ui/core/Grid";


import { inventoryActions } from 'appRedux/actions/inventoryActions';

class SearchBarItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [{
                label: "Yeast",
                value: 0,
                checked: true,
                subCategories: [{
                    label: "Ale Strains",
                    value: 1,
                    checked: true
                }, {
                    label: "Lager Strains",
                    value: 2,
                    checked: false
                }, {
                    label: "Wine/Mead/Cider Strains",
                    value: 3,
                    checked: false
                }, {
                    label: "Distilling Strains",
                    value: 4,
                    checked: false
                }, {
                    label: "Specialty/Belgian Strains",
                    value: 5,
                    checked: false
                }, {
                    label: "Wild Yeast & Bacteria Strains",
                    value: 6,
                    checked: false
                }, {
                    label: "Vault Strains",
                    value: 7,
                    checked: false
                }]
            }, {
                label: "Enzymes & Nutrients",
                value: 8,
                checked: false,
                subCategories: [{
                    label: "Enzymes",
                    value: 9,
                    checked: false
                }, {
                    label: "Nutrients",
                    value: 10,
                    checked: false
                }]
            }, {
                label: "Analytical Lab Services",
                value: 12,
                checked: false
            }, {
                label: "Lab Supplies",
                value: 13,
                checked: false
            }, {
                label: "Education",
                value: 14,
                checked: false
            }, {
                label: "Gift Shop",
                value: 15,
                checked: false
            }],
            selectedCategory: 0,
            selectedSubCategory: 1,
            searchText: ''
        };

    }

    /*
     * Change main category
     *
     * cannot unselect a category - can only switch to a new one
     */
    handleCategory = (e) => {
        this.setState({
            selectedCategory: e.target.value
        },()=>{
        this.changeCategory();
        })
    }

    changeCategory = () => {
        let category = this.state.selectedCategory;
        let subCategories = this.state.selectedSubCategory;
        let categories = this.state.categories;

        categories.map((data,i)=>{
            if(data.value == category){
                data.checked = true;
            } else {
                data.checked = false;
                if(data.subCategories){
                    data.subCategories.map((value)=>{
                        return value.checked == false;
                    })
                }
            }
        })
        this.setState({categories:categories})
        this.props.changeCategory({category});
    }
    /*
     * Change sub category
     *
     * If subcategory is unselected, main category becomes category selected
     */

    handleSubCategory = (e) => {
        this.setState({
            selectedSubCategory: e.target.value
        },()=>{
            this.changeSubCategory()
        })
    }

    changeSubCategory = () => {
        let mainCategory = this.state.selectedCategory;
        let category = this.state.selectedSubCategory;
        let categories = this.state.categories;

        categories.map((data,i)=>{
            if(data.value == mainCategory){
                if(data.subCategories){
                    data.subCategories.map((value)=>{
                        if(value.value === category){
                            value.checked = true
                        }
                    })
                }
            } else {
                data.checked = false;
                if(data.subCategories){
                    data.subCategories.map((value)=>{
                        return value.checked == false;
                    })
                }
            }
        })
        this.setState({categories:categories})
        this.props.changeCategory({category});
    }


    handleSearch = (e) => {
        this.setState({
            searchText: e.target.value
        },()=>{
            
            let search = this.state.searchText;
            let category = this.state.selectedCategory;
            if(search != ''){
                this.props.searchInventory({category, search})
            } else {
                this.props.changeCategory({category})
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={24} >
            <Grid item xs={4}  >
                <div className={classes.search} >
                    <SearchIcon />
                    <TextField
                        id="search"
                        placeholder="Search"
                        type="search"
                        value={this.state.searchText}
                        onChange={this.handleSearch}
                        className={classNames(classes.searchInput)}
                    />
                </div>
            </Grid>
            <Grid item xs={4}>
            <FormControl className={classes.formControl,classes.category} style={{width:'80%'}} >
                <InputLabel htmlFor="age-simple">Category</InputLabel>
                <Select
                    value={ this.state.selectedCategory }
                    onChange={this.handleCategory}
                    
                >
                    {
                    this.state.categories.map((mainCategory, i) => {
                      return(
                            <MenuItem value={mainCategory.value}>
                                <em> {mainCategory.label} </em>
                            </MenuItem>
                        )
                    })
                    }


                </Select>
            </FormControl>
            </Grid>
            {
            (this.state.selectedCategory === 0 || this.state.selectedCategory == 8) ? (
            <Grid item xs={4} >
            <FormControl className={classes.formControl, classes.category} style={{width:'80%'}} >
                <InputLabel htmlFor="age-simple"> Sub Category</InputLabel>
                <Select
                    value={ this.state.selectedSubCategory }
                    onChange={this.handleSubCategory}
                    
                >
                    {
                    this.state.categories.map((mainCategory, i) => {
                        if(mainCategory.subCategories && mainCategory.value == this.state.selectedCategory ){
                          return  mainCategory.subCategories.map((subCategory, j) => {
                            return(
                                    <MenuItem value={subCategory.value}>
                                        <em> {subCategory.label} </em>
                                    </MenuItem>
                                )
                            })
                            }
                    })
                    }
                </Select>
            </FormControl>
            </Grid>
            )
            :
            null
            }
            </Grid>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    },
    category: {
        margin: '5px'
    },
    searchInput: {
        marginLeft: 10
    },
    search:{
        padding: '5px',
        marginTop: '1vw',
    }, 
});

const mapStateToProps = state => {
    return {
        store: state.inventory,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(inventoryActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withStyles(styles, { withTheme: true })(SearchBarItems)));
