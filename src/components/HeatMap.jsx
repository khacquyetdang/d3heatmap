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
class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = { zoomValue: 1}
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


        if (this.props.isTemperatureFetching || this.props.isCountriesFetching
            || this.props.countryName === "" || _.isEmpty(this.props.allTemperature)) {
                this.renderLoading();
                return;
            }
            if ((temperature === undefined
                || temperature.length === 0)
            ) {
                this.createBarChartEmptyData();
                return;
            }
            // setup x
            //var minYear = temperature[0].year;

            var colors = ["#06dbd6", "#05ebaf", "#05ee9c", "#07f588", "#03fe32", "#9efe06", "#e6fd06", "#feb704", "#fd6c07", "#fd5405"];
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

            dragEnable(window);
            var tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([5, 0])
            .html(function(d) {
                var res =   "<div class=\"tooltipDot\"> <div> " + d.Year + " - " + months[d.Month - 1] +
                "  </div><div> Temperature : " + Number(d.tas).toFixed(1) + " °C </div>";

                res = res + "</div>";
                return res;
            });


            var azoom = zoom()
            .scaleExtent([1, 2])
            .translateExtent([
                [-width * 2, -height * 2],
                [width * 2, height * 2]
            ])
            .on("zoom", (event) => {
                this.zoomed();
            });

            this.azoom = azoom;

            const node = this.node;

            var mainNode = select(node);


            mainNode.selectAll("*").remove();



            var slider = select(this.slider)
            .datum({})
            .attr("type", "range")
            .attr("value", 1)
            .attr("min", azoom.scaleExtent()[0])
            .attr("max", azoom.scaleExtent()[1])
            .attr("step", (azoom.scaleExtent()[1] - azoom.scaleExtent()[0]) / 100);
            /*.on("change", function(target){
            console.log(target);
            //this.slided(target);
            });*/
            /**
            Obj is translate(0,0) scale(1)
            **/
            const my_transform= (Obj) => {
                var res = { translate : [0,0], scale: 0};
                try {
                    var ObjSplitted = Obj.split(" ");
                    var translatePart = ObjSplitted[0].split('(')[1].split(')')[0].split(',');
                    var x = parseFloat(translatePart[0]);
                    var y = parseFloat(translatePart[1]);
                    var scalePart = parseFloat(ObjSplitted[1].split('(')[1].split(')')[0]);
                    return { translate: [x, y], scale: scalePart};
                }
                catch(e) {
                    console.log(e);
                }
                return res;
            }
            var start_x = 0, start_y = 0;
            var translateX = 0, translateY = 0;
            const started = (d) => {
                console.log("dragge started");
                currentEvent.sourceEvent.stopPropagation();
                select(this.node).classed("dragging", true);
                var t =  select(this.node).attr("transform");
                t = my_transform(t);
                var scale = t.scale;
                console.log("transform scale :", scale);

                start_x = currentEvent.x;
                start_y = currentEvent.y;
                translateX = t.translate[0],
                translateY = t.translate[1];
                console.log("transform x :", translateX, " y : ", translateY);
            };
            const dragged = (d) => {
                console.log("dragged");
                var current_scale_string, current_scale;
                /*if (this.getAttribute("transform") === null)
                {
                current_scale = 1;
                }
                //case where we have transformed the circle
                else {
                current_scale_string = this.getAttribute("transform").split(' ')[1];
                current_scale = +current_scale_string.substring(6,current_scale_string.length-1);
                }*/
                current_scale = this.state.zoomValue;
                var t =  select(this.node).attr("transform");
                t = my_transform(t);
                if (t.scale === 1)
                {
                    return;
                }
                select(this.node)
                .attr("transform", "translate(" + (translateX + currentEvent.x - start_x) + "," + (translateY + currentEvent.y - start_y) + ") scale("+ t.scale +")");
                //.attr("x", d.x = start_x + ((currentEvent.x - start_x) / current_scale) )
                //.attr("y", d.y = start_y + ((currentEvent.y - start_y) / current_scale));
            };

            var adrag = drag()
            .subject(function(d) { return d; })
            .on("start", started)
            .on("drag", dragged)
            .on("end", function(d) {
                console.log("dragged end");
                select(this.node).classed("dragging", false);
            });


            this.container = mainNode;
            this.azoom.scaleTo(this.container, this.state.zoomValue);
            var widthLegendBar = 35;
            var heightLegendBar = 10;
            var dataLegend = [minTemp].concat(zScale.quantiles());
            var legend = mainNode.selectAll(".legend").append("g")
            .attr("transform", "translate(" + svg_dimensions.margin.left + "," + (svg_dimensions.margin.top) + ")")
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
            .attr("transform", "translate(" + svg_dimensions.margin.left + "," + (svg_dimensions.margin.top) + ")")
            .call(azoom).on("wheel.zoom", null)


            mainNode.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", svg_dimensions.width / 3)
            .attr("y", 40)
            .style("text-anchor", "start")
            .style("fill", "#2E4053")
            .style("font-size", "20")
            .text("Years");;

            mainNode.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis.ticks(10, ",f"))
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", - svg_dimensions.margin.left + 10)
            .attr("x", - svg_dimensions.width / 5)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .style("fill", "#2E4053")
            .style("font-size", "20")
            .text("Months");;

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
            .call(adrag)
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

        slided = (d) => {
            var currentVal = d.target.value;
            this.setState({zoomValue: currentVal}, function(){
                console.log("slided val currentVal", currentVal, "this.value", this.value);
                this.azoom.scaleTo(this.container, currentVal);
            }
        );
    }
    zoomed = () => {
        this.container.attr("transform", currentEvent.transform);
        /*
        if (this.container !== undefined && this.container !== null)
        {
        ///this.container.attr("transform", "translate(" + currentEvent.translate + ")scale(" + currentEvent.scale + ")");
        this.container.attr("transform", currentEvent.transform);
        }*/
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
                    The data source is from  {" "}
                    <a target="_blank" href="http://sdwebx.worldbank.org/climateportal/index.cfm?page=downscaled_data_download&menu=historical">World Bank Climate Data
                        The World Bank Climate Change Knowledge Portal
                    </a>
                </div>
                <input type="range"
                    value={this.state.zoomValue}
                    ref={slider => this.slider = slider}
                    onChange={this.slided}/>

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
/** It is better to set these attribute in the code
*/
function mapStateToProps(state)
{
    const {
        countryTemperatureSelect,
        temperature,
        isTemperatureFetching,
        isCountriesFetching,
        countriesById
    } = state;

    var countryName = countriesById[countryTemperatureSelect] != undefined ? countriesById[countryTemperatureSelect].label : "";
    var temperatureForCountry = temperature[countryTemperatureSelect];
    var minYear = temperatureForCountry === undefined ? 1901 : min(temperatureForCountry, function(d) { return d.Year; });


    var maxYear = temperatureForCountry === undefined ? 2015 : max(temperatureForCountry, function(d) { return d.Year; });
    var meanTemp =  temperatureForCountry === undefined ? 0 : Number(mean(temperatureForCountry, function(d) { return d.tas;})).toFixed(2);


    return {
        isTemperatureFetching,
        isCountriesFetching,
        countryName,
        minYear,
        maxYear,
        meanTemp,
        allTemperature : temperature,
        temperature : temperatureForCountry
    }
}

export default connect(mapStateToProps, {fetchTemperature}) (HeatMap);
