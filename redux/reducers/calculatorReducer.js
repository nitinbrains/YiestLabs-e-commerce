import { createReducer } from 'helpers/reduxHelpers';
import { calculatorTypes } from 'appRedux/actions/calculatorActions';

const initialState = {
    error: null,
    showResult: false,
    result: {},
    isHomebrew: false,
    volVal: "119",
    volUnit: "L",
    gravVal: "less than 12",
    gravUnit: "PLA",
    tempVal: "less than 59",
    tempUnit: "F",
    unitVal: "",

    startingGravity: "", 
    targetPitchRate: "", 
    volume: "", 
    viability: "", 
    cellCount: "",

    type: "Lab-grown",
    packSizeChart: {
		'less than 59': {
			'1': { 'less than 12': 0.5, '12 - 15': 0.5, '15 - 18': 0.5, 'greater than 18': 1 },
			'2 - 3': { 'less than 12': 1, '12 - 15': 1.5, '15 - 18': 2, 'greater than 18': 2 },
			'4 - 5': { 'less than 12': 2, '12 - 15': 3, '15 - 18': 3, 'greater than 18': 4 },
			'6 - 8': { 'less than 12': 3, '12 - 15': 4, '15 - 18': 4, 'greater than 18': 6 },
			'9 - 11': { 'less than 12': 4, '12 - 15': 5, '15 - 18': 6, 'greater than 18': 8 },
			'12 - 13': { 'less than 12': 5, '12 - 15': 6, '15 - 18': 7, 'greater than 18': 9 },
			'14 - 16': { 'less than 12': 6, '12 - 15': 8, '15 - 18': 9, 'greater than 18': 12 },
			'20': { 'less than 12': 8, '12 - 15': 10, '15 - 18': 12, 'greater than 18': 16 },
			'25': { 'less than 12': 10, '12 - 15': 12, '15 - 18': 15, 'greater than 18': 20 },
			'30': { 'less than 12': 12, '12 - 15': 15, '15 - 18': 18, 'greater than 18': 24 },
			'40': { 'less than 12': 16, '12 - 15': 20, '15 - 18': 24, 'greater than 18': 32 },
			'50': { 'less than 12': 20, '12 - 15': 24, '15 - 18': 30, 'greater than 18':  40 },
			'60': { 'less than 12': 24, '12 - 15': 30, '15 - 18': 36, 'greater than 18': 48 },
			'70': { 'less than 12': 28, '12 - 15': 36, '15 - 18': 44, 'greater than 18': 56 },
			'80': { 'less than 12': 32, '12 - 15': 40, '15 - 18': 48, 'greater than 18': 64 },
			'90': { 'less than 12': 36, '12 - 15': 44, '15 - 18': 54, 'greater than 18': 72 },
			'100': { 'less than 12': 40, '12 - 15': 50, '15 - 18': 60, 'greater than 18': 80 }
		},
		'60 - 65': {
			'1': { 'less than 12': 0.5, '12 - 15': 0.5, '15 - 18': 0.5, 'greater than 18': 1 },
			'2 - 3': { 'less than 12': 0.5, '12 - 15': 1, '15 - 18': 1.5, 'greater than 18': 1.5 },
			'4 - 5': { 'less than 12': 1.5, '12 - 15': 2, '15 - 18': 2, 'greater than 18': 3 },
			'6 - 8': { 'less than 12': 2, '12 - 15': 3, '15 - 18': 3, 'greater than 18': 4.5 },
			'9 - 11': { 'less than 12': 3, '12 - 15': 4, '15 - 18': 4.5, 'greater than 18': 6 },
			'12 - 13': { 'less than 12': 4, '12 - 15': 4.5, '15 - 18': 6, 'greater than 18': 6 },
			'14 - 16': { 'less than 12': 4, '12 - 15': 6, '15 - 18': 7, 'greater than 18': 9 },
			'20': { 'less than 12': 6, '12 - 15': 7.5, '15 - 18': 9 , 'greater than 18': 12 },
			'25': { 'less than 12': 7.5, '12 - 15': 9, '15 - 18': 12, 'greater than 18': 15 },
			'30': { 'less than 12': 9, '12 - 15': 12, '15 - 18': 14, 'greater than 18': 18 },
			'40': { 'less than 12': 12, '12 - 15': 15, '15 - 18': 18, 'greater than 18': 24 },
			'50': { 'less than 12': 15, '12 - 15': 18, '15 - 18': 22, 'greater than 18':  30 },
			'60': { 'less than 12': 18, '12 - 15': 22, '15 - 18': 27, 'greater than 18': 36 },
			'70': { 'less than 12': 21, '12 - 15': 27, '15 - 18': 33, 'greater than 18': 42 },
			'80': { 'less than 12': 24, '12 - 15': 30, '15 - 18': 36, 'greater than 18':  48 },
			'90': { 'less than 12': 27, '12 - 15': 33, '15 - 18': 40, 'greater than 18': 54 },
			'100': { 'less than 12': 30, '12 - 15': 38, '15 - 18': 45, 'greater than 18': 60 }
		},
		'greater than 65': {
			'1': { 'less than 12': 0.5, '12 - 15': 0.5, '15 - 18': 0.5, 'greater than 18': 1 },
			'2 - 3': { 'less than 12': 0.5, '12 - 15': 0.5, '15 - 18': 1, 'greater than 18': 1 },
			'4 - 5': { 'less than 12': 1, '12 - 15': 1.5, '15 - 18': 1.5, 'greater than 18': 2 },
			'6 - 8': { 'less than 12': 1.5, '12 - 15': 2, '15 - 18': 2, 'greater than 18': 3 },
			'9 - 11': { 'less than 12': 2, '12 - 15': 2.5, '15 - 18': 3, 'greater than 18': 4 },
			'12 - 13': { 'less than 12': 2.5, '12 - 15': 3, '15 - 18': 3.5, 'greater than 18': 4.5 },
			'14 - 16': { 'less than 12': 3, '12 - 15': 4, '15 - 18': 4.5, 'greater than 18': 6 },
			'20': { 'less than 12': 4, '12 - 15': 5, '15 - 18': 6 , 'greater than 18': 6 },
			'25': { 'less than 12': 5, '12 - 15': 6, '15 - 18': 7.5, 'greater than 18': 10 },
			'30': { 'less than 12': 6, '12 - 15': 7.5, '15 - 18': 9, 'greater than 18': 12 },
			'40': { 'less than 12': 8, '12 - 15': 10, '15 - 18': 12, 'greater than 18': 16 },
			'50': { 'less than 12': 10, '12 - 15': 12, '15 - 18': 12, 'greater than 18':  20 },
			'60': { 'less than 12': 12, '12 - 15': 15, '15 - 18': 18, 'greater than 18': 24 },
			'70': { 'less than 12': 14, '12 - 15': 18, '15 - 18': 22, 'greater than 18': 28 },
			'80': { 'less than 12': 16, '12 - 15': 20, '15 - 18': 24, 'greater than 18':  32 },
			'90': { 'less than 12': 18, '12 - 15': 22, '15 - 18': 27, 'greater than 18': 36 },
			'100': { 'less than 12': 20, '12 - 15': 25, '15 - 18': 30, 'greater than 18': 40 }
		},
    },
    
    homebrewPackSizeChart: {
		'less than 59': {
			'20': { 'less than 12': 2, '12 - 16.5': 4, 'greater than 18': 6 },
			'40': { 'less than 12': 4, '12 - 16.5': 8, 'greater than 18': 12 },
			'60': { 'less than 12': 6, '12 - 16.5': 8, 'greater than 18': 'starter' },
			'80': { 'less than 12': 8, '12 - 16.5': 'starter', 'greater than 18': 'starter' },
			'100': { 'less than 12': 10, '12 - 16.5': 'starter', 'greater than 18': 'starter' },
			'120': { 'less than 12': 12, '12 - 16.5': 'starter', 'greater than 18': 'starter' }
		},
		'60 - 65': {
			'20': { 'less than 12': 1, '12 - 16.5': 2, 'greater than 18': 3 },
			'40': { 'less than 12': 2, '12 - 16.5': 4, 'greater than 18': 6 },
			'60': { 'less than 12': 3, '12 - 16.5': 6, 'greater than 18': 9 },
			'80': { 'less than 12': 4, '12 - 16.5': 8, 'greater than 18': 12 },
			'100': { 'less than 12': 5, '12 - 16.5': 10, 'greater than 18': 'starter' },
			'120': { 'less than 12': 6, '12 - 16.5': 12, 'greater than 18': 'starter' }
		},
		'greater than 65': {
			'20': { 'less than 12': 1, '12 - 16.5': 2, 'greater than 18': 3 },
			'40': { 'less than 12': 2, '12 - 16.5': 4, 'greater than 18': 6 },
			'60': { 'less than 12': 3, '12 - 16.5': 6, 'greater than 18': 9 },
			'80': { 'less than 12': 4, '12 - 16.5': 8, 'greater than 18': 12 },
			'100': { 'less than 12': 5, '12 - 16.5': 10, 'greater than 18': 'starter' },
			'120': { 'less than 12': 6, '12 - 16.5': 12, 'greater than 18': 'starter' }
		}
    },
    
    homebrewVolChoices: {
		'L': ['20', '40', '60', '80', '100', '120', '140'],
		'SGAL': ['5', '10', '15', '20', '25', '30'],
		'KGAL': ['4', '8', '12', '16', '20', '24']
    },

    homebrewGravChocies: {
		'PLA': ['less than 12', '12 - 16.5', 'greater than 16.5'],
		'SPE': ['less than 1.050', '1.050 - 1.068', 'greater than 1.068']
    },
    
    volChoices: {
		'BBL': ['1', '2 - 3', '4 - 5', '6 - 8', '9 - 11', '12 - 13', '14 - 16', '20', '25', '30', '40', '50', '60', '70', '80', '90', '100'],
		'L': ['119', '298', '537', '835', '1192', '1491', '1789', '2385', '2981', '3577', '4770', '5962', '7154', '8347', '9539', '10732', '11924'],
		'HL': ['1', '3', '5', '8', '12', '15', '18', '24', '30', '36', '48', '60', '72', '83', '95', '107', '119'],
		'SGAL': ['32', '79', '142', '221', '315', '394', '473', '630', '788', '945', '1260', '1575', '1890', '2205', '2520', '2835', '3150'],
		'KGAL': ['38', '95', '170', '265', '378', '473', '567', '756', '945', '1134', '1512', '1890', '2268', '2646', '3024', '3402', '3780']
    },
    
    tempChoices: {
		'F': ['less than 59', '60 - 65', 'greater than 65'],
		'C': ['less than 15', '15 - 18', 'greater than 18']
    },
    
    gravChoices: {
		'PLA': ['less than 12', '12 - 15', '15 - 18', 'greater than 18'],
		'SPE': ['less than 1.050', '1.050 - 1.061', '1.061 - 1.074', 'greater than 1.074']
	},
    volUnits: [
        { label: "Liter", value: "L", forHomebrew: true },
        { label: "US Gallon", value: "SGAL", forHomebrew: true },
        { label: "UK Gallon", value: "KGAL", forHomebrew: true },
        { label:'Barrel', value:'BBL' },
		{ label:'Hectoliter', value:'HL' }
    ],
    gravUnits: [
        { label: "Plato", value: "PLA" },
        { label: "Specific Gravity", value: "SPE" }
    ],
    tempUnits: [
        { label: "Fahrenheit", value: "F" },
        { label: "Celsius", value: "C" }
    ],
    typeChoices: [
        {label:'Lab-grown', value:'Lab-grown'},
		{label:'Custom', value:'Custom'}
    ]
};


export default createReducer(initialState, {
    [calculatorTypes.CALCULATE_PACKS_SUCCESS]: (state, { data: { packs, total } }) => ({
		packs,
		total
    }),
    [calculatorTypes.CHANGE_TEMP_UNIT_SUCCESS]: (state, { data: { tempUnit, tempVal } }) => ({
        tempUnit, 
        tempVal, 
    }),
    [calculatorTypes.CHANGE_TEMP_VALUE_SUCCESS]: (state, { data: { tempVal } }) => ({
        tempVal
    }),
    [calculatorTypes.CHANGE_VOL_UNIT_SUCCESS]: (state, { data: { volUnit, volVal } }) => ({
        volUnit, 
        volVal, 
    }),
    [calculatorTypes.CHANGE_VOL_VALUE_SUCCESS]: (state, { data: { volVal } }) => ({
        volVal
    }),
    [calculatorTypes.CHANGE_GRAV_UNIT_SUCCESS]: (state, { data: { gravUnit, gravVal } }) => ({
        gravUnit, 
        gravVal, 
    }),
    [calculatorTypes.CHANGE_GRAV_VALUE_SUCCESS]: (state, { data: { gravVal } }) => ({
        gravVal
    }),
    [calculatorTypes.TOGGLE_HOMEBREW_SUCCESS]: (state, { data: { isHomebrew } }) => ({
        isHomebrew,
        volVal: "119",
        volUnit: "L",
    }),
    [calculatorTypes.CHANGE_TYPE_SUCCESS]: (state, { data: { type } }) => ({
        type
    }),
    [calculatorTypes.CHANGE_STARTING_GRAVITY_SUCCESS]: (state, { data: { startingGravity } }) => ({
       startingGravity
    }),
    [calculatorTypes.CHANGE_TARGET_PITCH_RATE_SUCCESS]: (state, { data: { targetPitchRate } }) => ({
       targetPitchRate
    }),
    [calculatorTypes.CHANGE_VOLUME_SUCCESS]: (state, { data: { volume } }) => ({
      volume
    }),
    [calculatorTypes.CHANGE_VIABILITY_SUCCESS]: (state, { data: { viability } }) => ({
      viability
    }),
    [calculatorTypes.CHANGE_CELL_COUNT_SUCCESS]: (state, { data: { cellCount } }) => ({
      cellCount
    }),
});
