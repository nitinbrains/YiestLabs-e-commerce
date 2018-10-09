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
		return "NLAuth nlauth_account=4099054_SB1, nlauth_email=mwhite@whitelabs.com, nlauth_signature=Yeastman001, nlauth_role=3";

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

	server.get('/get-inventory', (req, res, next) => {

		var classFilters = JSON.parse(req.query.classFilters)

		var body = NSSendMessage({classFilters: classFilters ? classFilters : null});

		//YMO-ITEM
		fetch("https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=912&deploy=1", {
	  		method: 'POST',
	  		headers: {
				'Authorization': NSAuth(912, "post"),		    		
				'Accept': 'application/json',
	    		'Content-Type': 'application/json',
	  		},
	  		body: body
		})
		.then((response) => response.json())
		.then(function(response)
		{
			if(response.type == 'error.SuiteScriptError')
			{
				res.send({error: {message: response.message, code: -1}})
			}
			else if(response.error)
			{
				if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
				{
					console.log('network', 'get-inventory', response, true);
				}

				res.send({error: { message: response.error.message, code: response.error.code}});
			}
			else
			{
				var message = NSReceiveMessage(response);
				//CHECK VERSION WARNING HERE
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
		.catch(err => {
			return res.send({error: {message: "service unavailable", code: -1}});
		});
	});

	server.post('/get-user-info', function(req, res, next){
		
		var userId = req.body.userId;

		if(userId)
		{
			//YMO-CUST
			fetch('https://4099054-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=913&deploy=1', {
		  		method: 'POST',
		  		headers: {
					'Authorization': NSAuth(913, 'post'),			    		
					'Accept': 'application/json',
		    		'Content-Type': 'application/json',
		  		},
		  		body: NSSendMessage({id: userId, get: true})
			})
			.then((response) => response.json())
			.then(function(response)
			{
				
				if(response.type == 'error.SuiteScriptError')
				{
					res.send({error: {  message: response.message, code: -1 }});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						// ErrorMod.log('network', 'requestUserInfo', response, true);
						console.log('network', 'get-user-info', response, true);

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
				res.send({error: { message: 'could not get user info', code: -1 }});
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in, cannot retrieve User Info', code: -1 }});
		}
	})

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
		.then((response) => response.text())
		.then(function(response)
		{
			var data = system.CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString(system.CryptoJS.enc.Utf8);
			XMLtoJSON(data, (result) => {
				if(result.CustomerInformation.Result[0].$.Status == "OK")
				{
					if(result.CustomerInformation.NetSuiteID[0].$.UserType == "Staff" || result.CustomerInformation.NetSuiteID[0]._ == '43148')
					{
						return res.send(result.CustomerInformation.NetSuiteID[0]._);
					}
					else
					{
						return res.send(result.CustomerInformation.NetSuiteID[0]._);
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

			console.log('err', error);
			res.send({error: { message: error, code: -1 }});
		});
 
	})

	server.post('/prepare-order', function(req, res, next){

		const request = req.body.request;
			
		if(request.userId)
		{

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
			.then((response) => response.json())
			.then(function(response)
			{
				if(response.type == 'error.SuiteScriptError')
				{
					return res.send({error: {message: response.message, code: -1}});
				}
				else if(response.error)
				{
					if(!(response.error.code == 'WS_CONCUR_SESSION_DISALLWD' || response.error.code == 'WS_REQUEST_BLOCKED' || response.error.code == -1))
					{
						console.log('network', 'prepare-order', response, true);
					}

					return res.send({error: { message: response.error.message, code: -1 }});
				}
				else
				{
					var message = NSReceiveMessage(response);
					if(message.items && message.items.length > 0 && message.transitTimes)
					{

						return res.send(message);

						// ConfirmationCart.init(userID, State.getState('UserInfo'), message.items, message.transitTimes, message.itemSubtotal, message.shippingSubtotal, message.orderSubtotal);

						// var warning;
						// if(message.items.length != WLCart.getLength())
						// {
						// 	warning = 'Items were removed due to lack of availability, please check your order carefully'
						// }

						// if(warning)
						// {
						// 	resolve(warning);
						// }
						// else
						// {
						// 	resolve();
						// }
					}
					else
					{
						res.send({error: { message: 'Items have been removed due to unavailability', code: 0 }});
					}
				}
			})
			.catch(err => {
				if(Tries < MaxTries)
				{
					//impose random backoff and try again
					const wait = Utils.getWaitTime(Tries) * 1000;
					setTimeout(wait, prepareOrder(Tries+1));
				}
				else
				{
					res.send({error: { message: 'max retries reached', code: -1}});
				}
			});
		}
		else
		{
			res.send({error: { message: 'User is not logged in, cannot retrieve ship dates', code: -1 }});
		}
		
	});

	server.get('*', (req, res, next) => {
		return handle(req, res, next)
	})

	server.listen(3000, (err) => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	})
})
.catch((ex) => {
	console.error(ex.stack)
	process.exit(1)
})
