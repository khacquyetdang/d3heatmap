import { FETCH_COUNTRY_REQUEST,
    FETCH_COUNTRY_SUCCESS,
    FETCH_COUNTRY_GDP_REQUEST,
    FETCH_COUNTRY_GDP_SUCCESS,
    FETCH_COUNTRY_GDP_FAILURE,
    FETCH_COUNTRY_GDP_END,
    SET_COUNTRY_GDP
} from '../constants';


export function countryGdpSelect(state = "FRA", action) {

    switch (action.type) {
        case SET_COUNTRY_GDP: {
            return action.country;
        }
        default: {
            return state;
        }
    }
};

export function countryGdp(state = [], action) {

    switch (action.type) {
        case FETCH_COUNTRY_GDP_SUCCESS: {
            if (action.response[1] === null)
            return [];
            return action.response[1];
        }
        default: {
            return state;
        }
    }
};


export function countries(state = [], action) {

    switch (action.type) {
        case FETCH_COUNTRY_SUCCESS: {
            if (action.response[1] === null)
            return [];
            return action.response[1];
        }
        default: {
            return state;
        }
    }
};

export function countriesById(state = {}, action) {

    switch (action.type) {
        case FETCH_COUNTRY_SUCCESS: {
            if (action.response[1] === null)
            {
                return {};
            }
            var countries = action.response[1];
            return countriesOptions = countries.reduce(function(map, country) {
                map[country.id] = { value : country.iso3Code,
                    iso3code : country.id,
                    iso2Code : country.iso2Code,
                    label : country.name
                };
                return map;
            }, {});
        }
        default: {
            return state;
        }
    }
};

export function countriesOptions(state = [], action) {

    switch (action.type) {
        case FETCH_COUNTRY_SUCCESS: {
            if (action.response[1] === null)
            {
                return [];
            }
            var countries = action.response[1];
            return countriesOptions = countries.map((country) => {
                return { value : country.id,
                    iso3code : country.id,
                    iso2Code : country.iso2Code,
                    label : country.name };
                }
            );
        }
        default: {
            return state;
        }
    }
};


export function isCountryGDPFetching (state = false, action) {
    switch (action.type) {
        case FETCH_COUNTRY_GDP_REQUEST: {
            return true;
        }
        case FETCH_COUNTRY_GDP_SUCCESS: {
            return false;
        }
        default: {
            return state;
        }
    }
}

export function isCountriesFetching (state = false, action) {
    switch (action.type) {
        case FETCH_COUNTRY_REQUEST: {
            return true;
        }
        case FETCH_COUNTRY_SUCCESS: {
            return false;
        }
        default: {
            return state;
        }
    }
}
