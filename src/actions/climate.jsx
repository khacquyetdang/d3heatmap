import * as webapi  from '../api';
import { FETCH_TEMPRATURE_REQUEST, FETCH_TEMPRATURE_SUCCESS, FETCH_TEMPRATURE_ERROR } from '../constants';

export function fetchTempratureRequest() {
    return {
        type: FETCH_TEMPRATURE_REQUEST,
    }
};
//

export function fetchTempratureSuccess(ISO3Country, startYear, endYear,response) {
    return {
        type: FETCH_TEMPRATURE_SUCCESS,
        ISO3Country, startYear, endYear,
        response
    }
};

export function fetchTempratureFailure(error) {
    return {
        type: FETCH_TEMPRATURE_ERROR,
        error
    }
};

export const fetchTemperature = (ISO3Country, startYear, endYear) => (dispatch, getState) => {
    console.log("fetchCyclist ");
    dispatch(fetchTempratureRequest());
    webapi.fetchTemperatureData(ISO3Country, startYear, endYear).then(response => {
        dispatch(fetchTempratureSuccess(ISO3Country, startYear, endYear, response));
    },
    error => {
        dispatch(fetchTempratureFailure(error.message || 'Something went wrong.'));
    });
}
