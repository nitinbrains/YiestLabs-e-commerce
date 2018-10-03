'use strict';

// import { State } from './State';
// import { WLCart } from './WhiteLabsCart';
// import { SalesLib } from './SalesLib'
// import { ConfirmationCart } from './ConfirmationCart';
// import { Utils } from './Utils';
// import { ErrorMod } from './Error';

// import * as firebase from 'firebase';
// import { Permissions, Notifications } from 'expo';

// change line 267 and 1413 to swap from standard/admin

import Utils from './Utils';
import SalesLib from './SalesLib';
import fetch from 'isomorphic-unfetch'

var Network = (function()
{
	const MaxTries = 3;

	function uuid()
	{
		try
		{
			var uuid = "", i, random;
			for (i = 0; i < 32; i++)
			{
			    random = Math.random() * 16 | 0;

			    if(i == 8 || i == 12 || i == 16 || i == 20)
			    {
			      	uuid += "-"
			    }
			    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
			}
			return uuid;
		}
		catch(err)
		{
			throw err;
		}

	}

	const system = {
		NSAuthentication: {
			SendAuth: '5TVDpAHPqLZSNY7EuLWJWDhLVaGBi862qlNp48ULcgaR6oDDH2hCLKdY92MA0pG',
			ReceiveAuth: 'DHA5ZsROSYuY1jJXxOcHS4dKNODjgzJPnsMFIEumUpOizL6dj9GnU8QC2Ctd2x8',
			Sendiv: 'ocbEMVHyax6MTNxD',
			Receiveiv: '8vr5BxmawvE5mZo7',
			consumerKey: 'a4b6d4aca2d042095764838da1f996d4c199b197882697325db3ee6ad39551a5',
			consumerSecret: '745b218f8a138ce0490b4d1fa708785ccfbd47987c76da7aa3fc22c583af8cc3',
			consumerToken: 'e51f7848457d3174d7cdc5a03b89e1bfea4cab62c1340ccc822522a8cdc9014d',
			consumerTokenSecret: '5e99b85161ac6a11a8c8bca57923565dd2f1e884006d4fd5bf3f269a75d00319',
		},
		YeastmanAuthentication: {
			Auth: 'idPty6huNSNURJeXr1DF6s7ZVRFWFXh5rpgpD5GAmbXCJ3CUfaDO8sOhmMx5wc3',
			iv: 'TaBbaKrkvqLZ1UEy',
			Token: 'HSeKXJ61VqOwsrtAXPNRTBuFsZIrhTgYN4NXGroiXM2nQgYP76UPUs47No5poG7',
		},
		CryptoJS: require('./CryptoJS').CryptoJS,
		// XMLParser: require('react-native-xml2js').parseString,
		firebase: {
		    apiKey: "AIzaSyC1F-DuIUbHYBcshYq6S4Y7EeOQ3f4iCcM",
		    authDomain: "white-labs-digital.firebaseapp.com",
		    databaseURL: "https://white-labs-digital.firebaseio.com",
		    projectId: "white-labs-digital",
		    storageBucket: "white-labs-digital.appspot.com",
		    messagingSenderId: "873887385537"
		},
		GMAPSKEY: '&key=AIzaSyCO-naseRBOZkHNrqOCqG1W9ms0-CAY_ro&sensor=true'
	};

	// const firebaseApp = firebase.initializeApp(system.firebase);
	// var firebaseDB = firebase.database();

	/******************
	* Private Methods *
	*******************/
	function NSAuth(scriptID, type = 'post')
  	{
  		//Fall back authentication
		return "NLAuth nlauth_account=4099054_SB1, nlauth_email=mwhite@whitelabs.com, nlauth_signature=Yeastman001, nlauth_role=3";

		// var time = Math.round(new Date().getTime()/1000);
		// var nonce = Utils.uuid();

		// var base = "deploy=1&oauth_consumer_key=" + system.NSAuthentication.consumerKey
		// 		+ "&oauth_nonce=" + nonce
		// 		+ "&oauth_signature_method=HMAC-SHA1"
		// 		+ "&oauth_timestamp=" + time
		// 		+ "&oauth_token=" + system.NSAuthentication.consumerToken
		// 		+ "&oauth_version=1.0"
		// 		+ "&script=" + scriptID.toString();

		// var encodedBase = type.toUpperCase() + "&" + encodeURIComponent('https://4099054-sb1.restlets.api.netsuite.com') + "&" + encodeURIComponent(base);
		// var baseSignature = system.NSAuthentication.consumerSecret + "&" + system.NSAuthentication.consumerTokenSecret;
		// var signature = encodeURIComponent(system.CryptoJS.HmacSHA1(encodedBase, baseSignature).toString(system.CryptoJS.enc.Base64));

		// var header = 'OAuth realm="4099054_SB1",'
		// 			+ 'oauth_consumer_key="' + system.NSAuthentication.consumerKey + '",'
		// 			+ 'oauth_token="' + system.NSAuthentication.consumerToken + '",'
		// 			+ 'oauth_nonce="' + nonce + '",'
		// 			+ 'oauth_timestamp="' + time + '",'
		// 			+ 'oauth_signature_method="HMAC-SHA1",'
		// 			+ 'oauth_version="1.0", '
		// 			+ 'oauth_signature="' + signature + '"';

		// return header;
  	}

	function NSReceiveMessage(message)
	{
		return JSON.parse(system.CryptoJS.AES.decrypt(message.data, system.NSAuthentication.ReceiveAuth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.NSAuthentication.Receiveiv }).toString(system.CryptoJS.enc.Utf8));
	}

	function NSSendMessage(data)
	{
		data.version = SalesLib.clientVersion;
		var message = {data: system.CryptoJS.AES.encrypt(JSON.stringify(data), system.NSAuthentication.SendAuth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.NSAuthentication.Sendiv }).toString()};
		return JSON.stringify(message);
	}

	function EncryptCC(card) //{ custID (optional), expire, ccnumber, type, name}
	{
		return system.CryptoJS.AES.encrypt(JSON.stringify(card), 'AWJeBmcD9uEy27L2Zla0ZKTKUbgjRJKwxr6CaKBqKDNbHSKsISC6BH2EhUvNm9s', { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: "A216T8JtJANg7F7C" }).toString();
	}

	function XMLtoJSON(xml, cb)
	{
		system.XMLParser(xml, function(err, result)
		{
			if(err)
			{
				throw err;
			}
			else
			{
				cb(result);
			}
		});
	}

	// /*********************
	// * GCloud Connections *
	// *********************/

	// function sendPushNotification(){
	// 	return fetch('http://35.193.208.36:14400/send_push_notification/', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: NSSendMessage({
	// 			recipients: [{UserID: 43148, OrderID: 2313}],
	// 			message: 'Your order has been shipped'
	// 		})
	// 	})
	// 	.then(response => response.json())
	// 	.then(response => {
	// 		console.log(response);
	// 		if(response.error)
	// 		{
	// 			throw {message: response.error.message, code: -1};
	// 		}
	// 	})
	// 	.catch(err => 
	// 	{
	// 		console.log('error', err);
	// 	});
	// }


	// async function registerForPushNotifications() 
 //    {
 //        const { status: existingStatus } = await Permissions.getAsync(
 //            Permissions.NOTIFICATIONS
 //        );
 //        let finalStatus = existingStatus;

 //        // only ask if permissions have not already been determined, because
 //        // iOS won't necessarily prompt the user a second time.
 //        if (existingStatus !== 'granted') {
 //            // Android remote notification permissions are granted during the app
 //            // install, so this will only ask on iOS
 //            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
 //            finalStatus = status;
 //        }

 //        // Stop here if the user did not grant permissions
 //        if (finalStatus !== 'granted') {
 //            return;
 //        }

 //        // Get the token that uniquely identifies this device
 //        let token = await Notifications.getExpoPushTokenAsync();

 //        // firebaseDB.ref('users').child(State.getState('UserID')).update({expoToken: token});

 //       	savePushToken(token);
        
 //    }


	// function savePushToken(token) {
	//     return fetch('http://35.193.208.36:14400/push_token/', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: NSSendMessage({id: State.getState('UserID'), token: token})
	// 	})
	// 	.then(response => response.json())
	// 	.then(response => {
	// 		if(response.error)
	// 		{
	// 			throw {message: response.error.message, code: -1};
	// 		}
	// 	});
	// }

	// function logLogin(Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
	// 	{

	// 		var message = NSSendMessage({id: State.getState('UserID'), info: State.getState('UserInfo'), cart: WLCart.getCart()});
	// 		fetch('http://35.193.208.36:14400/login/', {
	// 			method: 'POST',
	//   		  	headers: {
	//   		    	'Accept': 'application/json',
	//   		    	'Content-Type': 'application/json',
	//   		  	},
	//   		  	body: message
	// 		})
	// 		.then(response => response.json())
	// 		.then(response => {
	// 			var data = NSReceiveMessage(response);
	// 			if(data.error)
	// 			{
	// 				reject({message: response.error.message, code: response.error.code});
	// 			}
	// 			else
	// 			{
	// 				registerForPushNotifications();
	// 				resolve(data);
	// 			}
	// 		})
	// 		.catch(err => {
	// 			ErrorMod.log('GCloud', 'logLogin', err);
	// 		});
	// 	})
	// }

	// function updateCart(Tries=1)
	// {
	// 	var message = NSSendMessage({id: State.getState('UserID'), cart: WLCart.getCart()});
	// 	return fetch('http://35.193.208.36:14400/updateCart/', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: message
	// 	})
	// 	.then(response => response.json())
	// 	.then(response => {
	// 		if(response.error)
	// 		{
	// 			throw {message: response.error.message, code: -1};
	// 		}
	// 	});
	// }

	// function getFeedback(Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
	// 	{
	// 		return fetch('http://35.193.208.36:14400/get_feedback/', {
	// 		  headers: {
	// 		    'Accept': 'application/json',
	// 		    'Content-Type': 'application/json',
	// 		  },
	// 		})
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 		{
	// 			var result = NSReceiveMessage(response);
	// 			if(!result.error)
	// 			{
	// 				resolve(result.message);
					
	// 			}
	// 			else
	// 			{
	// 				reject(result);
	// 			}
	// 		})
	// 		.catch(function(err)
	// 		{
	// 			if(Tries < MaxTries)
	// 			{
	// 				//impose random backoff and try again
	// 				const wait = Utils.getWaitTime(Tries) * 1000;
	// 				return delay(wait).then(() => getFeedback(Tries+1));
	// 			}
	// 			else
	// 			{
	// 				ErrorMod.log('G cloud network error', 'getFeedback', err, false);
	// 				reject({message: 'max retries reached', code: -1});
	// 			}
	// 		});
	// 	});
	// }

	// function sendFeedback(feedback, Tries=1)
	// {

	// 	return new Promise(function(resolve, reject)
	// 	{
	// 		var message = NSSendMessage(feedback);
	// 		return fetch('http://35.193.208.36:14400/feedback/', {
	// 		  method: 'POST',
	// 		  headers: {
	// 		    'Accept': 'application/json',
	// 		    'Content-Type': 'application/json',
	// 		  },
	// 		  body: message
	// 		})
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 		{
	// 			if(response.error)
	// 			{
	// 				reject({ message: response.error.message, code: -1 });
	// 			}
	// 			else
	// 			{
	// 				resolve();
	// 			}
	// 		});
	// 	});
	// }

	// function updatePhoneList(Tries=1)
	// {
	// 	return new Promise((resolve, reject) => {
	// 		fetch('http://35.193.208.36:13131/phonelist/', {
	// 			method: 'GET',
	// 			headers: {
	// 				'Accept': 'application/json',
	// 				'Content-Type': 'application/json',
	// 	      	},
	// 	    })
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 	    {
	// 	      	var message = NSReceiveMessage(response);

	// 	      	if(!message.error)
	// 	      	{
	// 	        	State.setState({phoneList: message.phoneList});
	// 	        	resolve(message.phoneList);
	// 	      	}
	// 	      	else
	// 	      	{
	// 	      		reject({message: 'Could not retrieve phone list', code: 0});
	// 	      	}
	//     	})
	//     	.catch(function(err)
	// 		{
	// 			if(Tries < MaxTries)
	// 			{
	// 				//impose random backoff and try again
	// 				const wait = Utils.getWaitTime(Tries) * 1000;
	// 				return delay(wait).then(() => updatePhoneList(Tries+1));
	// 			}
	// 			else
	// 			{
	// 				ErrorMod.log('G cloud network error', 'updatePhoneList', err, false);
	// 				reject({message: 'max retries reached', code: -1});
	// 			}
	// 		});;
	// 	})
	// }

	// function getLocationSearchTerm(address, cb)
	// {
	// 	return new Promise((resolve, reject) => {

	// 		var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + system.GMAPSKEY;
 // 			fetch(url)
 // 			.then((response) => response.json())
	// 		.then(response => {
	// 			if(response.results)
	// 	    	{
	// 	    		var coordinates = response.results[0].geometry.location;
	// 	    		var country = response.results[0].address_components.find(x => x.types[0] == "country");
	// 		    	var state = response.results[0].address_components.find(x => x.types[0] == "administrative_area_level_1");
	// 		    	var city = response.results[0].address_components.find(x => x.types[0] == "locality");
	// 		    	var location;

	// 		    	if(country.short_name == 'US')
	// 		    	{
	// 		    		location = {
	// 			    		city: city ? city.short_name : null, 
	// 			    		state: state ? state.short_name : null, 
	// 			    		country: country ? country.short_name : null
	// 			    	};
	// 		    	}
	// 		    	else
	// 		    	{
	// 		    		location = {
	// 			    		country: country ? country.short_name : null
	// 			    	};
	// 		    	}
			    	
	// 		    	resolve({location, coordinates});

	// 	    	}
	// 	    	else
	// 	    	{
	// 	    		reject(null);
	// 	    	}
				
	// 		})
	// 		.catch(err => {
	// 			ErrorMod.log('Network', 'getLocationSearchTerm', err, true);
	// 			reject(null);
	// 		})
	// 	})
	// }

	// function getLocationLatLng(latitude, longitude, cb)
	// {
	// 	console.log('Step 1: ' + latitude + ", " + longitude);
	// 	var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + system.GMAPSKEY;
	// 	fetch(url)
	// 	.then((response) => response.json())
	// 	.then(function(response)
	//     {
	//     	if(response.results)
	//     	{
	//     		var country = response.results[0].address_components.find(x => x.types[0] == "country");
	// 	    	var state = response.results[0].address_components.find(x => x.types[0] == "administrative_area_level_1");
	// 	    	var city = response.results[0].address_components.find(x => x.types[0] == "locality");
	// 	    	var location;

	// 	    	if(country.short_name == 'US')
	// 	    	{
	// 	    		location = {
	// 		    		city: city ? city.short_name : null, 
	// 		    		state: state ? state.short_name : null, 
	// 		    		country: country ? country.short_name : null
	// 		    	};
	// 	    	}
	// 	    	else
	// 	    	{
	// 	    		location = {
	// 		    		country: country ? country.short_name : null
	// 		    	};
	// 	    	}
		    	

	// 	    	getCustomersInLocation(location, cb);
	//     	}
	//     	else
	//     	{
	//     		cb(null);
	//     	}

	//     })
	//     .catch(err => {
	// 		ErrorMod.log('Network', 'getLocationLatLng', err, true);
	// 		cb(null);
	// 	})
	// }

	// function getCustomersInLocation(locationFilter, cb)
	// {
	// 	console.log('Step 2: ' + locationFilter);

	//     var message = NSSendMessage(locationFilter);

	//     // WLAPP-FindCustomerGlobalSearch
	// 	fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=780&deploy=1', {
	// 		method: 'PUT',
	// 		headers: {
	// 			'Authorization' : NSAuth(780),
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: message
	// 	})
	// 	.then((response) => response.json())
	// 	.then(function(response)
	//     {
 //      		var message = NSReceiveMessage(response);
	//       	if(message.length > 0)
	//       	{
	//       		lookupCachedCustomersCoord(message, locationFilter, cb);
	//       	}
	//       	else
	//       	{
	//         	Alert.alert('Error', 'No Customers');
	//         	cb(null);
	//       	}
 //    	})
 //    	.catch(err => {
	// 		ErrorMod.log('Network', 'getCustomersInLocation', err, true);
	// 		cb(null);
	// 	});
	// }

	// function lookupCachedCustomersCoord(customers, locationFilter, cb)
	// {
	// 	console.log('Step 3: ' + customers[0].name + ", length: " + customers.length);
	// 	var message = NSSendMessage({locationKey: locationFilter});

	// 	fetch('http://35.193.208.36:13131/custCache/', {
	//       	method: 'POST',
	//       	headers: {
	//         	'Accept': 'application/json',
	//         	'Content-Type': 'application/json',
	//       	},
	//       	body: message
	//     })
	// 	.then((response) => response.json())
	// 	.then(function(response)
	//     {
	//     	var message = NSReceiveMessage(response);

	//     	var coordLookup = [];

	//     	for (var i = 0; i < customers.length; i++)
	//     	{
	//     		if(message.cache[customers[i].name])
	//     		{
	//     			customers[i].latlng = message.cache[customers[i].name];
	//     		}
	//     		else
	//     		{
	//     			coordLookup.push({index: i, customer: customers[i]});
	//     		}
	//     	}

	//     	var count = 0;

	//     	getCustomersLatLng(coordLookup, count, customers, locationFilter, cb);
	//     })
	//     .catch(err => {
	// 		ErrorMod.log('Network', 'lookupCachedCustomersCoord', err, true);
	// 		cb(null);
	// 	});
	// }

	// function getCustomersLatLng(coordLookup, count, customers, locationFilter, cb)
	// {
	// 	var baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
	// 	var lookupFailures = [];
	// 	var totalLookup = coordLookup.length;

	// 	if(totalLookup == 0)
	// 	{
 //    		State.setState({LocalCustomers: customers});
 //    		cb(customers);
 //    		return;
	// 	}

	// 	console.log('Step 4: ' + coordLookup[0].customer.name + ", length: " + coordLookup.length);

	// 	for (var i = 0; i < totalLookup; i++)
	// 	{
	// 		(function(i)
	// 		{
	// 			if(coordLookup[i].customer.address)
	// 			{
	// 				var testLowerCaseString = coordLookup[i].customer.address.toLowerCase();

	// 				if(testLowerCaseString.indexOf('po box') == -1 || testLowerCaseString.indexOf('pobox') == -1)
	// 				{
	// 					var customerAddress;
	// 					var customerNameIndex = testLowerCaseString.indexOf(coordLookup[i].customer.name.toLowerCase());
	// 					if(customerNameIndex > -1)
	// 					{
	// 						customerAddress = testLowerCaseString.substring(customerNameIndex + coordLookup[i].customer.name.length + 1, testLowerCaseString.length);
	// 						var streetNumberIndex = customerAddress.search(/\d/);
	// 						if(streetNumberIndex != 0)
	// 						{
	// 							customerAddress = customerAddress.substring(streetNumberIndex, customerAddress.length);
	// 						}
	// 					}
	// 					else
	// 					{
	// 						var streetNumberIndex = testLowerCaseString.search(/\d/);
	// 						if(streetNumberIndex == 0)
	// 						{
	// 							customerAddress = coordLookup[i].customer.address;
	// 						}
	// 						else
	// 						{
	// 							customerAddress = testLowerCaseString.substring(streetNumberIndex, testLowerCaseString.length);
	// 						}
	// 					}

	// 					var url = baseUrl + customerAddress.replace(/ |\n/g, "+") + system.GMAPSKEY;

	// 					fetch(url)
	// 					.then((response) => response.json())
	// 					.then(function(response)
	// 				    {
	// 				    	try
	// 				    	{
	// 				    		customers[coordLookup[i].index].latlng = response.results[0].geometry.location;
	// 					    	customers[coordLookup[i].index].newToCache = true;
	// 					    }
	// 					    catch(err)
	// 				    	{
	// 				    		lookupFailures.push(coordLookup[i].customer);
	// 				    		//console.log(url + '\n');
	// 				    		//console.log(JSON.stringify(response) + '\n');
	// 				    		//console.log(customers[coordLookup[i].index].name);
	// 				    	}

	// 				    	count++;
	// 				    	if(count == totalLookup)
	// 				    	{
	// 				    		console.log("Lookup Failures: " + lookupFailures.length);
	// 				    		State.setState({FailedToLookup: lookupFailures});
	// 				    		State.setState({LocalCustomers: customers});
	// 				    		updateCachedCustCoord(customers, locationFilter);
	// 				    		cb(customers);
	// 				    	}
	// 				    })
	// 				    .catch(err => {
	// 						ErrorMod.log('Network', 'getCustomersLatLng', err, true);
	// 						cb(null);
	// 					});
	// 				}
	// 				else
	// 				{
	// 					lookupFailures.push(coordLookup[i].customer);
	// 					count++;
	// 					if(count == totalLookup)
	// 				    {
	// 				    	console.log("Lookup Failures: " + lookupFailures.length);
	// 			    		State.setState({FailedToLookup: lookupFailures});
	// 			    		State.setState({LocalCustomers: customers});
	// 			    		updateCachedCustCoord(customers, locationFilter);
	// 			    		cb(customers);
	// 			    	}
	// 				}
	// 			}
	// 			else
	// 			{
	// 				count++;
	// 			}
	// 		})(i);
	//     }
	// }

	// function updateCachedCustCoord(customers, locationFilter)
	// {
	// 	console.log('Step 5: this is gonna hurt :\'(');
	// 	var message = NSSendMessage({customers: customers, locationKey: locationFilter});

	// 	fetch('http://35.193.208.36:13131/custCache/', {
 //      		method: 'PUT',
	//       	headers: {
	//         	'Accept': 'application/json',
	//         	'Content-Type': 'application/json',
	//       	},
	//       	body: message
	//     })
	// 	.then((response) => response.json())
	// 	.then(function(response)
	//     {
	//     	var message = NSReceiveMessage(response);
	//     	console.log(JSON.stringify(message));
	//     });
	// }

	// /*****************************
	// * WhiteLabs.com Connections *
	// *****************************/

	// function requestHBStores(Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
	// 	{
	// 	  	fetch('https://www.whitelabs.com/ajax/getlocations')
	// 		.then((response) => response.json())
	// 		.then(function(response){
	// 			if(response.error)
	// 			{
	// 				reject({message: response.error.message, code: response.error.code});
	// 			}
	// 			else
	// 			{
	// 				State.setState({HBStores: response.locations});
	// 				resolve(response.locations);
	// 			}
	// 		});
	// 	});
	// }

 //  	function requestNews(Tries=1)
 //  	{
 //  		return new Promise(function(resolve, reject)
	// 	{
	// 	  	fetch('http://www.whitelabs.com/news/rss')
	// 		.then((response) => response.text())
	// 		.then(function(response){
	//   			XMLtoJSON(response, (result) => {
	//   				/*
	// 	  				"title",
	// 					"link",
	// 					"description",
	// 					"language",
	// 					"atom:link",
	// 					"item",
	// 				*/

	// 				if(result.rss.channel[0].item)
	// 				{
	// 					var Regex = new RegExp('<[\S| ]*>','g');
	// 					for(var i = 0, newsLength = result.rss.channel[0].item.length; i < newsLength; i++)
	// 					{
	// 						var item = result.rss.channel[0].item[i];
	// 						item.description = String(item.description).replace(/<[^>]*>|&nbsp;/g, "").replace(/&amp;/g,'&').replace(/Category:.*/, "...").trim();
	// 						item.pubDate = Utils.formatDate(item.pubDate);
	// 					}
	// 					State.setState({News: result.rss.channel[0].item});
	// 					resolve();
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'news bad data?', code: -1});
	// 				}
	// 			});
	//   		});
	// 	});
 //  	}

 //  	/*******************
 //  	 * YMO Connections *
 //  	 *******************/
  	function requestUserID(username, password, Tries=1)
  	{
  		return new Promise(function(resolve, reject)
  		{
  			username = 'above';
  			password = 'test';
  			var time = new Date();
			var data = '<CustomerInformationRequest Operation="Login"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
						+ '<UserName>' + username.toString() + '</UserName>'
						+ '<Password>' + password.toString() + '</Password>'
						+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
						+ '<Nonce>' + uuid() + '</Nonce>'
						+ '</CustomerInformationRequest>';
			data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
			fetch('https://www.yeastman.com/Login/Validator.aspx', {
			 	method: 'POST',
			  	headers: {
			    	'Content-Type': 'application/x-www-form-urlencoded',
			  	},
			  	body: data
			})
			.then((response) => response.text())
			.then(function(response)
			{
				var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
				XMLtoJSON(data, (result) => {
					if(result.CustomerInformation.Result[0].$.Status == "OK")
					{
						if(result.CustomerInformation.NetSuiteID[0].$.UserType == "Staff" /*|| result.CustomerInformation.NetSuiteID[0]._ == '43148'*/)
						{
							State.setState({WLCSR: result.CustomerInformation.NetSuiteID[0]._});
							resolve(result.CustomerInformation.NetSuiteID[0]._);
						}
						else
						{
							State.setState({UserID: result.CustomerInformation.NetSuiteID[0]._});
							resolve(result.CustomerInformation.NetSuiteID[0]._);
						}
					}
					else
					{
						reject({message: 'Your username or password is invalid', code: 0});
					}
				});
			})
			.catch(function(err)
			{
				console.log('err', err);
			});
  		});
  	}

	// function createCustomerInYeastMan(email, password, message, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			for(var i = 0; i < message.id.length; i++)
	// 		{
	// 			if(message.id[i] <= 0)
	// 			{
	// 				reject({message: 'failed to create customer in Yeastman', code: 0});
	// 			}
	// 		}

	// 		var time = new Date();
	// 		var data = '<CustomerInformationRequest Operation="Register"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
	// 					+ '<Password>' + password.toString() + '</Password>'
	// 					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
	// 					+ '<Nonce>' + message.nonce + '</Nonce>'
	// 					+ '<ExternalID>' + message.id[0] + '</ExternalID>'
	// 					+ '<Email>' + email + '</Email>'
	// 					+ '</CustomerInformationRequest>';
	// 		data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
	// 		fetch('https://www.yeastman.com/Login/Validator.aspx', {
	// 		  method: 'POST',
	// 		  headers: {
	// 			'Content-Type': 'application/x-www-form-urlencoded',
	// 		  },
	// 		  body: data
	// 		})
	// 		.then((response) => response.text())
	// 		.then(function(response)
	// 		{
	// 			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
	// 			XMLtoJSON(data, async (result) => {
	// 				if(result.CustomerInformation.Result[0].$.Status == "OK")
	// 				{
	// 					resolve(true);
	// 				}
	// 				else if(result.CustomerInformation.Result[0]._.includes("already exist") || result.CustomerInformation.Result[0]._.includes("already in use"))
	// 				{
	// 					reject({message: 'This account already exists in Yeastman', code: 0});
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'failed to create an account in Yeastman', code: 0});
	// 				}
	// 			});
	// 		});
 //  		});
	// }

	// function requestForgotPassword(username, email, Tries=1) // {email or username
 //  	{
 //  		return new Promise(function(resolve, reject)
 //  		{
 //  			var time = new Date();

	//   		var subjective;
	//   		if(email)
	//   		{
	//   			subjective = '<Email>' + email + '</Email>';
	//   		}
	//   		else
	//   		{
	//   			subjective = '<UserName>' + username + '</UserName>';
	//   		}

	// 		var data = '<CustomerInformationRequest Operation="Reset Password"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
	// 					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
	// 					+ '<Nonce>' + Utils.uuid() + '</Nonce>'
	// 					+ subjective + '</CustomerInformationRequest>';
	// 		data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
	// 		fetch('https://www.yeastman.com/Login/Validator.aspx', {
	// 		  method: 'POST',
	// 		  headers: {
	// 		    'Content-Type': 'application/x-www-form-urlencoded',
	// 		  },
	// 		  body: data
	// 		})
	// 		.then((response) => response.text())
	// 		.then(function(response)
	// 		{
	// 			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
	// 			XMLtoJSON(data, (result) => {
	// 				if(result.CustomerInformation.Result[0].$.Status == "OK")
	// 				{
	// 					resolve();
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'No account was found', code: 0});
	// 				}
	// 			});
	// 		});
 //  		});
 //  	}

 //  	function requestActivateAccount(userOrEmail, userInfo, Tries=1)
 //  	{
 //  		return new Promise(function(resolve, reject)
 //  		{
 //  			var time = new Date();

	//   		var subjective;
	//   		if(userOrEmail)
	//   		{
	//   			subjective = '<AccountNumber>' + userInfo + '</AccountNumber>';
	//   		}
	//   		else
	//   		{
	//   			subjective = '<Email>' + userInfo + '</Email>';
	//   		}

	// 		var data = '<CustomerInformationRequest Operation="Lookup"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
	// 					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
	// 					+ '<Nonce>' + Utils.uuid() + '</Nonce>'
	// 					+ subjective + '</CustomerInformationRequest>';
	// 		data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
	// 		fetch('https://www.yeastman.com/Login/Validator.aspx', {
	// 		  method: 'POST',
	// 		  headers: {
	// 		    'Content-Type': 'application/x-www-form-urlencoded',
	// 		  },
	// 		  body: data
	// 		})
	// 		.then((response) => response.text())
	// 		.then(function(response)
	// 		{
	// 			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
	// 			XMLtoJSON(data, (result) => {
	// 				if(result.CustomerInformation.Result[0].$.Status == "OK")
	// 				{
	// 					resolve();
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'Could not recover your account please try again later', code: 0});
	// 				}
	// 			});
	// 		});
 //  		});
 //  	}

 //  	function requestChangePassword(newPassword, Tries = 1)
 //  	{
 //  		return new Promise(function(resolve, reject)
 //  		{
 //  			var UserID = State.getState('UserID');
	//   		if(UserID)
	//   		{

	//   			var time = new Date();
	//   			var UserInfo = State.getState('UserInfo');

	// 			var data = '<CustomerInformationRequest Operation="Change Password"><Token>' + system.YeastmanAuthentication.Token + '</Token>'	
	// 						+ '<NetSuiteID>' + UserID + '</NetSuiteID>'
	// 						+ '<UserName>' + UserInfo.username + '</UserName>'
	// 						+ '<Email>' + UserInfo.email + '</Email>'
	// 						+ '<NewPassword>' + newPassword + '</NewPassword>'
	// 						+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
	// 						+ '<Nonce>' + Utils.uuid() + '</Nonce>'
	// 						+ '</CustomerInformationRequest>';
	// 			data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
	// 			fetch('https://www.yeastman.com/Login/Validator.aspx', {
	// 			  method: 'POST',
	// 			  headers: {
	// 			    'Content-Type': 'application/x-www-form-urlencoded',
	// 			  },
	// 			  body: data
	// 			})
	// 			.then((response) => response.text())
	// 			.then(function(response)
	// 			{
	// 				var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
	// 				XMLtoJSON(data, (result) => {
	// 					if(result.CustomerInformation.Result[0].$.Status == "OK")
	// 					{
	// 						resolve();
	// 					}
	// 					else
	// 					{
	// 						reject({message: 'Could not process your request please contact White Labs for support', code: 0});
	// 					}
	// 				});
	// 			});
	//   		}
	//   		else
	//   		{
	//   			reject({message: 'user is not logged in', code: -1});
	//   		}
 //  		});
 //  	}

 //  	/***********************
	// * NetSuite Connections *
	// ************************/
 //  	function sendSurvey(request, Tries=1)
 //  	{
 //  		return new Promise(function(resolve, reject)
	// 	{
	// 		// WLAPP-CUST
	// 		fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=889&deploy=1', {
	// 		  method: 'POST',
	// 		  headers: {
	// 		    'Authorization' : NSAuth(889),
	// 		    'Accept': 'application/json',
	// 		    'Content-Type': 'application/json',
	// 		  },
	// 		  body: NSSendMessage(request)
	// 		})
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 		{
	// 			if(response.type == 'error.SuiteScriptError')
	// 			{
	// 				reject({message: response.message, code: -1});
	// 			}
	// 			else if(response.error)
	// 			{
	// 				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED'))
	// 				{
	// 					ErrorMod.log('network', 'Could not send survey', response, true);
	// 				}

	// 				reject({message: response.error.message, code: response.error.code});
	// 			}
	// 			else
	// 			{
	// 				var message = NSReceiveMessage(response);
	// 				resolve();
	// 			}
	// 		})
	// 		.catch(err => {
	// 			if(Tries < MaxTries)
	// 			{
	// 				//impose random backoff and try again
	// 				const wait = Utils.getWaitTime(Tries) * 1000;
	// 				return delay(wait).then(() => sendConfirmationEmail(custInfo, Tries+1));
	// 			}
	// 			else
	// 			{
	// 				reject({message: 'max retries reached', code: -1});
	// 			}
	// 		});
	// 	});
 //  	}


	// function sendConfirmationEmail(custInfo, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
	// 	{
	// 		// WLAPP-CUST
	// 		fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=889&deploy=1', {
	// 		  method: 'POST',
	// 		  headers: {
	// 		    'Authorization' : NSAuth(889),
	// 		    'Accept': 'application/json',
	// 		    'Content-Type': 'application/json',
	// 		  },
	// 		  body: NSSendMessage({sendConfirmationEmail: true, custInfo: custInfo})
	// 		})
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 		{
	// 			if(response.type == 'error.SuiteScriptError')
	// 			{
	// 				reject({message: response.message, code: -1});
	// 			}
	// 			else if(response.error)
	// 			{
	// 				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED'))
	// 				{
	// 					ErrorMod.log('network', 'Could not send confirmation email', response, true);
	// 				}

	// 				reject({message: response.error.message, code: response.error.code});
	// 			}
	// 			else
	// 			{
	// 				var message = NSReceiveMessage(response);
	// 				resolve();
	// 			}
	// 		})
	// 		.catch(err => {
	// 			if(Tries < MaxTries)
	// 			{
	// 				//impose random backoff and try again
	// 				const wait = Utils.getWaitTime(Tries) * 1000;
	// 				return delay(wait).then(() => sendConfirmationEmail(custInfo, Tries+1));
	// 			}
	// 			else
	// 			{
	// 				reject({message: 'max retries reached', code: -1});
	// 			}
	// 		});;

	// 	})
	// }


 //  	function requestCreateCustomer(custInfo, creditInfo, Tries=1) // custInfo { companyname, category, subsidiary[], email, phone, vat (optional), conatactName, contactPhone, shipAddressee, shipAddress1, shipaddress2, shipaddress3, shipcity, shipzip, shipcountryid, (same for billing)}
 //  	{ 																		// creditInfo { name, ccnumber, expire, type}
 //  		return new Promise(function(resolve, reject)
 //  		{
 //  			custInfo.creditToken = EncryptCC(creditInfo);
	// 		var email = String(custInfo.email);
	// 		var nonce = Utils.uuid();
	// 		custInfo.nonce = nonce;
	// 		var message = NSSendMessage(custInfo);
	// 		creditInfo = null;

	// 		// WLAPP-CUST
	// 		fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=889&deploy=1', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Authorization' : NSAuth(889),
	// 				'Accept': 'application/json',
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: message
	// 		})
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 		{
	// 			if(response.type == 'error.SuiteScriptError')
	// 			{
	// 				reject({message: response.message, code: -1});
	// 			}
	// 			else if(response.error)
	// 			{
	// 				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED'))
	// 				{
	// 					ErrorMod.log('network', 'failed to register customer in NS', response, true);
	// 				}

	// 				reject({message: response.error.message, code: response.error.code});
	// 			}
	// 			else
	// 			{
	// 				var message = NSReceiveMessage(response);
	// 				message.nonce = nonce;
	// 				resolve(message);
	// 			}
	// 		})
	// 		.catch(err => {
	// 			if(Tries < MaxTries)
	// 			{
	// 				//impose random backoff and try again
	// 				const wait = Utils.getWaitTime(Tries) * 1000;
	// 				return delay(wait).then(() => requestCreateCustomer(custInfo, creditInfo, Tries+1));
	// 			}
	// 			else
	// 			{
	// 				reject({message: 'max retries reached', code: -1});
	// 			}
	// 		});
 //  		});
 //  	}

	// function requestChangeCust(infoToChange, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID = State.getState('UserID');
	//   		if(userID)
	//   		{
	//   			infoToChange.id = parseInt(userID);
	// 			var message = NSSendMessage(infoToChange);
				
	// 			//WLAPP-CUST
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=889&deploy=1', {
	// 			  method: 'PUT',
	// 			  headers: {
	// 			    'Authorization' : NSAuth(889, 'put'),
	// 			    'Accept': 'application/json',
	// 			    'Content-Type': 'application/json',
	// 			  },
	// 			  body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(async function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestChangeCust', response, true);
	// 					}

	// 					reject({message: response.error.message, code: response.error.code});
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.phone != 1)
	// 					{
	// 						reject({error: 'Could not update your phone number', code: 0});
	// 					}

	// 					if(message.email != 1)
	// 					{
	// 						reject({error: 'Could not update your email', code: 0});
	// 					}

	// 					if(message.currency != 1)
	// 					{
	// 						reject({message: 'Could not update your currency', code: 0});
	// 					}

	// 					if(message.vat != 1)
	// 					{
	// 						reject({message: 'Could not update your vat number', code: 0});
	// 					}

	// 					if(message.shipmethod != 1)
	// 					{
	// 						reject({message: 'Could not update your shipping method', code: 0});
	// 					}

	// 					if(message.ship != 1)
	// 					{
	// 						reject({message: 'Could not update your shipping address', code: 0});
	// 					}

	// 					if(message.bill != 1)
	// 					{
	// 						reject({message: 'Could not update your billing address', code: 0});
	// 					}

	// 					if(message.card != 1)
	// 					{
	// 						reject({message: 'Could not update your credit card information', code: 0});
	// 					}

	// 					await requestUserInfo();
	// 					resolve();
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestChangeCust(infoToChange, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'User is not logged in, cannot change User Info', code: -1});
	// 		}
 //  		});
	// }

	function requestInventory(classFilters, InventoryHash = false, Tries=1)
	{
		return new Promise(function(resolve, reject)
  		{
  			var body = NSSendMessage({classFilters: classFilters, InventoryHash: InventoryHash ? InventoryHash: null})
  			var Authorization = NSAuth(778, 'post');

  			//WLAPP-ITEM
  			fetch("https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=778&deploy=1", {
		  		method: 'POST',
		  		headers: {
					'Authorization': Authorization,		    		
					'Accept': 'application/x-www-form-urlencoded',
		    		'Content-Type': 'application/x-www-form-urlencoded',
		  		},
		  		body: body
			})
			.then((response) => response.json())
			.then(function(response)
			{
				
				if(response.type == 'error.SuiteScriptError')
				{
					reject({message: response.message, code: -1});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						// ErrorMod.log('network', 'requestInventory', response, true);
						console.log('network', 'requestInventory', response, true);
					}

					reject({message: response.error.message, code: response.error.code});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(InventoryHash && message.InventoryHash == true)
					{
						resolve({items: false, InventoryHash: message.InventoryHash});
					}
					else
					{
						//CHECK VERSION WARNING HERE
						State.setState({Inventory: message.items});
						if(message.items.length > 0)
						{
							resolve({items: message.items, InventoryHash: message.InventoryHash});
						}
						else
						{
							reject({ message: "No items in inventory", code: -1 });
						}
					}
				}
			})
			.catch(err => {
				if(Tries < MaxTries)
				{
					//impose random backoff and try again
					const wait = Utils.getWaitTime(Tries) * 1000;
					return delay(wait).then(() => requestInventory(Tries+1));
				}
				else
				{
					reject({ message: 'max retries reached', code: -1 });
				}
			});
  		});
	}

	// function requestUserInfo(Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID = State.getState('UserID');
	// 		if(userID)
	// 		{
	// 			//WLAPP-CUST
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=889&deploy=1', {
	// 		  		method: 'POST',
	// 		  		headers: {
	// 					'Authorization': NSAuth(889, 'post'),			    		
	// 					'Accept': 'application/json',
	// 		    		'Content-Type': 'application/json',
	// 		  		},
	// 		  		body: NSSendMessage({id: userID, get: true})
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
					
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestUserInfo', response, true);
	// 					}

	// 					reject({ message: response.error.message, code: response.error.code });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message)
	// 					{
	// 						// copy username over to new UserInfo object
	// 						var UserInfo = State.getState('UserInfo');
	// 						if(UserInfo && UserInfo.username)
	// 						{
	// 							message.username = UserInfo.username;
	// 						}
	// 						State.setState({UserInfo: message});

	// 						resolve(message);
	// 					}
	// 					else
	// 					{
	// 						reject({ message: 'user info not working', code: -1 });
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestUserInfo(Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({ message: 'max retries reached', code: -1 });
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({ message: 'User is not logged in, cannot retrieve User Info', code: -1 });
	// 		}
 //  		});
	// }


	// function requestOrderHistory(customerID, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID;

 //  			if(customerID)
 //  			{
 //  				userID = customerID;
 //  			}
 //  			else
 //  			{
 //  				userID = State.getState('UserID');
 //  			}

	// 		if(userID)
	// 		{
	// 			//WLAPP-ORDER
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 				method: 'POST',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(891, 'post'),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: NSSendMessage({id: userID, admin: false, get: true})
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
					
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestOrderHistory', response, true);
	// 					}

	// 					reject({ message: response.error.message, code: -1 });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.orders && message.orders.length > 0)
	// 					{
	// 						State.setState({OrderHistory: message.orders});
	// 						resolve(message.orders);
	// 					}
	// 					else
	// 					{
	// 						reject({ message: 'No past orders were found', code: 0 });
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestOrderHistory(Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({ message: 'max retries reached', code: -1 });
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({ message: 'User is not logged in, cannot retrieve Order History', code: -1});
	// 		}
 //  		});
	// }

	// function requestOrderPrice(query, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			if(State.getState('UserID'))
	// 		{
	// 			query.userID = State.getState('UserID');
	// 			var message = NSSendMessage(query);

	// 			//WLAPP-ORDER
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 			 	method: 'PUT',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(891, 'put'),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
					
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestOrderPrice', response, true);
	// 					}

	// 					reject({ message: response.error.message, code: -1 });
	// 				}
	// 				else if(response.message && response.message.toLowerCase().includes('invalid couponcode'))
	// 				{
	// 					reject({ message: 'Invalid coupon code', code: 0 });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.orderSubtotal)
	// 					{
	// 						resolve(message);
	// 					}
	// 					else
	// 					{
	// 						reject({ message: 'no subtotal', code: -1 });
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestOrderPrice(query, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({ message: 'max retries reached', code: -1 });
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({ message: 'User is not logged in, cannot retrieve pricing', code: -1 });
	// 		}
 //  		});
	// }

	// function requestOrderShipDates(Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID = State.getState('UserID');
	// 		if(userID)
	// 		{
	// 			if(!WLCart.checkCart())
	// 			{
	// 				reject({message: 'There is a problem with your cart please check it and try again.', code: 0});
	// 			}

	// 			var calcShip = true;
	// 			var userID = userID;
	// 			var items = WLCart.getCart();
	// 			var shipMethod = State.getState('UserInfo').shipMethod;

	// 			var message = NSSendMessage({calcShip, userID, items, shipMethod});

	// 			// WLAPP-ORDER
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 			 	method: 'PUT',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(891, 'put'),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestOrderShipDates', response, true);
	// 					}

	// 					reject({ message: response.error.message, code: -1 });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.items && message.items.length > 0 && message.transitTimes)
	// 					{
	// 						ConfirmationCart.init(userID, State.getState('UserInfo'), message.items, message.transitTimes, message.itemSubtotal, message.shippingSubtotal, message.orderSubtotal);

	// 						var warning;
	// 						if(message.items.length != WLCart.getLength())
	// 						{
	// 							warning = 'Items were removed due to lack of availability, please check your order carefully'
	// 						}

	// 						if(warning)
	// 						{
	// 							resolve(warning);
	// 						}
	// 						else
	// 						{
	// 							resolve();
	// 						}
	// 					}
	// 					else
	// 					{
	// 						reject({ message: 'Items have been removed due to unavailability', code: 0 });
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestOrderShipDates(Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({ message: 'User is not logged in, cannot retrieve ship dates', code: -1 });
	// 		}
 //  		});
	// }

	// function requestAlternateSizes(item, itemRef, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var UserID = State.getState('UserID');
 //  			var UserInfo = State.getState('UserInfo');

	// 		if(UserID)
	// 		{
	// 			var message = NSSendMessage({alternateSizes: true, id: UserID, SaleItem: item, ItemGroup: itemRef.volID.slice(0,3), subsidiary: parseInt(UserInfo.subsidiary)});

	// 			//WLAPP-ITEM
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=778&deploy=1', {
	// 			 	method: 'PUT',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(778, 'put'),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{

	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestAlternateSizes', response, true);
	// 					}

	// 					reject({ message: response.error.message, code: -1 });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.alternateSizes.length > 0)
	// 					{
	// 						message.alternateSizes.forEach(function(x) {
	// 							x.forEach(function(y) {
	// 								if(y)
	// 								{
	// 									y.Name = String(itemRef.Name);
	// 									y.salesCategory = parseInt(itemRef.salesCategory);
	// 									y.alternateItem = true;		
	// 									y.purepitch = true;								
	// 								}
	// 							});
	// 						});

	// 						resolve(message.alternateSizes);
	// 					}
	// 					else
	// 					{
	// 						reject({message: 'No alternative size combinations were found', code: 0});
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestAlternateSizes(item, itemRef, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'User is not logged in', code: -1});
	// 		}
 //  		});
	// }

	// function requestSimilarStrains(item, itemRef, selectedStyles, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var UserID = State.getState('UserID');
	// 		if(UserID)
	// 		{
	// 			var message = NSSendMessage({id: UserID, SaleItem: item, ItemGroup: itemRef.volID.slice(0,3), selectedStyles: selectedStyles});

	// 			//WLAPP-ITEM
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=778&deploy=1', {
	// 			 	method: 'PUT',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(778, 'put'),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{

	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestSimilarStrains', response, true);
	// 					}
	// 					reject({ message: response.error.message, code: -1 });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.alternateStrains.length > 0)
	// 					{
	// 						message.alternateStrains.forEach(function(y) {
	// 							y.alternateItem = true;		
	// 							y.purepitch = true;	
	// 						});

	// 						resolve(message.alternateStrains);
	// 					}
	// 					else
	// 					{
	// 						reject({ message: 'No alternate strains were found', code: 0 });
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestAlternateSizes(item, itemRef, selectedStyles, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({ message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'User is not logged in', code: -1});
	// 		}
 //  		});
	// }

	// function requestAddSubsidiary(request, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var UserInfo = State.getState('UserInfo');
 //  			var mainSub = UserInfo.connectedaccounts.find(x => x.subsidiaryid == '2');
	// 		if(mainSub)
	// 		{
	// 			var message = NSSendMessage({addSubsidiary: true, id: mainSub.internalid, subsidiary: request.newSubsidiary, vat: request.vat, category: UserInfo.category});

	// 			//WLAPP-CUST
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=889&deploy=1', {
	// 			 	method: 'PUT',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(889, 'put'),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{	
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestAddSubsidiary', response, true);
	// 					}
	// 					reject({message: response.error.message, code: response.error.code});
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.id > 0)
	// 					{
	// 						resolve(message.id);
	// 					}
	// 					else
	// 					{
	// 						reject({message: 'failed to create subsidiary account', code: -1});
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestAddSubsidiary(subsidiary, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'User does not have White Labs Inc Account', code: -1});
	// 		}
 //  		});
	// }

	// function requestPlaceOrder(Tries=1)
	// {

	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID = State.getState('UserID');

	// 		if(userID && ConfirmationCart.getLength() > 0 && !ConfirmationCart.getErrorState())
	// 		{
	// 			var finalOrder = ConfirmationCart.finalOrder();
	// 			var message = NSSendMessage(finalOrder);

	// 			//WLAPP-ORDER
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 				method: 'POST',
	// 			  	headers: {
	// 			    	'Authorization' : NSAuth(891),
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestPlaceOrder', response, true);
	// 					}
	// 					reject({message: response.error.message, code: response.error.code});
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);

	// 					if(message.orderNum.length > 0)
	// 					{
	// 						WLCart.clearCart();
	// 					  	requestOrderHistory();
	// 					  	if(State.getState('WLCSR'))
	// 					  	{
	// 					  		requestSalesRepOrderHistory();
	// 					  	}
	// 						resolve();
	// 					}
	// 					else
	// 					{
	// 						reject({message: 'Please note your order details and contact White Labs', code: -1});
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestPlaceOrder(Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({ message: 'max retries reached', code: -1 });
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({ message: 'User not logged in', code: -1 });
	// 		}
 //  		});
	// }

	// function requestPlaceTestOrder(Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID = State.getState('UserID');
	// 		if(userID && ConfirmationCart.getLength() > 0 && !ConfirmationCart.getErrorState())
	// 		{
	// 			var message = NSSendMessage(ConfirmationCart.finalOrder());

	// 			// WLAPP-ORDER (Sandbox)
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 				method: 'POST',
	// 			  	headers: {
	// 			    	'Authorization' : "NLAuth nlauth_account=4099054_SB1, nlauth_email=mwhite@whitelabs.com, nlauth_signature=Yeastman001, nlauth_role=3",
	// 			    	'Accept': 'application/json',
	// 			    	'Content-Type': 'application/json',
	// 			  	},
	// 			  	body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestPlaceTestOrder', response, true);
	// 					}
	// 					reject({message: response.error.message, code: response.error.code});
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);

	// 					if(message.orderNum.length > 0)
	// 					{
	// 						WLCart.clearCart();
	// 					  	requestOrderHistory();
	// 					  	if(State.getState('WLCSR'))
	// 					  	{
	// 					  		requestSalesRepOrderHistory();
	// 					  	}
	// 						resolve();
	// 					}
	// 					else
	// 					{
	// 						reject({message: 'Please note your order details and contact White Labs', code: -1});
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestPlaceTestOrder(Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'User not logged in', code: -1});
	// 		}
 //  		});
	// }

	// function requestInvoice(orderID, email, Tries=1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			var userID = State.getState('UserID');
	// 		if(userID)
	// 		{
	// 			var message = NSSendMessage({orderID: orderID, email: email});

	// 			//WLAPP-ResendInvoice (v1)
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=781&deploy=1', {
	// 				method: 'POST',
	// 				headers: {
	// 					'Authorization' : NSAuth(781),
	// 					'Accept': 'application/json',
	// 					'Content-Type': 'application/json',
	// 				},
	// 				body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error)
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestInvoice', response, true);
	// 					}
	// 					reject({message: response.error.message, code: response.error.code});
	// 				}
	// 				else
	// 				{
	// 					resolve();
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestInvoice(orderID, email, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'user is not logged in', code: -1});
	// 		}
 //  		});
	// }

	// function requestCustomerLookup(custName, Tries = 1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
 //  			if(custName.length > 0)
	// 		{
	// 			var message = NSSendMessage({name: custName});

	// 			// WLAPP-FindCustomerGlobalSearch
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=780&deploy=1', {
	// 				method: 'POST',
	// 				headers: {
	// 					'Authorization' : NSAuth(780),
	// 					'Accept': 'application/json',
	// 					'Content-Type': 'application/json',
	// 				},
	// 				body: message
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error) //response.data
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestCustomerLookup', response, true);
	// 					}
	// 					reject({message: response.error.message, code: response.error.code});
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					if(message.length > 0)
	// 					{
	// 						resolve(message);
	// 					}
	// 					else
	// 					{
	// 						reject({message: 'No customers found for: ' + custName, code: 0});
	// 					}
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestCustomerLookup(custName, Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({message: 'max retries reached', code: -1});
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({message: 'Please enter a valid customer name', code: 0});
	// 		}
 //  		});
	// }

	// function requestSalesRepOrderHistory(Tries = 1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
	// 		var WLCSR = State.getState('WLCSR');
	// 		if(WLCSR)
	// 		{
	// 			//WLAPP-ORDER
	// 			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 			  method: 'post',
	// 			  headers: {
	// 				'Authorization' : NSAuth(891, 'post'),
	// 				'Accept': 'application/json',
	// 				'Content-Type': 'application/json',
	// 			  },
	// 			  body: NSSendMessage({id: WLCSR, admin: true, get: true}) //143
	// 			})
	// 			.then((response) => response.json())
	// 			.then(function(response)
	// 			{
	// 				if(response.type == 'error.SuiteScriptError')
	// 				{
	// 					reject({message: response.message, code: -1});
	// 				}
	// 				else if(response.error) //response.data
	// 				{
	// 					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 					{
	// 						ErrorMod.log('network', 'requestSalesRepOrderHistory', response, true);
	// 					}
	// 					reject({ message: response.error.message, code: -1 });
	// 				}
	// 				else
	// 				{
	// 					var message = NSReceiveMessage(response);
	// 					resolve(message.orders);
	// 				}
	// 			})
	// 			.catch(err => {
	// 				if(Tries < MaxTries)
	// 				{
	// 					//impose random backoff and try again
	// 					const wait = Utils.getWaitTime(Tries) * 1000;
	// 					return delay(wait).then(() => requestSalesRepOrderHistory(Tries+1));
	// 				}
	// 				else
	// 				{
	// 					reject({ message: 'max retries reached', code: -1 });
	// 				}
	// 			});
	// 		}
	// 		else
	// 		{
	// 			reject({ message: 'user is not logged in', code: -1 });
	// 		}
	// 	});
	// }

	// function requestPastOrder(orderID, Tries = 1)
	// {
	// 	return new Promise(function(resolve, reject)
 //  		{
	// 		orderID = parseInt(orderID);
	// 		if(isNaN(orderID))
	// 		{
	// 			reject({message: 'Invalid Order ID', code: -1});
	// 		}

	// 		//WLAPP-ORDER
	// 		fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=891&deploy=1', {
	// 		  method: 'POST',
	// 		  headers: {
	// 			'Authorization' : NSAuth(891, 'post'),
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json',
	// 		  },
	// 		  body: NSSendMessage({id: orderID, get: true})
	// 		})
	// 		.then((response) => response.json())
	// 		.then(function(response)
	// 		{
				
	// 			if(response.type == 'error.SuiteScriptError')
	// 			{
	// 				reject({message: response.message, code: -1});
	// 			}
	// 			else if(response.error) //response.data
	// 			{

	// 				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
	// 				{
	// 					ErrorMod.log('network', 'requestPastOrder', response, true);
	// 				}
	// 				reject({ message: response.error.message, code: -1 });
	// 			}
	// 			else
	// 			{
	// 				var message = NSReceiveMessage(response);
	// 				resolve(message);
	// 			}
	// 		})
	// 		.catch(err => {
	// 			if(Tries < MaxTries)
	// 			{
	// 				//impose random backoff and try again
	// 				const wait = Utils.getWaitTime(Tries) * 1000;
	// 				return delay(wait).then(() => requestPastOrder(orderID, Tries+1));
	// 			}
	// 			else
	// 			{
	// 				reject({ message: 'max retries reached', code: -1 });
	// 			}
	// 		});
	// 	});
	// }


	function delay(t, v) {
	   return Promise(function(resolve) {
		   setTimeout(resolve.bind(null, v), t)
	   });
	}

	return {

		//NS
		// sendSurvey: sendSurvey,
		// sendConfirmationEmail: sendConfirmationEmail,
		requestInventory: requestInventory,
		// requestUserInfo: requestUserInfo,
		// requestChangeCust: requestChangeCust,
		// requestOrderHistory: requestOrderHistory,
		// requestOrderShipDates: requestOrderShipDates,
		// requestOrderPrice: requestOrderPrice,
		// requestPlaceOrder: requestPlaceOrder,
		// requestPlaceTestOrder: requestPlaceTestOrder,
		// requestCreateCustomer: requestCreateCustomer,
		// requestInvoice: requestInvoice,
		// requestCustomerLookup: requestCustomerLookup,
		// requestSalesRepOrderHistory: requestSalesRepOrderHistory,
		// requestPastOrder: requestPastOrder,
		// requestAddSubsidiary: requestAddSubsidiary,
		// requestAlternateSizes: requestAlternateSizes,
		// requestSimilarStrains: requestSimilarStrains,

		// //WL.com
		// requestHBStores: requestHBStores,
		// requestNews: requestNews,

		// //Yeastman
		requestUserID: requestUserID,
		// requestForgotPassword: requestForgotPassword,
		// requestActivateAccount: requestActivateAccount,
		// requestChangePassword: requestChangePassword,
		// createCustomerInYeastMan: createCustomerInYeastMan,

		// //Google Cloud
		// getFeedback: getFeedback,
		// getLocationSearchTerm: getLocationSearchTerm,
		// getLocationLatLng: getLocationLatLng,
		// getCustomersInLocation: getCustomersInLocation,
		// updatePhoneList: updatePhoneList,
		// sendPushNotification: sendPushNotification,
		// savePushToken: savePushToken,
		// sendFeedback: sendFeedback,
		// logLogin: logLogin,
		// updateCart: updateCart
	}
})();

module.exports.Network = Network;