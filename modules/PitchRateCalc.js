/* **********
 * MobileYeastPitchCalc.js
 * Descr: Calculates yeast quantities according to official catalog
 */

'use strict'

import ErrorMod from './Error';

var PitchRateCalc = (function ()
{
	// Official Catalog values
	var standardGrav = [{vol: 5, purchasePacks: [{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':2, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 7, purchasePacks: [{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':1, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 10, purchasePacks: [{'count':1, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 15, purchasePacks: [{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':2, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 20, purchasePacks: [{'count':2, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 30, purchasePacks: [{'count':3, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 40, purchasePacks: [{'count':4, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 50, purchasePacks: [{'count':5, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 100, purchasePacks: [{'count':10, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]}],

		midGrav = [{vol: 5, purchasePacks: [{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':1, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 7, purchasePacks: [{'count':1, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 10, purchasePacks: [{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':2, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 15, purchasePacks: [{'count':2, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 20, purchasePacks: [{'count':3, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 30, purchasePacks: [{'count':4, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 40, purchasePacks: [{'count':6, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 50, purchasePacks: [{'count':7, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 100, purchasePacks: [{'count':15, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]}],

		highGrav = [{vol: 5, purchasePacks: [{'count':1, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 7, purchasePacks: [{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':2, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 10, purchasePacks: [{'count':2, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 15, purchasePacks: [{'count':3, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 20, purchasePacks: [{'count':4, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 30, purchasePacks: [{'count':6, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 40, purchasePacks: [{'count':8, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 50, purchasePacks: [{'count':10, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]},
		  		{vol: 100, purchasePacks: [{'count':20, 'pack':'10Bbl / HL, 2000 ml yeast'}, {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, {'count':0, 'pack':'Nano, 500 ml yeast'}, {'count':0, 'pack':'Homebrew, 40 ml yeast'}]}];

	var uBatchVolume, uPitchRate, uTemp, uGravity;
	var VolUnit, TempUnit, GravUnit, RateUnit;
	var Homebrew;

	function setupCalculator(isHB, vol, volUnit, temp, tempUnit, grav, gravUnit, pitchRate, pitchRateUnit)
	{
		VolUnit = String(volUnit).toUpperCase();
		TempUnit = String(tempUnit).toUpperCase();
		GravUnit = String(gravUnit).toUpperCase();
		RateUnit = String(pitchRateUnit).toUpperCase();

		Homebrew = Boolean(isHB);

		// Converting Batch Volume Units into mL
		switch(VolUnit) {
			case 'BBL':
				uBatchVolume = parseFloat(vol) * 117347.77;
			break;

			case 'HL':
				uBatchVolume = parseFloat(vol) * 100000.00;
			break;

			case 'SGAL':
				uBatchVolume = parseFloat(vol) * 3785.00;
				break;

			case 'L':
				uBatchVolume = parseFloat(vol) * 1000.00;
				break;

			case 'KGAL':
				uBatchVolume = parseFloat(vol) * 4546.09;
				break;

			case 'ML':
				uBatchVolume = parseFloat(vol) * 1;
				break;
			default:
				uBatchVolume = NaN;
				break;
		}

		// Converting Temperature Units into Fahrenheit
		switch(TempUnit) {
			case 'C':
				uTemp = parseFloat(temp) * 9 / 5 + 32;
				break;

			case 'F':
				uTemp = parseFloat(temp) * 1;
				break;
			default:
				uTemp = NaN;
				break;
		}

		// Converting Specific Gravity into Plato
		switch(GravUnit) {
			case 'PLA':
				uGravity = parseFloat(grav) * 1;
				break;

			case 'SPE':
				var SG2 = Math.pow(grav,2), SG3 = Math.pow(grav,3);
				uGravity = (-1 * 616.868) + (1111.14 * grav) - (630.272 * SG2) + (135.997 * SG3);
				break;
			default:
				uGravity = NaN;
				break;
		}

		// Converting Pitching Rate into 1st Gen
		switch(RateUnit) {
			case 'GEN1':
				uPitchRate = 1;
				break;

			case 'CUST':
				uPitchRate = parseFloat(pitchRate) * 1;
				break;
			default:
				uPitchRate = NaN;
				break;
		}
	}

	function calculate()
	{
		if(RateUnit == 'GEN1')
		{
			return getPacks(calculateYeastNeeded());
		}
		else
		{
			return getTotalVol();
		}
	}

	function getTotalAmount(purchasePacks)
	{
		var total = 0;
		for(var i in purchasePacks){
			if(parseInt(i) === 0)
			{
				total += (2 * purchasePacks[i].count);
			}
			else if(parseInt(i) === 1)
			{
				total += (1.5 * purchasePacks[i].count);
			}
			else if(parseInt(i) === 2)
			{
				total += (0.5 * purchasePacks[i].count);
			}
		}

		return total;
	}

	function getPacks(totalVol)
	{
		var purchasePacks = [
			{'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, 
			{'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, 
			{'count':0, 'pack':'Nano, 500 ml yeast'}, 
			{'count':0, 'pack':'Homebrew, 40 ml yeast'}
		];
		var amountPacks = getOptimalAmount([0.5, 1.5, 2], totalVol, {});
		purchasePacks[0].count = amountPacks["2.0"];
		purchasePacks[1].count = amountPacks["1.5"];
		purchasePacks[2].count = amountPacks["0.5"];

		if(totalVol == 0)
		{
			purchasePacks[3].count = Math.ceil(getTotalVol(true)/0.04);
		}
		else
		{
			purchasePacks[3].count = Math.ceil(totalVol/0.04);
		}
		
		//Pro Warning
		if(!Homebrew && totalVol < 0.450)
		{
			alert('Fermentation Volume wasn\'t large enough, pack amounts may largely overestimate needed yeast, please switch to Homebrew.');
		}

		return purchasePacks;
	}

	function getTotalVol(hb = false)
	{
		if(!checkForErrors())
		{
			alert('Calculator has not been setup properly');
			return null;
		}

		//Declarations and Constants
		var constTemp = 60, 
			boostedPitch, 
			constPitchDiv = .2840559690770, 
			tCellWortDensity, 
			constPitchRate = 284055.969077, 
			tTotalCell,
			constTotalCellDiv = 1000000, 
			targetYeastCount, 
			tSlurryVolume, 
			constSlurryVolumeDiv = 2000000000, 
			firstYeastVolume, 
			finalYeastVolume, 
			packs = [
				{'pack':0, 'mult':3, 'vol':6},
				{'pack':1, 'mult':2, 'vol':3},
				{'pack':0, 'mult':1, 'vol':2},
				{'pack':1, 'mult':1, 'vol':1.5},
				{'pack':2, 'mult':3, 'vol':1.5},
				{'pack':2, 'mult':1, 'vol':0.5}
			];


		var temp = uTemp >= constTemp ? 1 : 2;

		if(RateUnit == 'CUST') {
			boostedPitch = uPitchRate / constPitchDiv;
		}
		else {
			boostedPitch = uPitchRate;
		}


		// Calculate the Cell Worth Density
		tCellWortDensity = constPitchRate * uGravity * temp * boostedPitch;


		// Calculate the Target Total Cell Value
		tTotalCell = Math.floor((tCellWortDensity / constTotalCellDiv)*100)/100;

		// Calculate the Target  Pitch Rate Value
		//tPitchRate = tTotalCell / uGravity; //needs to be defined if used

		//Calculate Target Yeast Count
		targetYeastCount = tCellWortDensity * uBatchVolume;

		// Calculate the Slurry Volume
		tSlurryVolume = targetYeastCount / constSlurryVolumeDiv;
		// Final Yeast volume rounded up factor 1.01
		firstYeastVolume = (tSlurryVolume * 1.01);
		finalYeastVolume = firstYeastVolume/1000;
		// Getting Optimization Target by rounding up to nearest 0.5 litre
		if(hb)
		{
			return finalYeastVolume;
		}
		else
		{
			return Math.ceil(finalYeastVolume*2)/2;
		}
	}

	function calculateYeastNeeded()
	{
		var result = 0;

		if(RateUnit == 'GEN1')
		{
			var barrels = Math.round(uBatchVolume/117347.77);
			var multiplier = 1;

			if(uTemp <= 57 && uGravity >= 16.5)
			{
				multiplier = 3;
			}
			else if(uTemp <= 57 || uGravity >= 16.5)
			{
				multiplier = 2;
			}
			else if(uTemp <= 65 || uGravity >= 12.5)
			{
				multiplier = 1.5
			}

			result = (barrels/5)*multiplier;
		}
		else
		{
			throw {message: 'Cannot use custom rate for PurePitch values', code: -1};
		}

		return result;
	}

	function checkForErrors(input)
	{
		if(isNaN(uBatchVolume) || isNaN(uTemp) || isNaN(uGravity)  || isNaN(uPitchRate))
		{
			return false;
		}

		if(uBatchVolume <= 0 || uTemp <= 0 || uTemp >= 120 || uGravity <= 0 || uGravity >= 60 || uPitchRate <= 0)
		{
			return false;
		}

		return true;
	}

	function checkVolume(vol, unit)
	{
		var volume;

		switch(unit)
		{
			case 'BBL':
				volume = parseFloat(vol) * 117347.77;
				break;

			case 'HL':
				volume = parseFloat(vol) * 100000.00;
				break;

			case 'SGAL':
				volume = parseFloat(vol) * 3785.00;
				break;

			case 'L':
				volume = parseFloat(vol) * 1000.00;
				break;

			case 'KGAL':
				volume = parseFloat(vol) * 4546.09;
				break;

			case 'ML':
				volume = parseFloat(uBatchVolume) * 1;
				break;
			default:
				break;
		}

		if(volume <= 2000)
		{
			return 'Volume should be at least greater than 2 L to use' +
					' the smallest yeast pack';
		}
		else
		{
			return null;
		}
	}

	function checkTemp(temp, unit)
	{
		var warning;
		if(unit == 'F' && (temp < 45 || temp > 100))
		{
			warning = 'Temperature should be between 45°F and 100°F for best results.'

		}
		else if(unit == 'C' && (temp < 7.22 || temp > 37.78))
		{
			warning = 'Temperature should be between 7.22°C and 37.78°C for best results.'
		}

		return warning;
	}

	function checkGravity(grav, unit)
	{
		var warning;
		if(unit == 'PLA' && (grav < 2.5607 || grav > 43.9111))
		{
			warning = 'Gravity should be between 2.5607 and 43.9111 Plato for best results.'
		}
		else if(unit == 'SPE' && (grav < 1.01 || grav > 1.2))
		{
			warning = 'Gravity should be between 1.01 and 1.2 Specific Gravity for best results.'
		}

		return warning;
	}

	function getExactAmount(purchasePackAmounts, totalVol, knownResults)
	{

		// default pack
		var minPack = {
			"0.5" : 0,
			"1.5" : 0,
			"2.0" : 0,
			num : 0
		}

		// base case # 1: totalVol is 0
		if(totalVol === 0)
		{
			return Object.assign({}, minPack);
		}
		// base case # 2: optimal amount for totalVol has already been calculated. retrieve and return.
		else if(knownResults[totalVol])
		{
			return Object.assign({}, knownResults[totalVol]);
		}

		// base case # 3: totalVol is one of purchasePackAmounts
		else if(purchasePackAmounts.includes(totalVol))
		{
			minPack[totalVol.toFixed(1)] = 1;
			minPack.num += 1;
			knownResults[totalVol] = minPack;
			return Object.assign({}, minPack);
		}
		else
		{

			// flag to determine if no optimal solution was found for a particular totalVol
			var flag = false;

			// min will hold the current min of
			var min = Number.MAX_VALUE;

			// array keeps optimal packs for each type less than totalVol
			var subsetOptimalAmounts = [];

			// index of current min inside subsetOptimalAmounts
			var minIndexOfOptimalAmounts = 0;

			// holds the type of the pack indexed at minIndexOfOptimalAmounts needed to get to totalVol
			var minType = '';


			for(var i = 0; i < purchasePackAmounts.length; i++ )
			{
				var type = purchasePackAmounts[i];
				if(type <= totalVol)
				{
					var pack = getExactAmount(purchasePackAmounts, totalVol - type, knownResults);
					subsetOptimalAmounts.push(pack);

					// found at least one pack where num > 0
					if(pack.num > 0)
					{
						flag = true;
					}

					// found new pack with less quantity of types than the previous min
					// make this the new min and preserve index
					if(pack.num < min)
					{
						min = pack.num;
						minType = type;
						minIndexOfOptimalAmounts = subsetOptimalAmounts.length - 1;
					}
				}
			}

			// if flag === true: we know there is at least one optimal solution LESS than
			// totalVol from which we can reach totalVol.
			// calculate the optimal solution of totalVol based on this type.
			if(flag)
			{
				minPack = subsetOptimalAmounts[minIndexOfOptimalAmounts];
				minPack[(minType).toFixed(1)] += 1;
				minPack.num += 1;
				knownResults[totalVol] = minPack;

			}

		}

		return Object.assign({}, minPack);

	}


	function getOptimalAmount(purchasePackAmounts, totalVol, knownResults)
	{
		var initialVol = totalVol;

		var amount = getExactAmount(purchasePackAmounts, totalVol, knownResults);

		// found exact amount
		if(amount.num > 0)
		{
			return amount;
		}
		// no exact amount, find nearest neighbor with exact amount
		else
		{
			// should only get here once if no match was found for initialVol at end of recursion
			// code block finds next optimal solution within 0.5 range of initialVol
			if (initialVol === totalVol)
			{
				var newVol = initialVol + 0.5;
				for(var i = initialVol + 0.1; i <= newVol; i += 0.1)
				{

					// eliminate Javascript rounding errors
					var float = parseFloat((i).toFixed(1));

					var pack = getExactAmount(purchasePackAmounts, float, knownResults);

					// if we find a pack in which we can calculate the exact amount (above initialVol)
					// then this is the optimal amount for initialVol
					if(pack.num != 0)
					{
						return pack;
					}
				}
			}
		}
	}

	return {
	    setup: setupCalculator,
	    calculate: calculate,

		checkVolume: checkVolume,
		checkTemp: checkTemp,
		checkGravity: checkGravity,

		getTotalAmount: getTotalAmount
  	}
})();

export default PitchRateCalc;