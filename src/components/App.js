import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClimatHeatMap from './ClimatHeatMap'
import GdpBarChart from './GdpBarChart';
import Controls from './Controls';
import Footer from './Footer';
import CyclistScatterplot from './CyclistScatterplot';
import './styles/App.css';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { fetchCountries, fetchCountryGdp } from '../actions'
import Sidebar from 'react-sidebar';
import { intervalDateGdp } from '../constants';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: true
        }

        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen = (open) => {
        this.setState({sidebarOpen: open});
    }

    componentDidMount()
    {
        if (this.props.countries === undefined ||
            this.props.countries === null || this.props.countries.length === 0
        ) {
            this.props.fetchCountries();
        }

    }
    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        if (this.props.countryGdp === undefined ||
            this.props.countryGdp === null || this.props.countryGdp.length === 0
        ) {
            this.props.fetchCountryGdp("FR", intervalDateGdp);
        }

    }

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="abcmenu" >
                        <Link to='/'>Temperature</Link> {" | "}
                        <Link  to='/gdp'>Gdp</Link> {" | "}
                        <Link  to='/cyclist'>Cyclist</Link>
                    </div>
                    <div>
                        <Route exact path='/' component={ClimatHeatMap} />
                        <Route path='/cyclist' component={CyclistScatterplot}/>
                        <Route path='/gdp' component={GdpBarChart}/>
                    </div>
                    <Footer />
                </div>
        </Router>);
    }
}

function mapStateToProps(state)
{
    const { countries, isCountriesFetching, countryGdp } = state;
    return {
        countries,
        isCountriesFetching,
        countryGdp
    }
}

export default connect(mapStateToProps, {fetchCountryGdp, fetchCountries}) (App);
