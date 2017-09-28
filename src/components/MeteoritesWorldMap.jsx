import React, { Component } from 'react';
import * as d3  from 'd3';
import { svg_dimensions as svg_dimensions } from '../constants';
import { connect } from 'react-redux';
import { fetchWorldMapJsonPath } from '../actions';
import _ from 'lodash';

class MeteoritesWorldMap extends Component {

    componentDidMount()
    {
        if (_.isEmpty(this.props.worldmap.wolrdmappath))
        {
            this.props.fetchWorldMapJsonPath();
        }
        else {
            this.createMeteoritesWorldMap();
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        if (_.isEmpty(this.props.worldmap.wolrdmappath) === false)
        {
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

        var svg = d3.select(this.node)
        .attr("width", "100%")
        .attr("height", "100%")
        //.attr("viewBox","0 0 " + (width - margin.left - margin.right) + " " + (height  - margin.top - margin.bottom))
        //.attr("viewBox","0 0 " + (width + 50) + " " + (height- 50))
        .append('g')
        .attr('class', 'map');


        var projection = d3.geoMercator()
        .scale(125);
        //.translate( [width / 2, height / 1.45]);*/
        //var projection = d3.geoNaturalEarth1();

        path.projection(projection);

        svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(this.props.worldmap.wolrdmappath.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return "green"; })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)
        // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d) {

            d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){

            d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

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
        };

        return (
            <div className="Container">
                <div className="TitleContainer">
                    <div className='TitleSVG'>Meteorites WorldMap</div>
                </div>
                <div className="svg_container" style={svgContainerStyle}>
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
export  default connect(mapStateToProps, {fetchWorldMapJsonPath}) (MeteoritesWorldMap);
