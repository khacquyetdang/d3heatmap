import React, { Component } from 'react';
import { BounceLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { scaleLinear, scaleBand, scaleQuantile } from 'd3-scale';
import { max, min, mean } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import d3tip from 'd3-tip';
import browser from 'detect-browser';
import moment from 'moment';
import { timeDay, timeYear, timeMonth } from 'd3-time';
import './styles/ClimatHeatMap.css';
import { fetchTemperature } from '../actions';
import { svg_dimensions_climat as svg_dimensions } from '../constants';
import range  from 'lodash/range';
class HeatMap extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount()
    {
        this.createHeatMap();
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState(
            {
                isCountriesFetching: this.props.isCountriesFetching,
            }
        );
        this.createHeatMap();
        //this.props.fetchCountryGdp(this.state.selectValue, this.state.intervalDate);
    }


    componentDidUpdate() {
        this.createHeatMap();
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

    createHeatMap = () => {

        const { temperature } = this.props;

        if (this.props.isTemperatureFetching) {
            this.renderLoading();
            return;
        }
        if (temperature === undefined
            || temperature.length === 0
        ) {
            this.createBarChartEmptyData();
            return;
        }
        // setup x
        //var minYear = temperature[0].year;

        var colors = ["#089de8","#06dbd6", "#05ee9c", "#07f588", "#03fe32", "#9efe06", "#e6fd06", "#feb704", "#fd6c07", "#fd5405"];
        var months = [
            "December",
            "November",
            "October",
            "September",
            "August",
            "July",
            "June",
            "May",
            "April",
            "March",
            "February",
            "January"
        ];
        months.reverse();



        var yearsArr = range(this.props.minYear, this.props.maxYear + 1);

        var width = svg_dimensions.width - svg_dimensions.margin.left - svg_dimensions.margin.right;
        var height = svg_dimensions.height - svg_dimensions.margin.top - svg_dimensions.margin.bottom;
        var gridSize = Math.floor(width / yearsArr.length);

        var xScale = scaleBand().range([0, width]).paddingInner(0.05).paddingOuter(1),
        yScale = scaleBand().range([height, 0]).paddingInner(0.05),
        zScale = scaleQuantile().range(colors);

        xScale.domain(temperature.map(function(d) { return d.Year; }));
        yScale.domain(temperature.map(function(d) { return d.Month; }));

        var minTemp = min(temperature, function(d) { return d.tas; });
        var maxTemp = max(temperature, function(d) { return d.tas; });

        zScale.domain([minTemp, maxTemp]);


        var yAxis = axisLeft(yScale);
        var xAxis = axisBottom(xScale);


        var tip = d3tip()
        .attr('class', 'd3-tip')
        .offset([5, 0])
        .html(function(d) {
            var res =   "<div class=\"tooltipDot\"> <div> " + d.Year + " - " + months[d.Month - 1] +
            "  </div><div> Temperature : " + Number(d.tas).toFixed(1) + " °C </div>";

            res = res + "</div>";
            return res;
        });

        const node = this.node;

        var mainNode = select(node);

        mainNode.selectAll("*").remove();

        var widthLegendBar = 35;
        var heightLegendBar = 10;
        var dataLegend = [minTemp].concat(zScale.quantiles());
        var legend = mainNode.selectAll(".legend")
        .data(dataLegend, function(d) {
            console.log("legend", d);
            return d; }
        ).enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + ((width) - (dataLegend.length - i) * widthLegendBar)  + "," + (height + 20)+  ")"; });


        legend.append("rect")
        .attr("x", widthLegendBar)
        .attr("y", 10)
        .attr("width", widthLegendBar)
        .attr("height", heightLegendBar)
        .style("fill", zScale);

        legend.append("text")
        .attr("x", widthLegendBar)
        .attr("y", heightLegendBar * 3)
        .style("font-size", "9")
        .attr("dy", "0.35em")
        .text(function(tas){return  ">=" + Number(tas).toFixed(1)});


        mainNode = mainNode.attr("width", svg_dimensions.width)
        .attr("height", svg_dimensions.height)
        .attr("viewBox", "0 0 " + svg_dimensions.width + " " + svg_dimensions.height)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(" + svg_dimensions.margin.left + "," + (svg_dimensions.margin.top) + ")");


        mainNode.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        mainNode.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis.ticks(10, ",f"));

        mainNode.selectAll(".tile")
        .data(temperature)
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", function(d) {
            return xScale(d.Year);
        })
        .attr("y", function(d) {
            return yScale(d.Month);
        })
        .attr("width", xScale.bandwidth())
        //.attr("width", 10)
        .attr("height",  yScale.bandwidth())
        .style("fill", function(d) { return zScale(d.tas); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


        mainNode.call(tip);

        var xAxis = mainNode.select(".axis--x");
        var textXAxis = xAxis.selectAll(".tick text");

        var steps = 5;
        textXAxis.attr("class", function(d,i) {
            var removed = (i%steps) !== 0;
            if(removed) {
                select(this).remove();
            }
        });

        var yAxis = mainNode.select(".axis--y");
        var textsYAxis = yAxis.selectAll(".tick text");

        textsYAxis.attr("class", function(d,i) {
            select(this).text(months[d - 1]);
        });
    }

    renderTitle = () =>
    {
        const { temperature } = this.props;

        if (this.props.countryName !== ""
        && temperature !== undefined
        && temperature.length !== 0)
        {
            return (
                <div className="TitleContainer">
                    <div className='TitleSVG'>Monthly Temperature for {  this.props.countryName }</div>
                    <div className='DateTitleSVG'> { this.props.minYear } -  { this.props.maxYear } </div>
                    <div className='DescriptionSVG'>Temperatures are in Celsius. The mean temperature over these years is { this.props.meanTemp }.<br/>
                    The data source is from <a target="_blank" href="http://sdwebx.worldbank.org/climateportal/index.cfm?page=downscaled_data_download&menu=historical">World Bank Climate Data
                    The World Bank Climate Change Knowledge Portal</a>
            </div>
        </div>
    );
}
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


createBarChartEmptyData = () => {

    const node = this.node;

    var mainNode = select(node);

    mainNode.selectAll("*").remove();

    mainNode.attr("width", svg_dimensions.width)
    .attr("height", svg_dimensions.height)
    .attr("viewBox", "0 0 " + svg_dimensions.width + " " + svg_dimensions.height)
    .attr("preserveAspectRatio", "xMidYMid meet")

    mainNode.append("text")
    .attr("y", svg_dimensions.height / 2)
    .attr("x", svg_dimensions.width / 3)
    .attr("class", "labelTitle")
    .attr("font-size", 30)
    .attr("fill", "red")
    .text("Data is not availaible for this country.");
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
            <svg id="heatmapchart"
                xmlns="http://www.w3.org/2000/svg"
                ref={node => this.node = node}>
            </svg>
        </div>
    );
}
}
/** It is better to set these attribute in the code
width={widthWithMargin}
height={heightWithMargin}
viewBox={"0 0 " + widthWithMargin + " " + heightWithMargin}
preserveAspectRatio="xMidYMid meet"
*/
function mapStateToProps(state)
{
    const {
        countryTemperatureSelect,
        temperature,
        isTemperatureFetching,
        countriesById
    } = state;

    var countryName = countriesById[countryTemperatureSelect] != undefined ? countriesById[countryTemperatureSelect].label : "";
    var temperatureForCountry = temperature[countryTemperatureSelect];
    var minYear = temperatureForCountry === undefined ? 1901 : min(temperatureForCountry, function(d) { return d.Year; });


    var maxYear = temperatureForCountry === undefined ? 2015 : max(temperatureForCountry, function(d) { return d.Year; });
    var meanTemp =  temperatureForCountry === undefined ? 0 : Number(mean(temperatureForCountry, function(d) { return d.tas;})).toFixed(2);


    return {
        isTemperatureFetching,
        countryName,
        minYear,
        maxYear,
        meanTemp,
        temperature : temperatureForCountry
    }
}
export default connect(mapStateToProps, {fetchTemperature}) (HeatMap);
