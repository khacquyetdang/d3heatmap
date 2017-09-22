import { combineReducers } from 'redux';

import { isCyclistFetching, cyclist } from './cyclist';

import { isTemperatureFetching, temperature,
    countryTemperatureSelect
} from './climate';

import { countries,
    countriesOptions,
    countriesById,
    isCountriesFetching,
    isCountryGDPFetching,
    countryGdp,
    countryGdpSelect
} from './gdp';


const appReducer = combineReducers({
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
