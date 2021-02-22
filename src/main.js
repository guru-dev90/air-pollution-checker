/* require and import section */

import './styles.css';
const axios = require('axios');
const _ = require('lodash');
const hereApiModule = require('@here/maps-api-for-javascript');

/* end require section */

/**/ 
const airQualityTableLegenda = {
  Good:	"Air quality is considered satisfactory, and air pollution poses little or no risk",
  Moderate:	"Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
  UnhealthyForSensitiveGroups:	"Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
  Unhealthy:	"Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects",
  VeryUnhealthy:	"Health warnings of emergency conditions. The entire population is more likely to be affected.",
  Hazardous:	"Health alert: everyone may experience more serious health effects"
};

/* */

/* getting references to contentScreen1Container elements*/

const contentScreen1Container = document.querySelector('#contentScreen1ContainerId');
const locationInsertInputText = document.querySelector('#locationInsertInputText');
const locationCheckButton = document.querySelector('#locationCheckButton');
const currentLocationCheckButton = document.querySelector('#currentLocationCheckButton');

/* end getting references to contentScreen1Container elements */


/* getting references to contentScreen2Container elements*/

const contentScreen2Container = document.querySelector('#contentScreen2ContainerId');
const checkAnoterLocationButton = document.querySelector('#checkAnoterLocationButton');
const cityProvinceNation = document.querySelector('#cityProvinceNationId');
const airQualityIndicator = document.querySelector('#airQualityIndicatorId');
const airQualityIndicatorDescription = document.querySelector('#airQualityIndicatorDescriptionId');
const pm25CellText = document.querySelector('#pm25CellTextId');
const pm10CellText = document.querySelector('#pm10CellTextId');
const o3CellText = document.querySelector('#o3CellTextId');
const no2CellText = document.querySelector('#no2CellTextId');
const so2CellText = document.querySelector('#so2CellTextId');
const coCellText = document.querySelector('#coCellTextId');
const sensorStationDescription = document.querySelector('#sensorStationDescriptionId');
const lastUpdate = document.querySelector('#lastUpdateId');

/* end getting references to contentScreen2Container elements*/


/* start event listener setting */

currentLocationCheckButton.addEventListener('click', () => {
  getLocationCoordinates(null);
});

locationCheckButton.addEventListener('click', () => {
  
  if( locationInsertInputText.value !== '' ){
    let locationInsertInputTextValue = locationInsertInputText.value;
    locationInsertInputText.value = '';
    getLocationCoordinates(locationInsertInputTextValue);
  }

});

checkAnoterLocationButton.addEventListener('click',() => {
  contentScreen1Container.style.display = 'block';
  contentScreen2Container.style.display = 'none';
});

/* end event listener setting */ 


/* PROGRAM FUNCTIONS START*/ 



function getLocationCoordinates(location){

  if(location){  // get the lat/lng of the location provided by the user
    
    // Instantiate a platform object:
    let platform = new H.service.Platform({
      'apikey': process.env.HERE_SERVICE_APIKEY
    });

    let service = platform.getSearchService();

    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    service.geocode({
      q: location
    }, (results) => {
      // takes just the first result
      let item = results.items[0];
      console.log('Uso delle API here');
      console.log('Risultati:');
      console.log(item);
      apiQuery(location,item.position.lat, item.position.lng);

      /*results.items.forEach((item) => {
        console.log('Uso delle API here');
        console.log('Risultati:');
        console.log(item);
        apiQuery(location,item.position.lat, item.position.lng);
      });*/
    }, alert); // vedere error callback alert


  }
  else{  // get the device's current location in lat/lng format
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    function success(pos) {
      let crd = pos.coords;
    
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      apiQuery( location, crd.latitude, crd.longitude );
    }
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);

  }

}

function apiQuery( location, lat, lng ){
  //pollution api key:  0b4dd2b230957a8157eddcbf4561fa70aab8e91b
  //let lat = 42.505699;
  //let lng = 12.656161;
  let endpointLink = 'https://api.waqi.info/feed/geo:' + lat + ';' + lng + '/?token=' + process.env.WAQI_SERVICE_APIKEY;

  //'https://api.waqi.info/feed/geo::lat;:lng/?token=:token'

  axios.get( endpointLink)
    .then(function (response) {
      console.log(response);
      parseJson( location, response );
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    }); 
}

function parseJson( cityToQuery, jsonResponse ){

  let airQualityIndicator = _.get(jsonResponse, 'data.data.aqi' );
  let airQualityIndicatorDescription;

  switch(true){
    case ( airQualityIndicator < 0 ):
      console.log("Errore airQualityIndicator < 0");
      break;
    case ( airQualityIndicator <= 50 ):
      airQualityIndicatorDescription = airQualityTableLegenda.Good;
      break;
    case ( airQualityIndicator <= 100 ):
      airQualityIndicatorDescription = airQualityTableLegenda.Moderate;
      break;
    case ( airQualityIndicator <= 150 ):
      airQualityIndicatorDescription = airQualityTableLegenda.UnhealthyforSensitiveGroups;
      break;
    case ( airQualityIndicator <= 200 ):
      airQualityIndicatorDescription = airQualityTableLegenda.Unhealthy;
      break;
    case ( airQualityIndicator <= 300 ):
      airQualityIndicatorDescription = airQualityTableLegenda.VeryUnhealthy;
      break;
    case ( airQualityIndicator > 300 ):
      airQualityIndicatorDescription = airQualityTableLegenda.Hazardous;
      break;
    default:
      console.log("Errore default");
      break;
  }
  
  let iaqiObject = _.get(jsonResponse, 'data.data.iaqi' );
  //console.log(iaqi);

  

  let sensorStationDescription = _.get(jsonResponse, 'data.data.city.name' );
  let lastUpdate = _.get(jsonResponse, 'data.data.time.s' ); // formattare in che formato ???

  displayData(cityToQuery,airQualityIndicator,airQualityIndicatorDescription,iaqiObject,sensorStationDescription,lastUpdate);
}

function displayData(cityProvinceNationString, airQualityIndicatorString, airQualityIndicatorDescriptionString, 
  iaqiObject, sensorStationDescriptionString, lastUpdateString){

    contentScreen1Container.style.display = 'none';
    contentScreen2Container.style.display = 'block';
    console.log(_.get(iaqiObject, 'pm25.v'));

    cityProvinceNation.innerHTML = _.capitalize(cityProvinceNationString);
    airQualityIndicator.innerHTML = airQualityIndicatorString;
    airQualityIndicatorDescription.innerHTML = airQualityIndicatorDescriptionString;
    pm25CellText.innerHTML = _.get(iaqiObject, 'pm25.v') ? _.get(iaqiObject, 'pm25.v') : '-' ;
    pm10CellText.innerHTML = _.get(iaqiObject, 'pm10.v') ? _.get(iaqiObject, 'pm10.v') : '-' ;
    o3CellText.innerHTML = _.get(iaqiObject, 'o3.v') ? _.get(iaqiObject, 'o3.v') : '-' ;
    no2CellText.innerHTML = _.get(iaqiObject, 'no2.v') ? _.get(iaqiObject, 'no2.v') : '-' ;
    so2CellText.innerHTML = _.get(iaqiObject, 'so2.v') ? _.get(iaqiObject, 'so2.v') : '-';
    coCellText.innerHTML = _.get(iaqiObject, 'co.v') ? _.get(iaqiObject, 'co.v') : '-';
    sensorStationDescription.innerHTML = 'Sensor Station Location: ' + sensorStationDescriptionString;
    lastUpdate.innerHTML = 'Data Last Update: ' + lastUpdateString;
  
}

function colorCell(){ // da colorazione a cella in base a valore iaqi

}