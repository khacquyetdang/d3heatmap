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
import './styles/BarChart.css';
import { fetchCyclist } from '../actions';
import { svg_dimensions_cyclist as svg_dimensions } from '../constants';

class CyclistScatterplot extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount()
    {
        console.log("Scatterplot componentDidMount");
        console.log(this.props);
        if (this.props.cyclist === undefined ||
            this.props.cyclist === null ||
            this.props.cyclist.length === 0
        ) {
            this.props.fetchCyclist();
        }

        this.createBarChart();

    }
    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState(
            {
                isCountriesFetching: this.props.isCountriesFetching,
            }
        );
        this.createBarChart();
        //this.props.fetchCountryGdp(this.state.selectValue, this.state.intervalDate);
    }


    componentDidUpdate() {
        this.createBarChart();
        //this.createBarChartSimple();
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

    createBarChart = () => {
        const { cyclist } = this.props;
        var data = cyclist;
        // setup x
        var minScore = min(data, function(d) {
            return d.Seconds;
        });

        var maxScore = max(data, function(d) {
            return d.Seconds;
        });

        var colorDoping = "#C70039";
        var colorNoDoping = "#33FFB5";

        var xValue = function(d) {
            return (d.Seconds - minScore);}, // data -> value
        xScale = scaleLinear().range([svg_dimensions.width - svg_dimensions.margin.left -  svg_dimensions.margin.right, 0]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xMapLabel = function(d) { return xScale(xValue(d)) + d.Name.length * 6;}, // data -> display

        xAxis =  axisBottom(xScale);

        // setup y
        var yValue = function(d) {
            return d.Place;
        }, // data -> value
        yScale = scaleLinear().range([0, svg_dimensions.height]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yMapLabel = function(d) { return yScale(yValue(d)) + 4;}, // data -> display

        yAxis = axisLeft(yScale);




        var tip = d3tip()
        .attr('class', 'd3-tip')
        .offset([5, 0])
        .html(function(d) {
            //var money = '$' + Math.ceil(d.value) + " Billion";
            //return '<div className="tooltip">' + money + " date "+ d.date + "</div>";
            var res =   "<div class=\"tooltipDot\"> <div> " + d.Name + " : " + d.Nationality +
            "  </div><div> Year : " + d.Year + " , Time: " + d.Time + " </div>";
            if (d.Doping !== "")
            {
                res = res + "<br><div>" + d.Doping + " </div>";
            }
            res = res + "</div>";
            return res;
        });

        const node = this.node;

        var mainNode = select(node);

        mainNode.selectAll("*").remove();


        mainNode = mainNode.append("g")
        .attr("transform", "translate(" + svg_dimensions.margin.left + "," + svg_dimensions.margin.top + ")");

        // don't want dots overlapping axis, so add in buffer to data domain

        xScale.domain([min(data, xValue), max(data, xValue) + 15]);
        yScale.domain([min(data, yValue)-1, max(data, yValue) + 1]);

        // x-axis
        mainNode.append("g")
        .attr("class", "x axis x--axis")
        .attr("transform", "translate(0," + svg_dimensions.height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", svg_dimensions.width / 3)
        .attr("y", 55)
        .style("text-anchor", "start")
        .style("fill", "black")
        .style("font-size", "18")
        .text("Minutes Behind Fastest Time");

        // y-axis
        mainNode.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", - svg_dimensions.margin.left * 3 / 4.)
        .attr("x", - svg_dimensions.width / 5)
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .style("fill", "black")
        .style("font-size", "18")
        .text("Ranking");


        var gdots = mainNode.selectAll("g.dot")
        .data(data)
        .enter().append("g");

        gdots.append("circle")
        .attr("class", "dot")
        .attr("r", 4.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) {
            //console.log()
            return d.Doping === "" ?  colorNoDoping : colorDoping;
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


        gdots.append("text")
        .attr("y", yMapLabel)
        .attr("x", xMapLabel)
        .style("text-anchor", "end")
        .style("fill", "black")
        .style("font-size", "10")
        .text(function(d) {
            return d.Name;
        });

        mainNode.call(tip);



        var legendData = ["No doping allegations", "Riders with doping allegations"];
        var colorArray = [colorNoDoping, colorDoping];
        var color = scaleOrdinal().domain(legendData).range(colorArray);
        console.log("color scale ordinal : ", color);
        var legend = mainNode.selectAll(".legend")
             .data(legendData)
           .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) {
                 return "translate(0," + i * 20 + ")";
              });

         // draw legend colored rectangles
         legend.append("rect")
             .attr("x", svg_dimensions.width - 18)
             .attr("y", svg_dimensions.height * 2 / 3 )
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", color);

         // draw legend text
         legend.append("text")
             .attr("x", svg_dimensions.width - 24)
             .attr("y", svg_dimensions.height * 2 / 3 + 10)
             .attr("dy", ".35em")
             .style("text-anchor", "end")
             .text(function(d) {
                 return d;
             });

        var xAxis = mainNode.select(".x--axis");
        var ticks = xAxis.selectAll(".tick text");

        ticks.attr("class", function(d,i) {
            select(this).text(moment.utc(d * 1000).format("mm:ss"));
        });

    }
    renderLoading = () =>
    {
        if (this.props.isCyclistFetching === true
        ) {

            return (
                <BounceLoader
                    color={'#123abc'}
                    loading={true}
                    />
            );
        }
    }

    renderTitle = () =>
    {

        if (this.props.isCyclistFetching === false)
        {
            return (
                <div className="TitleContainer">
                    <div className='TitleSVG'>Doping in Professional Bicycle Racing</div>
                </div>
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
                {
                    this.renderTitle()
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
        cyclist,
        isCyclistFetching,
    } = state;

    return {
        cyclist,
        isCyclistFetching
    }
}
export default connect(mapStateToProps, {fetchCyclist}) (CyclistScatterplot);
