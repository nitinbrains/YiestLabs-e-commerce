import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import { inventoryActions } from 'appRedux/actions/inventoryActions';
import { userActions } from 'appRedux/actions/userActions';
import { messageActions } from 'appRedux/actions/messageActions';
import LoadingScreen from 'components/UI/LoadingScreen';


export default (Component) => {
    const Wrapper = props => (
        class extends React.Component {
            componentDidMount() {
                if (this.props.store.items.length === 0) {
                    this.props.getInventory();
                }
            }

            render () {
                if (this.props.loading.isLoading && this.props.loading.type == "loadingInventory") {
                    return <LoadingScreen />
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
