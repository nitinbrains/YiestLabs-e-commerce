/** 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *Author: Dimitri Vasilev
 */

define (['N/record', 'N/http', 'N/log', '../Dom\ Dev\ Library/aes', '../Dom\ Dev\ Library/enc-base64-min.js', './WLAPP-LIB'],
function(record, http, log) {

    function myAfterSubmit(context) {   
        
        try
        {
            log.debug({title: 'context type', details: context.type});

            if (context.type !== context.UserEventType.EDIT) return;    
        
            var record = context.newRecord;
            // var oldRecord = context.oldRecord;

            // var oldStatus = oldRecord.getValue({fieldId: 'status'});
            // var newStatus = newRecord.getValue({fieldId: 'status'});


            var trackingnumbers = record.getValue({fieldId: 'linkedtrackingnumbers'});

            // if(!trackingnumbers) return;

            var OrderID = record.getValue({fieldId: 'tranid'});
            var UserID =  record.getValue({fieldId: 'entity'});

            var body = {UserID:  UserID, kind: "order_shipped", content: OrderID, message: 'Your order has been shipped!' };

            log.debug({title: 'body', details: body});
            
            var response = http.post({
                url: 'http://35.193.208.36:14400/send_push_notification/',
                body: body
            });

            log.debug({title: 'response', details: response})

        }
        catch(err)
        {
            log.error({
                title: 'Error',
                details: JSON.stringify(err)
            });
        }          
      
    }
    


    // Add the return statement that identifies the entry point funtions.
    return {
        afterSubmit: myAfterSubmit
    };   
});