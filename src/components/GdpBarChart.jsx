import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClimatHeatMap from './ClimatHeatMap'
import BarChart from './BarChart';
import Controls from './Controls';
import CyclistScatterplot from './CyclistScatterplot';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './styles/App.css';
import 'react-tabs/style/react-tabs.css';
import { fetchCountries, fetchCountryGdp } from '../actions'


class GdpBarChart extends Component {

    onCountrySelectedForGdp = (country) => {
        var intervalDate = {
            start:'1960',
            end:'2017'
        };
        this.props.fetchCountryGdp(country, intervalDate);
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

function mapStateToProps(state)
{
    const { countries, isCountriesFetching } = state;
    return {
        countries,
        isCountriesFetching
    }
}

export default connect(mapStateToProps, {fetchCountryGdp, fetchCountries}) (GdpBarChart);
