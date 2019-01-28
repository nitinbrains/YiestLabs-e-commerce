/*
    Author: Dominik Konecny
*/

var Events = {

    //UNUSED
    GET: function (input) 
    {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a GET request');
    },

    POST: function (input) 
    {
        try
        {
            var message = ReceiveMessage(input);

            if(!(message.version && versionUpToDate(message.version)))
            {
                return { error: {message: 'App version is out of date. Please download new version.', code: 0}}; 
            }

            var searchResults = nlapiSearchGlobal(message.name);
            var customerResults = [];

            if(searchResults)
            {
                for(var i = 0; i < searchResults.length; i++)
                {
                    var type = searchResults[i].getRecordType();
                    if(type == 'customer')
                    {
                        var customerName = searchResults[i].getValue('name');
                        if(customerName)
                        {
                            var customer = {id: searchResults[i].getId(), name: customerName};
                            customerResults.push(customer);
                        }
                    }
                }
            }

            return SendMessage(customerResults);
        }
        catch(error)
        {
            nlapiLogExecution('ERROR', "Error in POST", error.toString());
            return {error: error};
        }
    },

    PUT: function (input) {

        try
        {
            var message = ReceiveMessage(input);

            var response = [];
            var filters = [];        
            var columns = [];

            columns.push(new nlobjSearchColumn('companyname'));
            columns.push(new nlobjSearchColumn('billaddress'));
            columns.push(new nlobjSearchColumn('custentity_gs_phonenumber'));
            columns.push(new nlobjSearchColumn('lastorderdate')); //Authorized Purchaser
            columns.push(new nlobjSearchColumn('category'));

            if(message.city)
            {
                filters.push(new nlobjSearchFilter('city', null, 'is', message.city));
            }

            if(message.state)
            {
                filters.push(new nlobjSearchFilter('state', null, 'anyof', message.state));
            }
            
            if(message.country)
            {
                filters.push(new nlobjSearchFilter('country', null, 'anyof', message.country));
            }
            

            filters.push(new nlobjSearchFilter('isdefaultbilling', null, 'is', 'T'));
            filters.push(new nlobjSearchFilter('category', null, 'noneof', '3'));

            try 
            {
                var customerSearch = nlapiCreateSearch('customer', filters, columns);
                var resultSet = customerSearch.runSearch();
            }
            catch (error) 
            {
                nlapiLogExecution('ERROR', 'Here it is', error);
                nlapiLogExecution('ERROR', 'Failed to load search', 'Customers could not be retrieved');
                return response;
            }

            var index = 0;

            do
            { 
                var results = resultSet.getResults(index, index+1000);
                index += 1000;

                if (results == null || results.length == 0) 
                {
                    nlapiLogExecution('ERROR', 'No results returned in IAPP-FindCustomersByLocation', 'Customers could not be retrieved');
                    return response;
                }

                for (var i = 0; i < results.length; i++) 
                {
                    var customer = {};

                    customer.id = results[i].getId();
                    customer.name = results[i].getValue('companyname');
                    customer.address = results[i].getValue('billaddress');
                    customer.phone = results[i].getValue('custentity_gs_phonenumber');
                    customer.lastOrder = results[i].getValue('lastorderdate');
                    customer.type = results[i].getText('category');

                    response.push(customer);
                }
            }
            while(results.length == 1000);

            return SendMessage(response);
        }
        catch(error)
        {
            nlapiLogExecution('ERROR', "Error in PUT", error.toString());
            return {error: error};
        }
    },

    //UNUSED
    DELETE: function (input) 
    {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a DELETE request');
    }
};