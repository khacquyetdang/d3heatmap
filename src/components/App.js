import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClimatHeatMap from './ClimatHeatMap';
import GdpBarChart from './GdpBarChart';
import CountryShareBorder from './CountryShareBorder';
import Controls from './Controls';
import Footer from './Footer';
import CyclistScatterplot from './CyclistScatterplot';
import './styles/App.css';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { fetchCountries, fetchCountryGdp } from '../actions'
import Sidebar from 'react-sidebar';
import { intervalDateGdp } from '../constants';
import { slide as Menu } from 'react-burger-menu';
import styles from './styles/BurgerMenu';
import MeteoritesWorldMap from './MeteoritesWorldMap';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: false
        }
    }

    setSideBarOpen = (open) => {
        this.setState({sidebarOpen: open});
        this.forceUpdate();
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

    onMenuStateChange = (state) => {
        this.setSideBarOpen(state.isOpen);
        return state.isOpen;
    };
    render() {
        return (
            <Router>
                <div id="outer-container" className="App"
                    onClick={() => this.setSideBarOpen(false)}>
                    <Menu
                        onStateChange={ this.onMenuStateChange }
                        isOpen={this.state.sidebarOpen}
                        right noOverlay disableOverlayClick pageWrapId={"page-wrap"} outerContainerId={ "outer-container" } styles={ styles } >
                        <Link  onClick={() => this.setSideBarOpen(false)} className="menu-item" to='/'>Temperature</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/gdp'>Gdp</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/cyclist'>Cyclist</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/countriesshareborders'>Graphe Directed Force</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/meteoritesworldmap'>Meteorites Worldmap</Link>

                    </Menu>
                    <div id="page-wrap" className="AppContent">
                        {
                            /*
                            <Menu pageWrapId={"page-wrap"} className="menu" >
                            <Link  className="menu" to='/'>Temperature</Link> {" | "}
                            <Link  className="menu" to='/gdp'>Gdp</Link> {" | "}
                            <Link  className="menu" to='/cyclist'>Cyclist</Link> {" | "}
                            <Link  className="menu" to='/countriesshareborders'>Graphe Directed Force</Link>
                            </Menu>
                            */
                        }
                        <div>
                            <Route exact path='/' component={ClimatHeatMap} />
                            <Route path='/cyclist' component={CyclistScatterplot}/>
                            <Route path='/gdp' component={GdpBarChart}/>
                            <Route path='/countriesshareborders' component={CountryShareBorder}/>
                            <Route path='/meteoritesworldmap' component={MeteoritesWorldMap}/>

                        </div>
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
