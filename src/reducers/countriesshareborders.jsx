import {
    FETCH_COUNTRIES_SHARE_BORDER_SUCCESS,
    FETCH_COUNTRIES_SHARE_BORDER_REQUEST,
    FETCH_COUNTRIES_SHARE_BORDER_ERROR,
} from '../constants';

export function countriesshareborders(state = {}, action) {

    switch (action.type) {
        case FETCH_COUNTRIES_SHARE_BORDER_SUCCESS: {
            if (action.response === null)
            {
                return {};
            }
            return action.response;
        }
        default: {
            return state;
        }
    }
};

export function isCountriessharebordersFetching (state = false, action) {
    switch (action.type) {
        case FETCH_COUNTRIES_SHARE_BORDER_REQUEST: {
            return true;
        }
        case FETCH_COUNTRIES_SHARE_BORDER_SUCCESS: {
            return false;
        }
        case FETCH_COUNTRIES_SHARE_BORDER_ERROR: {
            return false;
        }
        default: {
            return false;
        }
    }
}
