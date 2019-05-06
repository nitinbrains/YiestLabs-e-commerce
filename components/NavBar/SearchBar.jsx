import React, {Fragment} from 'react'
import InputBase from "@material-ui/core/InputBase";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

 const SearchBar=(props)=> {
     const {classes}=props
  return (
         <Fragment>
        <div  className={props.class} >
            <InputBase
                placeholder="Search…"
                name="searchTextmobile"
                classes={{
                    root: classes.inputRootmobile,
                    input: classes.inputInputmobile
                }}
                value={props.searchText}
                onChange={(e)=>{
                    props.handleSearch(e.target.value)
                }}
            />
                <div className={classes.searchIconmobile}>
                <SearchIcon />
            </div>
        </div>
         </Fragment>
  )
}

const styles = theme => ({
    
    searchIconmobile: {
        width: "34px",
        color:'white',
        position: "relative",
        background:'#f28531',
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin:'3px',
        borderRadius:'5px',
        // [theme.breakpoints.up("md")]: {
           
        // },
    },
    inputRootmobile: {
        color: "inherit",
        width: "100%"
    },
    inputInputmobile: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create("width"),
        width: "100%",
         [theme.breakpoints.between('md','xl')]: {
            paddingLeft: theme.spacing.unit * 3,
         },
    },
})


export default 
withStyles(styles, { withTheme: true })(SearchBar);