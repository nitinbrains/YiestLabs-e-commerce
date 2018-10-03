'use strict'

// import { AsyncStorage } from 'react-native';
import CryptoJS from './CryptoJS';
import SalesLib from './SalesLib';

var ErrorMod = (function() {
	
	function log(type, message, error, critical = true)
	{
		if(!type)
		{
			type = 'system';
		}

		if(!message)
		{
			message = 'logging error';
		}

		var obj = {type: type, message: message, error: error, critical: critical, date: Date.now(), version: SalesLib.clientVersion};
		console.log("Error: ", obj);
		sendErrorToCloud(obj);

	}

	//sends error to cloud or logs it locally
	function sendErrorToCloud(error)
	{
		var message = NSSendMessage(error);
		fetch('http://35.193.208.36:14400/ERRORS/', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: message
		})
		.then((response) => response.json())
		.then(function(response)
		{
			if(response.error)
			{
				console.error("ErrorLogging Error: ", response);
			}
		})
		.catch(err => {
			var otherError = {type: 'system', message: 'logging network error', additionalDetails: err.toString(), critical: false, date: Date.now(), version: SalesLib.clientVersion};
			storeError([error, otherError]);
		});
	}

	//reads local errors and tries to resubmit them and dies, erases local memory
	function retrieveLocalErrors()
	{
		retrieveErrors((Errors) => {
			if(Errors.length > 0)
			{
				retryFailedErrorSubmissionsOrDie(Errors);
			}
		});
		
	}

	function retryFailedErrorSubmissionsOrDie(Errors)
	{
		Errors.forEach(error => {
			var message = NSSendMessage(error);
			fetch('http://35.193.208.36:14400/ERRORS/', {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
			  },
			  body: message
			})
			.then((response) => response.json())
			.then(function(response)
			{
				if(response.error)
				{
					console.error("ErrorLogging Error: ", response);
				}
			})
			.catch(err => {
				console.error("ErrorLogging Error: ", err);
			});
		});
	}

	function storeError(errors)
	{
		retrieveErrors((Errors) => {
			Errors = Errors.concat(errors);
			var encryptedData = encryptData(Errors);
			AsyncStorage.setItem("ERRORS", encryptedData, (err) => {
				if(err)
				{
					console.error("Store Error Error: ", err);	
				}
			});
		});		
	}

	function retrieveErrors(cb)
	{
		AsyncStorage.getItem("ERRORS", (err, value) => {
			if(err)
			{
				console.error("Retrieve Errors Error: ", err);
				cb([]);
			}
			else if(value)
			{
				AsyncStorage.removeItem("ERRORS");
				cb(JSON.parse(decryptData(value)));
			}
			else
			{
				cb([]);
			}
		});

	}

	function encryptData(data)
	{
		var text = JSON.stringify(data);
		var result = CryptoJS.AES.encrypt(text, 'fe1e25PoYowqS6APXqHplbzd5ZTctmThJlQPKONQdZF7GULJBD68PI4i4fXat4z', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: 'Rs0uZmx1GSyYrbCm'}).toString();
		return result;
	}

	function decryptData(data)
	{
		var result = CryptoJS.AES.decrypt(data.toString(), 'fe1e25PoYowqS6APXqHplbzd5ZTctmThJlQPKONQdZF7GULJBD68PI4i4fXat4z', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: 'Rs0uZmx1GSyYrbCm'}).toString(CryptoJS.enc.Utf8);
		return result;
	}

	function NSSendMessage(data)
	{
		var message = {data: CryptoJS.AES.encrypt(JSON.stringify(data), '5TVDpAHPqLZSNY7EuLWJWDhLVaGBi862qlNp48ULcgaR6oDDH2hCLKdY92MA0pG', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: 'ocbEMVHyax6MTNxD' }).toString()};
		return JSON.stringify(message);
	}

	return {
		log: log,
		retrieveLocalErrors: retrieveLocalErrors
	}
})();

export default ErrorMod;