import React, { Component } from 'react';
import { BounceLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { scaleLinear, scaleBand, scaleQuantile } from 'd3-scale';
import { max, min, mean } from 'd3-array';
import { select, event as currentEvent } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { zoom  } from 'd3-zoom';
import { drag, dragEnable } from 'd3-drag';
//import { event as currentEvent } from 'd3';
import * as d3  from 'd3';
import { transform } from 'd3-transform';
import d3tip from 'd3-tip';
import browser from 'detect-browser';
import moment from 'moment';
import { timeDay, timeYear, timeMonth } from 'd3-time';
import _ from 'lodash';
import './styles/ClimatHeatMap.css';
import { fetchTemperature } from '../actions';
import { svg_dimensions_climat as svg_dimensions } from '../constants';
import range  from 'lodash/range';
class CountryShareBorder extends Component {
    constructor(props) {
        super(props);
        this.state = { zoomValue: 1}
    }
    componentDidMount()
    {
        this.createForceDirectGraph();
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState(
            {
                isCountriesFetching: this.props.isCountriesFetching,
            }
        );
        this.createForceDirectGraph();        
    }


    componentDidUpdate() {
        this.createForceDirectGraph();
    }

    createMargin = () => {
        var margin = svg_dimensions.margin;
        switch (browser && browser.name) {
            case 'firefox': {
                margin.top = 50;
                margin.left = 45;
                break;
            }
            default:{
                console.log('not supported');
            }
        }
        return margin;
    }

    createForceDirectGraph = () => {

    }

    renderTitle = () =>
    {
        return (
            <div className="TitleContainer">
                <div className='TitleSVG'>Force Directed Graph of State Contiguity</div>
                <div className='DateTitleSVG'> </div>
                <div className='DescriptionSVG'>
                    The data source is from  {" "}
                    <a target="_blank" href="https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json">Freecodecamp
                    </a>
                </div>

            </div>
        );
    }
    renderLoading = () =>
    {
        if (this.props.isTemperatureFetching === true
        ) {

            return (
                <BounceLoader
                    color={'#123abc'}
                    loading={true}
                    />
            );
        }
    }


    render() {

        var margin = svg_dimensions.margin;
        var width= svg_dimensions.width;
        var height = svg_dimensions.height;
        var widthWithMargin = width + margin.left + margin.right;
        var heightWithMargin = height + margin.top + margin.bottom;

        return (
            <div className="HeatMapContainer">
                {
                    this.renderLoading()
                }
                {
                    this.renderTitle()
                }
                <div className="svg_container">
                    <svg id="heatmapchart"
                        width={widthWithMargin}
                        height={heightWithMargin}
                        viewBox={"0 0 " + widthWithMargin + " " + heightWithMargin}
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                        ref={node => this.node = node}>
                    </svg>
                </div>
            </div>
        );
    }
}

export default connect(null, {}) (CountryShareBorder);
