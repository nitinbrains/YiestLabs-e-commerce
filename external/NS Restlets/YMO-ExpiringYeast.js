 /**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *Author: Dominik Konecny
 */

define(['N/record', 'N/log', 'N/search', '../wl_ba_cs_item_availability', '../Dom\ Dev\ Library/aes', '../Dom\ Dev\ Library/enc-base64-min.js', './WLAPP-LIB'],
function(record, log, search, itemAvailability)
{
    function post(input)
    {
        try
        {
            var response = ReceiveMessage(input);
            var today = new Date(new Date().toDateString());
            const cutoffDate = new Date(today.setDate(today.getDate() + 14));

            for (var i = response.items.length - 1; i >= 0; i--) 
            {
                var expiringQty = findExpiringYeast(cutoffDate, response.items[i]);
                response.items[i] = {id: response[i], expiringQty: expiringQty};
            }

            return SendMessage(response);
        }
        catch(err)
        {
            log.error({
                title: 'Expiring Yeast - Error', 
                details: err
            });
            return {error: err};
        }
    }

    //Helpers
    function findExpiringYeast(cutoffDate, itemID)
    {
        var expiringQty = 0;
        var Availability = itemAvailability.GetItemAvailability(itemID, [9]); //only checking san diego at the moment
        for(var i = 0, totalLength = Availability.length; i < totalLength; i++)
        {
            if(Availability[i].type == 'Expiration')
            {
                var expiringDate = new Date(Availability[i].dateValue);

                if(expiringDate.getTime() <= cutoffDate.getTime())
                {
                    expiringQty += Availability[i].qty;
                }
            }
        }

        return expiringQty;
    }

    return {
        post: post
    };
});