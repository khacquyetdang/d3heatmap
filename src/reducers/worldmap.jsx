import { combineReducers } from 'redux';
import {
    FETCH_WOLRDMAP_JSON_PATH_REQUEST,
    FETCH_WOLRDMAP_JSON_PATH_SUCCESS,
    FETCH_WOLRDMAP_JSON_PATH_ERROR,
} from '../constants';

function wolrdmappath(state = {}, action) {

    switch (action.type) {
        case FETCH_WOLRDMAP_JSON_PATH_SUCCESS: {
            if (action.response === null)
                return {};
            return action.response;
        }
        default: {
            return state;
        }
    }
};

function isWorldMapPathFetching (state = false, action) {
    switch (action.type) {
        case FETCH_WOLRDMAP_JSON_PATH_REQUEST: {
            return true;
        }
        case FETCH_WOLRDMAP_JSON_PATH_ERROR: {
            return false;
        }
        case FETCH_WOLRDMAP_JSON_PATH_SUCCESS: {
            return false;
        }
        default: {
            return false;
        }
    }
}

const worldmap = combineReducers({isWorldMapPathFetching, wolrdmappath});

export default worldmap;
