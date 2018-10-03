'use strict';

// import { Alert, AsyncStorage } from 'react-native';
import CryptoJS from './CryptoJS';
import State from './State';
import ErrorMod from './Error';
import Utils from './Utils';

var DeviceStorage = (function () {

	function saveToDevice(key, data, encrypted, cb)
	{
		try
		{
			let dataToSave = encrypted ? encryptData(data) : JSON.stringify(data);
			AsyncStorage.setItem(key.toString(), dataToSave, (err) => {
				if(err)
				{
					var info = {err: err.toString(), key: key};
					ErrorMod.log('DeviceStorage', 'error in saveToDevice', info, true);
					cb(null);
				}
				else
				{
					cb(true);
				}
			});
		}
		catch(err)
		{
			var info = {err: err.toString(), key: key};
			ErrorMod.log('DeviceStorage', 'error in saveToDevice', info, true);
			if(cb)
			{
				cb(null);
			}
		}
	}

	function removeFromDevice(key, cb = null)
	{
		try
		{
			AsyncStorage.removeItem(key.toString(), (err) => {
				if(err)
				{
					var info = {err: err.toString(), key: key};
					ErrorMod.log('DeviceStorage', 'error in removeFromDevice', info, true);
					if(cb && cb instanceof Function)
					{
						cb(null);
					}
				}
				else
				{
					if(cb && cb instanceof Function)
					{
						cb(true);
					}
				}
			});
		}
		catch(err)
		{
			var info = {err: err.toString(), key: key};
			ErrorMod.log('DeviceStorage', 'error in removeFromDevice', info, true);
			if(cb)
			{
				cb(null);
			}
		}
	}

	function loadFromDevice(key, encrypted, cb)
	{
		if(key)
		{
			AsyncStorage.getItem(key.toString(), (err, value) => {
				if(err)
				{
					throw err;
					cb(null);
				}
				else
				{
					if(cb && cb instanceof Function)
					{
						if(value)
						{
							if(encrypted)
							{
								value = decryptData(value);
							}

							cb(JSON.parse(value));
						}
						else
						{
							cb(false);
						}
					}
					else
					{
						console.log('No callback provided');
						throw 'Failed to load data from device!';
					}
				}
			});
		}
		else
		{
			console.log('Key is null!');
			throw 'Failed to load data from device!';
		}
	}

	function viewAvailableKeys(cb)
	{
		if(cb && cb instanceof Function)
		{
			AsyncStorage.getAllKeys((err, value) => {
				if(err)
				{
					console.log(err);
					throw err;
				}
				else
				{
					cb(value);
				}
			})
		}
		else
		{
			console.log('No valid callback provided');
			throw 'No valid callback provided';
		}
	}

	function clearAllKeys(cb)
	{
		if(cb && cb instanceof Function)
		{
			Alert.alert('WARNING', 'You are about to erase all data saved to this device from the White Labs App',
				[
					{text: 'Cancel', onPress: () => cb(false)},
					{text: 'Continue', onPress: () => AsyncStorage.clear((err) => {
						if(err)
						{
							console.log(err);
							throw err;
							cb(null);
						}
						else
						{
							cb(true);
						}
					})}
				]
			);
		}
		else
		{
			console.log('No valid callback provided');
			throw 'No valid callback provided';
		}
	}

	function encryptData(data)
	{
		var result = CryptoJS.AES.encrypt(JSON.stringify(data), 'fe1e25PoYowqS6APXqHplbzd5ZTctmThJlQPKONQdZF7GULJBD68PI4i4fXat4z', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: 'Rs0uZmx1GSyYrbCm'}).toString();
		return result;
	}

	function decryptData(data)
	{
		var result = CryptoJS.AES.decrypt(data.toString(), 'fe1e25PoYowqS6APXqHplbzd5ZTctmThJlQPKONQdZF7GULJBD68PI4i4fXat4z', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: 'Rs0uZmx1GSyYrbCm'}).toString(CryptoJS.enc.Utf8);
		return result;
	}

	/*******************************************
	 * Cart Storage Remember-Me Helper Methods *
	 *******************************************/


	 // save Cart to device
	 function saveCartToDevice(Cart)
	 {
		 var user = State.getState('UserInfo');
		 var subsidiaryId = 2;
		 if(user){
			 subsidiaryId = user.connectedaccounts[0].subsidiaryid;
		 }
		 var key = `rememberMe-cartItems:${subsidiaryId}`;

		 saveToDevice(key, Cart, true, (saved) => {
			 if(!saved){
				 console.log("Cannot save cart to device");
			 }
		 })
	 }

	 // get Cart from device
	 function getCartFromDevice(cb)
	 {
		 var user = State.getState('UserInfo');
		 var subsidiaryId = 2;
		 if(user){
			 subsidiaryId = user.connectedaccounts[0].subsidiaryid;
		 }
		 var key = `rememberMe-cartItems:${subsidiaryId}`;

		 loadFromDevice(key, true, Cart => {
			 if(Cart)
			 {
				cb(Cart);
			 }
			 if(Cart == null)
			 {
				 console.log("Cannot get Cart from device")
			 }
		 })
	 }

	// Clear Cart from device
	function clearCartFromDevice()
	{
		var user = State.getState('UserInfo');
		var subsidiaryId = 2;
		if(user)
		{
			subsidiaryId = user.connectedaccounts[0].subsidiaryid;
		}
		var key = `rememberMe-cartItems:${subsidiaryId}`;

		saveToDevice(key, [], true, saved => {
			if(!saved)
			{
				console.log("Cannot clear cart from Async Storage");
			}
		});
	}

	//Save Inventory Hash
	function saveInventoryHash(Inventory)
	{
		saveToDevice('InventoryHash', Inventory, false, (saved) =>
		{
			if(!saved)
			{
				console.log("Cannot save InventoryHash to Async Storage");
			}
		})
	}

	function loadInventoryHash(cb)
	{
		return new Promise(function(resolve, reject) 
		{
			loadFromDevice('InventoryHash', false, (result) => {
				if(result)
				{
					resolve(result);
				}
				else
				{
					resolve(null);
				}
			});
		});
		
	}

	// Save Home Brew store locations to device
	function saveHomeBrewStoreLocations(HBStores)
	{
		let currentDate = new Date();
		let storesWithDate = {stores: HBStores, date: currentDate};
		saveToDevice('rememberMe-HBstoreLocations', storesWithDate, true, (saved) =>
		{
			if(!saved)
			{
				console.log("Cannot save HB store locations to Async Storage");
			}
		});
	}

	// Load Home Brew store locations from device
	function loadHomeBrewStoreLocations(cb)
	{
		let currentDate = new Date();

		loadFromDevice('rememberMe-HBstoreLocations', true, stores =>
		{
			// if HomeBrew stores exist, check last timestamp is <= 7
			let dateToCheck = new Date(stores.date)
			if(stores)
			{
				if(Utils.daysBetween(dateToCheck, currentDate) < 7)
				{
					cb(stores.stores);
				}
				else
				{
					cb(null);
				}
			}
			// no stores exist
			else
			{
				cb(null);
			}
		});
	}

	// Save pitch rate calculator to device
	function savePitchRateCalculator(calculator)
	{
		saveToDevice('rememberMe-pitchRateCalc', calculator, true, (saved) =>
		{
			if(!saved)
			{
				console.log("Cannot save Pitch Rate Calculator field to Async Storage");
			}
		})
	}


	return {
		saveToDevice: saveToDevice,
		loadFromDevice: loadFromDevice,
		viewAvailableKeys: viewAvailableKeys,
		removeFromDevice: removeFromDevice,
		clearAllKeys: clearAllKeys,

		saveCartToDevice: saveCartToDevice,
		getCartFromDevice: getCartFromDevice,
		clearCartFromDevice: clearCartFromDevice,
		saveHomeBrewStoreLocations: saveHomeBrewStoreLocations,
		loadHomeBrewStoreLocations: loadHomeBrewStoreLocations,
		savePitchRateCalculator: savePitchRateCalculator,
		saveInventoryHash: saveInventoryHash,
		loadInventoryHash: loadInventoryHash,
	}
})();

export default DeviceStorage;