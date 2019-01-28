/*
 * Author: Dominik Konecny
 */

var Events = {

    //UNUSED
    GET: function (input) {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a GET request');
    },

    POST: function (input) 
    {
        try
        {
            var message = ReceiveMessage(input);

            if(!(message.version && versionUpToDate(message.version)))
            {
                throw {message: 'App version is out of date. Please download new version.', code: 0};
            }

            if(message.email.indexOf('@') <= 0)
            {
                throw {message: 'Invalid Email', code: -1};
            }

            var files = nlapiSearchGlobal('File: Sales Order_' + message.orderID + '%.pdf');
            
            if(files && files.length != 0)
            {
                var fileID = files[0].getId();
                if(fileID)
                {    
                    var file = nlapiLoadFile(fileID);
                    nlapiSendEmail(298063, message.email, "Sales Order " + message.orderID + " (Copy)", "Attached is a copy of your invoice for Sales Order: " + message.orderID, null, null, null, file, false, false, null);
                    return SendMessage({error: false});                    
                }
                else
                {
                    throw {message: 'No fileID on search result', code: -1};
                }
            }
            else
            {
                throw {message: 'No files found', code: -1};
            }
        }
        catch(error)
        {
            nlapiLogExecution('ERROR', 'Resend Invoice - error', error.toString());
            return {error: error};
        }
    },

    //UNUSED
    PUT: function (input) {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a PUT request');
    },

    //UNUSED
    DELETE: function (input) {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a DELETE request');
    },
};