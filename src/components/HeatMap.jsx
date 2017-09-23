import React, { Component } from 'react';
import { BounceLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { scaleLinear, scaleBand, scaleQuantile } from 'd3-scale';
import { max, min } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import d3tip from 'd3-tip';
import browser from 'detect-browser';
import moment from 'moment';
import { timeDay, timeYear, timeMonth } from 'd3-time';
import './styles/ClimatHeatMap.css';
import { fetchTemperature } from '../actions';
import { svg_dimensions } from '../constants';
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

        if (this.props.isTemperatureFetching || temperature === undefined
            || temperature.length === 0)
            {
                return ;
            }
            // setup x
            //var minYear = temperature[0].year;
            var minYear = 1920;


            var maxYear = temperature[temperature.length - 1].year;

            var colorDoping = "#C70039";
            var colorNoDoping = "#33FFB5";
            var colors = ["#5300ff","#0033ff","#00ffcc",
            "#00ff33","#99ff00","#ffff00",
            "#ffcc00","#ff9900","#ff5400", "#ff0000"]; // alternatively colorbrewer.YlGnBu[9]

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



            var yearsArr = range(minYear, maxYear);
            console.log("yearsArr ", yearsArr);

            var width = svg_dimensions.width - svg_dimensions.margin.left - svg_dimensions.margin.right;
            var height = svg_dimensions.height - svg_dimensions.margin.top - svg_dimensions.margin.bottom;
            var gridSize = Math.floor(width / yearsArr.length);

            var xScale = scaleBand().rangeRound([0, width]).paddingInner(0.05),
            yScale = scaleBand().range([height, 0]).paddingInner(0.05),
            zScale = scaleQuantile().range(colors);

            xScale.domain(temperature.map(function(d) { return d.year; }));
            yScale.domain(temperature.map(function(d) { return d.month; }));
            zScale.domain([0, max(temperature, function(d) { return d.temperature; })]);


            var yAxis = axisLeft(yScale);
            var xAxis = axisBottom(xScale);


            var tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([5, 0])
            .html(function(d) {
                var res =   "<div class=\"tooltipDot\"> <div> " + d.year + " - " + months[d.month - 1] +
                "  </div><div> Temperature : " + Number(d.temperature).toFixed(3)+ " °C </div>";

                res = res + "</div>";
                return res;
            });

            const node = this.node;

            var mainNode = select(node);

            mainNode.selectAll("*").remove();


            mainNode = mainNode.append("g")
            .attr("transform", "translate(" + svg_dimensions.margin.left + "," + svg_dimensions.margin.top + ")");


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
                return xScale(d.year);
            })
            .attr("y", function(d) {
                return yScale(d.month);
            })
            .attr("width", xScale.bandwidth())
            .attr("height",  yScale.bandwidth())
            .style("fill", function(d) { return zScale(d.temperature); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

            mainNode.call(tip);

            var xAxis = mainNode.select(".axis--x");
            var textXAxis = xAxis.selectAll(".tick text");

            var steps = 3;
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
                <div className="BarChart">
                    {
                        this.renderLoading()
                    }
                    <svg id="chart"
                        width={widthWithMargin}
                        height={heightWithMargin}
                        viewBox={"0 0 " + widthWithMargin + " " + heightWithMargin}
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                        ref={node => this.node = node}>
                    </svg>
                </div>
            );
        }
    }

    function mapStateToProps(state)
    {
        console.log("Scatterplot mapStateToProps: ");
        const {
            countryTemperatureSelect,
            temperature,
            isTemperatureFetching,
        } = state;

        return {
            isTemperatureFetching,
            temperature : temperature[countryTemperatureSelect]
        }
    }
    export default connect(mapStateToProps, {fetchTemperature}) (HeatMap);
