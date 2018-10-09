/*
 * Author: Dominik Konecny
 */

var Events = {

    //UNUSED
    GET: function (input) {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a GET request');
    },

    /*
        input = {
            CustomerID
            shipaddress (optional)
            *shipaddress1
            *shipaddress2
            *shipaddress3
            *shipcity
            *shipzip
            *shipcountryid
            billaddress (optional)
            *billaddress1
            *billaddress2
            *billaddress3
            *billcity
            *billzip
            *billcountryid
            OrderComment (optional)
            shipMethod (optional)
            SaleItems[
                chosenShipDate
                MerchandiseID
                OrderDetailQty
            ]
        }
        response = {
            orderNum[] *** collects responses
        }
    */
    POST: function (input) {

        var billaddressindex;
        var shipaddressindex;
    	 
        var response = {};

        var record = ReceiveMessage(input);

        try
        {
            response.tokenid = record.tokenid;
            response.orderNum = [];

            var customerid = parseInt(record.CustomerID);

            var today = new Date();

            var custRecord = nlapiLoadRecord('customer', customerid);
            var userLocation = parseInt(custRecord.getFieldValue('subsidiary'));

            var WillCall = null;
            if([3470, 3472, 13332, 3469, 3511].indexOf(parseInt(record.shipMethod)) >= 0 || (!record.shipMethod && [3470, 3472, 13332, 3469, 3511].indexOf(parseInt(custRecord.getFieldValue('shippingitem'))) >= 0))
            {
                if(record.shipMethod)
                {
                    WillCall = parseInt(record.shipMethod);
                }
                else
                {
                    WillCall = parseInt(custRecord.getFieldValue('shippingitem'));
                }
            }
            else if(record.shipaddress)
            {
                var found = false;

                for(var i = 1; i <= custRecord.getLineItemCount('addressbook'); i++ )
                {
                    custRecord.selectLineItem('addressbook', i);
                    var subrecord = custRecord.viewCurrentLineItemSubrecord('addressbook','addressbookaddress');
                    if(record.shipzip == subrecord.getFieldValue('zip'))
                    {
                        if(record.shipaddressee == subrecord.getFieldValue('addressee') && record.shipaddress1 == subrecord.getFieldValue('addr1'))
                        {
                            shipaddressindex = custRecord.getCurrentLineItemValue('addressbook', 'internalid');
                            found = true;
                            break;
                        }
                    }
                }

                if(!found)
                {
                    custRecord.selectNewLineItem('addressbook');
                    var subrecord = custRecord.createCurrentLineItemSubrecord('addressbook', 'addressbookaddress');
                    if(record.shipattn)
                    {
                        subrecord.setFieldValue('attention', record.shipattn);
                    }

                    subrecord.setFieldValue('addressee', record.shipaddressee);
                    subrecord.setFieldValue('addr1', record.shipaddress1);

                    if(record.shipaddress2)
                    {
                        subrecord.setFieldValue('addr2', record.shipaddress2);
                    }

                    if(record.shipaddress3)
                    {
                        subrecord.setFieldValue('addr3', record.shipaddress3);
                    }
                    
                    subrecord.setFieldValue('city', record.shipcity);
                    subrecord.setFieldValue('zip', record.shipzip);
                    subrecord.setFieldValue('country', record.shipcountryid);
                    subrecord.commit();
                    custRecord.commitLineItem('addressbook');
                    nlapiSubmitRecord(custRecord, false);
                    custRecord = nlapiLoadRecord('customer', customerid);
                    var newAddress = parseInt(custRecord.getLineItemCount('addressbook'));
                    custRecord.selectLineItem('addressbook', newAddress);
                    shipaddressindex = custRecord.getCurrentLineItemValue('addressbook', 'internalid');
                }
            }

            if(record.billaddress)
            {
                var found = false;

                for(var i = 1; i <= custRecord.getLineItemCount('addressbook'); i++ )
                {
                    custRecord.selectLineItem('addressbook', i);
                    var subrecord = custRecord.viewCurrentLineItemSubrecord('addressbook','addressbookaddress');
                    if(record.billzip == subrecord.getFieldValue('zip'))
                    {
                        if(record.billaddressee == subrecord.getFieldValue('addressee') && record.billaddress1 == subrecord.getFieldValue('addr1'))
                        {
                            billaddressindex = custRecord.getCurrentLineItemValue('addressbook', 'internalid');
                            found = true;
                            break;
                        }
                    }

                }

                if(!found)
                {
                    custRecord.selectNewLineItem('addressbook');
                    var subrecord = custRecord.createCurrentLineItemSubrecord('addressbook', 'addressbookaddress');
                    if(record.billattn)
                    {
                        subrecord.setFieldValue('attention', record.billattn);
                    }
                    
                    subrecord.setFieldValue('addressee', record.billaddressee);
                    subrecord.setFieldValue('addr1', record.billaddress1);

                    if(record.billaddress2)
                    {
                        subrecord.setFieldValue('addr2', record.billaddress2);
                    }

                    if(record.billaddress3)
                    {
                        subrecord.setFieldValue('addr3', record.billaddress3);
                    }
                    
                    subrecord.setFieldValue('city', record.billcity);
                    subrecord.setFieldValue('zip', record.billzip);
                    subrecord.setFieldValue('country', record.billcountryid);
                    subrecord.commit();
                    custRecord.commitLineItem('addressbook');
                    nlapiSubmitRecord(custRecord, false);
                    custRecord = nlapiLoadRecord('customer', customerid);
                    var newAddress = parseInt(custRecord.getLineItemCount('addressbook'));
                    custRecord.selectLineItem('addressbook', newAddress);
                    billaddressindex = custRecord.getCurrentLineItemValue('addressbook', 'internalid');
                }
            }

            for(var i = 0; i < record.SaleItems.length; i++)
            {
                if(!record.SaleItems[i].done)
                {
                   // Initialize new sales order object
                    var salesorder = {};

                    salesorder = nlapiCreateRecord('salesorder', {recordmode: 'dynamic'});
                    
                    salesorder.setFieldValue('entity', customerid);
                    salesorder.setFieldValue('trandate', today);

                    if(record.creditID)
                    {
                        salesorder.setFieldValue('customform', 102);
                        salesorder.setFieldValue('creditcard', record.creditID);
                    }
                    else
                    {
                        salesorder.setFieldValue('customform', 101);
                        if(custRecord.getFieldValue('subsidiary') != 2 && (!custRecord.getFieldValue('terms') || custRecord.getFieldValue('terms') == 10))
                        {
                            salesorder.setFieldValue('terms', 12); //Bank transfer required for non US
                        }
                    }

                    if(record.billaddress)
                    {
                        salesorder.setFieldValue('billaddresslist', billaddressindex);
                    }

                    salesorder.setFieldValue('custbody_wl_ymo_synced', 'T');                    
                    
                    if(record.OrderComment)
                    {
                        salesorder.setFieldValue('memo', record.OrderComment.substring(0,997));
                    }

                    if(record.PONum)
                    {
                        salesorder.setFieldValue('otherrefnum', record.PONum);
                    }

                    if(record.couponCode)
                    {
                        salesorder.setFieldText('couponcode', record.couponCode);
                    }
                    
                    if(record.shipMethod)
                    {
                        if(record.shipMethod != -3)
                        {
                            salesorder.setFieldValue('shipmethod', record.shipMethod);
                        }   
                    }

                    var shipdate = nlapiDateToString(new Date(record.SaleItems[i].chosenShipDate), 'date');
                    salesorder.setFieldValue('shipdate', shipdate);

                    if(custRecord.getFieldValue('subsidiary') == 5)
                    {
                        salesorder.setFieldText('orderstatus', 'Pending Approval');
                    }

                    if(WillCall)
                    {
                        setWillCallAddress(WillCall, salesorder, salesorder.getFieldText('entity'));
                    }
                    else if(record.shipaddress)
                    {
                       salesorder.setFieldValue('shipaddresslist', shipaddressindex);
                    }

                    salesorder.selectNewLineItem('item');
                    salesorder.setCurrentLineItemValue('item', 'item', record.SaleItems[i].MerchandiseID);
                    salesorder.setCurrentLineItemValue('item', 'quantity', record.SaleItems[i].OrderDetailQty);
                    salesorder.setCurrentLineItemValue('item', 'location', record.SaleItems[i].Warehouse); //needs to be replaced with lookup of location based on customer region
                    salesorder.commitLineItem('item');
                
                    for(var j = i+1; j < record.SaleItems.length; j++)
                    {
                        if(compareDates(new Date(record.SaleItems[i].chosenShipDate), new Date(record.SaleItems[j].chosenShipDate)) == 0)
                        {
                            salesorder.selectNewLineItem('item');
                            salesorder.setCurrentLineItemValue('item', 'item', record.SaleItems[j].MerchandiseID);
                            salesorder.setCurrentLineItemValue('item', 'quantity', record.SaleItems[j].OrderDetailQty);
                            salesorder.setCurrentLineItemValue('item', 'location', record.SaleItems[j].Warehouse); //needs to be replaced with lookup of location based on customer region
                            salesorder.commitLineItem('item');
                            record.SaleItems[j].done = true;
                        }
                    }

                    var id = 0;
                    id = nlapiSubmitRecord(salesorder, true);
                    
                    if (id != null && id != 0) 
                    {
                        response.errorCode = 0;
                        response.orderNum.push(parseInt(id));
                    }
                    else 
                    {
                        response.errorCode = -3;
                    }    
                }
            }
        }
        catch(err)
        {
            nlapiLogExecution('ERROR', 'Cust '+ record.CustomerID.toString(), JSON.stringify(err.toString()));
            response.errorCode = -1;
        }
        return SendMessage(response);           	
    },

    //UNUSED
    PUT: function (input) {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a PUT request');
    },

    //UNUSED
    DELETE: function (input) {
        nlapiLogExecution('ERROR', 'Unauthorized Access', 'Someone tried to execute a DELETE request');
    }
};

function setWillCallAddress(shipMethod, salesOrderRecord, customerName)
{
    switch(shipMethod)
    {
        case 3470:  //Boulder
            salesOrderRecord.setFieldValue('shipaddresslist', null);
            salesOrderRecord.setFieldValue('shipaddress', 'Attn To: ' + customerName + '\nBoulder Will-Call\n1898 S. Flatiron Ct. Suite 213\nBoulder, CO 80301 US');
            break;
        case 3472: //Asheville
        case 13332: //Go Green
            salesOrderRecord.setFieldValue('shipaddresslist', null);
            salesOrderRecord.setFieldValue('shipaddress', 'Attn To: ' + customerName + '\nAsheville Will-Call\n172 South Charlotte Street\nAsheville, NC 28801 US');
            break;
        case 3469: //SD
        case 3511: //Go Green
            salesOrderRecord.setFieldValue('shipaddresslist', null);
            salesOrderRecord.setFieldValue('shipaddress', 'Attn To: ' + customerName + '\nSan Diego Will-Call\n9495 Candida Street\nSan Diego, CA 92126 US');
            break;
    }
}