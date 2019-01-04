import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import { inventoryActions } from '../redux/actions/inventoryActions';
import { userActions } from '../redux/actions/userActions';
import LoadingIndicator from '../components/UI/LoadingIndicator';


export default (Component) => {
    const Wrapper = props => (
        class extends React.Component {
            componentDidMount() {
                if (this.props.store.itemsToShow.length === 0) {
                    this.props.getInventory();
                }
            }

            render () {
                if (this.props.store.isLoading) {
                    return <LoadingIndicator visible={this.props.store.isLoading}/> 
                }
                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ store: state.inventory, user: state.user }),
        dispatch => bindActionCreators({ ...inventoryActions, ...userActions}, dispatch) 
    )(Wrapper());
}