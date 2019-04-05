import SalesLib from "./SalesLib";

function convertVol(calculator)
{
    const { volVal, volUnit, volChoices } = calculator;
    var index = SalesLib.volChoices[volUnit].indexOf(volVal);
    return SalesLib.volChoices['BBLConvert'][index];
}

// Convert temperature into F
function convertTemp(calculator)
{
    const { tempVal, tempUnit, tempChoices } = calculator;
    var index = SalesLib.tempChoices[tempUnit].indexOf(tempVal);
    return SalesLib.tempChoices['F'][index];
}

// Convert gravity into PLA
function convertGrav(calculator)
{
    const { gravVal, gravUnit, gravChoices } = calculator;
    var index = SalesLib.gravChoices[gravUnit].indexOf(gravVal);
    return SalesLib.gravChoices['PLA'][index];
}

export function calculate(calculator)
{
    try
    {
        if(calculator.custom)
        {
            return getPacks(custom(calculator));
        }
        else
        {
            return getPacks(tableLookup(calculator));
        }
    }
    catch(error)
    {
        throw error;
    }

}

function tableLookup(calculator)
{

    try
    {
        var temp = convertTemp(calculator);
        var vol = convertVol(calculator);
        var grav = convertGrav(calculator);
        const { isHomebrewer, homebrewPackSizeChart, packSizeChart } = calculator;

        if(isHomebrewer && SalesLib.homebrewPackSizeChart[temp] && SalesLib.homebrewPackSizeChart[temp][vol] && SalesLib.homebrewPackSizeChart[temp][vol][grav])
        {
            var totalVol = SalesLib.homebrewPackSizeChart[temp][vol][grav];

            if(totalVol == 'starter')
            {
                console.log('Notice', "Please make starter or use Nano");
                return;
            }

            return totalVol;
        }
        else if(SalesLib.packSizeChart[temp] && SalesLib.packSizeChart[temp][vol] && SalesLib.packSizeChart[temp][vol][grav])
        {
            var totalVol = SalesLib.packSizeChart[temp][vol][grav];

            //Pro Warning
            if(!isHomebrewer && totalVol < 0.450)
            {
                console.log('Fermentation Volume wasn\'t large enough, pack amounts may largely overestimate needed yeast, please switch to Homebrew.');
                return;
            }

            return totalVol;

        }
        else
        {
            throw { message: 'value does not exist in table lookup', code: 0 };
        }
    }
    catch(error)
    {
        throw error;
    }
}

function custom(params)
{
    try
    {
        var { startingGravity, targetPitchRate, volume, viability, cellCount } = params;

        startingGravity = parseFloat(startingGravity);
        targetPitchRate = parseFloat(targetPitchRate);
        volume = parseFloat(volume);
        viability = parseFloat(viability);
        cellCount = parseFloat(cellCount);

        return (((startingGravity * targetPitchRate) * volume * 117347) / ((viability / 100) * cellCount)) / 1000;
    }
    catch(error)
    {
        throw error;
    }
}

function getPacks(total)
{
    try
    {
		var packs = getOptimalAmount([0.5, 1.5, 2], total, {});


		// if(total == 0)
		// {
		// 	packs[3].count = Math.ceil(getTotalVol(true)/0.04);
		// }
		// else
		// {
		// 	packs[3].count = Math.ceil(totalVol/0.04);
		// }

		return { total, packs };
    }
    catch(error)
    {
        throw error;
    }

}

export function getTotalAmount(purchasePacks)
{
    return Object.keys(purchasePacks).reduce(function (previous, key) {

        var float = parseFloat(key);

        if(!isNaN(key)){
            return previous + (float * purchasePacks[float.toFixed(1)]);
        }
        return previous;

    }, 0);
}

function getClosestAmount(purchasePackAmounts, totalVol, knownResults)
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
                var pack = getClosestAmount(purchasePackAmounts, totalVol - type, knownResults);
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

    var amount = getClosestAmount(purchasePackAmounts, totalVol, knownResults);

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

                var pack = getClosestAmount(purchasePackAmounts, float, knownResults);

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
