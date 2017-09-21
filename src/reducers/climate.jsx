import {
    FETCH_TEMPRATURE_REQUEST,
    FETCH_TEMPRATURE_SUCCESS,
    FETCH_TEMPRATURE_ERROR,
} from '../constants';

export function temperature(state = {}, action) {

    switch (action.type) {
        case FETCH_TEMPRATURE_SUCCESS: {
            if (action.response === null)
            {
                return state;
            }
            var periode = action.startYear + '-' + action.endYear;
            /*
            if (state.ISO3Country === undefined)
            {
                return Object.assign({}, state, {
                    ISO3Country: { periode : action.response }
                });
            }
            else {
                Object.assign({}, state, {
                    ISO3Country: { periode : action.response }
                });
            }*/
            var temperatureForCountry = {};
            temperatureForCountry[action.ISO3Country] = {};

            temperatureForCountry[action.ISO3Country][periode] = action.response;
            return Object.assign({},
                state,
                temperatureForCountry,
            );
        }
        default: {
            return state;
        }
    }
};

export function isTemperatureFetching (state = false, action) {
    switch (action.type) {
        case FETCH_TEMPRATURE_SUCCESS: {
            return false;
        }
        case FETCH_TEMPRATURE_REQUEST: {
            return true;
        }
        case FETCH_TEMPRATURE_ERROR: {
            return false;
        }
        default: {
            return false;
        }
    }
}