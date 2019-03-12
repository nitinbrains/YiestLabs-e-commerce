import React, { Component } from "react";
import Store from "./_store.jsx";
import Router from 'next/router'
class App extends Component {
componentDidMount(){
    Router.push('/')
}
    render() {
        return (
            <Store />
        );
    }
}

export default App;
