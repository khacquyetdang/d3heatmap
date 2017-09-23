import React, { Component } from 'react';
import { BounceLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { max, min } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import d3tip from 'd3-tip';
import browser from 'detect-browser';
import moment from 'moment';
import { timeDay, timeYear, timeMonth } from 'd3-time';
import './styles/ClimatHeatMap.css';
import { setCountryTemperature, fetchTemperature } from '../actions';
import { svg_dimensions } from '../constants';
import Controls from './Controls';
import HeatMap from './HeatMap';

class ClimatHeatMap extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount()
    {
        this.props.fetchTemperature("FRA", 1980, 1999);
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState(
            {
                isCountriesFetching: this.props.isCountriesFetching,
            }
        );
        //this.props.fetchCountryGdp(this.state.selectValue, this.state.intervalDate);
    }


    onCountrySelectedForTemperature = (country) => {
        this.props.setCountryTemperature(country);
    }


    render() {


        return (
            <div>
                <Controls onCountrySelected={this.onCountrySelectedForTemperature}
                    selectValue={this.props.countryTemperatureSelect}></Controls>
                <HeatMap></HeatMap>
            </div>
        );
    }
}

function mapStateToProps(state)
{
    console.log("Scatterplot mapStateToProps: ");
    const {
        countryTemperatureSelect
    } = state;

    return {
        countryTemperatureSelect,
    }
}
export default connect(mapStateToProps, {setCountryTemperature, fetchTemperature}) (ClimatHeatMap);
