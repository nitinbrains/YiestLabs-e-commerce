'use strict';

var SalesLib = { //Exported For External Use

	clientVersion: "2.3.7",
	CURRENCY_MAP: [ 
		{currency: 'US Dollar', symbol: '$', id: 1},
		{currency: 'British pound', symbol: '£', id: 2},
		{currency: 'Canadian Dollar', symbol: 'Can$', id: 3},
		{currency: 'EUR', symbol: '€', id: 4},
		{currency: 'Hong Kong Dollar', symbol: 'HK$', id: 5},
		{currency: 'DKK', symbol: 'kr.', id: 6}
	],

	POSItems: [
		1908, //MKTBEERBROCHUREPACK50
		4407 //PACKAGEHB6
	],

	YeastEssentials: [
		13873,
		13901,
		13880,
		13905,
		13874,
		13902
	], 

	RetailEnzNut: [
		14453, //WLN1000-1
		4009, //WLN3000-1
		3883, //WLN3000-20 Pack
		3071, //WLN3500
		3903, //WLN4000-10ML
		4238 //WLN4100-HB
	],

	WYBacteriaNoCalculator: [
		26, //WY - Private
		3, //WY - Standard
		27, //Bacteria - Standard
		28, //Bacteria - Private
		4, //Yeast Bay - WY
		30, //Yeast Bay - Bacteria
		32, //Vault - WY
		33, //Vault - Bacteria
		34 //Blend - WY/Bacteria
	],

	USHOLIDAYS: [
		{day: 1, month: 1}, //new years day
		{day: 25, month: 12}, //christmas
		{day: 4, month: 7}, //4th of july
		{day: -1, month: 5, week: -1, dayofweek: 1 }, //memorial day
		{day: -1, month: 11, week: 4, dayofweek: 4}, //thanksgiving
		{day: -1, month: 9, week: 1, dayofweek: 1} //labor day
	],

	HKHOLIDAYS: [{day: 30, month: 3},
					{day: 31, month: 3},
					{day: 2, month: 4},
					{day: 5, month: 4}],

	CPHHOLIDAYS: [{day: 1, month: 1},
					{day: 29, month: 3},
					{day: 30, month: 3},
					{day: 2, month: 4},
					{day: 27, month: 4},
					{day: 10, month: 5},
					{day: 21, month: 5},
					{day: 24, month: 12},
					{day: 25, month: 12},
					{day: 26, month: 12}],

	CUSTOMER_CATEGORY_MAP: [
		'Wholesaler-Pro',
		'Retailer',
		'End User',
		'Pro Brewery',
		'Pro Winery',
		'Pro Distillery',
		'Wholesaler-Homebrew'
	],

	COUNTRY_MAP: [
		{CountryID:'1', CountryCode:'US', CountryName:'United States', Regex: new RegExp('^\\b\\d{5}\\b(?:[- ]{1}\\d{4})?$','i')},
		{CountryID:'2', CountryCode:'CA', CountryName:'Canada', Regex: new RegExp('^(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\s{0,1}\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d$','i')},
		{CountryID:'3', CountryCode:'MX', CountryName:'Mexico', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'4', CountryCode:'GB', CountryName:'United Kingdom', Regex: new RegExp('^[A-Za-z]{1,2}\\d([A-Za-z]|\\d)\\d[A-Za-z]{2}$','i')},
		{CountryID:'5', CountryCode:'DK', CountryName:'Denmark', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'6', CountryCode:'AU', CountryName:'Australia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'7', CountryCode:'DE', CountryName:'Germany', Regex: new RegExp('^\\d{2}|\\d{4}|\\d{5}$','i')},
		{CountryID:'8', CountryCode:'NO', CountryName:'Norway', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'9', CountryCode:'PL', CountryName:'Poland', Regex: new RegExp('^\\d{2}[- ]{0,1}\\d{3}$','i')},
		{CountryID:'10', CountryCode:'AD', CountryName:'Andorra', Regex: new RegExp('^[Aa][Dd]\\d{3}$','i')},
		{CountryID:'11', CountryCode:'AE', CountryName:'United Arab Emirates', Regex: null},
		{CountryID:'12', CountryCode:'AF', CountryName:'Afghanistan', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'13', CountryCode:'AG', CountryName:'Antigua and Barbuda', Regex: null},
		{CountryID:'14', CountryCode:'AI', CountryName:'Anguilla', Regex: new RegExp('^[Aa][I][-][2][6][4][0]$','i')},
		{CountryID:'15', CountryCode:'AL', CountryName:'Albania', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'16', CountryCode:'AM', CountryName:'Armenia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'17', CountryCode:'AN', CountryName:'Netherlands Antilles', Regex: null},
		{CountryID:'18', CountryCode:'AO', CountryName:'Angola', Regex: null},
		{CountryID:'19', CountryCode:'AQ', CountryName:'Antarctica', Regex: null},
		{CountryID:'20', CountryCode:'AR', CountryName:'Argentina', Regex: new RegExp('^\\d{4}|[A-Za-z]\\d{4}[a-zA-Z]{3}$','i')},
		{CountryID:'21', CountryCode:'AS', CountryName:'American Samoa', Regex: new RegExp('^\\d{5}(-{1}\\d{4,6})$','i')},
		{CountryID:'22', CountryCode:'AT', CountryName:'Austria', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'23', CountryCode:'AW', CountryName:'Aruba', Regex: null},
		{CountryID:'24', CountryCode:'AZ', CountryName:'Azerbaijan', Regex: new RegExp('^[Aa][Zz]\\d{4}$','i')},
		{CountryID:'25', CountryCode:'BA', CountryName:'Bosnia and Herzegovina', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'26', CountryCode:'BB', CountryName:'Barbados', Regex: new RegExp('^[Aa][Zz]\\d{5}$','i')},
		{CountryID:'27', CountryCode:'BD', CountryName:'Bangladesh', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'28', CountryCode:'BE', CountryName:'Belgium', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'29', CountryCode:'BF', CountryName:'Burkina Faso', Regex: null},
		{CountryID:'30', CountryCode:'BG', CountryName:'Bulgaria', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'31', CountryCode:'BH', CountryName:'Bahrain', Regex: new RegExp('^\\d{3,4}$','i')},
		{CountryID:'32', CountryCode:'BI', CountryName:'Burundi', Regex: null},
		{CountryID:'33', CountryCode:'BJ', CountryName:'Benin', Regex: null},
		{CountryID:'34', CountryCode:'BM', CountryName:'Bermuda', Regex: new RegExp('^[A-Za-z]{2}\\s([A-Za-z]{2}|\\d{2})$','i')},
		{CountryID:'35', CountryCode:'BN', CountryName:'Brunei', Regex: new RegExp('^[A-Za-z]{2}\\d{4}$','i')},
		{CountryID:'36', CountryCode:'BO', CountryName:'Bolivia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'37', CountryCode:'BR', CountryName:'Brazil', Regex: new RegExp('^\\d{5}-\\d{3}$','i')},
		{CountryID:'38', CountryCode:'BS', CountryName:'Bahamas', Regex: null},
		{CountryID:'39', CountryCode:'BT', CountryName:'Bhutan', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'40', CountryCode:'BV', CountryName:'Bouvet Island', Regex: null},
		{CountryID:'41', CountryCode:'BW', CountryName:'Botswana', Regex: null},
		{CountryID:'42', CountryCode:'BY', CountryName:'Belarus', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'43', CountryCode:'BZ', CountryName:'Belize', Regex: null},
		{CountryID:'44', CountryCode:'CC', CountryName:'Cocos (Keeling) Islands', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'45', CountryCode:'CD', CountryName:'Democratic Republic of the Congo', Regex: null},
		{CountryID:'46', CountryCode:'CF', CountryName:'Central African Republic', Regex: null},
		{CountryID:'47', CountryCode:'CG', CountryName:'Republic of the Congo', Regex: null},
		{CountryID:'48', CountryCode:'CH', CountryName:'Switzerland', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'49', CountryCode:'CI', CountryName:'Ivory Coast', Regex: null},
		{CountryID:'50', CountryCode:'CK', CountryName:'Cook Islands', Regex: null},
		{CountryID:'51', CountryCode:'CL', CountryName:'Chile', Regex: new RegExp('^\\d{7}\\s\\(\\d{3}-\\d{4}\\)$','i')},
		{CountryID:'52', CountryCode:'CM', CountryName:'Cameroon', Regex: null},
		{CountryID:'53', CountryCode:'CN', CountryName:'China', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'54', CountryCode:'CO', CountryName:'Colombia', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'55', CountryCode:'CR', CountryName:'Costa Rica', Regex: new RegExp('^\\d{4,5}$','i')},
		{CountryID:'56', CountryCode:'CU', CountryName:'Cuba', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'57', CountryCode:'CV', CountryName:'Cape Verde', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'58', CountryCode:'CX', CountryName:'Christmas Island', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'59', CountryCode:'CY', CountryName:'Cyprus', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'60', CountryCode:'CZ', CountryName:'Czech Republic', Regex: new RegExp('^\\d{5}\\s\\(\\d{3}\\s\\d{2}\\)$','i')},
		{CountryID:'61', CountryCode:'DJ', CountryName:'Djibouti', Regex: null},
		{CountryID:'62', CountryCode:'DM', CountryName:'Dominica', Regex: null},
		{CountryID:'63', CountryCode:'DO', CountryName:'Dominican Republic', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'64', CountryCode:'DZ', CountryName:'Algeria',  Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'65', CountryCode:'EC', CountryName:'Ecuador', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'66', CountryCode:'EE', CountryName:'Estonia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'67', CountryCode:'EG', CountryName:'Egypt', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'68', CountryCode:'EH', CountryName:'Western Sahara', Regex: null},
		{CountryID:'69', CountryCode:'ER', CountryName:'Eritrea', Regex: null},
		{CountryID:'70', CountryCode:'ES', CountryName:'Spain', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'71', CountryCode:'ET', CountryName:'Ethiopia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'72', CountryCode:'FI', CountryName:'Finland', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'73', CountryCode:'FJ', CountryName:'Fiji', Regex: null},
		{CountryID:'74', CountryCode:'FK', CountryName:'Falkland Islands', Regex: new RegExp('^[Ff][Ii][Qq]{2}\\s{0,1}[1][Zz]{2}$','i')},
		{CountryID:'75', CountryCode:'FM', CountryName:'Micronesia', Regex: new RegExp('^\\d{5}(-{1}\\d{4})$','i')},
		{CountryID:'76', CountryCode:'FO', CountryName:'Faroe Islands', Regex: new RegExp('^\\d{3}$','i')},
		{CountryID:'77', CountryCode:'FR', CountryName:'France', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'78', CountryCode:'TF', CountryName:'France (European Territory)', Regex: null},
		{CountryID:'79', CountryCode:'GA', CountryName:'Gabon', Regex: new RegExp('^\\d{2}\\s[a-zA-Z-_ ]\\s\\d{2}$','i')},
		{CountryID:'80', CountryCode:'GB', CountryName:'United Kingdom', Regex: new RegExp('^[A-Za-z]{1,2}\\d([A-Za-z]|\\d)\\d[A-Za-z]{2}$','i')},
		{CountryID:'81', CountryCode:'GD', CountryName:'Grenada', Regex: null},
		{CountryID:'82', CountryCode:'GE', CountryName:'Georgia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'83', CountryCode:'GF', CountryName:'French Guyana', Regex: new RegExp('^973\\d{2}$','i')},
		{CountryID:'84', CountryCode:'GH', CountryName:'Ghana', Regex: null},
		{CountryID:'85', CountryCode:'GI', CountryName:'Gibraltar', Regex: new RegExp('^[Gg][Xx][1]{2}\\s{0,1}[1][Aa]{2}$','i')},
		{CountryID:'86', CountryCode:'GL', CountryName:'Greenland', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'87', CountryCode:'GM', CountryName:'Gambia', Regex: null},
		{CountryID:'88', CountryCode:'GN', CountryName:'Guinea', Regex: null},
		{CountryID:'89', CountryCode:'GP', CountryName:'Guadeloupe (French)', Regex: new RegExp('^971\\d{2}$','i')},
		{CountryID:'90', CountryCode:'GQ', CountryName:'Equatorial Guinea', Regex: null},
		{CountryID:'91', CountryCode:'GR', CountryName:'Greece', Regex: new RegExp('^\\d{3}\\s{0,1}\\d{2}$','i')},
		{CountryID:'92', CountryCode:'GS', CountryName:'S. Georgia & S. Sandwich Islands', Regex: new RegExp('^[Ss][Ii][Qq]{2}\\s{0,1}[1][Zz]{2}$','i')},
		{CountryID:'93', CountryCode:'GT', CountryName:'Guatemala', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'94', CountryCode:'GU', CountryName:'Guam', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'95', CountryCode:'GW', CountryName:'Guinea-Bissau', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'96', CountryCode:'GY', CountryName:'Guyana', Regex: null},
		{CountryID:'97', CountryCode:'HK', CountryName:'Hong Kong', Regex: null},
		{CountryID:'98', CountryCode:'HM', CountryName:'Heard and McDonald Islands', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'99', CountryCode:'HN', CountryName:'Honduras', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'100', CountryCode:'HR', CountryName:'Croatia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'101', CountryCode:'HT', CountryName:'Haiti', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'102', CountryCode:'HU', CountryName:'Hungary', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'103', CountryCode:'ID', CountryName:'Indonesia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'104', CountryCode:'IE', CountryName:'Ireland', Regex: null},
		{CountryID:'105', CountryCode:'IL', CountryName:'Israel', Regex: new RegExp('^\\d{7}$','i')},
		{CountryID:'106', CountryCode:'IN', CountryName:'India', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'107', CountryCode:'IO', CountryName:'British Indian Ocean Territory', Regex: new RegExp('^[Bb]{2}[Nn][Dd]\\s{0,1}[1][Zz]{2}$','i')},
		{CountryID:'108', CountryCode:'IQ', CountryName:'Iraq', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'109', CountryCode:'IR', CountryName:'Iran', Regex: new RegExp('^\\d{5}-\\d{5}$','i')},
		{CountryID:'110', CountryCode:'IS', CountryName:'Iceland', Regex: new RegExp('^\\d{3}$','i')},
		{CountryID:'111', CountryCode:'IT', CountryName:'Italy', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'112', CountryCode:'JM', CountryName:'Jamaica', Regex: new RegExp('^\\d{2}$','i')},
		{CountryID:'113', CountryCode:'JO', CountryName:'Jordan', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'114', CountryCode:'JP', CountryName:'Japan', Regex: new RegExp('^\\d{7}\\s\\(\\d{3}-\\d{4}\\)$','i')},
		{CountryID:'115', CountryCode:'KE', CountryName:'Kenya', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'116', CountryCode:'KG', CountryName:'Kyrgyzstan', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'117', CountryCode:'KH', CountryName:'Cambodia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'118', CountryCode:'KI', CountryName:'Kiribati', Regex: null},
		{CountryID:'119', CountryCode:'KM', CountryName:'Comoros', Regex: null},
		{CountryID:'120', CountryCode:'KN', CountryName:'Saint Kitts and Nevis', Regex: null},
		{CountryID:'121', CountryCode:'KP', CountryName:'North Korea', Regex: null},
		{CountryID:'122', CountryCode:'KR', CountryName:'South Korea', Regex: new RegExp('^\\d{6}\\s\\(\\d{3}-\\d{3}\\)$','i')},
		{CountryID:'123', CountryCode:'KW', CountryName:'Kuwait', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'124', CountryCode:'KY', CountryName:'Cayman Islands', Regex: new RegExp('^[Kk][Yy]\\d[-\\s]{0,1}\\d{4}$','i')},
		{CountryID:'125', CountryCode:'KZ', CountryName:'Kazakhstan', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'126', CountryCode:'LA', CountryName:'Laos', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'127', CountryCode:'LB', CountryName:'Lebanon', Regex: new RegExp('^\\d{4}\\s{0,1}\\d{4}$','i')},
		{CountryID:'128', CountryCode:'LC', CountryName:'Saint Lucia', Regex: null},
		{CountryID:'129', CountryCode:'LI', CountryName:'Liechtenstein', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'130', CountryCode:'LK', CountryName:'Sri Lanka', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'131', CountryCode:'LR', CountryName:'Liberia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'132', CountryCode:'LS', CountryName:'Lesotho', Regex: new RegExp('^\\d{3}$','i')},
		{CountryID:'133', CountryCode:'LT', CountryName:'Lithuania', Regex: new RegExp('^[Ll][Tt][- ]{0,1}\\d{5}$','i')},
		{CountryID:'134', CountryCode:'LU', CountryName:'Luxembourg', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'135', CountryCode:'LV', CountryName:'Latvia', Regex: new RegExp('^[Ll][Vv][- ]{0,1}\\d{4}$','i')},
		{CountryID:'136', CountryCode:'LY', CountryName:'Libya', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'137', CountryCode:'MA', CountryName:'Morocco', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'138', CountryCode:'MC', CountryName:'Monaco', Regex: new RegExp('^980\\d{2}$','i')},
		{CountryID:'139', CountryCode:'MD', CountryName:'Moldova', Regex: new RegExp('^[Mm][Dd][- ]{0,1}\\d{4}$','i')},
		{CountryID:'140', CountryCode:'MG', CountryName:'Madagascar', Regex: new RegExp('^\\d{3}$','i')},
		{CountryID:'141', CountryCode:'MH', CountryName:'Marshall Islands', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'142', CountryCode:'MK', CountryName:'Macedonia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'143', CountryCode:'ML', CountryName:'Mali', Regex: null},
		{CountryID:'144', CountryCode:'MM', CountryName:'Burma (Myanmar)', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'145', CountryCode:'MN', CountryName:'Mongolia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'146', CountryCode:'MO', CountryName:'Macau', Regex: null},
		{CountryID:'147', CountryCode:'MP', CountryName:'Northern Mariana Islands', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'148', CountryCode:'MQ', CountryName:'Martinique (French)', Regex: new RegExp('^972\\d{2}$','i')},
		{CountryID:'149', CountryCode:'MR', CountryName:'Mauritania', Regex: null},
		{CountryID:'150', CountryCode:'MS', CountryName:'Montserrat', Regex: new RegExp('^[Mm][Ss][Rr]\\s{0,1}\\d{4}$','i')},
		{CountryID:'151', CountryCode:'MT', CountryName:'Malta', Regex: new RegExp('^[A-Za-z]{3}\\s{0,1}\\d{4}$','i')},
		{CountryID:'152', CountryCode:'MU', CountryName:'Mauritius', Regex: null},
		{CountryID:'153', CountryCode:'MV', CountryName:'Maldives', Regex: new RegExp('^\\d{4,5}$','i')},
		{CountryID:'154', CountryCode:'MW', CountryName:'Malawi', Regex: null},
		{CountryID:'155', CountryCode:'MY', CountryName:'Malaysia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'156', CountryCode:'MZ', CountryName:'Mozambique', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'157', CountryCode:'NA', CountryName:'Namibia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'158', CountryCode:'NC', CountryName:'New Caledonia', Regex: new RegExp('^988\\d{2}$','i')},
		{CountryID:'159', CountryCode:'NE', CountryName:'Niger', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'160', CountryCode:'NF', CountryName:'Norfolk Island', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'161', CountryCode:'NG', CountryName:'Nigeria', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'162', CountryCode:'NI', CountryName:'Nicaragua', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'163', CountryCode:'NL', CountryName:'Netherlands', Regex: new RegExp('^\\d{4}\\s{0,1}[A-Za-z]{2}$','i')},
		{CountryID:'164', CountryCode:'NP', CountryName:'Nepal', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'165', CountryCode:'NR', CountryName:'Nauru', Regex: null},
		{CountryID:'166', CountryCode:'', CountryName:'Neutral Zone', Regex: null},
		{CountryID:'167', CountryCode:'NU', CountryName:'Niue', Regex: null},
		{CountryID:'168', CountryCode:'NZ', CountryName:'New Zealand', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'169', CountryCode:'OM', CountryName:'Oman', Regex: new RegExp('^\\d{3}$','i')},
		{CountryID:'170', CountryCode:'PA', CountryName:'Panama', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'171', CountryCode:'PE', CountryName:'Peru', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'172', CountryCode:'PF', CountryName:'French Polynesia', Regex: new RegExp('^987\\d{2}$','i')},
		{CountryID:'173', CountryCode:'PG', CountryName:'Papua New Guinea', Regex: new RegExp('^\\d{3}$','i')},
		{CountryID:'174', CountryCode:'PH', CountryName:'Philippines', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'175', CountryCode:'PK', CountryName:'Pakistan', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'176', CountryCode:'PM', CountryName:'Saint Pierre and Miquelon', Regex: new RegExp('^97500$','i')},
		{CountryID:'177', CountryCode:'PN', CountryName:'Pitcairn Islands', Regex: new RegExp('^[Pp][Cc][Rr][Nn]\\s{0,1}[1][Zz]{2}$','i')},
		{CountryID:'178', CountryCode:'PR', CountryName:'Puerto Rico', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'179', CountryCode:'PT', CountryName:'Portugal', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'180', CountryCode:'PW', CountryName:'Palau', Regex: new RegExp('^\\b\\d{5}\\b(?:[- ]{1}\\d{4})?$','i')},
		{CountryID:'181', CountryCode:'PY', CountryName:'Paraguay', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'182', CountryCode:'QA', CountryName:'Qatar', Regex: null},
		{CountryID:'183', CountryCode:'RE', CountryName:'Reunion (French)', Regex: new RegExp('^974\\d{2}$','i')},
		{CountryID:'184', CountryCode:'RO', CountryName:'Romania', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'185', CountryCode:'RU', CountryName:'Russia', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'186', CountryCode:'RW', CountryName:'Rwanda', Regex: null},
		{CountryID:'187', CountryCode:'SA', CountryName:'Saudi Arabia', Regex: new RegExp('^\\d{5}(-{1}\\d{4})?$','i')},
		{CountryID:'188', CountryCode:'SB', CountryName:'Solomon Islands', Regex: null},
		{CountryID:'189', CountryCode:'SC', CountryName:'Seychelles', Regex: null},
		{CountryID:'190', CountryCode:'SD', CountryName:'Sudan', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'191', CountryCode:'SE', CountryName:'Sweden', Regex: new RegExp('^\\d{5}\\s\\(\\d{3}\\s\\d{2}\\)$','i')},
		{CountryID:'192', CountryCode:'SG', CountryName:'Singapore', Regex: new RegExp('^\\d{2}|\\d{4}|\\d{6}$','i')},
		{CountryID:'193', CountryCode:'SH', CountryName:'Saint Helena', Regex: new RegExp('^[Ss][Tt][Hh][Ll]\\s{0,1}[1][Zz]{2}$','i')},
		{CountryID:'194', CountryCode:'SI', CountryName:'Slovenia', Regex: new RegExp('^([Ss][Ii][- ]{0,1}){0,1}\\d{4}$','i')},
		{CountryID:'195', CountryCode:'SJ', CountryName:'Svalbard', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'196', CountryCode:'SK', CountryName:'Slovakia', Regex: new RegExp('^\\d{5}\\s\\(\\d{3}\\s\\d{2}\\)$','i')},
		{CountryID:'197', CountryCode:'SL', CountryName:'Sierra Leone', Regex: null},
		{CountryID:'198', CountryCode:'SM', CountryName:'San Marino', Regex: new RegExp('^4789\\d$','i')},
		{CountryID:'199', CountryCode:'SN', CountryName:'Senegal', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'200', CountryCode:'SO', CountryName:'Somalia', Regex: null},
		{CountryID:'201', CountryCode:'SR', CountryName:'Suriname', Regex: null},
		{CountryID:'202', CountryCode:'ST', CountryName:'Sao Tome and Principe', Regex: null},
		{CountryID:'203', CountryCode:'SV', CountryName:'El Salvador', Regex: new RegExp('^1101$','i')},
		{CountryID:'204', CountryCode:'SY', CountryName:'Syria', Regex: null},
		{CountryID:'205', CountryCode:'SZ', CountryName:'Swaziland', Regex: new RegExp('^[A-Za-z]\\d{3}$','i')},
		{CountryID:'206', CountryCode:'TC', CountryName:'Turks and Caicos Islands', Regex: new RegExp('^[Tt][Kk][Cc][Aa]\\s{0,1}[1][Zz]{2}$','i')},
		{CountryID:'207', CountryCode:'TD', CountryName:'Chad', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'208', CountryCode:'TF', CountryName:'French Southern Territories', Regex: null},
		{CountryID:'209', CountryCode:'TG', CountryName:'Togo', Regex: null},
		{CountryID:'210', CountryCode:'TH', CountryName:'Thailand', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'211', CountryCode:'TJ', CountryName:'Tajikistan', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'212', CountryCode:'TK', CountryName:'Tokelau', Regex: null},
		{CountryID:'213', CountryCode:'TM', CountryName:'Turkmenistan', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'214', CountryCode:'TN', CountryName:'Tunisia', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'215', CountryCode:'TO', CountryName:'Tonga', Regex: null},
		{CountryID:'216', CountryCode:'TP', CountryName:'East Timor', Regex: null},
		{CountryID:'217', CountryCode:'TR', CountryName:'Turkey', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'218', CountryCode:'TT', CountryName:'Trinidad and Tobago', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'219', CountryCode:'TV', CountryName:'Tuvalu', Regex: null},
		{CountryID:'220', CountryCode:'TW', CountryName:'Taiwan', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'221', CountryCode:'TZ', CountryName:'Tanzania', Regex: null},
		{CountryID:'222', CountryCode:'UA', CountryName:'Ukraine', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'223', CountryCode:'UG', CountryName:'Uganda', Regex: null},
		{CountryID:'224', CountryCode:'UM', CountryName:'USA Minor Outlying Islands', Regex: null},
		{CountryID:'225', CountryCode:'UY', CountryName:'Uruguay', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'226', CountryCode:'UZ', CountryName:'Uzbekistan', Regex: new RegExp('^\\d{3} \\d{3}$','i')},
		{CountryID:'227', CountryCode:'VA', CountryName:'Vatican City', Regex: new RegExp('^120$','i')},
		{CountryID:'228', CountryCode:'VC', CountryName:'Saint Vincent and the Grenadines', Regex: new RegExp('^[Vv][Cc]\\d{4}$','i')},
		{CountryID:'229', CountryCode:'VE', CountryName:'Venezuela', Regex: new RegExp('^\\d{4}(\\s[a-zA-Z]{1})?$','i')},
		{CountryID:'230', CountryCode:'VG', CountryName:'British Virgin Islands', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'231', CountryCode:'VI', CountryName:'US Virgin Islands', Regex: new RegExp('^[Vv][Gg]\\d{4}$','i')},
		{CountryID:'232', CountryCode:'VN', CountryName:'Vietnam', Regex: new RegExp('^\\d{6}$','i')},
		{CountryID:'233', CountryCode:'VU', CountryName:'Vanuatu', Regex: null},
		{CountryID:'234', CountryCode:'WF', CountryName:'Wallis and Futuna', Regex: new RegExp('^986\\d{2}$','i')},
		{CountryID:'235', CountryCode:'WS', CountryName:'Samoa', Regex: null},
		{CountryID:'236', CountryCode:'YE', CountryName:'Yemen', Regex: null},
		{CountryID:'237', CountryCode:'YT', CountryName:'Mayotte', Regex: new RegExp('^976\\d{2}$','i')},
		{CountryID:'238', CountryCode:'ZA', CountryName:'South Africa', Regex: new RegExp('^\\d{4}$','i')},
		{CountryID:'239', CountryCode:'ZM', CountryName:'Zambia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'240', CountryCode:'ZW', CountryName:'Zimbabwe', Regex: null},
		{CountryID:'241', CountryCode:'RS', CountryName:'Serbia', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'242', CountryCode:'ME', CountryName:'Montenegro', Regex: new RegExp('^\\d{5}$','i')},
		{CountryID:'243', CountryCode:'IM', CountryName:'Isle of Man', Regex: new RegExp('^[Ii[Mm]\\d{1,2}\\s\\d\\[A-Z]{2}$','i')},
		{CountryID:'244', CountryCode:'JE', CountryName:'Jersey', Regex: new RegExp('^[Jj][Ee]\\d\\s{0,1}\\d[A-Za-z]{2}$','i')},
		{CountryID:'245', CountryCode:'BL', CountryName:'Saint Barthelemy', Regex: new RegExp('^97133$','i')},
		{CountryID:'246', CountryCode:'MF', CountryName:'Saint Martin', Regex: new RegExp('^97150$','i')},
		{CountryID:'247', CountryCode:'TP', CountryName:'Timor-Leste', Regex: null}
	],

	CCTYPE_MAP: [
		{ Prefix:'34', TypeID:'6'}, //American Express
		{ Prefix:'37', TypeID:'6'},
		{ Prefix:'6011', TypeID:'3'}, //Discover
		{ Prefix:'622126-622925', TypeID:'3'},
		{ Prefix:'644-649', TypeID:'3'},
		{ Prefix:'65', TypeID:'3'},
		{ Prefix:'50-55', TypeID:'4'}, //Mastercard
		{ Prefix:'4', TypeID:'5'}, //Visa
	],

	SHIPMETHOD_MAP: [
		{ NSID: -3, Name: 'Customer Specified Shipping Account', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: -3, Name: 'Customer Specified Shipping Account', Subsidiary: 'White Labs Hong Kong', CustomerVisible: false, USinternational: false, SubsidiaryID: 5},
		{ NSID: -3, Name: 'Customer Specified Shipping Account', Subsidiary: 'White Labs Copenhagen ApS', CustomerVisible: false, USinternational: false, SubsidiaryID: 7},
		{ NSID: 13321, Name: 'DHL International', Subsidiary: 'White Labs Hong Kong', CustomerVisible: false, USinternational: true, SubsidiaryID: 5},
		{ NSID: 2841, Name: 'DHL International Economy', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2842, Name: 'DHL International Priority', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: true, SubsidiaryID: 2},
		{ NSID: 3609, Name: 'Exempt', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2789, Name: '2 Day (Recomended Retail)', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2}, // Fedex 2Day
		{ NSID: 2790, Name: 'FedEx Express Saver', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2791, Name: 'Ground (Recommended Non-Yeast)', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2}, // Fedex Ground
		{ NSID: 2792, Name: 'FedEx Home Delivery', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2843, Name: 'FedEx International Economy', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 3475, Name: 'FedEx International Ground', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2844, Name: 'FedEx International Priority', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: true, SubsidiaryID: 2},
		{ NSID: 2787, Name: 'Priority Overnight', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2}, // FedEx Priority Overnight
		{ NSID: 2788, Name: 'Standard Overnight', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2},
		{ NSID: 13320, Name: 'Fedex International', Subsidiary: 'White Labs Hong Kong', CustomerVisible: false, USinternational: false, SubsidiaryID: 5},
		{ NSID: 13722, Name: 'Local Delivery - HK', Subsidiary: 'White Labs Hong Kong', CustomerVisible: true, USinternational: false, SubsidiaryID: 5},
		{ NSID: 2845, Name: 'OnTrac One Day (CA, AZ, NV)', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 13299, Name: 'Third Party Domestic Flat Rate', Subsidiary: 'White Labs Copenhagen ApS', CustomerVisible: true, USinternational: false, SubsidiaryID: 7},
		{ NSID: 13300, Name: 'Third Party Non Domestic Customers', Subsidiary: 'White Labs Copenhagen ApS', CustomerVisible: false, USinternational: true, SubsidiaryID: 7},
		{ NSID: 2794, Name: 'UPS 2nd Day Air A.M.', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 4, Name: 'UPS Ground', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2848, Name: 'UPS Int\'l Economy', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2849, Name: 'UPS Int\'l Priority', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2846, Name: 'UPS Overnight', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2847, Name: 'UPS Worldwide Express', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 2850, Name: 'USPS Priority', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 3471, Name: 'Pick Up - Davis', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 13301, Name: 'Pick Up - HK', Subsidiary: 'White Labs Hong Kong', CustomerVisible: true, USinternational: true, SubsidiaryID: 5},
		{ NSID: 13332, Name: 'Pick Up AVL-Go Green', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 13680, Name: 'Pick Up CPH', Subsidiary: 'White Labs Copenhagen ApS', CustomerVisible: true, USinternational: true, SubsidiaryID: 7},
		{ NSID: 5163, Name: 'Pick Up Hong Kong', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 3511, Name: 'Pick Up SD-Go Green', Subsidiary: 'White Labs Inc', CustomerVisible: false, USinternational: false, SubsidiaryID: 2},
		{ NSID: 3472, Name: 'Pick Up - Asheville', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2},
		{ NSID: 3470, Name: 'Pick Up - Boulder', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2},
		{ NSID: 3469, Name: 'Pick Up - San Diego', Subsidiary: 'White Labs Inc', CustomerVisible: true, USinternational: false, SubsidiaryID: 2},
	],

	SALESCATEGORY: [
		[2, 3, 4, 5, 6, 7, 8], //Yeast, 0
		[3], //Ale, 1
		[5], //Lager, 2
		[6], //Wine, 3
		[7], //Distilling, 4
		[8], //Belgian, 5
		[4], //Wild Yeast, 6
		[32], //Vault, 7
		[29, 30], //Enzymes & Nutrients, 8
		[29], //Enzymes, 9
		[30], //Nutrients, 10
		[24, 25, 26, 16, 17, 18, 19, 23, 20, 21], //Lab Services and Supplies, 11
		[24, 25, 26], //Analytical Services, 12
		[16, 17, 18, 19, 23, 20, 21], //Lab Supplies, 13
		[28], //Education, 14
		[27, 10],  //Merchandise, 15
		[2, 3, 4, 5, 6, 7, 8, 32] //All yeast, 16
	],

	USEmbargo: ['CN', 'KP', 'IR', 'RU', 'SY', 'CU'],

	DAYOFWEEK: {
		0: 'Sunday',
		1: 'Monday',
		2: 'Tuesday',
		3: 'Wednesday',
		4: 'Thursday',
		5: 'Friday',
		6: 'Saturday',
	}
};

module.exports = SalesLib;