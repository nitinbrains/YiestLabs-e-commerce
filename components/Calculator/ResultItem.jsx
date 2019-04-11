import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardBody from "components/UI/Card/CardBody.jsx";
import Grid from "@material-ui/core/Grid";

import { cartActions } from "appRedux/actions/cartActions";

// custom
import FormButton from "components/Form/FormButton";

class ResultItem extends Component {
    constructor(props) {
        super(props);
		this.state = {};
		this.item = this.props.item;
	}

	addToCart = () => {
		const { result: { packs }} = this.props;

		for(var key in packs) {

			if(!isNaN(key) && packs[key] > 0) {

				var cartItem = {};

				cartItem.Name = String(this.item.Name);
				cartItem.salesCategory = parseInt(this.item.salesCategory);
				cartItem.dispQuantity = parseInt(packs[key]);
				cartItem.type = 1;

				var packageSize;

				switch(key)
				{
					case '0.5':
						packageSize = "Nano";
						cartItem.MerchandiseID = parseInt(this.item.volID[0]);
						break;
					case '1.5':
						packageSize = "1.5L";
						cartItem.MerchandiseID = parseInt(this.item.volID[1]);
						break;
					case '2.0':
						packageSize = "2L";
						cartItem.MerchandiseID = parseInt(this.item.volID[2]);
						break;
          case '0.04':
            packageSize = "HB";
            cartItem.MerchandiseID = parseInt(this.item.volID[4]);
            break;
					default:
						break;
				}

				if(this.item.purePitch)
				{
					cartItem.details = "From CC Calculator: PurePitch® " + packageSize;
				}
				else
				{
					cartItem.details = "From CC Calculator: " + packageSize;
				}

				cartItem.OrderDetailQty = parseInt(cartItem.dispQuantity);
				this.props.addItem({ cartItem });
			}
		}

		this.props.closeDialog();
	}

    render() {

		const spaceIndex = this.item.Name.indexOf(" ");
        const itemID = this.item.Name.substr(0, spaceIndex);
		const itemName = this.item.Name.substr(spaceIndex + 1);

        return (
            <Card className="result-item-card">
                <CardBody>
                    <Grid container spacing={24}>
                        <Grid item xs={12} className="item-heading">
							{itemID} | {itemName}
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs={12} className="item-description">
                            {this.item.Description}
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs={12} className="item-button">
                            <FormButton text="ADD TO CART" onClick={this.addToCart} />
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        );
    }
}


const mapStateToProps = (state) => {
    return {
		inventory: state.inventory
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(cartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ResultItem);
