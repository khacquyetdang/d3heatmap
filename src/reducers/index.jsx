import { combineReducers } from 'redux';

import { isCyclistFetching, cyclist } from './cyclist';

import { isTemperatureFetching, temperature,
    countryTemperatureSelect
} from './climate';

import {countriesshareborders, isCountriessharebordersFetching} from './countriesshareborders';


import { countries,
    countriesOptions,
    countriesById,
    isCountriesFetching,
    isCountryGDPFetching,
    countryGdp,
    countryGdpSelect
} from './gdp';


const countriessharebordersReducer = combineReducers({countriesshareborders, isCountriessharebordersFetching});
const appReducer = combineReducers({
    countriessharebordersRoot : countriessharebordersReducer,
    countries,
    countriesOptions,
    countriesById,
    isCountriesFetching,
    isCountryGDPFetching,
    countryGdp,
    countryGdpSelect,
    isCyclistFetching,
    cyclist,
    isTemperatureFetching,
    temperature,
    countryTemperatureSelect
});


export default appReducer
