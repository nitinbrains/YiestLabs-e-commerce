// import { Notifications, Location, Permissions, WebBrowser } from 'expo';
// import { Alert, Dimensions, Platform } from 'react-native';
// import { Toast } from 'native-base';
// import dismissKeyboard from 'react-native-dismiss-keyboard';
// import {
//   Analytics,
//   Hits as GAHits,
//   Experiment as GAExperiment
// } from 'react-native-google-analytics';
// import { Constants } from 'expo';

//Custom
import SalesLib from './SalesLib';
// import Network from './Network';
// import WLCart from './WhiteLabsCart';
import State from './State';
// import { DeviceStorage from './DeviceStorage';
// import CryptoJS from './CryptoJS';
import Utils from './Utils';
import ErrorMod from './Error';


var WLHelper = (function () 
{
	// let ga = this.ga = null;

	function getPaymentTerm(term)
	{
		switch(term)
		{
			case '1':
			case 1:
				return "Net15";
			case '2':
			case 2:
				return "Net30";
			case '3':
			case 3:
				return "Pay on Pickup";
			case '7':
			case 7:
				return "C.O.D";
			case '10':
			case 10:
				return "Credit Card";
			case '11':
			case 11:
				return "Wire Transfer to WL";
			case '12':
			case 12:
				return "Prepay";
			default:
				return "None";
		}

	}

	function warehouseMap(warehouse)
	{
		switch(warehouse)
		{
			case 9:
			case '9':
				return "San Diego";
			case 11: 
			case '11':
				return "Ashville";
			case 30:
			case '30':
				return "Copenhagen";
			case 31:
			case '31':
				return "Hong Kong";
			default:
				return "San Diego";
		}
	}

	function getGA()
	{
		if(!ga)
		{
			var user = State.getState('UserID');
			ga = new Analytics('UA-125122817-1', user ? user : Constants.installationId, 1, Constants.getWebViewUserAgentAsync());
		}

		return ga;
	}

	function getStrainCategoryLabel(category)
	{
		switch(category)
		{
			case 2:
				return "All Core Strains";
			case 3:
				return "Ale";
			case 4:
				return "Wild Yeast";
			case 5: 
				return "Lager";
			case 6:
				return "Wine";
			case 7:
				return "Distilling";
			case 8:
				return "Belgian";
			case 32:
				return "Vault";
			case 29:
				return "Enzymes";
			case 30:
				return "Nutrients";
			case 24:
			case 25:
			case 26:
				return "Analytical Services";
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 23:
				return "Lab Supplies";
			case 28:
				return "Education";
			case 27:
			case 10:
				return "Merchandise";
			default:
				return "Yeast";
		}
	}

	function getExpiredCreditCards()
    {
    	var message;
    	var cardsToRemove = [];
    	var UserInfo = State.getState('UserInfo');

    	if(UserInfo)
    	{
    		cardsToRemove = UserInfo.cardsToRemove;
    	}

        if(cardsToRemove.length > 0)
        {
            message = "The following credit cards have expired:\n"
            for(var card of cardsToRemove)
            {
                var expiryDate = (new Date(card.ccexpire).getMonth() + 1) + '/' + new Date(card.ccexpire).getFullYear();
                message += '\u2022 ' + card.ccnumber + ' (' + expiryDate + ')\n';
            }
        }

        return message;
    }

	function getPurePitchSize(itemName)
	{
		if(itemName.includes('2.0 Liter'))
		{
			return 2;
		}
		else if(itemName.includes('1.5 Liter'))
		{
			return 1;
		}
		else
		{
			return 0;
		}

	}

	function requestInventory(classFilters)
	{

		return new Promise((resolve, reject) => {
			fetch('/get-inventory', {classFilters})
			.then(res => res.json())
			.then(result => {
				resolve(result)
			})
			.catch(err => {
				console.log('WLHelper', 'requestInventory', err, true);
				reject(err);
			});
		});
		
	}

	async function getInventory(cat, search=null)
	{

		try
		{
			var mainCategories = [0, 7, 8, 12, 13, 14, 15];
			var strCategoriesLoaded = State.getState('categoriesLoaded');

			// return values
			var categoriesLoaded = [];
			var Inventory = [];

			// convert each category to int
			if(strCategoriesLoaded)
			{
				strCategoriesLoaded.forEach(category => categoriesLoaded.push(parseInt(category)));
			}

			var existingInventory = State.getState('Inventory');
			var classFilters = [];

			if(search)
			{
				// Get all inventory
				if(categoriesLoaded)
				{
					var remainingCategories = mainCategories.filter(category => categoriesLoaded.indexOf(parseInt(category)) < 0);
				}
				else
				{
					var remainingCategories = mainCategories;
				}

				if(remainingCategories.length > 0)
				{

					for(var i = 0; i < remainingCategories.length; i++)
					{

						var cat = remainingCategories[i];

						if(!categoriesLoaded || categoriesLoaded.indexOf(parseInt(cat)) < 0)
						{
							classFilters = SalesLib.SALESCATEGORY[cat];

							var result = await requestInventory(classFilters);
							Inventory.push(...result.items);

							if(categoriesLoaded)
							{
								categoriesLoaded.push(parseInt(cat));
							}
							else
							{
								categoriesLoaded = [parseInt(cat)];
							}
						}
					}
					
					if(existingInventory)
					{
						State.setState({categoriesLoaded: categoriesLoaded, Inventory: [...existingInventory, ...Inventory]});
					}
					else
					{
						State.setState({categoriesLoaded: categoriesLoaded, Inventory: Inventory});
					}
				}
			}
			else
			{
				if(!categoriesLoaded || categoriesLoaded.indexOf(parseInt(cat)) < 0)
				{
					classFilters = SalesLib.SALESCATEGORY[cat];

					var result = await requestInventory(classFilters);

					if(categoriesLoaded)
					{
						categoriesLoaded.push(parseInt(cat));
					}
					else
					{
						categoriesLoaded = [parseInt(cat)];
					}

					if(existingInventory)
					{
						State.setState({categoriesLoaded: categoriesLoaded, Inventory: [...existingInventory, ...result.items]});
					}
					else
					{
						State.setState({categoriesLoaded: categoriesLoaded, Inventory: result.items});
					}

				}
				else  // Inventory has been loaded
				{

				}
			}

			return {categoriesLoaded, Inventory};	

		}
		catch(err)
		{
			throw err;
		}

	}

	function filterInventory(search, sub, main, retail = false)
    {
        try
        {
            dismissKeyboard();

            var Inventory = State.getState('Inventory');

            if(search)
            {
                search = search.toLowerCase();
            }

            var category = parseInt(sub);
            if(retail)
            {
                category = 0;
            }
            else
            {
                if(isNaN(category))
                {
                    category = parseInt(main);
                }
            }


            var UserID = State.getState('UserID');
            var UserInfo = State.getState('UserInfo');

            var subsidiary;
            if(UserInfo)
            {
                subsidiary = parseInt(UserInfo.subsidiary);
            }
            else
            {
                subsidiary = 2;
            }
            var userIsRetailer;
            if(UserInfo)
            {
                userIsRetailer = [2, 1, 7].includes(parseInt(UserInfo.category));
            }
            else
            {
                userIsRetailer = false;
            }

            var itemToShow = [], similarItems = [];

            for (var i = 0, length = Inventory.length; i < length; i++)
            {
                var containsSearchTerm = false;
                var Name = Inventory[i].Name ? Inventory[i].Name : '';
                var styleRec = Inventory[i].styleRec ? Inventory[i].styleRec : '';
                var searchTags = Inventory[i].searchTags ? Inventory[i].searchTags : '';
                var Description = Inventory[i].Description ? Inventory[i].Description : '';
                var PartNum = Inventory[i].partNum ? Inventory[i].partNum : '';
                var beerStyles = Inventory[i].beerStylesSearch ? Inventory[i].beerStylesSearch : '';

                if(Utils.warehouseMatch(Inventory[i].warehouse, subsidiary) && (!SalesLib.POSItems.includes(Inventory[i].volID[0]) || (SalesLib.POSItems.includes(Inventory[i].volID[0]) && userIsRetailer)))
                {
                    if(UserID)
                    {
                        if(!Inventory[i].IsPrivate[0] || Inventory[i].IsPrivate.indexOf(UserID) >= 0)
                        {
                            if(search)
                            {
                                if(Name.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(styleRec.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(searchTags.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(Description.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(PartNum.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(beerStyles.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }


                                if(containsSearchTerm)
                                {
                                    if(SalesLib.SALESCATEGORY[category].indexOf(Inventory[i].salesCategory) >= 0 && !(retail && !Inventory[i].volID[4]))
                                    {
                                        itemToShow.push(Inventory[i]);
                                    }
                                    else if(!retail)
                                    {
                                        similarItems.push(Inventory[i]);
                                    }
                                }
                            }
                            else if(SalesLib.SALESCATEGORY[category].indexOf(Inventory[i].salesCategory) >= 0 && !(retail && !Inventory[i].volID[4]))
                            {
                                itemToShow.push(Inventory[i]);
                            }
                        }
                    }
                    else if(!Inventory[i].IsPrivate[0])
                    {
                        if(search)
                        {
                            if(Name.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(styleRec.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(searchTags.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(Description.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(PartNum.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(beerStyles.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }

                            if(containsSearchTerm)
                            {
                                if(SalesLib.SALESCATEGORY[category].indexOf(Inventory[i].salesCategory) >= 0 && !(retail && !Inventory[i].volID[4]))
                                {
                                    itemToShow.push(Inventory[i]);
                                }
                                else if(!retail)
                                {
                                    similarItems.push(Inventory[i]);
                                }
                            }
                        }
                        else if(SalesLib.SALESCATEGORY[category].indexOf(Inventory[i].salesCategory) >= 0 && !(retail && !Inventory[i].volID[4]))
                        {
                            itemToShow.push(Inventory[i]);
                        }
                    }
                }
            }

            var finalResult = sortItems(itemToShow);

            if(similarItems.length > 0)
            {
                finalResult.push('altresult');
                finalResult = finalResult.concat(similarItems);
            }

            return finalResult;
        }
        catch(err)
        {
        	throw err;
        }
    }

    function sortItems(items)
    {
        try
        {
            return items.sort(function(item1, item2)
            {
                if(item1.Name.includes("WLP") && item2.Name.includes("WLP"))
                {
                    return item1.Name.slice(3).localeCompare(item2.Name.slice(3));
                }
                else if(item1.Name.includes("WLP"))
                {
                    return -1;
                }
                else if(item2.Name.includes("WLP"))
                {
                    return 1;
                }
                else
                {
                    return item1.Name.localeCompare(item2.Name);
                }
            });
        }
        catch(err)
        {
            throw {message: 'could not sort items', code: -1}
        }
    }

	async function registerForPushNotifications() {
	    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

	    if (status !== 'granted') {
	        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	        if (status !== 'granted') {
	            return;
	        }
	    }

	    const token = await Notifications.getExpoPushTokenAsync();

	    this.subscription = Notifications.addListener(handleNotification);

	    State.setState({PushToken: token});

	    return fetch('http://35.193.208.36:14400/push_token/', {
		    method: 'POST',
		    headers: {
		      	Accept: 'application/json',
		      	'Content-Type': 'application/json',
		    },
		    body: JSON.stringify({
		      	token: {
		        	value: token,
		      	},
		      	user: {
		        	username: State.getState('UserID'),
		      	},
		    }),
	  	});
	}

	function handleNotification(notification)
	{
		console.log('notification', notification)
	}

	function compareCarts(before, after)
	{
		try
		{
			return before.filter(element => {
				return !after.find(item => item.MerchandiseID == element.MerchandiseID)
			});
		}
		catch(err)
		{
			throw err;
		}
	}

	function isIphoneX() 
	{
		try
		{
			const dim = Dimensions.get('window');
		    return (
		        Platform.OS === 'ios' &&
		        !Platform.isPad &&
		        !Platform.isTVOS &&
		        (dim.height === 812 || dim.width === 812)
		    );
		}
		catch(err)
		{
			throw err;
		}
	}

	// const Images = {
 //        1735: require('../img/gift-shop/brewmaster-game.jpg'),
	// 	13863: require('../img/gift-shop/double-walled-black-32oz.jpg'),
	// 	3253: require('../img/gift-shop/growler-64oz.jpg'),
	// 	13682: require('../img/gift-shop/growler-32oz-stainless-steel.jpg'),
	// 	13819: require('../img/gift-shop/patch-hat-charcoal.jpg'),
	// 	1740: require('../img/gift-shop/double-walled-black-32oz.jpg'),
	// 	1731: require('../img/gift-shop/womens-black-burnout-tank.jpg'),
	// 	11360: require('../img/gift-shop/black-snapback-with-patch.jpg'),
	// 	13361: require('../img/gift-shop/black-snapback.jpg'),
	// 	11359: require('../img/gift-shop/leather-coaster-circular-logo.jpg'),
	// 	11225: require('../img/gift-shop/mens-periodic-table-blk-wht.jpg'),
	// 	11231: require('../img/gift-shop/mens-ingredients-shirt.jpg'),
	// 	1864: require('../img/gift-shop/horse-blanket-espresso.jpg'),
	// 	1788: require('../img/gift-shop/mens-T-black.jpg'),
	// 	11237: require('../img/gift-shop/ladies-periodic-table-blk-wht.jpg'),
	// 	11242: require('../img/gift-shop/ladies-ingredients-shirt.jpg'),
	// 	3052: require('../img/gift-shop/yeast-book.jpg'),
	// 	13820: require('../img/gift-shop/beanie-olive.jpg'),
	// 	1811: require('../img/gift-shop/babies-onsie.jpg'),
	// 	1826: require('../img/gift-shop/card-deck.jpg'),
	// 	3055: require('../img/gift-shop/brewing-microbiology-3rd.jpg'),
	// 	13070: require('../img/gift-shop/button-microscope.jpg'),
	// 	13069: require('../img/gift-shop/button-seal-logo.jpg'),
	// 	13068: require('../img/gift-shop/button-water.jpg'),
	// 	13073: require('../img/gift-shop/black-sunglasses.jpg'),
	// 	13067: require('../img/gift-shop/bottle-opener.jpg'),
	// 	11361: require('../img/gift-shop/black-patch.jpg')
 //    };

 //    function getImage(imageIndex)
 //    {
 //    	try
 //    	{
 //    		return Images[imageIndex];
 //    	}
 //    	catch(err)
 //    	{
 //    		throw err;
 //    	}
 //    }

 	/*********************
 	* Expo API Wrappers *
 	*********************/
	function addHomebrewPacks(packs)
	{
		try
		{
			var totalHomebrewPacks = State.getState('TotalHomebrewPacks');
			if(!totalHomebrewPacks)
			{
				State.setState({TotalHomebrewPacks: packs});
			}
			else
			{
				State.setState({TotalHomebrewPacks: totalHomebrewPacks + packs});
			}
		}
		catch(err)
		{
			throw err;
		}
	}

	function subtractHomebrewPacks(packs)
	{
		try
		{
			var totalHomebrewPacks = State.getState('TotalHomebrewPacks');
			if(totalHomebrewPacks >= packs)
			{
				State.setState({TotalHomebrewPacks: totalHomebrewPacks - packs});
			}
		}
		catch(err)
		{
			throw err;
		}
	}

	function setHomebrewPacks(packs)
	{
		try
		{
			State.setState({TotalHomebrewPacks: packs});
		}
		catch(err)
		{
			throw err;
		}
	}

	async function getLocation()
	{
		try
		{
			let { status } = await Permissions.askAsync(Permissions.LOCATION);
			if(status !== 'granted')
			{
				return null;
			}
			else
			{
				let location = await Location.getCurrentPositionAsync({});
				var userLocation = {
					latitude: location.coords.latitude,
	            	longitude: location.coords.longitude,
	            	latitudeDelta: 0.3,
	            	longitudeDelta: 0.3,
				};

				return userLocation;
			}
		}
		catch(err)
		{
			throw err;
		}
	}

	function openWebLink(url)
	{
		try
		{
			WebBrowser.openBrowserAsync(url);	
		}
		catch(err)
		{
			throw err;
		}
	}

	/****************************
	 * Network Helper Functions *
	 ****************************/

	function changeUser(UserID = null, rememberMe = null) //null removes rememberMe, false leaves as is, true remembers new user
	{
		try
		{
			// WLCart.clearCart();
			State.setState({WLCSR: null, CSROrderHistory: null, UserID: UserID, UserInfo: null, OrderHistory: null});

			if(rememberMe == false)
			{
				//do nothing
			}
			else if(rememberMe == true && UserID)
			{
				return new Promise((resolve, reject) => {
					DeviceStorage.saveToDevice('rememberMe-login', {UserID: UserID}, true, function(result)
		            {
		                if(!result)
		                {
		                    reject();
		                }
		                else
		                {
		                	resolve();
		                }
		            });
	            });
			}
			else
			{
				return new Promise((resolve, reject) => {
					DeviceStorage.removeFromDevice('rememberMe-login', function(result)
					{
						if(result)
						{
							resolve();
						}
						else
						{
							reject();
						}
					});
				});
			}
		}
		catch(err)
		{
			throw err;
		}
	}

	function generateCreditToken(creditInfo)
	{
		try
		{

			creditInfo.type = Utils.getCardType(creditInfo.ccnumber);

			if(creditInfo.type == -1)
			{
				return null;
			}

			creditInfo.custID = State.getState('UserID');

			if(isNaN(parseInt(creditInfo.custID)))
			{
				return null;
			}

			return CryptoJS.AES.encrypt(JSON.stringify(creditInfo), 'AWJeBmcD9uEy27L2Zla0ZKTKUbgjRJKwxr6CaKBqKDNbHSKsISC6BH2EhUvNm9s', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: "A216T8JtJANg7F7C" }).toString();
		}
		catch(err)
		{
			throw err;
		}
	}

	function storeCurrentRoute(routeName)
	{
		try
		{
			if(routeName.length > 0)
			{
				State.setState({currentRoute: routeName.toString()});
			}
			else
			{
				throw {message: 'RouteName is empty', code: -1};
			}
		}
		catch(err)
		{
			throw err;
		}
	}

	function matchOldAddress(address, index)
	{
		try
		{
			var UserInfo = State.getState('UserInfo');
			var selectedAddress = UserInfo.otherAddresses[index];

			var test = isNaN(index) || index < 0 || index >= UserInfo.otherAddresses.length;
			if(!test)
			{
				if(
					address.attn == selectedAddress.attn &&
					address.addressee == selectedAddress.addressee &&
					address.address1 == selectedAddress.address1 &&
					address.address2 == selectedAddress.address2 &&
					address.address3 == selectedAddress.address3 &&
					address.city == selectedAddress.city &&
					address.zip == selectedAddress.zip &&
					address.countryid == selectedAddress.countryid
				)
				{
					return true;
				}
			}

			return false;
		}
		catch(err)
		{
			throw err;
		}
	}

	function showFeedback(error, defaultError)
	{
		try
		{
			if(Utils.showErrorToUser(error))
			{
				Toast.show({
	                text: error.message,
	                position: 'bottom',
	                duration: 4000
	            });
	            return true;
			}
			else
			{
				setTimeout(() => Alert.alert('Error', defaultError), 2500);
				return false;
			}
		}
		catch(err)
		{
			throw err;
		}
	}

	return {
		getPaymentTerm: getPaymentTerm,
		warehouseMap: warehouseMap,
		getGA: getGA,
		getStrainCategoryLabel: getStrainCategoryLabel,
		getExpiredCreditCards: getExpiredCreditCards,
		getPurePitchSize: getPurePitchSize,
		getInventory: getInventory,
		filterInventory: filterInventory,
		sortItems: sortItems,

		// Notification handlers
		registerForPushNotifications: registerForPushNotifications,
		handleNotification: handleNotification,

		compareCarts: compareCarts,
		isIphoneX: isIphoneX,
		// getImage: getImage,

		addHomebrewPacks: addHomebrewPacks,
		subtractHomebrewPacks: subtractHomebrewPacks,
		setHomebrewPacks: setHomebrewPacks,

		//Expo API Wrappers
		getLocation: getLocation,
		openWebLink: openWebLink,

		//Network Helper Methods
		changeUser: changeUser,
		generateCreditToken: generateCreditToken,

		storeCurrentRoute: storeCurrentRoute,
		matchOldAddress: matchOldAddress,
		showFeedback: showFeedback,
	}

})();

export default WLHelper;