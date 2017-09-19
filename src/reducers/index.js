import { FETCH_COUNTRY_REQUEST,
    FETCH_COUNTRY_SUCCESS,
    FETCH_COUNTRY_GDP_REQUEST,
    FETCH_COUNTRY_GDP_SUCCESS,
    FETCH_COUNTRY_GDP_FAILURE,
    FETCH_COUNTRY_GDP_END
} from '../constants.js';


import {isCyclistFetching, cyclist} from './cyclist';

import {combineReducers} from 'redux';



export function countryGdp(state = [], action) {

    switch (action.type) {
        case FETCH_COUNTRY_GDP_SUCCESS: {
            if (action.response[1] === null)
                return [];
            return action.response[1];
        }
        default: {
            return state;
        }
    }
};


export function countries(state = [], action) {

    switch (action.type) {
        case FETCH_COUNTRY_SUCCESS: {
            if (action.response[1] === null)
                return [];
            return action.response[1];
        }
        default: {
            return state;
        }
    }
};

export function isCountryGDPFetching (state = false, action) {
    switch (action.type) {
        case FETCH_COUNTRY_GDP_REQUEST: {
            return true;
        }
        case FETCH_COUNTRY_GDP_SUCCESS: {
            return false;
        }
        default: {
            return state;
        }
    }
}

export function isCountriesFetching (state = false, action) {
    switch (action.type) {
        case FETCH_COUNTRY_REQUEST: {
            return true;
        }
        case FETCH_COUNTRY_SUCCESS: {
            return false;
        }
        default: {
            return state;
        }
    }
}

const appReducer = combineReducers({
    countries,
    isCountriesFetching,
    isCountryGDPFetching,
    countryGdp,
    isCyclistFetching,
    cyclist
});


export default appReducer
