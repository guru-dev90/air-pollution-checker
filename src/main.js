/* require and import section */

import './styles.css';
//import good from './img/moderate.svg';
import { Tooltip, Toast, Popover } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { hasNumericValue, smaller, smallerEq, larger } from 'mathjs';
const { hasNumericValue, smaller, smallerEq, larger } = require('mathjs');
/*const { hasNumericValue } = require('mathjs');
const { smaller } = require('mathjs');
const { smallerEq } = require('mathjs');
const { larger } = require('mathjs');*/
const goodImage = new URL('./img/good.svg', import.meta.url);
const moderateImage = new URL('./img/moderate.svg', import.meta.url);
const unhealthyForSensitiveGroupImage = new URL('./img/unhealthy_for_sensitive_group.svg', import.meta.url);
const unhealthyImage = new URL('./img/unhealthy.svg', import.meta.url);
const very_unhealthyImage = new URL('./img/very_unhealthy.svg', import.meta.url);
const hazardousImage = new URL('./img/hazardous.svg', import.meta.url);
const axios = require('axios');
const _ = require('lodash');
const hereApiModule = require('@here/maps-api-for-javascript');

/* end require and import section */


/* Start global error handler definition */

window.onerror = function(message, url, line, col, error) {

  console.log(message + " in script " + url + " at line: " + line + " and col: " + col );
  console.log("\nFollowing is the error object:\n");
  console.log(error);
  errorBulletinBoard.innerText = "Error: A general error occurred! Please, reload the page";

  currentLocationCheckButton.removeAttribute('disabled');
  locationCheckButton.removeAttribute('disabled');

};

/* End global error handler definition */


/* air quality indicator legenda */ 

const airQualityTableLegenda = {
  Good:	"Air quality is considered satisfactory, and air pollution poses little or no risk",
  Moderate:	"Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
  UnhealthyForSensitiveGroups:	"Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
  Unhealthy:	"Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects",
  VeryUnhealthy:	"Health warnings of emergency conditions. The entire population is more likely to be affected.",
  Hazardous:	"Health alert: everyone may experience more serious health effects"
};

/* end air quality indicator legenda */


/* getting references to contentScreen1Container elements*/

const contentScreen1Container = document.querySelector('#contentScreen1ContainerId');
const locationInsertInputText = document.querySelector('#locationInsertInputText');
const locationCheckButton = document.querySelector('#locationCheckButtonId');
const currentLocationCheckButton = document.querySelector('#currentLocationCheckButtonId');

/* end getting references to contentScreen1Container elements */


/* getting references to contentScreen2Container elements*/

const contentScreen2Container = document.querySelector('#contentScreen2ContainerId');
const checkAnoterLocationButton = document.querySelector('#checkAnoterLocationButton');
const cityProvinceNation = document.querySelector('#cityProvinceNationId');
const airQualityIndicator = document.querySelector('#airQualityIndicatorId');
const airQualityIndicatorSummary = document.querySelector('#airQualityIndicatorSummaryId');
const airQualityIndicatorDescription = document.querySelector('#airQualityIndicatorDescriptionId');
const pm25CellText = document.querySelector('#pm25CellTextId');
const pm10CellText = document.querySelector('#pm10CellTextId');
const o3CellText = document.querySelector('#o3CellTextId');
const no2CellText = document.querySelector('#no2CellTextId');
const so2CellText = document.querySelector('#so2CellTextId');
const coCellText = document.querySelector('#coCellTextId');
const emoticonImage = document.querySelector('#emoticonImageId');
const sensorStationDescription = document.querySelector('#sensorStationDescriptionId');
const lastUpdate = document.querySelector('#lastUpdateId');

/* end getting references to contentScreen2Container elements*/


/* getting references to errorBulletinBoard elements*/

const errorBulletinBoard = document.querySelector('#errorBulletinBoardId');

/* end getting references to errorBulletinBoard elements*/


/* start event listener setting */

currentLocationCheckButton.addEventListener('click', () => {

  currentLocationCheckButton.setAttribute('disabled',true);
  locationCheckButton.setAttribute('disabled',true);

  errorBulletinBoard.innerHTML = '';
  getLocationCoordinates( null );

});

locationCheckButton.addEventListener('click', () => {
  
  currentLocationCheckButton.setAttribute('disabled',true);
  locationCheckButton.setAttribute('disabled',true);

  if( locationInsertInputText.value !== '' ){

    errorBulletinBoard.innerHTML = '';

    let locationInsertInputTextValue = locationInsertInputText.value;
    locationInsertInputText.value = '';
    getLocationCoordinates( locationInsertInputTextValue );

  }
  else{

    errorBulletinBoard.innerHTML = 'Error: Please, insert a non empty location';

  }

});

checkAnoterLocationButton.addEventListener('click',() => {

  checkAnoterLocationButton.setAttribute('disabled',true);

  errorBulletinBoard.innerHTML = '';

  contentScreen1Container.style.display = 'block';
  contentScreen2Container.style.display = 'none';

  checkAnoterLocationButton.removeAttribute('disabled');

});

/* end event listener setting */ 

/* start error type classes */ 

class InvalidResultsError extends Error{    

  constructor(message) {
      super(message); 
      this.name = "InvalidResultsError"; 
  }

}

/* end error type classes */


/* ---------------------------------------------------------------------------------------------------------------- */

/* PROGRAM FUNCTIONS START*/ 

/* ---------------------------------------------------------------------------------------------------------------- */


function getLocationCoordinates( userProvidedLocation ){

  if( userProvidedLocation ){  // get the lat/lng of the location provided by the user

    getCoorinatesOfProvidedLocationWithHereApi( userProvidedLocation );

  }
  else{  // get the device's current location in lat/lng format

    getDeviceCurrentCoordinatesWithJSApi();

  }

}

function hereApiErrorFunctionHandler(){

  errorBulletinBoard.innerHTML = 'Error: An error occurred while getting data from the server';

  currentLocationCheckButton.removeAttribute('disabled');
  locationCheckButton.removeAttribute('disabled');

}

function getCoorinatesOfProvidedLocationWithHereApi( userProvidedLocation ){

  // Instantiate a platform object:
  let platform = new H.service.Platform({
    'apikey': process.env.HERE_SERVICE_APIKEY
  });

  let service = platform.getSearchService();

  // Call the geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  service.geocode({
    q: userProvidedLocation
  }, (results) => {

    try{
    
      // takes just the first result
      let item = results.items[0];
      let locationWithExtendedInformation = _.get(item, 'address.label' );
      let lat = _.get(item, 'position.lat' );
      let lng = _.get(item, 'position.lng' );

      if ( ! ( item && locationWithExtendedInformation && lat && lng ) ){ // if any of the variable are null/undefined throw error
        throw new InvalidResultsError();
      }

      queryAqicnApi( locationWithExtendedInformation, lat, lng );

    }catch(error){

      currentLocationCheckButton.removeAttribute('disabled');
      locationCheckButton.removeAttribute('disabled');

      if ( error instanceof InvalidResultsError )
        errorBulletinBoard.innerHTML = 'Error: An error occurred while validating data from the server';
      else
        throw error;

    }

  }, hereApiErrorFunctionHandler ); 

}

function getDeviceCurrentCoordinatesWithJSApi(){

  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success( currentPositionoordinates ) {

    try{
      
      let coordinates = _.get( currentPositionoordinates , 'coords' );
      let lat = _.get( coordinates, 'latitude');
      let lng = _.get( coordinates, 'longitude');

      if ( !( coordinates && lat && lng ) ){

        throw new InvalidResultsError();

      }

      reverseGeocodeFromCoordinates( lat, lng );

    }catch(err){

      currentLocationCheckButton.removeAttribute('disabled');
      locationCheckButton.removeAttribute('disabled');

      if ( err instanceof InvalidResultsError )
        errorBulletinBoard.innerHTML = 'Error: An error occurred while validating your position data';
      else
        throw err;

    }
  }
  
  function error() {
    errorBulletinBoard.innerHTML = 'Error: An error occurred while getting your position data';

    currentLocationCheckButton.removeAttribute('disabled');
    locationCheckButton.removeAttribute('disabled');
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);

}

function reverseGeocodeFromCoordinates( lat, lng ){
    // Instantiate a map and platform object:
  let platform = new H.service.Platform({
    'apikey': process.env.HERE_SERVICE_APIKEY
  });

  // Get an instance of the search service:
  var service = platform.getSearchService();

  // Call the reverse geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  service.reverseGeocode({
    at: `${lat},${lng}`
  }, (results) => {

    try{
      
      let city = _.get(results.items[0], 'address.city');
      let state = _.get(results.items[0], 'address.state');
      let countryName = _.get(results.items[0], 'address.countryName');

      if ( !( city && state && countryName ) ){

        throw new InvalidResultsError();

      }
      
      let locationWithExtendedInformation = city + ', ' + state + ', ' + countryName;
      queryAqicnApi( locationWithExtendedInformation, lat, lng);

    }catch(error){

      currentLocationCheckButton.removeAttribute('disabled');
      locationCheckButton.removeAttribute('disabled');

      if ( error instanceof InvalidResultsError )
        errorBulletinBoard.innerHTML = 'Error: An error occurred while validating data from the server';
      else
        throw error;

    }
  }, hereApiErrorFunctionHandler );
}

function queryAqicnApi( locationWithExtendedInformation, lat, lng ){

  let waqiEndpointLink = 'https://api.waqi.info/feed/geo:' + lat + ';' + lng + '/?token=' + process.env.WAQI_SERVICE_APIKEY;

  axios.get( waqiEndpointLink)
    .then(function (response) {

      parseJson( locationWithExtendedInformation, response );

    })
    .catch(function () {

      errorBulletinBoard.innerHTML = 'Error: An error occurred while getting data from the server';

      currentLocationCheckButton.removeAttribute('disabled');
      locationCheckButton.removeAttribute('disabled');

    }); 

}

function parseJson( locationWithExtendedInformation, jsonResponse ){

  try{
    
    let airQualityIndicatorInteger = _.get(jsonResponse, 'data.data.aqi' );

    //use mathjs functions 
    if( !airQualityIndicatorInteger || !hasNumericValue(airQualityIndicatorInteger) || smaller( airQualityIndicatorInteger, 0 ) ){
      throw new InvalidResultsError();
    }

    let airQualityIndicatorDescriptionString;
    let airQualityIndicatorSummaryString;
    let airQualityEmoticonImage;

    switch(true){

      case ( smallerEq( airQualityIndicatorInteger, 50 ) ): // airQualityIndicatorInteger is between 0 (included ) and 50 (included)
        airQualityIndicatorDescriptionString = airQualityTableLegenda.Good;
        airQualityIndicatorSummaryString = 'Air quality is Good';
        airQualityEmoticonImage = goodImage;
        break;
      case ( smallerEq( airQualityIndicatorInteger, 100 ) ):
        airQualityIndicatorDescriptionString = airQualityTableLegenda.Moderate;
        airQualityIndicatorSummaryString = 'Air quality is Moderate';
        airQualityEmoticonImage = moderateImage;
        break;
      case ( smallerEq( airQualityIndicatorInteger, 150 ) ):
        airQualityIndicatorDescriptionString = airQualityTableLegenda.UnhealthyForSensitiveGroups;
        airQualityIndicatorSummaryString = 'Air quality is Unhealthy for Sensitive Groups';
        airQualityEmoticonImage = unhealthyForSensitiveGroupImage;
        break;
      case ( smallerEq( airQualityIndicatorInteger, 200 ) ):
        airQualityIndicatorDescriptionString = airQualityTableLegenda.Unhealthy;
        airQualityIndicatorSummaryString = 'Air quality is Unhealthy';
        airQualityEmoticonImage = unhealthyImage;
        break;
      case ( smallerEq( airQualityIndicatorInteger, 300 ) ):
        airQualityIndicatorDescriptionString = airQualityTableLegenda.VeryUnhealthy;
        airQualityIndicatorSummaryString = 'Air quality is Very Unhealthy';
        airQualityEmoticonImage = very_unhealthyImage;
        break;
      case ( larger( airQualityIndicatorInteger, 300 ) ):
        airQualityIndicatorDescriptionString = airQualityTableLegenda.Hazardous;
        airQualityIndicatorSummaryString = 'Air quality is Hazardous';
        airQualityEmoticonImage = hazardousImage;
        break;
      default:
        throw new InvalidResultsError();
        break;
    }
    
    let iaqiObject = _.get(jsonResponse, 'data.data.iaqi' );
    let sensorStationDescriptionString = _.get(jsonResponse, 'data.data.city.name' );
    let lastUpdateString = _.get(jsonResponse, 'data.data.time.s' ); 

    if( !( iaqiObject && sensorStationDescriptionString && lastUpdateString ) ){
      throw new InvalidResultsError();
    }


    displayData(locationWithExtendedInformation,airQualityIndicatorInteger,airQualityIndicatorSummaryString,airQualityIndicatorDescriptionString,iaqiObject,airQualityEmoticonImage ,sensorStationDescriptionString,lastUpdateString);

  }catch(err){

    currentLocationCheckButton.removeAttribute('disabled');
    locationCheckButton.removeAttribute('disabled');

    if ( err instanceof InvalidResultsError )
      errorBulletinBoard.innerHTML = 'Error: An error occurred while parsing data';
    else if ( err instanceof TypeError )
      errorBulletinBoard.innerHTML = 'Error: An error occurred while parsing data';
    else
      throw err;

  }

}

function displayData( cityProvinceNationString, airQualityIndicatorString, airQualityIndicatorSummaryString, airQualityIndicatorDescriptionString, 
  iaqiObject, airQualityEmoticonImage, sensorStationDescriptionString, lastUpdateString ){

    contentScreen1Container.style.display = 'none';
    contentScreen2Container.style.display = 'block';

    cityProvinceNation.innerHTML = cityProvinceNationString;
    airQualityIndicator.innerHTML = airQualityIndicatorString;
    airQualityIndicatorSummary.innerHTML = airQualityIndicatorSummaryString
    airQualityIndicatorDescription.innerHTML = airQualityIndicatorDescriptionString;
    pm25CellText.innerHTML = _.get(iaqiObject, 'pm25.v') ? _.get(iaqiObject, 'pm25.v') : '-' ;
    pm10CellText.innerHTML = _.get(iaqiObject, 'pm10.v') ? _.get(iaqiObject, 'pm10.v') : '-' ;
    o3CellText.innerHTML = _.get(iaqiObject, 'o3.v') ? _.get(iaqiObject, 'o3.v') : '-' ;
    no2CellText.innerHTML = _.get(iaqiObject, 'no2.v') ? _.get(iaqiObject, 'no2.v') : '-' ;
    so2CellText.innerHTML = _.get(iaqiObject, 'so2.v') ? _.get(iaqiObject, 'so2.v') : '-';
    coCellText.innerHTML = _.get(iaqiObject, 'co.v') ? _.get(iaqiObject, 'co.v') : '-';
    emoticonImage.src = airQualityEmoticonImage;
    sensorStationDescription.innerHTML = `<b>Station Location:</b> ${sensorStationDescriptionString}`;
    lastUpdate.innerHTML = `<b>Last Update:</b> ${lastUpdateString}`;

    currentLocationCheckButton.removeAttribute('disabled');
    locationCheckButton.removeAttribute('disabled');
  
}
