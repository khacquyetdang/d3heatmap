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

var styles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '36px',
        height: '30px',
        right: '18px',
        top: '18px',
    },
    bmBurgerBars: {
        background: '#373a47'
        //background: '#e6e8f3'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.1em',
        height: '80%',
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

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
                <div id="outer-container" className="App">
                    <Menu
                        onStateChange={ this.onMenuStateChange }
                        isOpen={this.state.sidebarOpen}
                        right noOverlay disableOverlayClick pageWrapId={"page-wrap"} outerContainerId={ "outer-container" } styles={ styles } >
                        <Link  onClick={() => this.setSideBarOpen(false)} className="menu-item" to='/'>Temperature</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/gdp'>Gdp</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/cyclist'>Cyclist</Link>
                        <Link  onClick={() => this.setSideBarOpen(false)}  className="menu-item" to='/countriesshareborders'>Graphe Directed Force</Link>
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
