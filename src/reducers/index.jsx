import { combineReducers } from 'redux';

import { isCyclistFetching, cyclist } from './cyclist';

import { isTemperatureFetching, temperature } from './climate';

import { countries,
    isCountriesFetching,
    isCountryGDPFetching,
    countryGdp } from './gdp';


const appReducer = combineReducers({
    countries,
    isCountriesFetching,
    isCountryGDPFetching,
    countryGdp,
    isCyclistFetching,
    cyclist,
    isTemperatureFetching,
    temperature
});


export default appReducer
