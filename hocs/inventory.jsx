import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import { inventoryActions } from '../redux/actions/inventoryActions';
import { userActions } from '../redux/actions/userActions';
import { messageActions } from '../redux/actions/messageActions';
import LoadingScreen from '../components/UI/LoadingScreen';
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
                if (
                    this.props.loading.isLoading &&
                    this.props.loading.type == "loadingInventory" &&
                    this.props.store.items.length === 0 &&
                    this.props.store.itemsToShow === 0
                ) {
                    return <LoadingScreen />;
                }
                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ store: state.inventory, user: state.user, loading: state.loading, message: state.messages }),
        dispatch => bindActionCreators({ ...inventoryActions, ...userActions, ...messageActions}, dispatch)
    )(Wrapper());
}
