import { createReducer } from 'helpers/reduxHelpers';
import { calculatorTypes } from 'appRedux/actions/calculatorActions';

const initialState = {
    error: null,
    showResult: false,
    result: {},
    isHomebrew: false,
    volVal: "119",
    volUnit: "L",
    gravVal: "less than 13.5",
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
			'1': { 'less than 13.5': 0.5, '13.5 - 15': 0.5, '15.1 - 17.5': 0.5, 'greater than 17.5': 1 },
			'2': { 'less than 13.5': 1, '13.5 - 15': 1.5, '15.1 - 17.5': 2, 'greater than 17.5': 2 },
			'4': { 'less than 13.5': 2, '13.5 - 15': 3, '15.1 - 17.5': 3, 'greater than 17.5': 4 },
			'6': { 'less than 13.5': 3, '13.5 - 15': 4, '15.1 - 17.5': 4, 'greater than 17.5': 6 },
			'9': { 'less than 13.5': 4, '13.5 - 15': 5, '15.1 - 17.5': 6, 'greater than 17.5': 8 },
			'12': { 'less than 13.5': 5, '13.5 - 15': 6, '15.1 - 17.5': 7, 'greater than 17.5': 9 },
			'14': { 'less than 13.5': 6, '13.5 - 15': 8, '15.1 - 17.5': 9, 'greater than 17.5': 12 },
			'20': { 'less than 13.5': 8, '13.5 - 15': 10, '15.1 - 17.5': 12, 'greater than 17.5': 16 },
			'25': { 'less than 13.5': 10, '13.5 - 15': 12, '15.1 - 17.5': 15, 'greater than 17.5': 20 },
			'30': { 'less than 13.5': 12, '13.5 - 15': 15, '15.1 - 17.5': 18, 'greater than 17.5': 24 },
			'40': { 'less than 13.5': 16, '13.5 - 15': 20, '15.1 - 17.5': 24, 'greater than 17.5': 32 },
			'50': { 'less than 13.5': 20, '13.5 - 15': 24, '15.1 - 17.5': 30, 'greater than 17.5':  40 },
			'60': { 'less than 13.5': 24, '13.5 - 15': 30, '15.1 - 17.5': 36, 'greater than 17.5': 48 },
			'70': { 'less than 13.5': 28, '13.5 - 15': 36, '15.1 - 17.5': 44, 'greater than 17.5': 56 },
			'80': { 'less than 13.5': 32, '13.5 - 15': 40, '15.1 - 17.5': 48, 'greater than 17.5': 64 },
			'90': { 'less than 13.5': 36, '13.5 - 15': 44, '15.1 - 17.5': 54, 'greater than 17.5': 72 },
			'100': { 'less than 13.5': 40, '13.5 - 15': 50, '15.1 - 17.5': 60, 'greater than 17.5': 80 }
		},
		'60 - 66': {
			'1': { 'less than 13.5': 0.5, '13.5 - 15': 0.5, '15.1 - 17.5': 0.5, 'greater than 17.5': 1 },
			'2': { 'less than 13.5': 0.5, '13.5 - 15': 1, '15.1 - 17.5': 1.5, 'greater than 17.5': 1.5 },
			'4': { 'less than 13.5': 1.5, '13.5 - 15': 2, '15.1 - 17.5': 2, 'greater than 17.5': 3 },
			'6': { 'less than 13.5': 2, '13.5 - 15': 3, '15.1 - 17.5': 3, 'greater than 17.5': 4.5 },
			'9': { 'less than 13.5': 3, '13.5 - 15': 4, '15.1 - 17.5': 4.5, 'greater than 17.5': 6 },
			'12': { 'less than 13.5': 4, '13.5 - 15': 4.5, '15.1 - 17.5': 6, 'greater than 17.5': 6 },
			'14': { 'less than 13.5': 4, '13.5 - 15': 6, '15.1 - 17.5': 7, 'greater than 17.5': 9 },
			'20': { 'less than 13.5': 6, '13.5 - 15': 7.5, '15.1 - 17.5': 9 , 'greater than 17.5': 12 },
			'25': { 'less than 13.5': 7.5, '13.5 - 15': 9, '15.1 - 17.5': 12, 'greater than 17.5': 15 },
			'30': { 'less than 13.5': 9, '13.5 - 15': 12, '15.1 - 17.5': 14, 'greater than 17.5': 18 },
			'40': { 'less than 13.5': 12, '13.5 - 15': 15, '15.1 - 17.5': 18, 'greater than 17.5': 24 },
			'50': { 'less than 13.5': 15, '13.5 - 15': 18, '15.1 - 17.5': 22, 'greater than 17.5':  30 },
			'60': { 'less than 13.5': 18, '13.5 - 15': 22, '15.1 - 17.5': 27, 'greater than 17.5': 36 },
			'70': { 'less than 13.5': 21, '13.5 - 15': 27, '15.1 - 17.5': 33, 'greater than 17.5': 42 },
			'80': { 'less than 13.5': 24, '13.5 - 15': 30, '15.1 - 17.5': 36, 'greater than 17.5':  48 },
			'90': { 'less than 13.5': 27, '13.5 - 15': 33, '15.1 - 17.5': 40, 'greater than 17.5': 54 },
			'100': { 'less than 13.5': 30, '13.5 - 15': 38, '15.1 - 17.5': 45, 'greater than 17.5': 60 }
		},
		'67 and over': {
			'1': { 'less than 13.5': 0.5, '13.5 - 15': 0.5, '15.1 - 17.5': 0.5, 'greater than 17.5': 1 },
			'2': { 'less than 13.5': 0.5, '13.5 - 15': 0.5, '15.1 - 17.5': 1, 'greater than 17.5': 1 },
			'4': { 'less than 13.5': 1, '13.5 - 15': 1.5, '15.1 - 17.5': 1.5, 'greater than 17.5': 2 },
			'6': { 'less than 13.5': 1.5, '13.5 - 15': 2, '15.1 - 17.5': 2, 'greater than 17.5': 3 },
			'9': { 'less than 13.5': 2, '13.5 - 15': 2.5, '15.1 - 17.5': 3, 'greater than 17.5': 4 },
			'12': { 'less than 13.5': 2.5, '13.5 - 15': 3, '15.1 - 17.5': 3.5, 'greater than 17.5': 4.5 },
			'14': { 'less than 13.5': 3, '13.5 - 15': 4, '15.1 - 17.5': 4.5, 'greater than 17.5': 6 },
			'20': { 'less than 13.5': 4, '13.5 - 15': 5, '15.1 - 17.5': 6 , 'greater than 17.5': 6 },
			'25': { 'less than 13.5': 5, '13.5 - 15': 6, '15.1 - 17.5': 7.5, 'greater than 17.5': 10 },
			'30': { 'less than 13.5': 6, '13.5 - 15': 7.5, '15.1 - 17.5': 9, 'greater than 17.5': 12 },
			'40': { 'less than 13.5': 8, '13.5 - 15': 10, '15.1 - 17.5': 12, 'greater than 17.5': 16 },
			'50': { 'less than 13.5': 10, '13.5 - 15': 12, '15.1 - 17.5': 12, 'greater than 17.5':  20 },
			'60': { 'less than 13.5': 12, '13.5 - 15': 15, '15.1 - 17.5': 18, 'greater than 17.5': 24 },
			'70': { 'less than 13.5': 14, '13.5 - 15': 18, '15.1 - 17.5': 22, 'greater than 17.5': 28 },
			'80': { 'less than 13.5': 16, '13.5 - 15': 20, '15.1 - 17.5': 24, 'greater than 17.5':  32 },
			'90': { 'less than 13.5': 18, '13.5 - 15': 22, '15.1 - 17.5': 27, 'greater than 17.5': 36 },
			'100': { 'less than 13.5': 20, '13.5 - 15': 25, '15.1 - 17.5': 30, 'greater than 17.5': 40 }
		},
    },

    homebrewPackSizeChart: {
		'less than 59': {
			'20': { 'less than 13.5': 2, '12 - 16.5': 4, 'greater than 17.5': 6 },
			'40': { 'less than 13.5': 4, '12 - 16.5': 8, 'greater than 17.5': 12 },
			'60': { 'less than 13.5': 6, '12 - 16.5': 8, 'greater than 17.5': 'starter' },
			'80': { 'less than 13.5': 8, '12 - 16.5': 'starter', 'greater than 17.5': 'starter' },
			'100': { 'less than 13.5': 10, '12 - 16.5': 'starter', 'greater than 17.5': 'starter' },
			'120': { 'less than 13.5': 12, '12 - 16.5': 'starter', 'greater than 17.5': 'starter' }
		},
		'60 - 66': {
			'20': { 'less than 13.5': 1, '12 - 16.5': 2, 'greater than 17.5': 3 },
			'40': { 'less than 13.5': 2, '12 - 16.5': 4, 'greater than 17.5': 6 },
			'60': { 'less than 13.5': 3, '12 - 16.5': 6, 'greater than 17.5': 9 },
			'80': { 'less than 13.5': 4, '12 - 16.5': 8, 'greater than 17.5': 12 },
			'100': { 'less than 13.5': 5, '12 - 16.5': 10, 'greater than 17.5': 'starter' },
			'120': { 'less than 13.5': 6, '12 - 16.5': 12, 'greater than 17.5': 'starter' }
		},
		'67 and over': {
			'20': { 'less than 13.5': 1, '12 - 16.5': 2, 'greater than 17.5': 3 },
			'40': { 'less than 13.5': 2, '12 - 16.5': 4, 'greater than 17.5': 6 },
			'60': { 'less than 13.5': 3, '12 - 16.5': 6, 'greater than 17.5': 9 },
			'80': { 'less than 13.5': 4, '12 - 16.5': 8, 'greater than 17.5': 12 },
			'100': { 'less than 13.5': 5, '12 - 16.5': 10, 'greater than 17.5': 'starter' },
			'120': { 'less than 13.5': 6, '12 - 16.5': 12, 'greater than 17.5': 'starter' }
		}
    },

    homebrewVolChoices: {
		'L': ['20', '40', '60', '80', '100', '120', '140'],
		'SGAL': ['5', '10', '15', '20', '25', '30'],
		'KGAL': ['4', '8', '12', '16', '20', '24']
    },

    homebrewGravChocies: {
		'PLA': ['less than 13.5', '12 - 16.5', 'greater than 16.5'],
		'SPE': ['less than 1.050', '1.050 - 1.068', 'greater than 1.068']
    },

    volChoices: {
		'BBL': ['1', '2 - 3', '4 - 5', '6 - 8', '9 - 11', '12 - 13', '14 - 16', '20 - 24', '25 - 29', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70 - 79', '80 - 89', '90 - 99', '100 - 109'],
		'L': ['119', '298', '537', '835', '1192', '1491', '1789', '2385', '2981', '3577', '4770', '5962', '7154', '8347', '9539', '10732', '11924'],
		'HL': ['1', '3', '5', '8', '12', '15', '18', '24', '30', '36', '48', '60', '72', '83', '95', '107', '119'],
		'SGAL': ['32', '79', '142', '221', '315', '394', '473', '630', '788', '945', '1260', '1575', '1890', '2205', '2520', '2835', '3150'],
		'KGAL': ['38', '95', '170', '265', '378', '473', '567', '756', '945', '1134', '1512', '1890', '2268', '2646', '3024', '3402', '3780'],
    'BBLConvert': ['1', '2', '4', '6', '9', '12', '14', '20', '25', '30', '40', '50', '60', '70', '80', '90', '100']
    },

    tempChoices: {
		'F': ['less than 59', '60 - 66', '67 and over'],
		'C': ['less than 15', '15.1 - 17.5', 'greater than 17.5']
    },

    gravChoices: {
		'PLA': ['less than 13.5', '13.5 - 15', '15.1 - 17.5', 'greater than 17.5'],
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
		    {label:'Re-pitching', value:'Custom'}
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
