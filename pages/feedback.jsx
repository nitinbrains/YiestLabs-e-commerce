import React, { Component } from 'react'
import NavBarLayout from "components/NavBar/NavBarLayout";
import PageContainer from 'components/UI/PageContainer';
import Typography from '@material-ui/core/Typography';
import StarRatings from "react-star-ratings";

class Feedback extends Component {

  // changeRating( newRating, name ) {
  //   this.setState({
  //     rating: newRating
  //   });
  // }
  state={
    rating:4
  }


  render() {
    return (
        <NavBarLayout>
          <div className='flex-center'>
           <PageContainer heading="Feedback" >
           <div className='flex-center'>
           <Typography  component="h2" variant="Title" gutterBottom>
          How was your experience with the app?
        </Typography>
        hjvjhvjhvjv
        </div>
        {/* <StarRatings
          rating={this.state.rating}
          starRatedColor="blue"
          // changeRating={this.changeRating}
          numberOfStars={6}
          name='rating'
        /> */}
     
           </PageContainer>
           </div>
        </NavBarLayout>
    )
  }
}

export default Feedback;