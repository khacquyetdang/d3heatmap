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
import d3tip from 'd3-tip';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import browser from 'detect-browser';
import moment from 'moment';
import { timeDay, timeYear, timeMonth } from 'd3-time';
import _ from 'lodash';
import './styles/CountryShareBorder.css';
import { fetchCountriesShareBorder } from '../actions';
import { svg_dimensions_climat as svg_dimensions } from '../constants';
import range  from 'lodash/range';
import 'flag-icon-css/css/flag-icon.css';

class CountryShareBorder extends Component {
    constructor(props) {
        super(props);
        this.state = { zoomValue: 1}
    }

    componentDidMount()
    {
        this.props.fetchCountriesShareBorder();
    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps !== this.props)
        {
            var isDiff = this.props.countriesshareborders !== nextProps.countriesshareborders;
            if (isDiff)
            {
                this.props = nextProps;
                this.createForceDirectGraph();
            }
        }
        this.props = nextProps;

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

        if (this.props.isCountriessharebordersFetching || _.isEmpty(this.props.countriesshareborders)) {
            return ;
        }
        var width = svg_dimensions.width;
        var height = svg_dimensions.height;

        var svg = select(this.node);
        svg.selectAll("*").remove();
        var radius = 20;


        //set up the simulation and add forces
        var simulation = forceSimulation()
        .nodes(this.props.countriesshareborders.nodes);

        var link_force =  forceLink(this.props.countriesshareborders.links)
        .id(function(d, index) {
            return d.index;
        });

        var charge_force = forceManyBody()
        .strength(-50);

        var center_force = forceCenter(width / 2, height / 2);

        simulation
        .force("charge_force", charge_force)
        .force("center_force", center_force)
        .force("links",link_force);


        //add tick instructions:
        simulation.on("tick", tickActions );

        //add encompassing group for the zoom
        var g = svg.append("g")
        .attr("class", "everything");

        //draw lines for the links
        var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(this.props.countriesshareborders.links)
        .enter().append("line")
        .attr("stroke-width", 1)
        .style("stroke", linkColour);

        //draw circles for the nodes
        var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(this.props.countriesshareborders.nodes)
        .enter()
        .append("g");
        
        node.append("image")
        .attr("xlink:href",function(d) { return process.env.PUBLIC_URL + "/img/flags/1x1/" + d.code +".svg";})
        //.attr("xlink:href", "https://github.com/favicon.ico")
        .attr("width", radius)
        .attr("height", radius)
        .attr("x", function(d) { return centerFlag(d.x);})
        .attr("y", function(d) { return centerFlag(d.y);});

        node.append("title")
             .text(function(d) { return d.country; });


        //add drag capabilities
        var drag_handler = d3.drag()
        .on("start", drag_start)
        .on("drag", drag_drag)
        .on("end", drag_end);

        drag_handler(node);


        //add zoom capabilities
        var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

        zoom_handler(svg);

        /** Functions **/

        function centerFlag(coord) {
            return coord - radius / 2;
        }

        //Function to choose what color circle we have
        //Let's return blue for males and red for females
        function circleColour(d){
            if(d.sex =="M"){
                return "blue";
            } else {
                return "pink";
            }
        }

        //Function to choose the line colour and thickness
        //If the link type is "A" return green
        //If the link type is "E" return red
        function linkColour(d){
            if(d.type == "A"){
                return "green";
            } else {
                return "#AEB6BF";
            }
        }

        //Drag functions
        //d is the node
        function drag_start(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        //make sure you can't drag the circle outside the box
        function drag_drag(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function drag_end(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        //Zoom functions
        function zoom_actions(){
            g.attr("transform", d3.event.transform)
        }

        function tickActions() {
            //update circle positions each tick of the simulation
            node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

            node.selectAll("image")
            .attr("x", function(d) { return centerFlag(d.x); })
            .attr("y", function(d) { return centerFlag(d.y); });

            //update link positions
            link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        }
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
        if (this.props.isCountriessharebordersFetching === true
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
                    this.renderTitle()
                }
                {
                    this.renderLoading()
                }
                <div className="rule"/>
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
function mapStateToProps(state)
{
    console.log("CountryShareBorder mapStateToProps: ");
    const {
        isCountriessharebordersFetching,
        countriesshareborders
    } = state.countriessharebordersRoot;
    console.log(isCountriessharebordersFetching, countriesshareborders);

    return {
        isCountriessharebordersFetching, countriesshareborders
    }
}
export default connect(mapStateToProps, {fetchCountriesShareBorder}) (CountryShareBorder);
