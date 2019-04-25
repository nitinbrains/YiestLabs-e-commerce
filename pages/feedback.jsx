import React, { Component } from 'react'
import NavBarLayout from "components/NavBar/NavBarLayout";
import PageContainer from 'components/UI/PageContainer';
import Typography from '@material-ui/core/Typography';

class Feedback extends Component {
  render() {
    return (
        <NavBarLayout>
           <PageContainer heading="Feedback" >
           <Typography component="h2" variant="display4" gutterBottom>
          How was your experience with the app?
        </Typography>
           </PageContainer>
        </NavBarLayout>
    )
  }
}

export default Feedback;