import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import Controls from './Controls';
import CyclistScatterplot from './CyclistScatterplot';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './styles/App.css';
import 'react-tabs/style/react-tabs.css';
import { fetchCountries, fetchCountryGdp } from '../actions'
import { intervalDateGdp } from '../constants';

class GdpBarChart extends Component {


    onCountrySelectedForGdp = (country) => {
        this.props.fetchCountryGdp(country, intervalDateGdp);
    }

    render() {

        return (
            <div className="AppContainer">
                <Controls onCountrySelected={this.onCountrySelectedForGdp}></Controls>
                <div></div>
                <BarChart />
            </div>
        );
    }
}

export default connect(null, {fetchCountryGdp, fetchCountries}) (GdpBarChart);
