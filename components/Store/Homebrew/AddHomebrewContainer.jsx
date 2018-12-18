import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';

import PageContainer from '../../UI/PageContainer';

// custom
// import Alert from '../UI/Alert';
import FormTextbox from '../../Form/FormTextbox'
// import FormSelectbox from '../Form/FormSelectbox'
import FormButton from '../../Form/FormButton'
// import FormCheckbox from '../Form/FormCheckbox'

class AddHomebrewContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
      items: [],
      activeItemIndex: 0,
      activeItem: {}
    }
	}

  static getDerivedStateFromProps(nextProps, prevState){
    if( nextProps.items && nextProps.items.length > 0 ){
      return {
        activeItem: nextProps.items[prevState.activeItemIndex],
        items: nextProps.items
      }
    } else {
      return null
    }
  }

  // _cycleItem is used for switching prev and next item of the list, whete type will be next or prev
  _cycleItem( type ){
    let appendVal = 1;
    if( type == 'prev' ){
      appendVal = -1
    }
    let {activeItemIndex} = this.state;
    let new_activeItemIndex = activeItemIndex + appendVal;
    if( new_activeItemIndex >= 0 && new_activeItemIndex <= (this.state.items.length - 1) ){
      let newItem = _.cloneDeep( this.state.items[ new_activeItemIndex * 1 ], true )
      this.setState({
        activeItemIndex: new_activeItemIndex
      })  
    }
  }

  _renderItems () {
    // return this.props.items.map((item) => {
    //   return  (<Grid container spacing={24}>
    //     <Grid container spacing={24}>
    //       Name
    //     </Grid>
    //     <Grid container spacing={24}>
    //       Description
    //     </Grid>
    //     <Grid container spacing={24}>
    //       <Grid item xs={8}>
    //         add to cart
    //       </Grid>
    //       <Grid item xs={4}>
    //         prev next
    //       </Grid>
    //     </Grid>
    //   </Grid>
    //   )
    // })
  }

	render() {
		return (
      <PageContainer heading="ADD HOMEBREW">
  			<Grid container spacing={24} id="add-homebrew-block">  		  
          <Grid item xs={8}>
            <Grid container spacing={24}>
              <Grid item className="item-heading">
                {this.state.activeItem.Name  || ''}
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              <Grid item className="item-description">
                {this.state.activeItem.Description  || ''}
              </Grid>
            </Grid>
            <Grid container spacing={24}>                
              <Grid item xs={8}>
                <Grid container>
                  <Grid item className="quantity">
                    <div className="header">QUANTITY</div>
                    <div>
                      <FormTextbox
                        className="input-textbox"
                        onChange={() => {}}
                      />
                    </div>
                  </Grid>
                  <Grid item>
                    <FormButton 
                      text="ADD TO CART" 
                      className="btn addtocart"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container dir="rtl">
                  <Grid item xs={6}>
                    <FormButton
                      text="NEXT" 
                      className="btn next-btn"
                      onClick={() => this._cycleItem('next')}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormButton 
                      text="BACK" 
                      className="btn prev-btn"
                      onClick={() => this._cycleItem('prev')}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            right
          </Grid>
        </Grid>
      </PageContainer>
		);
	}
}

export default AddHomebrewContainer