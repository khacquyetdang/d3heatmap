//var myHeaders = new Headers({'Access-Control-Allow-Origin' : '*',
//'Access-Control-Allow-Credentials': 'true',
//'Origin': 'http://localhost:3000'});
var myHeaders = new Headers();
/*
myHeaders.append('Access-Control-Allow-Origin', 'https://api.worldbank.org');
myHeaders.append('Access-Control-Allow-Credentials', 'true');
myHeaders.append('Origin', 'https://api.worldbank.org');
*/
var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

export function fetchCountryData() {
    return fetch('https://api.worldbank.org/v2/countries?format=json&per_page=1000', myInit)
    .then((response) => {
        console.log(response);
        return response.json();
     }
    ).then((responseJson) => {
        console.log("result fetchCountryData");
        console.log(responseJson);
        return responseJson;
    })
    .catch((error) => {
        console.error(error);
    });
}

export function fetchCountryGDP(countryId, intervalDate, page) {
    var urlCountryGdp = 'https://api.worldbank.org/v2/countries/' + countryId + '/indicators/NY.GDP.MKTP.CD/?date=' + intervalDate.start +  ":"
    + intervalDate.end + '&format=json' + '&page=' + "&per_page=1000";
    console.log('urlCountryGdp : ', urlCountryGdp);
    return fetch(urlCountryGdp, myInit)
    .then((response) => response.json()).then((responseJson) => {
        console.log("result fetchCountryGdpData");
        console.log(responseJson);
        return responseJson;
    })
    .catch((error) => {
        console.error(error);
    });
}



export function fetchCyclistData() {
    var urlCyclistData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    return fetch(urlCyclistData, myInit)
    .then((response) => response.json()).then((responseJson) => {
        console.log("result fetch Cyclist Data");
        console.log(responseJson);
        return responseJson;
    })
    .catch((error) => {
        console.error(error);
    });
}


export function fetchTemperatureData(ISO3Country, startYear, endYear) {
    var urlTemperatureData = `http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/${startYear}/${endYear}/${ISO3Country}.JSON`;
    return fetch(urlTemperatureData, myInit)
    .then((response) => response.json()).then((responseJson) => {
        console.log("result fetchTemperatureData", urlTemperatureData);
        console.log(responseJson);
        return responseJson;
    })
    .catch((error) => {
        console.error(error);
    });
}
