import {
    FETCH_CYCLIST_REQUEST,
    FETCH_CYCLIST_SUCCESS,
    FETCH_CYCLIST_ERROR,
} from '../constants';

export function cyclist(state = [], action) {

    switch (action.type) {
        case FETCH_CYCLIST_SUCCESS: {
            if (action.response === null)
                return [];
            return action.response;
        }
        default: {
            return state;
        }
    }
};

export function isCyclistFetching (state = false, action) {
    switch (action.type) {
        case FETCH_CYCLIST_REQUEST: {
            return true;
        }
        case FETCH_CYCLIST_SUCCESS: {
            return false;
        }
        case FETCH_CYCLIST_ERROR: {
            return false;
        }
        default: {
            return false;
        }
    }
}
