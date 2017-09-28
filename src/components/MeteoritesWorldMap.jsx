
import React, { Component } from 'react';
import * as d3  from 'd3';
import d3tip from 'd3-tip';
import { svg_dimensions as svg_dimensions } from '../constants';
import { connect } from 'react-redux';
import { fetchWorldMapJsonPath, fetchMeteoriteJsonPath } from '../actions';
import _ from 'lodash';
import './styles/MeteoritesWorldMap.css';

class MeteoritesWorldMap extends Component {

    componentDidMount()
    {
        if (_.isEmpty(this.props.worldmap.wolrdmappath))
        {
            this.props.fetchWorldMapJsonPath();
        }
        if (_.isEmpty(this.props.worldmap.meteoritepath))
        {
            this.props.fetchMeteoriteJsonPath();
        }

        if (_.isEmpty(this.props.worldmap.wolrdmappath) === false
        && _.isEmpty(this.props.worldmap.meteoritepath) === false) {
            this.createMeteoritesWorldMap();
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        if (_.isEmpty(this.props.worldmap.wolrdmappath) === false
        && _.isEmpty(this.props.worldmap.meteoritepath) === false) {
            this.createMeteoritesWorldMap();
        }
        //this.props.fetchCountryGdp(this.state.selectValue, this.state.intervalDate);
    }
    createMeteoritesWorldMap = () =>
    {
        var margin = svg_dimensions.margin,
        width = svg_dimensions.width,
        height = svg_dimensions.height;

        var color = d3.scaleThreshold()
        .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);
        var path = d3.geoPath();

        d3.select(this.node).selectAll("*").remove();

        var svg = d3.select(this.node)
        .attr("width", "100%")
        .attr("height", "100%")
        //.attr("viewBox","0 0 " + (width - margin.left - margin.right) + " " + (height  - margin.top - margin.bottom))
        //.attr("viewBox","0 0 " + (width + 50) + " " + (height- 50))
        .append('g')
        .attr('class', 'map');


        this.props.worldmap.meteoritepath.features = this.props.worldmap.meteoritepath.features.map(function(d)
        {
            if (d.properties.mass === undefined || d.properties.mass === null)
            {
                d.properties.mass = 1.;
            } else {
                d.properties.mass = parseFloat(d.properties.mass)
            }
            return d;
        });
        var minMass = d3.min(this.props.worldmap.meteoritepath.features, function(d) { return (d.properties.mass); });
        var maxMass = d3.max(this.props.worldmap.meteoritepath.features, function(d) { return (d.properties.mass); });

/*
        var distanceMinMax = maxMass - minMass;
        var rangeArr = [minMass];
        var step = distanceMinMax / 20;
        var index = minMass + step;
        while (index < maxMass)
        {
            rangeArr.push(index);
            index = index + step;
        }
        rangeArr.push(maxMass);*/

        var rangeArr = _.range(0.1, 5, 0.2);//[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0, 1.1, 1.2, 1.3 ];
        //rangeArr = rangeArr.map((d) =>  d * 3);
        var xScale = d3.scaleOrdinal().range(rangeArr);
        xScale.domain(this.props.worldmap.meteoritepath.features.map(function(d) { return (d.properties.mass); }));

        //var colorRange = d3.schemeCategory10;
        var colorRange = [d3.rgb("#007AFF"), d3.rgb('#FFF500')];
        var colorScale = d3.scaleLinear().range(colorRange).interpolate(d3.interpolateHcl);
        colorScale.domain(this.props.worldmap.meteoritepath.features.map(function(d) { return (d.properties.mass); }));

        console.log("domain : ", this.props.worldmap.meteoritepath.features.map(function(d) { return (d.properties.mass); }));
        var projection = d3.geoMercator()
        .scale(125);
        //.translate( [width / 2, height / 1.45]);*/
        //var projection = d3.geoNaturalEarth1();

        var tip = d3tip()
        .attr('class', 'd3-tip')
        .offset([5, 0])
        .html(function(d) {
            var properties = d.properties;

            var res =   "<div class=\"tooltipDot\">"+ " Name: " + properties.name + "<br/>"
            + " Mass: " + properties.mass + "<br/>"
            + " fall: " + properties.fall + "<br/>"
            + " Year: " + properties.year + "<br/>"
            + "</div>";

            res = res + "</div>";
            return res;
        });

        path.projection(projection);

        svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(this.props.worldmap.wolrdmappath.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return '#238B27'; })//"#246024"; })
        .style('stroke', 'rgba(0,0,0,0.5)')
        .style('stroke-width', 1.00)
        .style("opacity",0.5);

        var meteorite = svg.append("g")
        .attr("class", "meteorite")
        .selectAll("circle")
        .data(this.props.worldmap.meteoritepath.features)
        .enter().append("circle")
        .attr("cx", function(d) {
            if (d.geometry !== null)
            {
                //console.log("projection", projection(d.geometry.coordinates));
                return projection(d.geometry.coordinates)[0];
            }
            return 20;
        })
        .attr("cy", function(d) {
            if (d.geometry !== null)
            {
                return projection(d.geometry.coordinates)[1];
            }
            return 10;

        })
        .attr("r", function(d){
            //console.log("size radius", "" + xScale(d.properties.mass) + "px");
            return "" + xScale(d.properties.mass) + "";
            //return d.properties.mass / maxMass * 10;
        })
        .style("fill", function(d) { return colorScale(d.properties.mass); })//"#246024"; })
        .style("opacity",0.5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);;

        meteorite.call(tip);
        // tooltips
    }
    render()
    {
        var margin = svg_dimensions.margin;
        var width= svg_dimensions.width;
        var height = svg_dimensions.height;
        var widthWithMargin = width + margin.left + margin.right;
        var heightWithMargin = height + margin.top + margin.bottom;

        const svgContainerStyle = {
          width: width,
          height: height,
          overflow: 'unset'
        };
        const svgStyle = {
          overflow: 'hidden',
          border: 'none'
        };

        return (
            <div className="Container">
                <div className="TitleContainer">
                    <div className='TitleSVG'>Meteorites WorldMap</div>
                </div>
                <div className="svg_container_worldmap" style={svgContainerStyle}>
                    <svg id="heatmapchart"
                        width={width}
                        height={height}
                        style={svgStyle}
                        xmlns="http://www.w3.org/2000/svg"
                        ref={node => this.node = node}>
                    </svg>
                </div>
            </div>);

        /*
        return (
        <div className="Container">
        Meteorites WorldMap
        <div className="svg_container">
        <svg id="heatmapchart"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        ref={node => this.node = node}>
        </svg>
        </div>
        </div>);
        */
    }
}
/** It is better to set these attribute in the code
*/
function mapStateToProps(state)
{
    const {
        worldmap
    } = state;

    return {
        worldmap
    }
}
export  default connect(mapStateToProps, {fetchWorldMapJsonPath, fetchMeteoriteJsonPath}) (MeteoritesWorldMap);
