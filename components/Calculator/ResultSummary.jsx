import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import Grid from "@material-ui/core/Grid";

class ResultSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

		const { result: { total, packs }} = this.props;

        return (
            <Card className="result-summary-card">
                <CardBody>
                    <Grid container spacing={24}>
                        <Grid item xs={12} className="summary-heading">
                            Your Results
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="summary-total">
                        <Grid item xs={6}>
                            Total Liters Needed: {total}
                        </Grid>
                        <Grid item xs={6} dir="rtl" />
                    </Grid>
                    <Grid container spacing={24} className="summary-others">
                        <Grid item xs={6}>
                            0.5L (Nano):
                        </Grid>
                        <Grid item xs={6} dir="rtl">
                           {packs["0.5"]}
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="summary-others">
                        <Grid item xs={6}>
                            1.5L:
                        </Grid>
                        <Grid item xs={6} dir="rtl">
                            {packs["1.5"]}
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="summary-others">
                        <Grid item xs={6}>
                            2L:
                        </Grid>
                        <Grid item xs={6} dir="rtl">
                            {packs["2.0"]}
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        );
    }
}

export default ResultSummary;
