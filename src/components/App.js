import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClimatHeatMap from './ClimatHeatMap'
import GdpBarChart from './GdpBarChart';
import Controls from './Controls';
import CyclistScatterplot from './CyclistScatterplot';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './styles/App.css';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { fetchCountries, fetchCountryGdp } from '../actions'
import Sidebar from 'react-sidebar';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: false
        }

        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen = (open) => {
        this.setState({sidebarOpen: open});
    }

    componentDidMount()
    {
        if (this.props.countries === undefined ||
            this.props.countries !== null || this.props.countries.length === 0
        ) {
            this.props.fetchCountries();
        }
    }

    onCountrySelectedForGdp = (country) => {
        var intervalDate = {
            start:'1960',
            end:'2017'
        };
        this.props.fetchCountryGdp(country, intervalDate);
    }
    render() {
        return (
            <Router>
                <div className="App">
                    <div><Link to='/'>Temperature</Link> {" | "}
                    <Link to='/gdp'>Gdp</Link> {" | "}
                    <Link to='/cyclist'>Cyclist</Link>
                </div>
                <div>
                    <Route exact path='/' component={ClimatHeatMap} />
                    <Route path='/cyclist' component={CyclistScatterplot}/>
                    <Route path='/gdp' component={GdpBarChart}/>
                </div>
            </div>
        </Router>);
    }
}

function mapStateToProps(state)
{
    const { countries, isCountriesFetching } = state;
    return {
        countries,
        isCountriesFetching
    }
}

export default connect(mapStateToProps, {fetchCountryGdp, fetchCountries}) (App);
