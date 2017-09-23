import * as webapi  from '../api';
import { FETCH_TEMPRATURE_REQUEST,
    FETCH_TEMPRATURE_SUCCESS,
    FETCH_TEMPRATURE_ERROR,
    SET_COUNTRY_TEMEPRATURE
} from '../constants';


export function setCountryTemperature(iso3Code) {
    return {
        type: SET_COUNTRY_TEMEPRATURE,
        country: iso3Code
    }
};

export function fetchTempratureRequest() {
    return {
        type: FETCH_TEMPRATURE_REQUEST,
    }
};
//

export function fetchTempratureSuccess(response) {
    return {
        type: FETCH_TEMPRATURE_SUCCESS,
        response
    }
};

export function fetchTempratureFailure(error) {
    return {
        type: FETCH_TEMPRATURE_ERROR,
        error
    }
};

export const fetchTemperature = () => (dispatch, getState) => {
    console.log("fetchCyclist ");
    dispatch(fetchTempratureRequest());
    const onCompleted = (response) => {
        dispatch(fetchTempratureSuccess(response));
    };
    const onError = (error) => {
        dispatch(fetchTempratureFailure(error.message || 'Something went wrong.'));
    };
    webapi.fetchTemperatureData(onCompleted, onError);
}
