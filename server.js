const express = require('express')
const nextJS = require('next')
var bodyParser = require('body-parser')

const dev = process.env.NODE_ENV !== 'production'
const app = nextJS({ dev })
const handle = app.getRequestHandler()


const fetch = require('isomorphic-unfetch');

const Utils = require('./lib/Utils');
const SalesLib = require('./lib/SalesLib');

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
	CryptoJS: require('./lib/CryptoJS'),
	XMLParser: require('xml2js').parseString,
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

const MaxTries = 3;

app.prepare()
.then(() => {
	const server = express();
	server.use( bodyParser.json() );       // to support JSON-encoded bodies
	server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	 	extended: true
	}));

	function delay(duration) {
		return function(...args){
			return new Promise(function(resolve, reject){
				setTimeout(function(){
					resolve(...args);
				}, duration)
			});
		};
	}

	function NSAuth(scriptID, type = 'post')
  	{
  		//Fall back authentication
		return "NLAuth nlauth_account=4099054_SB1, nlauth_email=mwhite@whitelabs.com, nlauth_signature=YeastBuddy08, nlauth_role=1067";
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
		system.XMLParser(xml, function(error, result)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				cb(result);
			}
		});
	}

	/******************
	* YMO Connections *
	******************/

	 server.post('/get-user-id', function(req, res, next){

 		var username = req.body.username;
 		var password = req.body.password;

 		var time = new Date();
 		var data = '<CustomerInformationRequest Operation="Login"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
 					+ '<UserName>' + username.toString() + '</UserName>'
 					+ '<Password>' + password.toString() + '</Password>'
 					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
 					+ '<Nonce>' + Utils.uuid() + '</Nonce>'
 					+ '</CustomerInformationRequest>';
 		data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
 		fetch('https://www.yeastman.com/Login/Validator.aspx', {
 		 	method: 'POST',
 		  	headers: {
 		    	'Content-Type': 'application/x-www-form-urlencoded',
 		  	},
 		  	body: data
 		})
 		.then(response => response.text())
 		.then(response => {

 			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
 			XMLtoJSON(data, (result) => {
 				if(result.CustomerInformation.Result[0].$.Status == "OK")
 				{
 					if(result.CustomerInformation.NetSuiteID[0].$.UserType == "Staff" || result.CustomerInformation.NetSuiteID[0]._ == '43148')
 					{
						 console.log('sssssssssssssssss');
						 
 						return res.send({userID: result.CustomerInformation.NetSuiteID[0]._});
 					}
 					else
 					{
						 console.log('3333333333333333333');
						 
 						return res.send({userID: result.CustomerInformation.NetSuiteID[0]._});
 					}
 				}
 				else
 				{
 					res.send({error: { message: 'Your username or password is invalid', code: 0}});
 				}
 			});
 		})
 		.catch(function(error)
 		{

 			console.log('error', error);
 			res.send({error: { message: error, code: -1 }});
 		});

 	})

	server.post('/create-yeastman-account', function(req, res, next) {
		for(var i = 0; i < message.id.length; i++)
		{
			if(message.id[i] <= 0)
			{
				reject({message: 'failed to create customer in Yeastman', code: 0});
			}
		}

		var time = new Date();
		var data = '<CustomerInformationRequest Operation="Register"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
					+ '<Password>' + password.toString() + '</Password>'
					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
					+ '<Nonce>' + message.nonce + '</Nonce>'
					+ '<ExternalID>' + message.id[0] + '</ExternalID>'
					+ '<Email>' + email + '</Email>'
					+ '</CustomerInformationRequest>';
		data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
		fetch('https://www.yeastman.com/Login/Validator.aspx', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		  },
		  body: data
		})
		.then(response => response.text())
		.then(response => {
			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
			XMLtoJSON(data, async (result) => {
				if(result.CustomerInformation.Result[0].$.Status == "OK")
				{
					res.sendStatus(200);
				}
				else if(result.CustomerInformation.Result[0]._.includes("already exist") || result.CustomerInformation.Result[0]._.includes("already in use"))
				{
					res.send({error: { message: "This account already exists in Yeastman", code: 0}});
				}
				else
				{
					res.send({error: { message: "failed to create an account in Yeastman", code: 0}});				}
			});
		});
	});

	server.post('/new-password', function(req, res, next) {
		var request = req.body.request;
		var time = new Date();
		var subjective;
		if(request.email)
		{
			subjective = '<Email>' + request.email + '</Email>';
		}
		else
		{
			subjective = '<UserName>' + request.username + '</UserName>';
		}

		var data = '<CustomerInformationRequest Operation="Reset Password"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
					+ '<Nonce>' + Utils.uuid() + '</Nonce>'
					+ subjective + '</CustomerInformationRequest>';
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
					res.sendStatus(200);
				}
				else
				{
					res.send({error: { message: "No account was found", code: 0}});
				}
			});
		});
	});

	server.post('/activate-account', function(req, res, next) {

		var request = req.body.request;

		var time = new Date();

		var subjective;
		if(request.userOrEmail)
		{
			subjective = '<AccountNumber>' + request.userInfo + '</AccountNumber>';
		}
		else
		{
			subjective = '<Email>' + request.userInfo + '</Email>';
		}

		var data = '<CustomerInformationRequest Operation="Lookup"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
					+ '<TimeStamp>' + time.getTime() + '</TimeStamp>'
					+ '<Nonce>' + Utils.uuid() + '</Nonce>'
					+ subjective + '</CustomerInformationRequest>';
		data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
		fetch('https://www.yeastman.com/Login/Validator.aspx', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		  },
		  body: data
		})
		.then(response => response.text())
		.then(response => {
			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
			XMLtoJSON(data, (result) => {
				if(result.CustomerInformation.Result[0].$.Status == "OK")
				{
					res.sendStatus(200);
				}
				else
				{
					res.send({error: { message: "Could not recover your account please try again later", code: 0}});
				}
			});
		});
	})

	/***********************
	* NetSuite Connections *
	***********************/

	server.get('/get-inventory', (req, res, next) => {

		//YMO-ITEM
		fetch("https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=912&deploy=1", {
	  		method: 'GET',
	  		headers: {
				'Authorization': NSAuth(912, "get"),
				'Accept': 'application/json',
	    		'Content-Type': 'application/json',
	  		},
		})
		.then((response) => response.json())
		.then(response => {
			if(response.type == 'error.SuiteScriptError')
			{
				res.send({error: {message: response.message, code: -1}})
			}
			else if(response.error)
			{
				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
				{
					console.log('server', 'get-inventory', response, true);
				}

				res.send({error: { message: response.error.message, code: response.error.code}});
			}
			else
			{
				var message = NSReceiveMessage(response);
				
				if(message.items.length > 0)
				{
					return res.send(message);
				}
				else
				{
					res.send({error: { message: "No items in inventory", code: -1}});

				}
			}
		})
		.catch(error => {
			res.send({error: { message: error, code: -1 }});
		});
	});


	server.post('/get-item-availability', function(req, res, next) {
		var itemID = req.body.itemID;

		if(itemID) {

			var body = NSSendMessage({itemID});
			
			//YMO-ITEM
			fetch("https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=912&deploy=1", {
				method: 'POST',
				headers: {
					'Authorization': NSAuth(912, "post"),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body
			})
			.then((response) => response.json())
			.then(response => {
				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}})
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'get-item-availability', response, true);
					}

					res.send({error: { message: response.error.message, code: response.error.code}});
				}
				else
				{
					var message = NSReceiveMessage(response);
					return res.send(message);
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'No item provided. Cannot get item availability', code: -1 }});
		}

	})

	server.post('/get-user-info', function(req, res, next){

		var userID = req.body.userID;

		if(userID)
		{
			var body = NSSendMessage({id: userID, get: true});

			//YMO-CUST
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=913&deploy=1', {
		  		method: 'POST',
		  		headers: {
					'Authorization': NSAuth(913, 'post'),
					'Accept': 'application/json',
		    		'Content-Type': 'application/json',
		  		},
		  		body
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {  message: response.message, code: -1 }});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						// ErrorMod.log('server', 'requestUserInfo', response, true);
						console.log('server', 'get-user-info', response, true);

					}

					res.send({error: {  message: response.error.message, code: response.error.code }});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message)
					{
						return res.send(message);
					}
					else
					{
						res.send({error: { message: 'user info not working', code: -1 }});
					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in, cannot retrieve User Info', code: -1 }});
		}
	});

	server.post('/prepare-order', function(req, res, next){

		const request = req.body;
		if(request.user.id) {

			var message = NSSendMessage(request);

			// YMO-ORDER
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=914&deploy=1', {
			 	method: 'PUT',
			  	headers: {
			    	'Authorization' : NSAuth(914, 'put'),
			    	'Accept': 'application/json',
			    	'Content-Type': 'application/json',
			  	},
			  	body: message
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					return res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'prepare-order', response, true);
					}

					return res.send({error: { message: response.error.message, code: -1 }});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message.items && message.items.length > 0 && message.transitTimes)
					{
						return res.send(message);
					}
					else
					{
						res.send({error: { message: 'Items have been removed due to unavailability', code: 0 }});
					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in, cannot retrieve ship dates', code: -1 }});
		}

	});

	server.post('/place-order', function(req, res, next) {
		const request = req.body.request;

		if(request.user.id)
		{
			var message = NSSendMessage(request);

			//YMO-ORDER
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=914&deploy=1', {
				method: 'POST',
				headers: {
					'Authorization' : NSAuth(914, 'post'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: message
			})
			.then(response=> response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'place-order', response, true);
					}
					res.send({error: { message: response.error.message, code: response.error.code }});
				}
				else
				{
					var message = NSReceiveMessage(response);

					if(message.orderNum.length > 0)
					{
						res.sendStatus(200);
					}
					else
					{
						res.send({error: { message: 'Items have been removed due to unavailability', code: 0 }});					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in, cannot place order', code: 0 }});
		}
	})

	server.post('/update-user-info', function(req, res, next) {

		const request = req.body.request;
		if(request.id)
		{
			var message = NSSendMessage(request);

			//YMO-CUST
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=913&deploy=1', {
			  method: 'PUT',
			  headers: {
				'Authorization' : NSAuth(913, 'put'),
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			  },
			  body: message
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'update-user-info', response, true);
					}

					res.status(500).send({error: {message: response.error.message, code: response.error.code}});
				}
				else
				{
					var message = NSReceiveMessage(response);
					res.sendStatus(200)

				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});

			});
		}
		else
		{
			res.send({error: { message: "User is not logged in, cannot change User Info", code: -1 }});
		}
	})

	/**
	* Get order history for a customer
	*
	* @param String userID - User Id of customer requesting order history
	*
	* @return [Object] - Array of order objects
	*/
	server.post('/get-order-history', function(req, res, next) {

		var request = req.body.request;

		if(request.id)
		{

			const body = NSSendMessage({id: request.id, admin: false, get: true});

			//YMO-ORDER
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=914&deploy=1', {
				method: 'POST',
				headers: {
					'Authorization' : NSAuth(914, 'post'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'get-order-history', response, true);
					}

					res.send({error: {message: response.error.message, code: -1}});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message.orderHistory && message.orderHistory.length > 0)
					{
						res.send(message);
					}
					else
					{
						res.send({error: { message: 'No past orders were found', code: 0 }});
					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: "User is not logged in, cannot retrieve Order History", code: -1 }});
		}
	})

	/**
	* Get pricing for order
	*
	* @param {Object} request - Object containing items, shipmethod, and coupon code (optional)
	*
	* @return {Object} - Object containing item subtotal, shipping subtotal, and order subtotal
	*/
	server.post('/get-order-price', function(req, res, next) {

		var request = req.body.request;
		if(request.userID)
		{
			var message = NSSendMessage(request);

			//YMO-ORDER
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=914&deploy=1', {
				method: 'PUT',
				headers: {
					'Authorization' : NSAuth(914, 'put'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: message
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'get-order-price', response, true);
					}

					res.send({error: {message: response.error.message, code: -1}});
				}
				else if(response.message && response.message.toLowerCase().includes('invalid couponcode'))
				{
					res.send({error: { message: 'Invalid coupon code', code: 0 }});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message.orderSubtotal)
					{
						res.send(message);
					}
					else
					{
						res.send({error: { message: 'No subtotal', code: -1 }});
					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in, cannot retrieve pricing', code: -1 }});
		}
	})

	/**
	* Create customer account in NetSuite
	*
	* @param {Object} custInfo - Object containing all customer's info required upon registration
	*
	* @return {Object} - Object containing array of ids for each related customer account, username, and token id
	*/
	server.post('/create-netsuite-account', function(req, res, next) {
		var custInfo = req.body.custInfo;

		var message = NSSendMessage(custInfo);
		creditInfo = null;

		// YMO-CUST
		fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=913&deploy=1', {
			method: 'POST',
			headers: {
				'Authorization' : NSAuth(913),
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: message
		})
		.then(response => response.json())
		.then(response => {
			if(response.type == 'error.SuiteScriptError')
			{
				res.send({error: { message: response.message, code: -1 }});
			}
			else if(response.error)
			{
				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED'))
				{
					console.log('server', 'create-netsuite-account', response, true);
				}

				res.send({error: { message: response.error.message, code: response.error.code}});
			}
			else
			{
				var message = NSReceiveMessage(response);
				message.nonce = nonce;
				res.send(message);
			}
		})
		.catch(error => {
			res.send({error: { message: error, code: -1 }});
		});

	})

	/**
	* Get similar strains for a particular item
	*
	* @param {int} userID - ID of user logged in
	* @param {Object} item - the yeast item being exchanged
	* @param {Object} itemRef - the inventory item reference to the yeast item
	* @param [string] selectedStyles - List of beer styles that will be used
	* 		to look up alternative strains
	* @return [Object] - array of strains
	*/
	server.get('/similar-strains', function(req, res, next) {

		var request = req.body.request;

		if(request.userID)
		{
			var message = NSSendMessage({id: request.userID, SaleItem: request.item, ItemGroup: request.itemRef.volID.slice(0,3), selectedStyles: request.selectedStyles});

			//YMO-ITEM
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=912&deploy=1', {
				method: 'PUT',
				headers: {
					'Authorization' : NSAuth(912, 'put'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: message
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'similar-strains', response, true);
					}

					res.send({ error: {message: response.error.message, code: -1 }});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message.alternateStrains.length > 0)
					{
						message.alternateStrains.forEach(function(y) {
							y.alternateItem = true;
							y.purepitch = true;
						});

						res.send(message.alternateStrains);
					}
					else
					{
						res.send({ error: { message: 'No alternate strains were found', code: 0 }});
					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in', code: -1}});
		}
	})

	/**
	* Get alternate sizes for a particular item
	*
	* @param {int} userID - ID of user logged in
	* @param {Object} item - the yeast item being exchanged
	* @param {Object} itemRef - the inventory item reference to the yeast item
	*
	* @return [Object] - array of strains
	*/
	server.post('/alternate-sizes', function(req, res, next) {

		var request = req.body.request;

		if(request.userID)
		{
			var message = NSSendMessage({alternateSizes: true, id: request.userID, SaleItem: request.item, ItemGroup: request.itemRef.volID.slice(0,3), subsidiary: parseInt(request.subsidiary)});

			//YMO-ITEM
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=912&deploy=1', {
				method: 'PUT',
				headers: {
					'Authorization' : NSAuth(912, 'put'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: message
			})
			.then(response => response.json())
			.then(response => {

				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('server', 'alternate-sizes', response, true);
					}

					res.send({ error: {message: response.error.message, code: -1 }});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message.alternateSizes.length > 0)
					{
						message.alternateSizes.forEach(function(x) {
							x.forEach(function(y) {
								if(y)
								{
									y.Name = String(itemRef.Name);
									y.salesCategory = parseInt(itemRef.salesCategory);
									y.alternateItem = true;
									y.purepitch = true;
								}
							});
						});

						res.send(message.alternateSizes);
					}
					else
					{
						reject({message: 'No alternative size combinations were found', code: 0});
					}
				}
			})
			.catch(error => {
				res.send({error: { message: error, code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in', code: -1}});
		}
	})

	server.get('*', (req, res, next) => {

		return handle(req, res, next)
	})


	server.listen(3000, (error) => {
		if (error) throw error
		console.log('> Ready on http://localhost:3000')
	})
})
.catch((ex) => {
	console.error(ex.stack)
	process.exit(1)
})
