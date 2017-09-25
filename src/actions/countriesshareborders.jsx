import * as webapi  from '../api';
import { FETCH_COUNTRIES_SHARE_BORDER_REQUEST,
    FETCH_COUNTRIES_SHARE_BORDER_SUCCESS,
    FETCH_COUNTRIES_SHARE_BORDER_ERROR,
} from '../constants';

export function fetchCountriesShareBorderRequest() {
    return {
        type: FETCH_COUNTRIES_SHARE_BORDER_REQUEST,
    }
};
//

export function fetchCountriesShareBorderSuccess(response) {
    return {
        type: FETCH_COUNTRIES_SHARE_BORDER_SUCCESS,
        response
    }
};

export function fetchCountriesShareBorderFailure(error) {
    return {
        type: FETCH_COUNTRIES_SHARE_BORDER_ERROR,
        error
    }
};

export const fetchCountriesShareBorder = () => (dispatch, getState) => {
    console.log("fetchCyclist ");
    dispatch(fetchCountriesShareBorderRequest());
    webapi.fetchCountriesShareBorder().then(response => {
        dispatch(fetchCountriesShareBorderSuccess(response));
    },
    error => {
        dispatch(fetchCountriesShareBorderFailure(error.message || 'Something went wrong.'));
    });
}
