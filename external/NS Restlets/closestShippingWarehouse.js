 /**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 *Author: Dimitar Vasilev
 */

require(['N/record', 'N/log', 'N/search', 'N/email', 'N/runtime', 'N/https'],
function(record, log, search, email, runtime, https)
{

    function getUserAddressCoordinates(userID)
    {
        var API_KEY = 'AIzaSyDuejdESSuOcCd0Fo6UX8wS0TLXLwwUCac';

        var userRecord = record.load({type: record.Type.CUSTOMER, id: String(userID)});
        var userAddress = userRecord.getValue({fieldId: 'defaultaddress'});

        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        url += userAddress;
        url += '&key=' + API_KEY;

        var response = https.get({
            url: url
        });

        var body = JSON.parse(response.body);

        if(body.status == 'OK')
        {
            location = body.results[0].geometry.location;
            return [location.lat, location.lng]
        }
        else
        {
            return null;
        }
    }

    function findClosestShippingWarehouse(customerLocation) 
    {
        var distances = [];
        var nextIndex = 0;
        var distancesCalculatedOrAttempted = false;
        var setLocation = customerLocation;

        return {
            next: function(){

                if(!setLocation)
                {
                    return {done: true};
                }

                if(!distancesCalculatedOrAttempted){    
                    try 
                    {
                        var API_KEY = 'AIzaSyDuejdESSuOcCd0Fo6UX8wS0TLXLwwUCac';

                        var shippingWarehouses = [ 
                            {
                                warehouseId: 30,            // Copenhagen
                                coordinates: [55.614434, 12.619042],  
                            },
                            {
                                warehouseId: 31,            // Hong Kong
                                coordinates: [22.317785, 114.169764],
                            },
                            {
                                warehouseId: 11,           // Asheville
                                coordinates: [35.591255, -82.549004],
                            },
                            {
                                warehouseId: 9,             // San Diego
                                coordinates: [32.896036, -117.121332],  
                            },
                        ]

                        var customersLocation = [37.956928, -122.012008]    // 964 Court Lane, Concord, CA

                        var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=';
                       
                        url += customersLocation[0] + ',' + customersLocation[1];

                        url += '&destinations=';

                        shippingWarehouses.forEach(function(warehouse){
                            url += warehouse.coordinates[0] + ',' + warehouse.coordinates[1] + '|';
                        })

                        url += '&key=' + API_KEY;

                        var response = https.get({
                            url: url
                        });
                        
                        var body = JSON.parse(response.body);

                        if(body.status == 'OK')
                        {
                            const elements = body.rows[0].elements;
                            const len = elements.length;

                            for(var i = 0; i < len; i++)
                            {

                                var element = elements[i];
                                if(element.status == 'OK')
                                {
                                    distances.push({
                                        warehouseId: shippingWarehouses[i].warehouseId,
                                        distance: element.distance.value
                                    })
                                }
                            }

                            distances.sort(function(a, b){return a.distance - b.distance});
                        }
                        
                    }
                    catch(err)
                    {
                       log.error({
                            title: 'Invalid Request: ',
                            details: err.toString()
                        });
                    }

                    distancesCalculatedOrAttempted = true; 
                }

                return nextIndex < distances.length ? 
                    {value: distances[nextIndex++], done: false} :
                    {done: true};
            }
        }

    }

});