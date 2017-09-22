import * as webapi  from '../api';
// key for localStorage
// import { normalize } from 'normalizr';
// import * as schema from './schema';
import { FETCH_COUNTRY_REQUEST,
    FETCH_COUNTRY_SUCCESS,
    FETCH_COUNTRY_FAILURE,
    FETCH_COUNTRY_GDP_REQUEST,
    FETCH_COUNTRY_GDP_SUCCESS,
    FETCH_COUNTRY_GDP_END,
    FETCH_COUNTRY_GDP_FAILURE,
    SET_COUNTRY_GDP
} from '../constants';


export function setCountryGdp(iso2Code) {
    return {
        type: SET_COUNTRY_GDP,
        country: iso2Code
    }
};

export function fetchCountryRequest() {
    return {
        type: FETCH_COUNTRY_REQUEST,
    }
};
//

export function fetchCountrySuccess(response) {
    return {
        type: FETCH_COUNTRY_SUCCESS,
        response
    }
};

export function fetchCountriesFailure(error) {
    return {
        type: FETCH_COUNTRY_FAILURE,
        error
    }
};



export function fetchCountryGdpRequest() {
    return {
        type: FETCH_COUNTRY_GDP_REQUEST,
    }
};

export function fetchCountryGdpSuccess(response) {
    return {
        type: FETCH_COUNTRY_GDP_SUCCESS,
        response
    }
};

export function fetchCountryGdpEnd() {
    return {
        type: FETCH_COUNTRY_GDP_END,
    }
};


export function fetchCountryGdpFailure(error) {
    return {
        type: FETCH_COUNTRY_GDP_FAILURE,
        error
    }
};


export const fetchCountries = () => (dispatch, getState) => {
    console.log("fetchCountries actions");
    dispatch(fetchCountryRequest());
    webapi.fetchCountryData().then(response => {
        console.log(response);

        dispatch(fetchCountrySuccess(response));
    },
    error => {
        dispatch(fetchCountriesFailure(error.message || 'Something went wrong.'));
    });
}


export const fetchCountryGdp = (countryId, intervalDate) => (dispatch, getState) => {
    console.log("fetchCountryGdp actions countryId", countryId);
    dispatch(fetchCountryGdpRequest());
    var page = 1;
    webapi.fetchCountryGDP(countryId, intervalDate, page).then(response => {
        dispatch(fetchCountryGdpSuccess(response));
    },
    error => {
        dispatch(fetchCountryGdpFailure(error.message || 'Something went wrong.'));
    });
}
