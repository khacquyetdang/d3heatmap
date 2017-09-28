import * as webapi  from '../api';
import {
    FETCH_WOLRDMAP_JSON_PATH_ERROR,
    FETCH_WOLRDMAP_JSON_PATH_REQUEST,
    FETCH_WOLRDMAP_JSON_PATH_SUCCESS } from '../constants';

export function fetchWorldMapJsonPathRequest() {
    return {
        type: FETCH_WOLRDMAP_JSON_PATH_REQUEST,
    }
};
//

export function fetchWorldMapJsonPathSuccess(response) {
    return {
        type: FETCH_WOLRDMAP_JSON_PATH_SUCCESS,
        response
    }
};

export function fetchWorldMapJsonPathFailure(error) {
    return {
        type: FETCH_WOLRDMAP_JSON_PATH_ERROR,
        error
    }
};

export const fetchWorldMapJsonPath = () => (dispatch, getState) => {
    console.log("fetchWorldMapJsonPath ");
    dispatch(fetchWorldMapJsonPathRequest());
    webapi.fetchWorldMapJsonPath().then(response => {
        dispatch(fetchWorldMapJsonPathSuccess(response));
    },
    error => {
        dispatch(fetchWorldMapJsonPathFailure(error.message || 'Something went wrong.'));
    });
}
