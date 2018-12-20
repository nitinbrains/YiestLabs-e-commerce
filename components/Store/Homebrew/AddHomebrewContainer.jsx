import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PageContainer from '../../UI/PageContainer';
import FormTextbox from '../../Form/FormTextbox'
import FormButton from '../../Form/FormButton'
import { cartActions } from "../../../redux/actions/cartActions";

class AddHomebrewContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
      quantity: "1",
      items: [],
      activeItemIndex: 0,
      activeItem: {},
      updateCartIndex:0,
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

  changeQuantity = (event) => {
    this.setState({ quantity: event.target.value });
  }

  checkQuantity = (cartItem) => {
    let quantity = parseFloat(cartItem.OrderDetailQty);
    if(isNaN(quantity) || quantity <= 0 ) {
      console.log('Please enter a valid value for the quantity');
      return false;
    }
    //  Must be in increments of 1
    else if ((parseFloat(quantity) / parseInt(quantity) != 1.0)) {
      return false;
    }
    return true;
  }

  _addToCart() {
    try {
      let quantity = this.state.quantity;
      let item = this.state.activeItem;
      // Create cart item
      let cartItem = {};
      cartItem.Name = String(item.Name);
      cartItem.MerchandiseID = item.volID[0];
      cartItem.salesCategory = parseInt(item.salesCategory);
      cartItem.type = 3;
      cartItem.details = "";
      cartItem.OrderDetailQty = parseFloat(quantity);
      cartItem.dispQuantity = parseInt(quantity);
      if (this.checkQuantity(cartItem)) {
        this.props.addItem({ cartItem });
      }
    } catch (error) {
      console.log("could not add item to cart", error);
    }
  }

  changeCartItemQuantity = (event) => {
    try {
      this.props.updateItem({ index: this.state.updateCartIndex, quantity: event.target.value });
    }
    catch(error) {
      console.log('could not add item to cart', error);
    }

  }


  _renderCartItems() {
    return (
      <Grid className="cart-section" >
        <Grid container spacing={24}>
          <Grid item className="heading">
            YOUR CART
          </Grid>
        </Grid>
        <Grid className="cart-items-list">
          {
            this.props.cart.items.map((item,i) => {
              return (        
                <Grid key={i} className="small-cart-item">
                  <Grid container spacing={24}>
                    <Grid item>
                      {item.Name}
                    </Grid>
                  </Grid>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <Grid container spacing={24}>
                        <Grid item xs={5} className="label-text">
                          QUANTITY
                        </Grid>
                        <Grid item xs={7}>
                          <FormTextbox
                            className="quantity-input-textbox"
                            onChange={this.changeCartItemQuantity}
                            value={item.OrderDetailQty}
                            onClick={() => {
                              this.setState({
                                updateCartIndex: i
                              })
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} dir="rtl">
                      $255
                    </Grid>
                  </Grid>
                </Grid> 
              )
            })
          }
        </Grid>

        <Grid container spacing={24} className="total-block" dir="rtl">
          <Grid item xs={6}>
            <Grid container spacing={24}>
              <Grid item xs={7}>
                $500
              </Grid>
              <Grid item xs={5} className="label-text">
                TOTAL
              </Grid>
              
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={24} className="checkout-block" dir="rtl">
          <Grid item >
            <Link prefetch href="/checkout">
              <FormButton
                text="CHECKOUT" 
                className="btn next-btn"
                onClick={() => this._cycleItem('next')}
              />
            </Link>
          </Grid>
        </Grid>
      </Grid>
    )
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
                        onChange={this.changeQuantity}
                        value={this.state.quantity}
                      />
                    </div>
                  </Grid>
                  <Grid item>
                    <FormButton 
                      text="ADD TO CART" 
                      className="btn addtocart"
                      onClick={() => this._addToCart()}
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
            {this._renderCartItems()}
          </Grid>
        </Grid>
      </PageContainer>
		);
	}
}

const styles = theme => ({
    
});

const mapStateToProps = state => ({
    cart: state.cart,
    user: state.user,
    store: state.inventory
})

const mapDispatchToProps = dispatch => bindActionCreators({ ...cartActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(AddHomebrewContainer));

// export default AddHomebrewContainer