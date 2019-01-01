import { put, select  } from 'redux-saga/effects';
import _ from 'lodash';

import { calculatorActions } from '../actions/calculatorActions';
import { inventoryActions } from '../actions/inventoryActions';

export function * calculatePacks(action) {
    const { responseSuccess, responseFailure } = action;

    try {
        const calculator = yield select(state => state.calculator);
        const packs = calculate(calculator);
        const total = getTotalAmount(packs);

        yield put(responseSuccess({ packs, total }));

    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeTempValue(action) {
    const { responseSuccess, responseFailure, data: { tempVal }} = action;
    try {
        yield put(responseSuccess({ tempVal }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeTempUnit(action) {
    const { responseSuccess, responseFailure, data} = action;
    try {
        const calculator = yield select(state => state.calculator);
        const choices = calculator.tempChoices[data.tempUnit];
        const tempVal = choices[0];
        const tempUnit = data.tempUnit;

        yield put(responseSuccess({ tempUnit, tempVal }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeVolValue(action) {
    const { responseSuccess, responseFailure, data: { volVal }} = action;
    try {
        yield put(responseSuccess({ volVal }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeVolUnit(action) {
    const { responseSuccess, responseFailure, data} = action;
    try {
        const calculator = yield select(state => state.calculator);

        const choices = calculator.volChoices[data.volUnit];
        const volVal = choices[0];
        const volUnit = data.volUnit;

        yield put(responseSuccess({ volUnit, volVal }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeGravValue(action) {
    const { responseSuccess, responseFailure, data: { gravVal }} = action;
    try {
        yield put(responseSuccess({ gravVal }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeGravUnit(action) {
    const { responseSuccess, responseFailure, data} = action;
    try {
        const calculator = yield select(state => state.calculator);
        const choices = calculator.gravChoices[data.gravUnit];
        const gravVal = choices[0];
        const gravUnit = data.gravUnit;

        yield put(responseSuccess({ gravUnit, gravVal }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * toggleHomebrew(action) {
    const { responseSuccess, responseFailure, data: { isHomebrew }} = action;
    try {   
        yield put(responseSuccess({ isHomebrew }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * changeType(action) {
    const { responseSuccess, responseFailure, data: { type }} = action;
    try {
        yield put(responseSuccess({ type }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

/* ------------- custom fields ------------- */
export function * changeStartingGravity(action) {
    const { responseSuccess, responseFailure, data: { startingGravity }} = action;
    try {
        yield put(responseSuccess({ startingGravity }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}
export function * changeTargetPitchRate(action) {
    const { responseSuccess, responseFailure, data: { targetPitchRate }} = action;
    try {
        yield put(responseSuccess({ targetPitchRate }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}
export function * changeVolume(action) {
    const { responseSuccess, responseFailure, data: { volume }} = action;
    try {
        yield put(responseSuccess({ volume }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}
export function * changeViability(action) {
    const { responseSuccess, responseFailure, data: { viability }} = action;
    try {
        yield put(responseSuccess({ viability }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}
export function * changeCellCount(action) {
    const { responseSuccess, responseFailure, data: { cellCount }} = action;
    try {
        yield put(responseSuccess({ cellCount }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}
/* ------------- custom fiels  ------------- */

/* ------------- Business Logic ------------- */
// Converting volume into BBL
function convertVol(calculator)
{
    const { volVal, volUnit, volChoices } = calculator;
    var index = volChoices[volUnit].indexOf(volVal);
    return volChoices['BBL'][index];
}

// Convert temperature into F
function convertTemp(calculator)
{
    const { tempVal, tempUnit, tempChoices } = calculator;
    var index = tempChoices[tempUnit].indexOf(tempVal);
    return tempChoices['F'][index];
}

// Convert gravity into PLA
function convertGrav(calculator)
{
    const { gravVal, gravUnit, gravChoices } = calculator;
    var index = gravChoices[gravUnit].indexOf(gravVal);
    return gravChoices['PLA'][index];
}


function calculate(calculator)
{
    try
    {
        if(calculator.type == 'Lab-grown')
        {

            return getPacks(tableLookup(calculator));
        }
        else
        {
            return getPacks(custom(calculator));
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
        const { isHomebrew, homebrewPackSizeChart, packSizeChart } = calculator;

        if(isHomebrew && homebrewPackSizeChart[temp] && homebrewPackSizeChart[temp][vol] && homebrewPackSizeChart[temp][vol][grav])
        {
            var totalVol = homebrewPackSizeChart[temp][vol][grav];

            if(totalVol == 'starter')
            {
                Alert.alert('Notice', "Please make starter or use Nano");
                return;
            }

            return totalVol;
        }
        else if(packSizeChart[temp] && packSizeChart[temp][vol] && packSizeChart[temp][vol][grav])
        {
            var totalVol = packSizeChart[temp][vol][grav];

            //Pro Warning
            if(!isHomebrew && totalVol < 0.450)
            {
                Alert.alert('Fermentation Volume wasn\'t large enough, pack amounts may largely overestimate needed yeast, please switch to Homebrew.');
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

        return (startingGravity * targetPitchRate) * volume / (viability * cellCount);
    }
    catch(err)
    {
        throw err;
    }
}

function getPacks(totalVol)
{
    try
    {
        return getOptimalAmount([0.5, 1.5, 2], totalVol, {});
    }
    catch(err)
    {
        throw err;
    }

}

function getTotalAmount(purchasePacks)
{ 
    return Object.keys(purchasePacks).reduce(function (previous, key) {
        
        var float = parseFloat(key);
        
        if(!isNaN(key)){
            return previous + (float * purchasePacks[float.toFixed(1)]);
        }
        return previous;
        
    }, 0);
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
