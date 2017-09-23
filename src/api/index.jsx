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
    var allPairDate = [{ start: 1920, end: 1939},
        { start: 1940, end: 1959},
        { start: 1960, end: 1979},
        { start: 1980, end: 1999}];

    var urlArr = allPairDate.map(pair => {
        var startYear = pair.start;
        var endYear = pair.end;
        return `http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/${startYear}/${endYear}/${ISO3Country}.JSON`;
    });

    const grabContent = url => fetch(url)
    .then(res => res.json());

    return Promise
    .all(urlArr.map((url) => grabContent(url)))
    .then((contentArr) => {
        console.log(`Urls ${urlArr} were grabbed`);
        console.log(contentArr);
        var contentJsonArr = contentArr.reduce((res, content, index) => {
            return res.concat(content);
        }, []);
        console.log("arrayJson ");
        console.log(contentJsonArr);

        var startYear= 1920;
        var contentJsonArrPlat = contentJsonArr.reduce((res, content, index) => {
            var newContent = [];

            content.monthVals.forEach((data, indexMonth) => {
                var newData = {};
                newData.year = startYear + index;
                newData.month = indexMonth + 1;
                newData.temperature = data;
                newContent.push(newData);
            });
            console.log("index  : ", index, " year :", startYear + index)
            return res.concat(newContent);
        }, []);

        return contentJsonArrPlat;
    })
    .catch((error) => {
        console.error(error);
    });
}
