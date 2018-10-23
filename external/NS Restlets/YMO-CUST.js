/**
*@NApiVersion 2.x
*@NScriptType Restlet
*Author: Dimitri Vasilev
*Date Modified: 10/23/18
*/

/* ***************
   * Description *
   ***************
   This endpoint was established to perform the following tasks for the White Labs App:
   1 - get | Retrieve Customer Information
   2 - put | Change Customer Information/Add Subsidiary
   3 - post| Create New Customers
 */


define(['N/record', 'N/log', 'N/search', 'N/email', '../Dom\ Dev\ Library/aes', '../Dom\ Dev\ Library/enc-base64-min.js', './YMO-LIB'],
function(record, log, search, email)
{

   /*
       input = {
           id
       }

       response = {
           id
           phone
           email
           companyname
           category
           terms
           shipmethod = {
               id
               flatRate
               cost
               minimum
               maximum
           }
           currency
           shipping: {
               id
               addressee
               address1
               address2
               address3
               city
               zip
               countryid
           }
           billing: {
               id
               addressee
               address1
               address2
               address3
               city
               zip
               countryid
           }
           otherAddresses = {...}
           cards = {
               id
               ccnumber
               ccexpire
               default
           }
           connectedaccounts[{
               internalid
               name
               customer
           }]
       }
   */

   function post(input)
   {

       var message = ReceiveMessage(input);

       if(!(message.version && versionUpToDate(message.version)))
       {
           return { error: {message: 'App version is out of date. Please download new version.', code: 0}};
       }

       if(message.sendConfirmationEmail)
       {
           try
           {
               email.send({
                   author: 298063,
                   recipients: message.custInfo.username,
                   subject: "White Labs Registration Confirmation" ,
                   body: "Thank you for registering with White Labs. Your credentials are:<br /><br /> " +
                   "username: <b>" + message.custInfo.username + "</b><br />" +
                   "password: <b>" + message.custInfo.password + "</b>"
               });

               return SendMessage({response: 'Confirmation email send successfully'});
           }
           catch(err)
           {
               var err = {message: 'Could not send confirmation email to your account', code: 0};
               logError('send confirmation email:', err.message.toString());
               return {error: err};
           }
       }

       else if(message.sendSurvey)
       {
           try
           {
               var orderSubrecord = record.create({type: 'customrecord379', isDynamic: true});
               orderSubrecord.setValue({fieldId: 'custrecord121', value: message.UserID});
               if(message.howSatisfiedWithRecentOrder)
               {
                   orderSubrecord.setValue({fieldId: 'custrecord125', value: message.howSatisfiedWithRecentOrder});
               }

               if(message.howSatisfiedWithCompany)
               {
                   orderSubrecord.setValue({fieldId: 'custrecord122', value: message.howSatisfiedWithCompany});
               }

               if(message.companySatisfactionReason)
               {
                 orderSubrecord.setValue({fieldId: 'custrecord153', value: message.companySatisfactionReason});
               }

               if(message.orderSatisfactionReason)
               {
                   orderSubrecord.setValue({fieldId: 'custrecord154', value: message.orderSatisfactionReason});
               }

               if(message.wouldYouOrderAgain)
               {
                   orderSubrecord.setValue({fieldId: 'custrecord123', value: message.wouldYouOrderAgain});
               }

               if(message.howLikelyToRecommend)
               {
                   orderSubrecord.setValue({fieldId: 'custrecord124', value: message.howLikelyToRecommend});
               }


               if(message.shippingExperience)
               {
                   orderSubrecord.setValue({fieldId: 'custrecord127', value: message.shippingExperience});
               }

               if(message.additionalFeedback)
               {
                  orderSubrecord.setValue({fieldId: 'custrecord155', value: message.additionalFeedback});
               }

               orderSubrecord.save({enableSourcing: true});

               return SendMessage({response: 'Order Survey saved successfully'});
           }
           catch(err)
           {
               var err = {message: 'Could not save survey to your account', code: 0};
               logError('save survey', err.message.toString());
               return {error: err};
           }
       }
       else if(message.get)
       {
           try
           {
               var customerRecord = record.load({type: record.Type.CUSTOMER, id: message.id});

               //Customer Editable
               message.phone = customerRecord.getValue({fieldId: 'phone'});
               message.email = customerRecord.getValue({fieldId: 'email'});
               message.currency = customerRecord.getValue({fieldId: 'currency'});
               message.vat = customerRecord.getValue({fieldId: 'vatregnumber'});


               //Not Customer Editable
               message.companyname = customerRecord.getValue({fieldId: 'companyname'});
               message.category = customerRecord.getValue({fieldId: 'category'});
               message.terms = customerRecord.getValue({fieldId: 'terms'});
               message.subsidiary = customerRecord.getValue({fieldId: 'subsidiary'});
               message.vat = customerRecord.getValue({fieldId: 'vatregnumber'});

               var shipIndex = customerRecord.findSublistLineWithValue({sublistId: 'addressbook', fieldId: 'defaultshipping', value: true});
               var billIndex = customerRecord.findSublistLineWithValue({sublistId: 'addressbook', fieldId: 'defaultbilling', value: true});

               //Default Addresses

               message.shipping = {};
               if(shipIndex >= 0) {
                   var shipSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: shipIndex});
                   message.shipping.id = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: shipIndex});
                   message.shipping.attn = shipSubrecord.getValue({fieldId: 'attention'});
                   message.shipping.addressee = shipSubrecord.getValue({fieldId: 'addressee'});
                   message.shipping.address1 = shipSubrecord.getValue({fieldId: 'addr1'});
                   message.shipping.address2 = shipSubrecord.getValue({fieldId: 'addr2'});
                   message.shipping.address3 = shipSubrecord.getValue({fieldId: 'addr3'});
                   message.shipping.city = shipSubrecord.getValue({fieldId: 'city'});
                   message.shipping.zip = shipSubrecord.getValue({fieldId: 'zip'});
                   message.shipping.countryid = shipSubrecord.getValue({fieldId: 'country'});
               }


               message.billing = {};
               if(billIndex >= 0) {
                   var billSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: billIndex});
                   message.billing.id = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: billIndex});
                   message.billing.attn = billSubrecord.getValue({fieldId: 'attention'});
                   message.billing.addressee = billSubrecord.getValue({fieldId: 'addressee'});
                   message.billing.address1 = billSubrecord.getValue({fieldId: 'addr1'});
                   message.billing.address2 = billSubrecord.getValue({fieldId: 'addr2'});
                   message.billing.address3 = billSubrecord.getValue({fieldId: 'addr3'});
                   message.billing.city = billSubrecord.getValue({fieldId: 'city'});
                   message.billing.zip = billSubrecord.getValue({fieldId: 'zip'});
                   message.billing.countryid = billSubrecord.getValue({fieldId: 'country'});
               }

               //Other Addresses
               message.otherAddresses = [];
               var numAddresses = customerRecord.getLineCount({sublistId: 'addressbook'});
               for (var i = numAddresses - 1; i >= 0; i--)
               {
                   var address = {};
                   address.id = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: i});
                   address.defaultBill = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: i});
                   address.defaultShip = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: i});
                   var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: i});
                   address.attn = addressSubrecord.getValue({fieldId: 'attention'});
                   address.addressee = addressSubrecord.getValue({fieldId: 'addressee'});
                   address.address1 = addressSubrecord.getValue({fieldId: 'addr1'});
                   address.address2 = addressSubrecord.getValue({fieldId: 'addr2'});
                   address.address3 = addressSubrecord.getValue({fieldId: 'addr3'});
                   address.city = addressSubrecord.getValue({fieldId: 'city'});
                   address.zip = addressSubrecord.getValue({fieldId: 'zip'});
                   address.countryid = addressSubrecord.getValue({fieldId: 'country'});
                   message.otherAddresses.push(address);

               }

               //Credit Cards
               message.cardsToRemove = [];
               message.cards = [];
               for (var j = customerRecord.getLineCount({sublistId: 'creditcards'}) - 1; j >= 0; j--)
               {
                   var card = {};
                   card.id = customerRecord.getSublistValue({sublistId: 'creditcards', fieldId: 'internalid', line: j});
                   card.ccname = customerRecord.getSublistValue({sublistId: 'creditcards', fieldId: 'ccname', line: j});
                   card.ccnumber = customerRecord.getSublistValue({sublistId: 'creditcards', fieldId: 'ccnumber', line: j});
                   card.ccexpire = customerRecord.getSublistValue({sublistId: 'creditcards', fieldId: 'ccexpiredate', line: j});

                   card.type = customerRecord.getSublistValue({sublistId: 'creditcards', fieldId: 'paymentmethod', line: j});

                   var today = new Date();
                   if(compareDates(card.ccexpire, today) == 1)
                   {
                       message.cardsToRemove.push(card);
                   }

                   if(customerRecord.getSublistValue({sublistId: 'creditcards', fieldId: 'ccdefault', line: j}))
                   {
                       card.default = true;
                       message.cards.splice(0, 0, card);
                   }
                   else
                   {
                       card.default = false;
                       message.cards.push(card);
                   }
               }

               //Connected Subsidiary Accounts
               var currentSubsidiary = {internalid: message.id, subsidiary: customerRecord.getText({fieldId: 'subsidiary'}), subsidiaryid: message.subsidiary};
               var relatedAccounts = customerRecord.getValue({fieldId: 'custentityrelatedaccounts'})
               if(relatedAccounts)
               {
                  message.connectedaccounts = JSON.parse(JSON.stringify(relatedAccounts));
               }


               if(message.connectedaccounts)
               {
                   for (var n = message.connectedaccounts.length - 1; n >= 0; n--)
                   {
                       message.connectedaccounts[n] = {internalid: parseInt(message.connectedaccounts[n])};
                   }
                   message.connectedaccounts.splice(0, 0, currentSubsidiary);
               }
               else
               {
                   message.connectedaccounts = [currentSubsidiary];
               }

               for(var k = 1; k < message.connectedaccounts.length; k++)
               {
                   //running a search here probably won't save any time or governance, at most 2 iterations
                   var subsidiaryRecord = record.load({type: record.Type.CUSTOMER, id: message.connectedaccounts[k].internalid});
                   message.connectedaccounts[k].subsidiary = subsidiaryRecord.getText({fieldId: 'subsidiary'});
                   message.connectedaccounts[k].subsidiaryid = subsidiaryRecord.getValue({fieldId: 'subsidiary'});
               }

               //Ship Method
               var thirdParty = customerRecord.getValue({fieldId: 'thirdpartyacct'});
               if(thirdParty)
               {
                   message.shipmethod = -3;
               }
               else
               {
                   var shipid = customerRecord.getValue({fieldId: 'shippingitem'});

                   if(shipid)
                   {
                       message.shipmethod = shipid;
                   }
                   else
                   {
                       message.shipmethod = getShipMethodFromSub(message.subsidiary, 'DK' == message.shipcountryid, message.category);
                   }
               }

               return SendMessage(message);
           }
           catch(err)
           {
               logError('get cust:' + message.id, err.toString());
               return {error: err};
           }
       }
       else
       {
           try
           {
               var response = {};
               response.tokenid = message.tokenid;
               response.id = [];

               var filters = [];
               filters.push(search.createFilter({name: 'email', operator: search.Operator.IS, values: message.email}));

               var duplicateSearch = search.create({type: 'transaction', filters: filters, columns: []});
               if(duplicateSearch.run().getRange({start: 0, end: 1}).length > 0)
               {
                   throw {message: 'Duplicate Email Found', code: 0};
               }

               for(var i = 0; i < message.subsidiary.length; i++)
               {
                   var customerRecord = record.create({type: record.Type.CUSTOMER, isDynamic: true});
                   customerRecord.setValue({fieldId: 'customform', value: 98}); //default form at the time of writing
                   customerRecord.setValue({fieldId: 'subsidiary', value: message.subsidiary[i]});

                   if(!message.category)
                   {
                       throw {message: 'Missing Customer Category', code: 0};
                   }
                   customerRecord.setValue({fieldId: 'category', value: message.category});
                   customerRecord.setValue({fieldId: 'pricelevel', value: priceLevelDetermination(message.category)});

                   if(!message.phone)
                   {
                       throw {message: 'Missing Phone Number', code: 0};
                   }
                   customerRecord.setValue({fieldId: 'phone', value: message.phone});
                   customerRecord.setValue({fieldId: 'custentity_gs_phonenumber', value: message.phone});

                   if(!message.companyname)
                   {
                       throw {message: 'Missing Company Name', code: 0};
                   }
                   customerRecord.setValue({fieldId: 'companyname', value: message.companyname});
                   customerRecord.setValue({fieldId: 'entityid', value: message.companyname});

                   if(!message.email)
                   {
                       throw {message: 'Missing Email', code: 0};
                   }
                   customerRecord.setValue({fieldId: 'email', value: message.email});


                   if(!message.shipping.countryid)
                   {
                       throw {message: 'Missing Country for Shipping Address', code: 0};
                   }
                   customerRecord.setValue({fieldId: 'currency', value: getCurrencyFromSub(message.subsidiary[i], 'DK' == message.shipping.countryid)});
                   customerRecord.setValue({fieldId: 'shippingitem', value: getShipMethodFromSub(message.subsidiary[i], 'DK' == message.shipping.countryid, message.category)});

                   customerRecord.setValue({fieldId: 'entitystatus', value: 13});
                   customerRecord.setValue({fieldId: 'terms', value: getTermsFromSub(message.subsidiary[i])});
                   customerRecord.setValue({fieldId: 'custentitynonce', value: message.nonce});


                   customerRecord.selectNewLine({sublistId: 'addressbook'});
                   customerRecord.setCurrentSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', value: true});
                   var shipSubrecord = customerRecord.getCurrentSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress'});
                   shipSubrecord.setValue({fieldId: 'country', value: message.shipping.countryid});

                   if(message.shipzip)
                   {
                       shipSubrecord.setValue({fieldId: 'zip', value: message.shipping.zip});
                   }

                   if(!message.shipcity)
                   {
                       throw {message: 'Missing City for Shipping Address', code: 0};
                   }
                   shipSubrecord.setValue({fieldId: 'city', value: message.shipping.city});

                   if(message.shipattn)
                   {
                      shipSubrecord.setValue({fieldId: 'attention', value: message.shipping.attn});
                   }

                   if(!message.shipping.addressee)
                   {
                       throw {message: 'Missing Addressee for Shipping Address', code: 0};
                   }
                   shipSubrecord.setValue({fieldId: 'addressee', value: message.shipping.addressee});

                   if(!message.shipping.address1)
                   {
                       throw {message: 'Missing Shipping Address Line 1', code: 0};
                   }
                   shipSubrecord.setValue({fieldId: 'addr1', value: message.shipping.address1});

                   if(message.shipping.address2)
                   {
                       shipSubrecord.setValue({fieldId: 'addr2', value: message.shipping.address2});
                   }

                   if(message.shipping.address3)
                   {
                       shipSubrecord.setValue({fieldId: 'addr3', value: message.shipping.address3});
                   }

                   customerRecord.commitLine({sublistId: 'addressbook'});

                   customerRecord.selectNewLine({sublistId: 'addressbook'});
                   customerRecord.setCurrentSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', value: true});
                   var billSubrecord = customerRecord.getCurrentSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress'});

                   if(!message.billing.countryid)
                   {
                       throw {message: 'Missing Country for Billing Address', code: 0};
                   }
                   billSubrecord.setValue({fieldId: 'country', value: message.billing.countryid});

                   if(!message.billing.city)
                   {
                       throw {message: 'Missing City for Billing Address', code: 0};
                   }
                   billSubrecord.setValue({fieldId: 'city', value: message.billing.city});

                   if(message.billzip)
                   {
                       billSubrecord.setValue({fieldId: 'zip', value: message.billing.zip});
                   }

                   if(message.billing.attn)
                   {
                      billSubrecord.setValue({fieldId: 'attention', value: message.billing.attn});
                   }

                   if(!message.billing.addressee)
                   {
                       throw {message: 'Missing Addressee for Billing Address', code: 0};
                   }
                   billSubrecord.setValue({fieldId: 'addressee', value: message.billing.addressee});

                   if(!message.billing.address1)
                   {
                       throw {message: 'Missing Billing Address Line 1', code: 0};
                   }
                   billSubrecord.setValue({fieldId: 'addr1', value: message.billing.address1});

                   if(message.billing.address2)
                   {
                       billSubrecord.setValue({fieldId: 'addr2', value: message.billing.address2});
                   }

                   if(message.billing.address3)
                   {
                       billSubrecord.setValue({fieldId: 'addr3', value: message.billing.address3});
                   }

                   customerRecord.commitLine({sublistId: 'addressbook'});

                   if(message.vat)
                   {
                       try
                       {
                           customerRecord.setValue({fieldId: 'vatregnumber', value: message.billing.countryid + message.vat});
                       }
                       catch(err)
                       {
                           throw {message: 'Invalid VAT Number', code: 0};
                       }

                       customerRecord.setValue({fieldId: 'taxitem', value: taxCodeLookup(message.billing.countryid)});
                       customerRecord.setValue({fieldId: 'receivablesaccount', value: 709}); // Accounts Receivable - CPH
                   }

                   if(!message.contactName || !message.contactPhone)
                   {
                       throw {message: 'Missing Financial Contact Information', code: 0};
                   }

                   try
                   {
                       var card = decryptCard(message.creditToken);
                       customerRecord.selectNewLine({sublistId: 'creditcards'});
                       customerRecord.setCurrentSublistValue({sublistId:'creditcards', fieldId:'ccdefault', value: true});
                       var expireDate = new Date(), dateShortHand = card.expire.split('/');
                       expireDate.setDate(1);
                       expireDate.setMonth(dateShortHand[0]);
                       expireDate.setFullYear(dateShortHand[1]);
                       customerRecord.setCurrentSublistValue({sublistId:'creditcards', fieldId:'ccexpiredate', value: expireDate});
                       customerRecord.setCurrentSublistValue({sublistId:'creditcards', fieldId:'ccnumber', value: card.ccnumber});
                       customerRecord.setCurrentSublistValue({sublistId:'creditcards', fieldId:'ccname', value: card.name});
                       customerRecord.setCurrentSublistValue({sublistId:'creditcards', fieldId:'paymentmethod', value: card.type});
                       customerRecord.commitLine({sublistId: 'creditcards'});
                   }
                   catch(err)
                   {
                       throw {message: 'Credit Card Information is Invalid', code: 0};
                   }

                   try
                   {
                       response.id.push(customerRecord.save());
                   }
                   catch(err)
                   {
                       logError('post', err);
                       throw {message: 'Couldn\'t create account', code: -1};
                   }

                   try
                   {
                       var contactRecord = record.create({type: record.Type.CONTACT, isDynamic: true});
                       contactRecord.setValue({fieldId: 'customform', value: -40});
                       contactRecord.setValue({fieldId: 'entityid', value: message.contactName});
                       contactRecord.setValue({fieldId: 'phone', value: message.contactPhone});
                       contactRecord.setValue({fieldId: 'company', value: response.id[i]});
                       contactRecord.setValue({fieldId: 'subsidiary', value: message.subsidiary[i]});
                       contactRecord.save();
                   }
                   catch(err)
                   {
                       throw {message: 'Failed to create contact, contact customer service to continue', code: 0};
                   }
               }

               // Create Account for each subsidiary
               if(response.id.length > 1)
               {
                   //Retroactively Connect Subsidiaries
                   for (var k = 0; k < response.id.length; k++)
                   {
                       var connectCustomerRecord = record.load({type: record.Type.CUSTOMER, id: response.id[k]});

                       if(connectCustomerRecord.getValue({fieldId: 'subsidiary'}) == 2)
                       {
                           response.username = parseInt(connectCustomerRecord.getValue({fieldId: 'entityid'}));
                       }

                       var relatedAccounts = [];
                       for(var j = 0; j < response.id.length; j++)
                       {
                           if(j != k)
                           {
                               relatedAccounts.push(response.id[j]);
                           }
                       }

                       if(relatedAccounts.length == 1)
                       {
                           connectCustomerRecord.setValue({fieldId: 'custentityrelatedaccounts', value: relatedAccounts[0]});
                       }
                       else
                       {
                           connectCustomerRecord.setFieldValues({fieldId: 'custentityrelatedaccounts', value: relatedAccounts});
                       }

                       connectCustomerRecord.save();
                   }
               }
               else if(response.id.length == 0)
               {
                   throw {message: 'No Account Created, Please Contact Customer Service for Assistance', code: 0};
               }

               return SendMessage(response);
           }
           catch(err)
           {
               logError('post cust:' + message.phone, err.toString());
               return {error: err};
           }
       }
   }

   function put(input)
   {
       try
       {
           var message = ReceiveMessage(input);

           if(!(message.version && versionUpToDate(message.version)))
           {
               return { error: {message: 'App version is out of date. Please download new version.', code: 0}};
           }

           var response = {};

           //duplicate and add as subsidiary
           if(message.addSubsidiary)
           {
               //Clone Record
               var recordClone = record.copy({type: record.Type.CUSTOMER, id: message.id});

               if(!message.subsidiary || isNaN(parseInt(message.subsidiary)))
               {
                   throw {message: 'Invalid subsidiary selected', code: -1};
               }

               var newSubsidiary = Math.abs(message.subsidiary);

               //Change Necessary Fields
               recordClone.setValue({fieldId: 'subsidiary', value: newSubsidiary});
               recordClone.setValue({fieldId: 'currency', value: getCurrencyFromSub(newSubsidiary)});
               recordClone.setValue({fieldId: 'shippingitem', value: getShipMethodFromSub(newSubsidiary, 'DK' == recordClone.getValue({fieldId: 'billcountry'}), message.category)});


               if(message.subsidiary == -7)
               {

                   recordClone.setValue({fieldId: 'receivablesaccount', value: 709});
                   recordClone.setValue({fieldId: 'taxitem', value: taxCodeLookup(recordClone.getValue({fieldId: 'billcountry'}))});

                   if(message.vat)
                   {
                       recordClone.setValue({fieldId: 'vatregnumber', value: 'D' + message.vat});
                   }
                   else
                   {
                       throw {message: 'Missing VAT #', code: 0};
                   }
               }

               //Invalid CC number problem when copying customer - Remove CC's
               for (var i = recordClone.getLineCount({sublistId: 'creditcards'}) - 1; i >= 0; i--)
               {
                   recordClone.removeLine({sublistId: 'creditcards', line: i});
               }


               //Open original account
               var customerRecord = record.load({type: 'customer', id: message.id});

               //Create related accounts & submit updates
               var relatedAccounts = customerRecord.getValue({fieldId: 'custentityrelatedaccounts'});

               if(relatedAccounts.length > 0)
               {

                   var middleAccount = String(relatedAccounts[0]);
                   var recordMiddle = record.load({type: 'customer', id: middleAccount});

                   var accounts = [message.id, middleAccount];
                   recordClone.setValue({fieldId: 'custentityrelatedaccounts', value: accounts});

                   response.id = recordClone.save();

                   accounts = [message.id, response.id];
                   recordMiddle.setValue({fieldId: 'custentityrelatedaccounts', value: accounts});
                   recordMiddle.save();

                   accounts = [middleAccount, response.id];
                   customerRecord.setValue({fieldId: 'custentityrelatedaccounts', value: accounts});
                   customerRecord.save();
               }
               else
               {
                   recordClone.setValue({fieldId: 'custentityrelatedaccounts', value: message.id});
                   response.id = recordClone.save();
                   customerRecord.setValue({fieldId: 'custentityrelatedaccounts', value: response.id});
                   customerRecord.save();
               }
           }
           else //normal change cust
           {
               response.phone = 1;
               response.email = 1;
               response.currency = 1;
               response.vat = 1;
               response.shipmethod = 1;
               response.ship = 1;
               response.bill = 1;
               response.card = 1;

               var customerRecord = record.load({type: record.Type.CUSTOMER, id: message.id});

               if(message.phone)
               {
                   try
                   {
                       customerRecord.setValue({fieldId: 'custentity_gs_phonenumber', value: message.phone});
                       customerRecord.setValue({fieldId: 'phone', value: message.phone});
                   }
                   catch(err)
                   {
                       response.phone = 0;
                       logError('put - phone, cust: ' + message.id, err);
                   }
               }

               if(message.email)
               {
                   try
                   {
                       customerRecord.setValue({fieldId: 'email', value: message.email});
                   }
                   catch(err)
                   {
                       response.email = 0;
                       logError('put - email, cust: ' + message.id, err);
                   }
               }

               if(message.currency)
               {
                   try
                   {
                       customerRecord.setValue({fieldId: 'currency', value: message.currency});
                   }
                   catch(err)
                   {
                       response.currency = 0;
                       logError('put - currency, cust: ' + message.id, err);
                   }
               }

               if(message.vat)
               {
                   try
                   {
                       customerRecord.setValue({fieldId: 'vatregnumber', value: message.vat});
                   }
                   catch(err)
                   {
                       response.vat = 0;
                       logError('put - vat, cust: ' + message.id, err);
                   }
               }

               if(message.shipmethod)
               {
                   try
                   {
                       customerRecord.setValue({fieldId: 'shippingitem', value: message.shipmethod});
                   }
                   catch(err)
                   {
                       response.shipmethod = 0;
                       logError('put - shipmethod, cust: ' + message.id, err);
                   }
               }

               if(message.shipChange)
               {
                   try
                   {
                       var found = false;
                       var numAddresses = customerRecord.getLineCount({sublistId: 'addressbook'});
                       for(var i = numAddresses - 1; i >= 0; i--)
                       {
                           var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: i});
                           var addressId = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: i});
                           if(message.shipping.id == addressId)
                           {
                               found = true;
                               customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', value: true, line: i});
                               addressSubrecord.setValue({fieldId:'country', value: message.shipping.countryid});
                               addressSubrecord.setValue({fieldId:'attention', value: message.shipping.attn});
                               addressSubrecord.setValue({fieldId:'addressee', value: message.shipping.addressee});
                               addressSubrecord.setValue({fieldId:'addr1', value: message.shipping.address1});
                               addressSubrecord.setValue({fieldId:'addr2', value: message.shipping.address2});
                               addressSubrecord.setValue({fieldId:'add3', value: message.shipping.address3});
                               addressSubrecord.setValue({fieldId:'city', value: message.shipping.city});
                               addressSubrecord.setValue({fieldId:'zip', value: message.shipping.zip});
                               break;
                           }
                       }

                       if(!found)
                       {
                           customerRecord.insertLine({sublistId: 'addressbook', line: numAddresses});
                           customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', value: true, line: numAddresses});
                           var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: numAddresses});
                           addressSubrecord.setValue({fieldId:'country', value: message.shipping.countryid});
                           addressSubrecord.setValue({fieldId:'attention', value: message.shipping.attn});
                           addressSubrecord.setValue({fieldId:'addressee', value: message.shipping.addressee});
                           addressSubrecord.setValue({fieldId:'addr1', value: message.shipping.address1});
                           addressSubrecord.setValue({fieldId:'addr2', value: message.shipping.address2});
                           addressSubrecord.setValue({fieldId:'add3', value: message.shipping.address3});
                           addressSubrecord.setValue({fieldId:'city', value: message.shipping.city});
                           addressSubrecord.setValue({fieldId:'zip', value: message.shipping.zip});
                       }
                   }
                   catch(err)
                   {
                       response.ship = 0;
                       logError('put - shipaddress, cust: ' + message.id, err);
                   }
               }

               if(message.billChange)
               {
                   try
                   {
                       var found = false;
                       var numAddresses = customerRecord.getLineCount({sublistId: 'addressbook'});
                       for(var i = numAddresses - 1; i >= 0; i--)
                       {
                           var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: i});
                           var addressId = customerRecord.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: i});

                           if(message.billing.id == addressId)
                           {
                               found = true;
                               customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', value: true, line: i});
                               addressSubrecord.setValue({fieldId:'country', value: message.billing.countryid});
                               addressSubrecord.setValue({fieldId:'attention', value: message.billing.attn});
                               addressSubrecord.setValue({fieldId:'addressee', value: message.billing.addressee});
                               addressSubrecord.setValue({fieldId:'addr1', value: message.billing.address1});
                               addressSubrecord.setValue({fieldId:'addr2', value: message.billing.address2});
                               addressSubrecord.setValue({fieldId:'add3', value: message.billing.address3});
                               addressSubrecord.setValue({fieldId:'city', value: message.billing.city});
                               addressSubrecord.setValue({fieldId:'zip', value: message.billing.zip});
                               break;
                           }
                       }

                       if(!found)
                       {
                           customerRecord.insertLine({sublistId: 'addressbook', line: numAddresses});
                           customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', value: true, line: numAddresses});
                           var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: numAddresses});
                           addressSubrecord.setValue({fieldId:'country', value: message.billing.countryid});
                           addressSubrecord.setValue({fieldId:'attention', value: message.billing.attn});
                           addressSubrecord.setValue({fieldId:'addressee', value: message.billing.addressee});
                           addressSubrecord.setValue({fieldId:'addr1', value: message.billing.address1});
                           addressSubrecord.setValue({fieldId:'addr2', value: message.billing.address2});
                           addressSubrecord.setValue({fieldId:'add3', value: message.billing.address3});
                           addressSubrecord.setValue({fieldId:'city', value: message.billing.city});
                           addressSubrecord.setValue({fieldId:'zip', value: message.billing.zip});
                       }
                   }
                   catch(err)
                   {
                       response.bill = 0;
                       logError('put - billaddress, cust: ' + message.id, err);
                   }
               }

               if(message.creditChange)
               {
                   try
                   {
                       // default credit card
                       if(message.card.setDefault)
                       {
                           // remove old default
                           var line = customerRecord.findSublistLineWithValue({sublistId: 'creditcards', fieldId:'ccdefault', value: true});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccdefault', value: false, line: line});

                           // set new default
                           var line = customerRecord.findSublistLineWithValue({sublistId: 'creditcards', fieldId:'ccnumber', value: message.card.ccnumber});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccdefault', value: true, line: line});
                       }

                       // Add new credit card
                       if(message.card.added)
                       {
                           var card = decryptCard(message.card.token);
                           var expireDate = new Date(), dateShortHand = card.ccexpire.split('/');
                           expireDate.setMonth(dateShortHand[0]);
                           expireDate.setFullYear(dateShortHand[1]);

                           var line = customerRecord.getLineCount({sublistId: 'creditcards'});
                           customerRecord.insertLine({sublistId: 'creditcards', line: line});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccnumber', value: card.ccnumber, line: line});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccname', value: card.ccname, line: line});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccexpiredate', value: expireDate, line: line});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'paymentmethod', value: card.type, line: line});
                       }

                       // Edit existing credit card information (except ccnumber)
                       else if(message.card.edited)
                       {
                           var expireDate = new Date(), dateShortHand = message.card.ccexpire.split('/');
                           expireDate.setMonth(dateShortHand[0]);
                           expireDate.setFullYear(dateShortHand[1]);

                           var line = customerRecord.findSublistLineWithValue({sublistId: 'creditcards', fieldId: 'ccnumber', value: message.card.ccnumber});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccexpiredate', value: expireDate, line: line});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'ccname', value: message.card.ccname, line: line});
                           customerRecord.setSublistValue({sublistId:'creditcards', fieldId:'paymentmethod', value: message.card.type, line: line});
                       }

                       // Delete credit card
                       else if(message.card.deleted)
                       {
                           var line = customerRecord.findSublistLineWithValue({sublistId: 'creditcards', fieldId: 'ccnumber', value: message.card.ccnumber});
                           customerRecord.removeLine({sublistId: 'creditcards', line: line});
                       }
                   }
                   catch(err)
                   {
                       response.card = 0;
                       logError('put - credit, cust: ' + message.id, err);
                   }
               }

               else if(message.deleteExpired)
               {
                   try
                   {
                       for(var i = message.cards.length-1; i >= 0; i--)
                       {

                           var line = customerRecord.findSublistLineWithValue({sublistId: 'creditcards', fieldId: 'ccnumber', value: message.cards[i].ccnumber});
                           customerRecord.removeLine({sublistId: 'creditcards', line: line});
                       }
                   }
                   catch(err)
                   {
                       throw(err);
                   }
               }

               customerRecord.save();

           }

           return SendMessage(response);
       }
       catch(err)
       {
           logError('put, cust:' + message.id, err);
           return {error: err};
       }
   }

   function logError(func, err)
   {
       var errorText = err.code ? JSON.stringify(err.code) : err.toString();
       log.error({
           title: 'CUST - ' + func,
           details: errorText
       });
   }

   return {
       put: put,
       post: post,
   };
});
