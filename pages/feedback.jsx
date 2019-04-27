import React, { Component } from 'react'
import NavBarLayout from "components/NavBar/NavBarLayout";
import PageContainer from 'components/UI/PageContainer';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import StarRatings from "react-star-ratings";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import * as Yup from "yup";

class Feedback extends Component {

  // changeRating( newRating, name ) {
  //   this.setState({
  //     rating: newRating
  //   });
  // }
  state={
    rating:4
  }

  submitScreen = (values) => {
    console.log(values,'existing screen')
    
};


  render() {
    const customFormValidation = Yup.object().shape({
      comment: Yup.string()
        .required('Required'),
    });
  const {classes} = this.props;

    return (
        <NavBarLayout>
          <div  className={classes.container}>
          <PageContainer heading="FEEDBACK">
         
      
      <Grid container style={{width:'100%'}} className="flex-center">
         <Formik
            initialValues={{
                comment: '',
                appRating:0,
                orderProcessRating:0
            }}
             validationSchema={customFormValidation}
            enableReinitialize
            onSubmit={(values, actions) => {
                this.submitScreen(values);
            }}
           >


            {({ errors, touched, isValidating,handleChange,values, setFieldValue }) => {
                   console.log(errors,'errr')
                        return (
                            <Form>
                                 <Grid item xs={12}>
                                 <Typography className="flex-center" style={{textAlign:'center'}} component="h2" variant="Title" gutterBottom>
          How was your experience with the app?
        </Typography>
        <div className="flex-center">
                                 <StarRatings
                          
          rating={values.appRating}
          starRatedColor="#FF9933"
          changeRating={value =>
            setFieldValue("appRating", value)
          }
          numberOfStars={5}
          name='rating'
          // style={{display:'flex',justifyContent:'center'}}
        />
        </div>

           <Typography className="flex-center"  style={{textAlign:'center'}} component="h2" variant="Title" gutterBottom>
          How was the overall ordering process?
        </Typography>
        <div className="flex-center">
                                 <StarRatings 
          rating={values.orderProcessRating}
          starRatedColor="#FF9933"
          changeRating={value =>
            setFieldValue("orderProcessRating", value)
          }
          numberOfStars={5}
          name='rating'
        />
        </div>
                                 <FormControl margin="normal" required fullWidth>
                                        <textarea
                                            className={classes.textarea}
                                            placeholder="Your feedback is valuable to us :)"
                                            name="comment"
                                            label="Your Feedback is Valuable to us"
                                            variant="outlined"
                                            margin='normal'
                                            fullWidth
                                            onChange={handleChange}
                                            value={values.comment}
                                        />
                                    </FormControl>
                                    </Grid>
                                    {errors.comment && touched.comment && <div style={{color:'red'}} >{errors.comment}</div>}
                                   
                                    <Grid style={{ marginTop: 10 }} container justify="center">
                                        <Grid item>
                                            <Button variant="contained" color="primary" type="submit">
                                                Send Feedback
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    </Form>
 );
}}

           </Formik>
           </Grid>
        </PageContainer>
         </div>
        </NavBarLayout>
    )
  }
}

const styles = theme => ({
  starDimension:{
    fontSize:'20px'
  },
  container: {
    width:'80%',
    marginLeft:'7%',
    [theme.breakpoints.down("sm")]: {
      marginLeft:'11%',
  },
},
textarea : {
  width: '100%',
  height: '150px',
  padding: '12px 20px',
  boxSizing: 'border-box',
  border: '2px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f8f8f8',
  resize: 'none'
}
})


export default withStyles(styles, { withTheme: true })(Feedback)