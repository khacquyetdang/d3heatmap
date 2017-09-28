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

import worldmap from './worldmap';

const countriessharebordersReducer = combineReducers({countriesshareborders, isCountriessharebordersFetching});
const appReducer = combineReducers({
    worldmap,
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
