import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import Controls from './Controls';
import CyclistScatterplot from './CyclistScatterplot';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './styles/App.css';
import { setCountryGdp, fetchCountries, fetchCountryGdp } from '../actions'
import { intervalDateGdp } from '../constants';

class GdpBarChart extends Component {


    onCountrySelectedForGdp = (country) => {
        this.props.setCountryGdp(country);
        this.props.fetchCountryGdp(country, intervalDateGdp);
    }

    render() {

        return (
            <div className="AppContainer">
                <Controls onCountrySelected={this.onCountrySelectedForGdp}
                    selectValue={this.props.countryGdpSelect}></Controls>
                <div></div>
                <BarChart />
            </div>
        );
    }
}


function mapStateToProps(state)
{
    const { countryGdpSelect } = state;
    return {
        countryGdpSelect
    }
}

export default connect(mapStateToProps, {setCountryGdp, fetchCountryGdp, fetchCountries}) (GdpBarChart);
