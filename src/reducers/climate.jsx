import {
    FETCH_TEMPRATURE_REQUEST,
    FETCH_TEMPRATURE_SUCCESS,
    FETCH_TEMPRATURE_ERROR,
    SET_COUNTRY_TEMEPRATURE,
} from '../constants';

export function countryTemperatureSelect(state = "FRA", action){

    switch (action.type) {
        case SET_COUNTRY_TEMEPRATURE: {
            return action.country;
        }
        default: {
            return state;
        }
    }
};
export function temperature(state = {}, action) {

    switch (action.type) {
        case FETCH_TEMPRATURE_SUCCESS: {
            if (action.response === null)
            {
                return state;
            }

            var temperatureByCountry = action.response.data.reduce((accu, item) => {
                if (accu[item.Country] === undefined || accu[item.Country] === null)
                {
                    accu[item.Country] = [];
                }
                accu[item.Country].push(item);
                return accu;
            }, {});
            return temperatureByCountry;
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
