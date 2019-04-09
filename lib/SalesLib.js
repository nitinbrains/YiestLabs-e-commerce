var SalesLib = {
    //Exported For External Use
    CURRENCY_MAP: [
        { id: 1, name: "US Dollar", symbol: "$", subsidiary: 2 },
        { id: 2, name: "British pound", symbol: "£", subsidiary: 2 },
        { id: 3, name: "Canadian Dollar", symbol: "Can$", subsidiary: 2 },
        { id: 4, name: "EUR", symbol: "€", subsidiary: 7 },
        { id: 5, name: "Hong Kong Dollar", symbol: "HK$", subsidiary: 5 },
        { id: 6, name: "DKK", symbol: "Kr.", subsidiary: 7 }
    ],

    POSItems: [
        1908, //MKTBEERBROCHUREPACK50
        4407 //PACKAGEHB6
    ],

    YeastEssentials: [13873, 13901, 13880, 13905, 13874, 13902],

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
        { day: 1, month: 1 }, //new years day
        { day: 25, month: 12 }, //christmas
        { day: 4, month: 7 }, //4th of july
        { day: -1, month: 5, week: -1, dayofweek: 1 }, //memorial day
        { day: -1, month: 11, week: 4, dayofweek: 4 }, //thanksgiving
        { day: -1, month: 9, week: 1, dayofweek: 1 } //labor day
    ],

    HKHOLIDAYS: [{ day: 30, month: 3 }, { day: 31, month: 3 }, { day: 2, month: 4 }, { day: 5, month: 4 }],

    CPHHOLIDAYS: [
        { day: 1, month: 1 },
        { day: 29, month: 3 },
        { day: 30, month: 3 },
        { day: 2, month: 4 },
        { day: 27, month: 4 },
        { day: 10, month: 5 },
        { day: 21, month: 5 },
        { day: 24, month: 12 },
        { day: 25, month: 12 },
        { day: 26, month: 12 }
    ],

    CUSTOMER_CATEGORY_MAP: ["Wholesaler-Pro", "Retailer", "End User", "Pro Brewery", "Pro Winery", "Pro Distillery", "Wholesaler-Homebrew"],

    COUNTRY_MAP: [
        { id: "US", name: "United States", Regex: new RegExp("^\\b\\d{5}\\b(?:[- ]{1}\\d{4})?$", "i") },
        { id: "CA", name: "Canada", Regex: new RegExp("^(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\s{0,1}\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d$", "i") },
        { id: "MX", name: "Mexico", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "GB", name: "United Kingdom", Regex: new RegExp("^[A-Za-z]{1,2}\\d([A-Za-z]|\\d)\\d[A-Za-z]{2}$", "i") },
        { id: "DK", name: "Denmark", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "AU", name: "Australia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "DE", name: "Germany", Regex: new RegExp("^\\d{2}|\\d{4}|\\d{5}$", "i") },
        { id: "NO", name: "Norway", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "PL", name: "Poland", Regex: new RegExp("^\\d{2}[- ]{0,1}\\d{3}$", "i") },
        { id: "AD", name: "Andorra", Regex: new RegExp("^[Aa][Dd]\\d{3}$", "i") },
        { id: "AE", name: "United Arab Emirates", Regex: null },
        { id: "AF", name: "Afghanistan", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "AG", name: "Antigua and Barbuda", Regex: null },
        { id: "AI", name: "Anguilla", Regex: new RegExp("^[Aa][I][-][2][6][4][0]$", "i") },
        { id: "AL", name: "Albania", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "AM", name: "Armenia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "AN", name: "Netherlands Antilles", Regex: null },
        { id: "AO", name: "Angola", Regex: null },
        { id: "AQ", name: "Antarctica", Regex: null },
        { id: "AR", name: "Argentina", Regex: new RegExp("^\\d{4}|[A-Za-z]\\d{4}[a-zA-Z]{3}$", "i") },
        { id: "AS", name: "American Samoa", Regex: new RegExp("^\\d{5}(-{1}\\d{4,6})$", "i") },
        { id: "AT", name: "Austria", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "AW", name: "Aruba", Regex: null },
        { id: "AZ", name: "Azerbaijan", Regex: new RegExp("^[Aa][Zz]\\d{4}$", "i") },
        { id: "BA", name: "Bosnia and Herzegovina", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "BB", name: "Barbados", Regex: new RegExp("^[Aa][Zz]\\d{5}$", "i") },
        { id: "BD", name: "Bangladesh", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "BE", name: "Belgium", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "BF", name: "Burkina Faso", Regex: null },
        { id: "BG", name: "Bulgaria", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "BH", name: "Bahrain", Regex: new RegExp("^\\d{3,4}$", "i") },
        { id: "BI", name: "Burundi", Regex: null },
        { id: "BJ", name: "Benin", Regex: null },
        { id: "BM", name: "Bermuda", Regex: new RegExp("^[A-Za-z]{2}\\s([A-Za-z]{2}|\\d{2})$", "i") },
        { id: "BN", name: "Brunei", Regex: new RegExp("^[A-Za-z]{2}\\d{4}$", "i") },
        { id: "BO", name: "Bolivia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "BR", name: "Brazil", Regex: new RegExp("^\\d{5}-\\d{3}$", "i") },
        { id: "BS", name: "Bahamas", Regex: null },
        { id: "BT", name: "Bhutan", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "BV", name: "Bouvet Island", Regex: null },
        { id: "BW", name: "Botswana", Regex: null },
        { id: "BY", name: "Belarus", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "BZ", name: "Belize", Regex: null },
        { id: "CC", name: "Cocos (Keeling) Islands", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "CD", name: "Democratic Republic of the Congo", Regex: null },
        { id: "CF", name: "Central African Republic", Regex: null },
        { id: "CG", name: "Republic of the Congo", Regex: null },
        { id: "CH", name: "Switzerland", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "CI", name: "Ivory Coast", Regex: null },
        { id: "CK", name: "Cook Islands", Regex: null },
        { id: "CL", name: "Chile", Regex: new RegExp("^\\d{7}\\s\\(\\d{3}-\\d{4}\\)$", "i") },
        { id: "CM", name: "Cameroon", Regex: null },
        { id: "CN", name: "China", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "CO", name: "Colombia", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "CR", name: "Costa Rica", Regex: new RegExp("^\\d{4,5}$", "i") },
        { id: "CU", name: "Cuba", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "CV", name: "Cape Verde", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "CX", name: "Christmas Island", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "CY", name: "Cyprus", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "CZ", name: "Czech Republic", Regex: new RegExp("^\\d{5}\\s\\(\\d{3}\\s\\d{2}\\)$", "i") },
        { id: "DJ", name: "Djibouti", Regex: null },
        { id: "DM", name: "Dominica", Regex: null },
        { id: "DO", name: "Dominican Republic", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "DZ", name: "Algeria", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "EC", name: "Ecuador", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "EE", name: "Estonia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "EG", name: "Egypt", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "EH", name: "Western Sahara", Regex: null },
        { id: "ER", name: "Eritrea", Regex: null },
        { id: "ES", name: "Spain", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "ET", name: "Ethiopia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "FI", name: "Finland", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "FJ", name: "Fiji", Regex: null },
        { id: "FK", name: "Falkland Islands", Regex: new RegExp("^[Ff][Ii][Qq]{2}\\s{0,1}[1][Zz]{2}$", "i") },
        { id: "FM", name: "Micronesia", Regex: new RegExp("^\\d{5}(-{1}\\d{4})$", "i") },
        { id: "FO", name: "Faroe Islands", Regex: new RegExp("^\\d{3}$", "i") },
        { id: "FR", name: "France", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "TF", name: "France (European Territory)", Regex: null },
        { id: "GA", name: "Gabon", Regex: new RegExp("^\\d{2}\\s[a-zA-Z-_ ]\\s\\d{2}$", "i") },
        { id: "GB", name: "United Kingdom", Regex: new RegExp("^[A-Za-z]{1,2}\\d([A-Za-z]|\\d)\\d[A-Za-z]{2}$", "i") },
        { id: "GD", name: "Grenada", Regex: null },
        { id: "GE", name: "Georgia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "GF", name: "French Guyana", Regex: new RegExp("^973\\d{2}$", "i") },
        { id: "GH", name: "Ghana", Regex: null },
        { id: "GI", name: "Gibraltar", Regex: new RegExp("^[Gg][Xx][1]{2}\\s{0,1}[1][Aa]{2}$", "i") },
        { id: "GL", name: "Greenland", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "GM", name: "Gambia", Regex: null },
        { id: "GN", name: "Guinea", Regex: null },
        { id: "GP", name: "Guadeloupe (French)", Regex: new RegExp("^971\\d{2}$", "i") },
        { id: "GQ", name: "Equatorial Guinea", Regex: null },
        { id: "GR", name: "Greece", Regex: new RegExp("^\\d{3}\\s{0,1}\\d{2}$", "i") },
        { id: "GS", name: "S. Georgia & S. Sandwich Islands", Regex: new RegExp("^[Ss][Ii][Qq]{2}\\s{0,1}[1][Zz]{2}$", "i") },
        { id: "GT", name: "Guatemala", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "GU", name: "Guam", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "GW", name: "Guinea-Bissau", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "GY", name: "Guyana", Regex: null },
        { id: "HK", name: "Hong Kong", Regex: null },
        { id: "HM", name: "Heard and McDonald Islands", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "HN", name: "Honduras", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "HR", name: "Croatia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "HT", name: "Haiti", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "HU", name: "Hungary", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "ID", name: "Indonesia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "IE", name: "Ireland", Regex: null },
        { id: "IL", name: "Israel", Regex: new RegExp("^\\d{7}$", "i") },
        { id: "IN", name: "India", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "IO", name: "British Indian Ocean Territory", Regex: new RegExp("^[Bb]{2}[Nn][Dd]\\s{0,1}[1][Zz]{2}$", "i") },
        { id: "IQ", name: "Iraq", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "IR", name: "Iran", Regex: new RegExp("^\\d{5}-\\d{5}$", "i") },
        { id: "IS", name: "Iceland", Regex: new RegExp("^\\d{3}$", "i") },
        { id: "IT", name: "Italy", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "JM", name: "Jamaica", Regex: new RegExp("^\\d{2}$", "i") },
        { id: "JO", name: "Jordan", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "JP", name: "Japan", Regex: new RegExp("^\\d{7}\\s\\(\\d{3}-\\d{4}\\)$", "i") },
        { id: "KE", name: "Kenya", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "KG", name: "Kyrgyzstan", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "KH", name: "Cambodia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "KI", name: "Kiribati", Regex: null },
        { id: "KM", name: "Comoros", Regex: null },
        { id: "KN", name: "Saint Kitts and Nevis", Regex: null },
        { id: "KP", name: "North Korea", Regex: null },
        { id: "KR", name: "South Korea", Regex: new RegExp("^\\d{6}\\s\\(\\d{3}-\\d{3}\\)$", "i") },
        { id: "KW", name: "Kuwait", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "KY", name: "Cayman Islands", Regex: new RegExp("^[Kk][Yy]\\d[-\\s]{0,1}\\d{4}$", "i") },
        { id: "KZ", name: "Kazakhstan", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "LA", name: "Laos", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "LB", name: "Lebanon", Regex: new RegExp("^\\d{4}\\s{0,1}\\d{4}$", "i") },
        { id: "LC", name: "Saint Lucia", Regex: null },
        { id: "LI", name: "Liechtenstein", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "LK", name: "Sri Lanka", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "LR", name: "Liberia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "LS", name: "Lesotho", Regex: new RegExp("^\\d{3}$", "i") },
        { id: "LT", name: "Lithuania", Regex: new RegExp("^[Ll][Tt][- ]{0,1}\\d{5}$", "i") },
        { id: "LU", name: "Luxembourg", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "LV", name: "Latvia", Regex: new RegExp("^[Ll][Vv][- ]{0,1}\\d{4}$", "i") },
        { id: "LY", name: "Libya", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MA", name: "Morocco", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MC", name: "Monaco", Regex: new RegExp("^980\\d{2}$", "i") },
        { id: "MD", name: "Moldova", Regex: new RegExp("^[Mm][Dd][- ]{0,1}\\d{4}$", "i") },
        { id: "MG", name: "Madagascar", Regex: new RegExp("^\\d{3}$", "i") },
        { id: "MH", name: "Marshall Islands", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MK", name: "Macedonia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "ML", name: "Mali", Regex: null },
        { id: "MM", name: "Burma (Myanmar)", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MN", name: "Mongolia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MO", name: "Macau", Regex: null },
        { id: "MP", name: "Northern Mariana Islands", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MQ", name: "Martinique (French)", Regex: new RegExp("^972\\d{2}$", "i") },
        { id: "MR", name: "Mauritania", Regex: null },
        { id: "MS", name: "Montserrat", Regex: new RegExp("^[Mm][Ss][Rr]\\s{0,1}\\d{4}$", "i") },
        { id: "MT", name: "Malta", Regex: new RegExp("^[A-Za-z]{3}\\s{0,1}\\d{4}$", "i") },
        { id: "MU", name: "Mauritius", Regex: null },
        { id: "MV", name: "Maldives", Regex: new RegExp("^\\d{4,5}$", "i") },
        { id: "MW", name: "Malawi", Regex: null },
        { id: "MY", name: "Malaysia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "MZ", name: "Mozambique", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "NA", name: "Namibia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "NC", name: "New Caledonia", Regex: new RegExp("^988\\d{2}$", "i") },
        { id: "NE", name: "Niger", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "NF", name: "Norfolk Island", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "NG", name: "Nigeria", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "NI", name: "Nicaragua", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "NL", name: "Netherlands", Regex: new RegExp("^\\d{4}\\s{0,1}[A-Za-z]{2}$", "i") },
        { id: "NP", name: "Nepal", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "NR", name: "Nauru", Regex: null },
        { id: "", name: "Neutral Zone", Regex: null },
        { id: "NU", name: "Niue", Regex: null },
        { id: "NZ", name: "New Zealand", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "OM", name: "Oman", Regex: new RegExp("^\\d{3}$", "i") },
        { id: "PA", name: "Panama", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "PE", name: "Peru", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "PF", name: "French Polynesia", Regex: new RegExp("^987\\d{2}$", "i") },
        { id: "PG", name: "Papua New Guinea", Regex: new RegExp("^\\d{3}$", "i") },
        { id: "PH", name: "Philippines", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "PK", name: "Pakistan", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "PM", name: "Saint Pierre and Miquelon", Regex: new RegExp("^97500$", "i") },
        { id: "PN", name: "Pitcairn Islands", Regex: new RegExp("^[Pp][Cc][Rr][Nn]\\s{0,1}[1][Zz]{2}$", "i") },
        { id: "PR", name: "Puerto Rico", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "PT", name: "Portugal", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "PW", name: "Palau", Regex: new RegExp("^\\b\\d{5}\\b(?:[- ]{1}\\d{4})?$", "i") },
        { id: "PY", name: "Paraguay", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "QA", name: "Qatar", Regex: null },
        { id: "RE", name: "Reunion (French)", Regex: new RegExp("^974\\d{2}$", "i") },
        { id: "RO", name: "Romania", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "RU", name: "Russia", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "RW", name: "Rwanda", Regex: null },
        { id: "SA", name: "Saudi Arabia", Regex: new RegExp("^\\d{5}(-{1}\\d{4})?$", "i") },
        { id: "SB", name: "Solomon Islands", Regex: null },
        { id: "SC", name: "Seychelles", Regex: null },
        { id: "SD", name: "Sudan", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "SE", name: "Sweden", Regex: new RegExp("^\\d{5}\\s\\(\\d{3}\\s\\d{2}\\)$", "i") },
        { id: "SG", name: "Singapore", Regex: new RegExp("^\\d{2}|\\d{4}|\\d{6}$", "i") },
        { id: "SH", name: "Saint Helena", Regex: new RegExp("^[Ss][Tt][Hh][Ll]\\s{0,1}[1][Zz]{2}$", "i") },
        { id: "SI", name: "Slovenia", Regex: new RegExp("^([Ss][Ii][- ]{0,1}){0,1}\\d{4}$", "i") },
        { id: "SJ", name: "Svalbard", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "SK", name: "Slovakia", Regex: new RegExp("^\\d{5}\\s\\(\\d{3}\\s\\d{2}\\)$", "i") },
        { id: "SL", name: "Sierra Leone", Regex: null },
        { id: "SM", name: "San Marino", Regex: new RegExp("^4789\\d$", "i") },
        { id: "SN", name: "Senegal", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "SO", name: "Somalia", Regex: null },
        { id: "SR", name: "Suriname", Regex: null },
        { id: "ST", name: "Sao Tome and Principe", Regex: null },
        { id: "SV", name: "El Salvador", Regex: new RegExp("^1101$", "i") },
        { id: "SY", name: "Syria", Regex: null },
        { id: "SZ", name: "Swaziland", Regex: new RegExp("^[A-Za-z]\\d{3}$", "i") },
        { id: "TC", name: "Turks and Caicos Islands", Regex: new RegExp("^[Tt][Kk][Cc][Aa]\\s{0,1}[1][Zz]{2}$", "i") },
        { id: "TD", name: "Chad", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "TF", name: "French Southern Territories", Regex: null },
        { id: "TG", name: "Togo", Regex: null },
        { id: "TH", name: "Thailand", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "TJ", name: "Tajikistan", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "TK", name: "Tokelau", Regex: null },
        { id: "TM", name: "Turkmenistan", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "TN", name: "Tunisia", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "TO", name: "Tonga", Regex: null },
        { id: "TP", name: "East Timor", Regex: null },
        { id: "TR", name: "Turkey", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "TT", name: "Trinidad and Tobago", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "TV", name: "Tuvalu", Regex: null },
        { id: "TW", name: "Taiwan", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "TZ", name: "Tanzania", Regex: null },
        { id: "UA", name: "Ukraine", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "UG", name: "Uganda", Regex: null },
        { id: "UM", name: "USA Minor Outlying Islands", Regex: null },
        { id: "UY", name: "Uruguay", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "UZ", name: "Uzbekistan", Regex: new RegExp("^\\d{3} \\d{3}$", "i") },
        { id: "VA", name: "Vatican City", Regex: new RegExp("^120$", "i") },
        { id: "VC", name: "Saint Vincent and the Grenadines", Regex: new RegExp("^[Vv][Cc]\\d{4}$", "i") },
        { id: "VE", name: "Venezuela", Regex: new RegExp("^\\d{4}(\\s[a-zA-Z]{1})?$", "i") },
        { id: "VG", name: "British Virgin Islands", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "VI", name: "US Virgin Islands", Regex: new RegExp("^[Vv][Gg]\\d{4}$", "i") },
        { id: "VN", name: "Vietnam", Regex: new RegExp("^\\d{6}$", "i") },
        { id: "VU", name: "Vanuatu", Regex: null },
        { id: "WF", name: "Wallis and Futuna", Regex: new RegExp("^986\\d{2}$", "i") },
        { id: "WS", name: "Samoa", Regex: null },
        { id: "YE", name: "Yemen", Regex: null },
        { id: "YT", name: "Mayotte", Regex: new RegExp("^976\\d{2}$", "i") },
        { id: "ZA", name: "South Africa", Regex: new RegExp("^\\d{4}$", "i") },
        { id: "ZM", name: "Zambia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "ZW", name: "Zimbabwe", Regex: null },
        { id: "RS", name: "Serbia", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "ME", name: "Montenegro", Regex: new RegExp("^\\d{5}$", "i") },
        { id: "IM", name: "Isle of Man", Regex: new RegExp("^[Ii[Mm]\\d{1,2}\\s\\d\\[A-Z]{2}$", "i") },
        { id: "JE", name: "Jersey", Regex: new RegExp("^[Jj][Ee]\\d\\s{0,1}\\d[A-Za-z]{2}$", "i") },
        { id: "BL", name: "Saint Barthelemy", Regex: new RegExp("^97133$", "i") },
        { id: "MF", name: "Saint Martin", Regex: new RegExp("^97150$", "i") },
        { id: "TP", name: "Timor-Leste", Regex: null }
    ],

    CCTYPE_MAP: [
        { Prefix: "34", TypeID: "6" }, //American Express
        { Prefix: "37", TypeID: "6" },
        { Prefix: "6011", TypeID: "3" }, //Discover
        { Prefix: "622126-622925", TypeID: "3" },
        { Prefix: "644-649", TypeID: "3" },
        { Prefix: "65", TypeID: "3" },
        { Prefix: "50-55", TypeID: "4" }, //Mastercard
        { Prefix: "4", TypeID: "5" } //Visa
    ],

    SHIPMETHOD_MAP: [
        { NSID: "custom", Name: "Customer Specified Shipping Account", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "custom", Name: "Customer Specified Shipping Account", Subsidiary: "White Labs Hong Kong", CustomerVisible: false, USinternational: false, SubsidiaryID: 5 },
        { NSID: "custom", Name: "Customer Specified Shipping Account", Subsidiary: "White Labs Copenhagen ApS", CustomerVisible: false, USinternational: false, SubsidiaryID: 7 },
        { NSID: "13321", Name: "DHL International", Subsidiary: "White Labs Hong Kong", CustomerVisible: false, USinternational: true, SubsidiaryID: 5 },
        { NSID: "2841", Name: "DHL International Economy", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2842", Name: "DHL International Priority", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: true, SubsidiaryID: 2 },
        { NSID: "3609", Name: "Exempt", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2789", Name: "2 Day (Recommended Retail)", Subsidiary: "White Labs Inc", CustomerVisible: true, USinternational: false, SubsidiaryID: 2 }, // Fedex 2Day
        { NSID: "2790", Name: "FedEx Express Saver", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2791", Name: "Ground (Recommended Non-Yeast)", Subsidiary: "White Labs Inc", CustomerVisible: true, USinternational: false, SubsidiaryID: 2 }, // Fedex Ground
        { NSID: "2792", Name: "FedEx Home Delivery", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2843", Name: "FedEx International Economy", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "3475", Name: "FedEx International Ground", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2844", Name: "FedEx International Priority", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: true, SubsidiaryID: 2 },
        { NSID: "2787", Name: "Priority Overnight (Recommended Pro)", Subsidiary: "White Labs Inc", CustomerVisible: true, USinternational: false, SubsidiaryID: 2 }, // FedEx Priority Overnight
        { NSID: "2788", Name: "Standard Overnight", Subsidiary: "White Labs Inc", CustomerVisible: true, USinternational: false, SubsidiaryID: 2 },
        { NSID: "13320", Name: "Fedex International", Subsidiary: "White Labs Hong Kong", CustomerVisible: false, USinternational: false, SubsidiaryID: 5 },
        { NSID: "13722", Name: "Local Delivery - HK", Subsidiary: "White Labs Hong Kong", CustomerVisible: true, USinternational: false, SubsidiaryID: 5 },
        { NSID: "2845", Name: "OnTrac One Day (CA, AZ, NV)", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "13299", Name: "Third Party Domestic Flat Rate", Subsidiary: "White Labs Copenhagen ApS", CustomerVisible: true, USinternational: false, SubsidiaryID: 7 },
        { NSID: "13300", Name: "Third Party Non Domestic Customers", Subsidiary: "White Labs Copenhagen ApS", CustomerVisible: false, USinternational: true, SubsidiaryID: 7 },
        { NSID: "2794", Name: "UPS 2nd Day Air A.M.", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "4", Name: "UPS Ground", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2848", Name: "UPS Int'l Economy", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2849", Name: "UPS Int'l Priority", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2846", Name: "UPS Overnight", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2847", Name: "UPS Worldwide Express", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "2850", Name: "USPS Priority", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "3471", Name: "Pick Up - Davis", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "13301", Name: "Pick Up - HK", Subsidiary: "White Labs Hong Kong", CustomerVisible: true, USinternational: true, SubsidiaryID: 5 },
        { NSID: "13332", Name: "Pick Up AVL-Go Green", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "13680", Name: "Pick Up CPH", Subsidiary: "White Labs Copenhagen ApS", CustomerVisible: true, USinternational: true, SubsidiaryID: 7 },
        { NSID: "5163", Name: "Pick Up Hong Kong", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "3511", Name: "Pick Up SD-Go Green", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "3472", Name: "Pick Up - Asheville", Subsidiary: "White Labs Inc", CustomerVisible: true, USinternational: false, SubsidiaryID: 2 },
        { NSID: "3470", Name: "Pick Up - Boulder", Subsidiary: "White Labs Inc", CustomerVisible: false, USinternational: false, SubsidiaryID: 2 },
        { NSID: "3469", Name: "Pick Up - San Diego", Subsidiary: "White Labs Inc", CustomerVisible: true, USinternational: false, SubsidiaryID: 2 }
    ],

    SALESCATEGORY: [
        [2, 3, 4, 5, 6, 7, 8, 32], //Yeast, 0
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
        [27, 10], //Merchandise, 15
        [2, 3, 4, 5, 6, 7, 8, 32] //All yeast, 16
    ],

    USEmbargo: ["CN", "KP", "IR", "RU", "SY", "CU"],

    DAYOFWEEK: {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    },

    CATEGORIES: [
        {
            label: "Yeast Strains",
            value: 0,
            img: "static/images/categories/Category-core.jpg",
            color: "#95b95e",
            subCategories: [
                {
                    label: "Ale Strains",
                    value: 1,
                    img: "static/images/categories/Category-ale.jpg",
                    icon: "static/images/icons/Ale-icon.svg",
                    color: "#f68f32"
                },
                {
                    label: "Lager Strains",
                    value: 2,
                    img: "static/images/categories/Category-lager.jpg",
                    icon: "static/images/icons/Lager-icon.svg",
                    color: "#f7ac31"
                },
                {
                    label: "Wine Mead & Cider Strains",
                    value: 3,
                    img: "static/images/categories/Category-wine.jpg",
                    icon: "static/images/icons/wine-icon.svg",
                    color: "#af81ca"
                },
                {
                    label: "Distilling Strains",
                    value: 4,
                    img: "static/images/categories/Category-Distilling.jpg",
                    icon: "static/images/icons/Distilling-icon.svg",
                    color: "#5251a1"
                },
                {
                    label: "Specialty & Belgian Strains",
                    value: 5,
                    img: "static/images/categories/Category-belgian.jpg",
                    icon: "static/images/icons/Belgian-icon.svg",
                    color: "#5ed1d1"
                },
                {
                    label: "Wild Yeast & Bacteria",
                    value: 6,
                    img: "static/images/categories/Category-wild.jpg",
                    icon: "static/images/icons/wildyeast-icon.svg",
                    color: "#daab77"
                },
                {
                    label: "Vault Strains",
                    value: 7,
                    img: "static/images/categories/Category-vault.jpg",
                    icon: "static/images/icons/vault-icon.svg",
                    color: "#c4bab4"
                }
            ]
        },
        {
            label: "Enzymes & Nutrients",
            value: 8,
            img: "static/images/categories/Category-ale.jpg",
            subCategories: [
                {
                    label: "Enzymes",
                    value: 9,
                    img: "static/images/categories/Category-vault.jpg",
                    icon: "static/images/icons/Ale-icon.svg",
                    color: "#95b95e"
                },
                {
                    label: "Nutrients",
                    value: 10,
                    img: "static/images/categories/Category-vault.jpg",
                    icon: "static/images/icons/Ale-icon.svg",
                    color: "#95b95e"
                }
            ]
        },
        {
            label: "Analytical Lab Services",
            value: 12,
            img: "static/images/categories/Category-belgian.jpg",
            color: "#95b95e"
        },
        {
            label: "Lab Supplies",
            value: 13,
            img: "static/images/categories/Category-wild.jpg",
            color: "#95b95e"
        },
        {
            label: "Education",
            value: 14,
            img: "static/images/categories/Category-wine.jpg",
            color: "#95b95e"
        },
        {
            label: "Gift Shop",
            value: 15,
            img: "static/images/categories/Category-vault.jpg",
            color: "#95b95e"
        }
    ],

    packSizeChart: {
        "less than 59": {
            "1": { "less than 13.5": 0.5, "13.5 - 15": 0.5, "15.1 - 17.5": 0.5, "greater than 17.5": 1 },
            "2 - 3": { "less than 13.5": 1, "13.5 - 15": 1.5, "15.1 - 17.5": 2, "greater than 17.5": 2 },
            "4 - 5": { "less than 13.5": 2, "13.5 - 15": 3, "15.1 - 17.5": 3, "greater than 17.5": 4 },
            "6 - 8": { "less than 13.5": 3, "13.5 - 15": 4, "15.1 - 17.5": 4, "greater than 17.5": 6 },
            "9 - 11": { "less than 13.5": 4, "13.5 - 15": 5, "15.1 - 17.5": 6, "greater than 17.5": 8 },
            "12 - 13": { "less than 13.5": 5, "13.5 - 15": 6, "15.1 - 17.5": 7, "greater than 17.5": 9 },
            "14 - 16": { "less than 13.5": 6, "13.5 - 15": 8, "15.1 - 17.5": 9, "greater than 17.5": 12 },
            "20 - 24": { "less than 13.5": 8, "13.5 - 15": 10, "15.1 - 17.5": 12, "greater than 17.5": 16 },
            "25 - 29": { "less than 13.5": 10, "13.5 - 15": 12, "15.1 - 17.5": 15, "greater than 17.5": 20 },
            "30 - 39": { "less than 13.5": 12, "13.5 - 15": 15, "15.1 - 17.5": 18, "greater than 17.5": 24 },
            "40 - 49": { "less than 13.5": 16, "13.5 - 15": 20, "15.1 - 17.5": 24, "greater than 17.5": 32 },
            "50 - 59": { "less than 13.5": 20, "13.5 - 15": 24, "15.1 - 17.5": 30, "greater than 17.5": 40 },
            "60 - 69": { "less than 13.5": 24, "13.5 - 15": 30, "15.1 - 17.5": 36, "greater than 17.5": 48 },
            "70 - 79": { "less than 13.5": 28, "13.5 - 15": 36, "15.1 - 17.5": 44, "greater than 17.5": 56 },
            "80 - 89": { "less than 13.5": 32, "13.5 - 15": 40, "15.1 - 17.5": 48, "greater than 17.5": 64 },
            "90 - 99": { "less than 13.5": 36, "13.5 - 15": 44, "15.1 - 17.5": 54, "greater than 17.5": 72 },
            "100 - 109": { "less than 13.5": 40, "13.5 - 15": 50, "15.1 - 17.5": 60, "greater than 17.5": 80 }
        },
        "60 - 66": {
            "1": { "less than 13.5": 0.5, "13.5 - 15": 0.5, "15.1 - 17.5": 0.5, "greater than 17.5": 1 },
            "2 - 3": { "less than 13.5": 0.5, "13.5 - 15": 1, "15.1 - 17.5": 1.5, "greater than 17.5": 1.5 },
            "4 - 5": { "less than 13.5": 1.5, "13.5 - 15": 2, "15.1 - 17.5": 2, "greater than 17.5": 3 },
            "6 - 8": { "less than 13.5": 2, "13.5 - 15": 3, "15.1 - 17.5": 3, "greater than 17.5": 4.5 },
            "9 - 11": { "less than 13.5": 3, "13.5 - 15": 4, "15.1 - 17.5": 4.5, "greater than 17.5": 6 },
            "12 - 13": { "less than 13.5": 4, "13.5 - 15": 4.5, "15.1 - 17.5": 6, "greater than 17.5": 6 },
            "14 - 16": { "less than 13.5": 4, "13.5 - 15": 6, "15.1 - 17.5": 7, "greater than 17.5": 9 },
            "20 - 24": { "less than 13.5": 6, "13.5 - 15": 7.5, "15.1 - 17.5": 9, "greater than 17.5": 12 },
            "25 - 29": { "less than 13.5": 7.5, "13.5 - 15": 9, "15.1 - 17.5": 12, "greater than 17.5": 15 },
            "30 - 39": { "less than 13.5": 9, "13.5 - 15": 12, "15.1 - 17.5": 14, "greater than 17.5": 18 },
            "40 - 49": { "less than 13.5": 12, "13.5 - 15": 15, "15.1 - 17.5": 18, "greater than 17.5": 24 },
            "50 - 59": { "less than 13.5": 15, "13.5 - 15": 18, "15.1 - 17.5": 22, "greater than 17.5": 30 },
            "60 - 69": { "less than 13.5": 18, "13.5 - 15": 22, "15.1 - 17.5": 27, "greater than 17.5": 36 },
            "70 - 79": { "less than 13.5": 21, "13.5 - 15": 27, "15.1 - 17.5": 33, "greater than 17.5": 42 },
            "80 - 89": { "less than 13.5": 24, "13.5 - 15": 30, "15.1 - 17.5": 36, "greater than 17.5": 48 },
            "90 - 99": { "less than 13.5": 27, "13.5 - 15": 33, "15.1 - 17.5": 40, "greater than 17.5": 54 },
            "100 - 109": { "less than 13.5": 30, "13.5 - 15": 38, "15.1 - 17.5": 45, "greater than 17.5": 60 }
        },
        "67 and over": {
            "1": { "less than 13.5": 0.5, "13.5 - 15": 0.5, "15.1 - 17.5": 0.5, "greater than 17.5": 1 },
            "2 - 3": { "less than 13.5": 0.5, "13.5 - 15": 0.5, "15.1 - 17.5": 1, "greater than 17.5": 1 },
            "4 - 6": { "less than 13.5": 1, "13.5 - 15": 1.5, "15.1 - 17.5": 1.5, "greater than 17.5": 2 },
            "6 - 8": { "less than 13.5": 1.5, "13.5 - 15": 2, "15.1 - 17.5": 2, "greater than 17.5": 3 },
            "9 - 11": { "less than 13.5": 2, "13.5 - 15": 2.5, "15.1 - 17.5": 3, "greater than 17.5": 4 },
            "12 - 13": { "less than 13.5": 2.5, "13.5 - 15": 3, "15.1 - 17.5": 3.5, "greater than 17.5": 4.5 },
            "14 - 16": { "less than 13.5": 3, "13.5 - 15": 4, "15.1 - 17.5": 4.5, "greater than 17.5": 6 },
            "20 - 24": { "less than 13.5": 4, "13.5 - 15": 5, "15.1 - 17.5": 6, "greater than 17.5": 6 },
            "25 - 29": { "less than 13.5": 5, "13.5 - 15": 6, "15.1 - 17.5": 7.5, "greater than 17.5": 10 },
            "30 - 39": { "less than 13.5": 6, "13.5 - 15": 7.5, "15.1 - 17.5": 9, "greater than 17.5": 12 },
            "40 - 49": { "less than 13.5": 8, "13.5 - 15": 10, "15.1 - 17.5": 12, "greater than 17.5": 16 },
            "50 - 59": { "less than 13.5": 10, "13.5 - 15": 12, "15.1 - 17.5": 12, "greater than 17.5": 20 },
            "60 - 69": { "less than 13.5": 12, "13.5 - 15": 15, "15.1 - 17.5": 18, "greater than 17.5": 24 },
            "70 - 79": { "less than 13.5": 14, "13.5 - 15": 18, "15.1 - 17.5": 22, "greater than 17.5": 28 },
            "80 - 89": { "less than 13.5": 16, "13.5 - 15": 20, "15.1 - 17.5": 24, "greater than 17.5": 32 },
            "90 - 99": { "less than 13.5": 18, "13.5 - 15": 22, "15.1 - 17.5": 27, "greater than 17.5": 36 },
            "100 - 109": { "less than 13.5": 20, "13.5 - 15": 25, "15.1 - 17.5": 30, "greater than 17.5": 40 }
        }
    },

    homebrewPackSizeChart: {
        "less than 59": {
            "20": { "less than 13.5": 2, "12 - 16.5": 4, "greater than 17.5": 6 },
            "40": { "less than 13.5": 4, "12 - 16.5": 8, "greater than 17.5": 12 },
            "60": { "less than 13.5": 6, "12 - 16.5": 8, "greater than 17.5": "starter" },
            "80": { "less than 13.5": 8, "12 - 16.5": "starter", "greater than 17.5": "starter" },
            "100": { "less than 13.5": 10, "12 - 16.5": "starter", "greater than 17.5": "starter" },
            "120": { "less than 13.5": 12, "12 - 16.5": "starter", "greater than 17.5": "starter" }
        },
        "60 - 66": {
            "20": { "less than 13.5": 1, "12 - 16.5": 2, "greater than 17.5": 3 },
            "40": { "less than 13.5": 2, "12 - 16.5": 4, "greater than 17.5": 6 },
            "60": { "less than 13.5": 3, "12 - 16.5": 6, "greater than 17.5": 9 },
            "80": { "less than 13.5": 4, "12 - 16.5": 8, "greater than 17.5": 12 },
            "100": { "less than 13.5": 5, "12 - 16.5": 10, "greater than 17.5": "starter" },
            "120": { "less than 13.5": 6, "12 - 16.5": 12, "greater than 17.5": "starter" }
        },
        "67 and over": {
            "20": { "less than 13.5": 1, "12 - 16.5": 2, "greater than 17.5": 3 },
            "40": { "less than 13.5": 2, "12 - 16.5": 4, "greater than 17.5": 6 },
            "60": { "less than 13.5": 3, "12 - 16.5": 6, "greater than 17.5": 9 },
            "80": { "less than 13.5": 4, "12 - 16.5": 8, "greater than 17.5": 12 },
            "100": { "less than 13.5": 5, "12 - 16.5": 10, "greater than 17.5": "starter" },
            "120": { "less than 13.5": 6, "12 - 16.5": 12, "greater than 17.5": "starter" }
        }
    },

    homebrewVolChoices: {
        L: ["20", "40", "60", "80", "100", "120", "140"],
        SGAL: ["5", "10", "15", "20", "25", "30"],
        KGAL: ["4", "8", "12", "16", "20", "24"]
    },

    homebrewGravChoices: {
        PLA: ["less than 13.5", "12 - 16.5", "greater than 16.5"],
        SPE: ["less than 1.050", "1.050 - 1.068", "greater than 1.068"]
    },

    volChoices: {
        BBL: ["1", "2 - 3", "4 - 5", "6 - 8", "9 - 11", "12 - 13", "14 - 16", "20 - 24", "25 - 29", "30 - 39", "40 - 49", "50 - 59", "60 - 69", "70 - 79", "80 - 89", "90 - 99", "100 - 109"],
        HL: ["1", "3", "5", "8", "12", "15", "18", "24", "30", "36", "48", "60", "72", "83", "95", "107", "119"]
        //L: ["119", "298", "537", "835", "1192", "1491", "1789", "2385", "2981", "3577", "4770", "5962", "7154", "8347", "9539", "10732", "11924"],
        //SGAL: ["32", "79", "142", "221", "315", "394", "473", "630", "788", "945", "1260", "1575", "1890", "2205", "2520", "2835", "3150"],
        //KGAL: ["38", "95", "170", "265", "378", "473", "567", "756", "945", "1134", "1512", "1890", "2268", "2646", "3024", "3402", "3780"],
    },

    tempChoices: {
        F: ["less than 59", "60 - 66", "67 and over"],
        C: ["less than 15", "15.1 - 17.5", "greater than 17.5"]
    },

    gravChoices: {
        PLA: ["less than 13.5", "13.5 - 15", "15.1 - 17.5", "greater than 17.5"],
        SPE: ["less than 1.050", "1.050 - 1.061", "1.061 - 1.074", "greater than 1.074"]
    },

    volUnits: [
        //{ label: "Liter", value: "L", forHomebrew: true },
        //{ label: "US Gallon", value: "SGAL", forHomebrew: true },
        //{ label: "UK Gallon", value: "KGAL", forHomebrew: true },
        { label: "Barrel", value: "BBL", forHomebrew: false },
        { label: "Hectoliter", value: "HL", forHomebrew: false }
    ]
};

module.exports = SalesLib;
