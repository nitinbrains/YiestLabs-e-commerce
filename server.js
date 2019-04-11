const express = require("express");
const nextJS = require("next");
var bodyParser = require("body-parser");
var fs = require("fs");
const fetch = require("isomorphic-unfetch");

const dev = process.env.NODE_ENV !== "production";
const app = nextJS({ dev });
const handle = app.getRequestHandler();

const CryptoJS = require("./lib/CryptoJS");
const XMLParser = require("xml2js").parseString;
const Utils = require("./lib/Utils");
const SalesLib = require("./lib/SalesLib");

var system = dev ? JSON.parse(fs.readFileSync("config.json", "utf8")) : JSON.parse(fs.readFileSync("config.prod.json", "utf8"));

// Uncomment to use a proxy to test TBA or other troubleshooting
// You will need to npm install https-proxy-agent if you haven't done so already.
/*
var HttpsProxyAgent = require('https-proxy-agent');
var HttpProxyAgent = require('http-proxy-agent');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
*/
// Place the code below in a fetch block to make that block use a proxy.
// You will probably need to change the port in the proxy agent.
// Format may be different for GET or POST requests.
/*,
agent:new HttpsProxyAgent('http://127.0.0.1:23772'),
rejectUnauthorized: false,
strictSSL: false
*/


app.prepare().then(() => {
    const server = express();
    server.use(bodyParser.json()); // to support JSON-encoded bodies
    server.use(
        bodyParser.urlencoded({
            // to support URL-encoded bodies
            extended: true
        })
    );

    /*
    //User-based authentication
    function NSAuth(scriptID, type = "post") {
        return "NLAuth nlauth_account=4099054_SB1, nlauth_email=mwhite@whitelabs.com, nlauth_signature=<redacted>, nlauth_role=1067";
    }
    */

    //Token-based authentication
    function NSAuth(scriptID, type = 'post') {
        //RESTlet deployments cannot be in TESTING mode with token-based authentication
        var time = Math.round(new Date().getTime()/1000);
        var nonce = Utils.uuid();

        var base = "deploy=1&oauth_consumer_key=" + system.NSAuthentication.consumerKey
                + "&oauth_nonce=" + nonce
                + "&oauth_signature_method=HMAC-SHA1"
                + "&oauth_timestamp=" + time
                + "&oauth_token=" + system.NSAuthentication.consumerToken
                + "&oauth_version=1.0"
                + "&script=" + scriptID.toString();

        var encodedBase = type.toUpperCase() + "&"
          + encodeURIComponent(system.NSAuthentication.NSURIBase) + "&" + encodeURIComponent(base);
        var baseSignature = system.NSAuthentication.consumerSecret + "&" + system.NSAuthentication.consumerTokenSecret;
        var signature = encodeURIComponent(CryptoJS.HmacSHA1(encodedBase, baseSignature).toString(CryptoJS.enc.Base64));

        var header = 'OAuth realm="' + system.NSAuthentication.NSAccountNo + '",'
                    + 'oauth_consumer_key="' + system.NSAuthentication.consumerKey + '",'
                    + 'oauth_token="' + system.NSAuthentication.consumerToken + '",'
                    + 'oauth_nonce="' + nonce + '",'
                    + 'oauth_timestamp="' + time + '",'
                    + 'oauth_signature_method="HMAC-SHA1",'
                    + 'oauth_version="1.0", '
                    + 'oauth_signature="' + signature + '"';

        return header;
    }

    function NSReceiveMessage(message) {
        return JSON.parse(
            CryptoJS.AES.decrypt(message.data, system.NSAuthentication.ReceiveAuth, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: system.NSAuthentication.Receiveiv }).toString(
                CryptoJS.enc.Utf8
            )
        );
    }

    function NSSendMessage(data) {
        data.version = SalesLib.clientVersion;
        var message = {
            data: CryptoJS.AES.encrypt(JSON.stringify(data), system.NSAuthentication.SendAuth, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: system.NSAuthentication.Sendiv
            }).toString()
        };
        return JSON.stringify(message);
    }

    function XMLtoJSON(xml, cb) {
        XMLParser(xml, function(error, result) {
            if (error) {
                throw error;
            } else {
                cb(result);
            }
        });
    }

    /******************
     * YMO Connections *
     ******************/

    server.post("/get-user-id", function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        var time = new Date();
        var data =
            '<CustomerInformationRequest Operation="Login">' +
                '<Token>' + system.YeastmanAuthentication.Token + "</Token>" +
                "<UserName>" + username.toString() + "</UserName>" +
                "<Password>" + password.toString() + "</Password>" +
                "<TimeStamp>" + time.getTime() + "</TimeStamp>" +
                "<Nonce>" + Utils.uuid() + "</Nonce>" +
            "</CustomerInformationRequest>";
        data = "Validate=" + CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
        fetch("https://www.yeastman.com/Login/Validator.aspx", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data
        })
        .then(response => response.text())
        .then(response => {
            var data = CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: system.YeastmanAuthentication.iv
            }).toString(CryptoJS.enc.Utf8);
            XMLtoJSON(data, result => {
                if (result.CustomerInformation.Result[0].$.Status == "OK") {
                    if (result.CustomerInformation.NetSuiteID[0].$.UserType == "Staff" || result.CustomerInformation.NetSuiteID[0]._ == "43148") {
                        return res.send({ userID: result.CustomerInformation.NetSuiteID[0]._ });
                    } else {
                        return res.send({ userID: result.CustomerInformation.NetSuiteID[0]._ });
                    }
                } else {
                    res.send({ error: { message: "Your username or password is invalid", code: 0 } });
                }
            });
        })
        .catch(function(error) {
            console.log("error", error);
            res.send({ error: { message: error, code: -1 } });
        });
    });

    server.post("/create-yeastman-account", function(req, res, next) {
        for (var i = 0; i < message.id.length; i++) {
            if (message.id[i] <= 0) {
                reject({ message: "failed to create customer in Yeastman", code: 0 });
            }
        }

        var time = new Date();
        var data =
            '<CustomerInformationRequest Operation="Register">' +
                '<Token>' + system.YeastmanAuthentication.Token + "</Token>" +
                "<Password>" + password.toString() + "</Password>" +
                "<TimeStamp>" + time.getTime() + "</TimeStamp>" +
                "<Nonce>" + message.nonce + "</Nonce>" +
                "<ExternalID>" + message.id[0] + "</ExternalID>" +
                "<Email>" + email + "</Email>" +
            "</CustomerInformationRequest>";
        data = "Validate=" + CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
        fetch("https://www.yeastman.com/Login/Validator.aspx", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data
        })
        .then(response => response.text())
        .then(response => {
            var data = CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: system.YeastmanAuthentication.iv
            }).toString(CryptoJS.enc.Utf8);
            XMLtoJSON(data, async result => {
                if (result.CustomerInformation.Result[0].$.Status == "OK") {
                    res.sendStatus(200);
                } else if (result.CustomerInformation.Result[0]._.includes("already exist") || result.CustomerInformation.Result[0]._.includes("already in use")) {
                    res.send({ error: { message: "This account already exists in Yeastman", code: 0 } });
                } else {
                    res.send({ error: { message: "failed to create an account in Yeastman", code: 0 } });
                }
            });
        });
    });

    server.post("/forgot-password", function(req, res, next) {
        var user = req.body.request.user;
        var time = new Date();

        var subjective;
        if (user.email) {
            subjective = "<Email>" + user.email + "</Email>";
        } else {
            subjective = "<UserName>" + user.username + "</UserName>";
        }

        var data =
            '<CustomerInformationRequest Operation="Reset Password">' +
                '<Token>' + system.YeastmanAuthentication.Token + "</Token>" +
                "<TimeStamp>" + time.getTime() + "</TimeStamp>" +
                "<Nonce>" + Utils.uuid() + "</Nonce>" +
                subjective +
            "</CustomerInformationRequest>";
        data =
            "Validate=" + CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
        fetch("https://www.yeastman.com/Login/Validator.aspx", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data
        })
        .then(response => response.text())
        .then(function(response) {
            var data = CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: system.YeastmanAuthentication.iv
            }).toString(CryptoJS.enc.Utf8);
            XMLtoJSON(data, result => {
                if (result.CustomerInformation.Result[0].$.Status == "OK") {
                    res.sendStatus(200);
                } else {
                    res.send({ error: { message: "No account was found", code: 0 } });
                }
            });
        });
    });

    server.post("/change-password", function(req, res, next) {
        const request = req.body.request;
        const user = request.user;
        const newPassword = request.newPassword;
        var time = new Date();

        var subjective;
        if (user.email) {
            subjective = "<Email>" + user.email + "</Email>";
        } else {
            subjective = "<UserName>" + user.username + "</UserName>";
        }

        var data = '<CustomerInformationRequest Operation="Change Password"><Token>' + system.YeastmanAuthentication.Token + '</Token>'
            + '<NetSuiteID>' + user.id + '</NetSuiteID>'
            + '<Email>' + user.email + '</Email>'
            + '<NewPassword>' + newPassword + '</NewPassword>'
            + '<TimeStamp>' + time.getTime() + '</TimeStamp>'
            + '<Nonce>' + Utils.uuid() + '</Nonce>'
        + '</CustomerInformationRequest>';
        
        data = 'Validate=' + system.CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: system.CryptoJS.mode.CBC, padding: system.CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
        fetch('https://www.yeastman.com/Login/Validator.aspx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data
        })
        .then(response => response.text())
        .then(function(response) {
            var data = CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: system.YeastmanAuthentication.iv
            }).toString(CryptoJS.enc.Utf8);
            XMLtoJSON(data, result => {
                if (result.CustomerInformation.Result[0].$.Status == "OK") {
                    res.sendStatus(200);
                } else {
                    res.send({ error: { message: "Could not process your request please contact White Labs for support", code: 0 } });
                }
            });
        });
    });

    server.post("/activate-account", function(req, res, next) {
        var request = req.body.request;

        var time = new Date();

        var subjective;
        if (request.userOrEmail) {
            subjective = "<AccountNumber>" + request.userInfo + "</AccountNumber>";
        } else {
            subjective = "<Email>" + request.userInfo + "</Email>";
        }

        var data =
            '<CustomerInformationRequest Operation="Lookup">' +
                '<Token>' + system.YeastmanAuthentication.Token +  "</Token>" +
                "<TimeStamp>" + time.getTime() + "</TimeStamp>" +
                "<Nonce>" + Utils.uuid() + "</Nonce>" +
                subjective +
            "</CustomerInformationRequest>";
        data =
            "Validate=" + CryptoJS.AES.encrypt(data, system.YeastmanAuthentication.Auth, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: system.YeastmanAuthentication.iv }).toString();
        fetch("https://www.yeastman.com/Login/Validator.aspx", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data
        })
        .then(response => response.text())
        .then(response => {
            var data = CryptoJS.AES.decrypt(response, system.YeastmanAuthentication.Auth, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: system.YeastmanAuthentication.iv
            }).toString(CryptoJS.enc.Utf8);
            XMLtoJSON(data, result => {
                if (result.CustomerInformation.Result[0].$.Status == "OK") {
                    res.sendStatus(200);
                } else {
                    res.send({ error: { message: "Could not recover your account please try again later", code: 0 } });
                }
            });
        });
    });

    /***********************
     * NetSuite Connections *
     ***********************/

    /**
     * Get item availability
     *
     * @return [Items] - Returns array of items
     */
    server.get("/get-inventory", (req, res, next) => {
        fetch(system.ITEM.url, {
            method: "GET",
            headers: {
                Authorization: NSAuth(system.ITEM.id, "get"),
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.type == "error.SuiteScriptError") {
                res.send({ error: { message: response.message, code: -1 } });
            } else if (response.error) {
                if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                    console.log("server", "get-inventory", response, true);
                }

                res.send({ error: { message: response.error.message, code: response.error.code } });
            } else {
                var message = NSReceiveMessage(response);

                if (message.items && message.items.length > 0) {
                    return res.send(message);
                } else {
                    res.send({ error: { message: "No items in inventory", code: -1 } });
                }
            }
        })
        .catch(error => {
            res.send({ error: { message: error, code: -1 } });
        });
    });

    /**
     * Get item availability
     *
     * @param {Integer} itemID - Request item availability for item with id
     *
     * @return {Map} - Returns map of ship locations and quantity available
     */
    server.post("/get-item-availability", function(req, res, next) {
        var itemID = req.body.itemID;

        if (itemID) {
            var body = NSSendMessage({ itemID });

            fetch(system.ITEM.url, {
                method: "POST",
                headers: {
                    Authorization: NSAuth(system.ITEM.id, "post"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "get-item-availability", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: response.error.code } });
                } else {
                    var message = NSReceiveMessage(response);
                    return res.send(message);
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "No item provided. Cannot get item availability", code: -1 } });
        }
    });

    /**
     * Get user information
     *
     * @param {Integer} userID - Request user information for user with id
     *
     * @return {Object} - Returns object with items and ship dates, transit times, ship locations, and pricing
     */
    server.post("/get-user-info", function(req, res, next) {
        var userID = req.body.userID;

        if (userID) {
            var body = NSSendMessage({ id: userID, get: true });

            fetch(system.CUST.url, {
                method: "POST",
                headers: {
                    Authorization: NSAuth(system.CUST.id, "post"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        // ErrorMod.log('server', 'requestUserInfo', response, true);
                        console.log("server", "get-user-info", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: response.error.code } });
                } else {
                    var message = NSReceiveMessage(response);
                    if (message) {
                        return res.send(message);
                    } else {
                        res.send({ error: { message: "user info not working", code: -1 } });
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in, cannot retrieve User Info", code: -1 } });
        }
    });

    /**
     * Prepare order
     *
     * @param {Object} order - Object with item information
     *
     * @return {Object} - Returns object with items and ship dates, transit times, ship locations, and pricing
     */
    server.post("/prepare-order", function(req, res, next) {
        const request = req.body;
        if (request.user.id) {
            var message = NSSendMessage(request);

            fetch(system.ORDER.url, {
                method: "PUT",
                headers: {
                    Authorization: NSAuth(system.ORDER.id, "put"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: message
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    return res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "prepare-order", response, true);
                    }

                    return res.send({ error: { message: response.error.message, code: -1 } });
                } else {
                    var message = NSReceiveMessage(response);
                    if (message.items && message.items.length > 0 && message.transitTimes) {
                        return res.send(message);
                    } else {
                        console.log("Items have been removed due to unavailability");
                        //return res.send({ error: { message: "Items have been removed due to unavailability", code: 0 } });
                        return res.send(message);
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in, cannot retrieve ship dates", code: -1 } });
        }
    });

    /**
     * Place order in NetSuite
     *
     * @param {Object} order - Object with items and user information
     *
     * @return [Integer] - Array of integers representing order numbers
     */
    server.post("/place-order", function(req, res, next) {
        const request = req.body.request;

        if (request.user.id) {
            var message = NSSendMessage(request);

            fetch(system.ORDER.url, {
                method: "POST",
                headers: {
                    Authorization: NSAuth(system.ORDER.id, "post"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: message
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "place-order", response, true);
                    }
                    res.send({ error: { message: response.error.message, code: response.error.code } });
                } else {
                    var message = NSReceiveMessage(response);

                    if (message.orderNum.length > 0) {
                        res.sendStatus(200);
                    } else {
                        res.send({ error: { message: "Items have been removed due to unavailability", code: 0 } });
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in, cannot place order", code: 0 } });
        }
    });

    /**
     * Update user account information in NetSuite
     *
     * @param {Object} custInfo - Object containing customer info to be changed
     *
     * @return null if success
     */
    server.post("/update-user-info", function(req, res, next) {
        const request = req.body.request;
        if (request.id) {
            var message = NSSendMessage(request);

            fetch(system.CUST.url, {
                method: "PUT",
                headers: {
                    Authorization: NSAuth(system.CUST.id, "put"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: message
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "update-user-info", response, true);
                    }

                    res.status(500).send({ error: { message: response.error.message, code: response.error.code } });
                } else {
                    var message = NSReceiveMessage(response);
                    res.sendStatus(200);
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in, cannot change User Info", code: -1 } });
        }
    });

    server.post("/add-subsidiary", function(req, res, next) {
        var request = req.body.request;

        if (request.id) {
            const body = NSSendMessage(request);

            fetch(system.CUST.url, {
                method: 'PUT',
                headers: {
                    Authorization: NSAuth(system.CUST.id, "put"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "get-order-history", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: -1 } });
                } else {
                    var message = NSReceiveMessage(response);
                    if(message.id) {
                        res.send(message);
                    } else {
                        res.send({ error: { message: "Failed to create subsidiary", code: 0 }});
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            })
        } else {
            res.send({ error: { message: "User is not logged in, cannot create subsidiary", code: -1 } });
        }
    })

    /**
     * Get order history for a customer
     *
     * @param String userID - User Id of customer requesting order history
     *
     * @return [Object] - Array of order objects
     */
    server.post("/get-order-history", function(req, res, next) {
        var request = req.body.request;

        if (request.id) {
            const body = NSSendMessage({ id: request.id, admin: false, get: true });

            fetch(system.ORDER.url, {
                method: "POST",
                headers: {
                    Authorization: NSAuth(system.ORDER.id, "post"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "get-order-history", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: -1 } });
                } else {
                    var message = NSReceiveMessage(response);
                    if (message.orderHistory && message.orderHistory.length > 0) {
                        res.send(message);
                    } else {
                        res.send({ error: { message: "No past orders were found", code: 0 } });
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in, cannot retrieve Order History", code: -1 } });
        }
    });

    /**
     * Get pricing for order
     *
     * @param {Object} request - Object containing items, shipmethod, and coupon code (optional)
     *
     * @return {Object} - Object containing item subtotal, shipping subtotal, and order subtotal
     */
    server.post("/get-order-price", function(req, res, next) {
        var request = req.body.request;
        if (request.userID) {
            var message = NSSendMessage(request);

            fetch(system.ORDER.url, {
                method: "PUT",
                headers: {
                    Authorization: NSAuth(system.ORDER.id, "put"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: message
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "get-order-price", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: -1 } });
                } else if (response.message && response.message.toLowerCase().includes("invalid couponcode")) {
                    res.send({ error: { message: "Invalid coupon code", code: 0 } });
                } else {
                    var message = NSReceiveMessage(response);
                    if (message.orderSubtotal) {
                        res.send(message);
                    } else {
                        res.send({ error: { message: "No subtotal", code: -1 } });
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in, cannot retrieve pricing", code: -1 } });
        }
    });

    /**
     * Create customer account in NetSuite
     *
     * @param {Object} custInfo - Object containing all customer's info required upon registration
     *
     * @return {Object} - Object containing array of ids for each related customer account, username, and token id
     */
    server.post("/create-netsuite-account", function(req, res, next) {
        var custInfo = req.body.custInfo;

        var message = NSSendMessage(custInfo);
        creditInfo = null;

        // CUST
        fetch(system.CUST.url, {
            method: "POST",
            headers: {
                Authorization: NSAuth(system.CUST.id),
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: message
        })
        .then(response => response.json())
        .then(response => {
            if (response.type == "error.SuiteScriptError") {
                res.send({ error: { message: response.message, code: -1 } });
            } else if (response.error) {
                if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED")) {
                    console.log("server", "create-netsuite-account", response, true);
                }

                res.send({ error: { message: response.error.message, code: response.error.code } });
            } else {
                var message = NSReceiveMessage(response);
                message.nonce = nonce;
                res.send(message);
            }
        })
        .catch(error => {
            res.send({ error: { message: error, code: -1 } });
        });
    });

    /**
     * Get similar strains for a particular item
     *
     * @param {int} userID - ID of user logged in
     * @param {Object} item - the yeast item being exchanged
     * @param {Object} itemRef - the inventory item reference to the yeast item
     * @param [string] selectedStyles - List of beer styles that will be used
     * 		to look up alternative strains
     * @return [Object] - array of strains
     */
    server.get("/similar-strains", function(req, res, next) {
        var request = req.body.request;

        if (request.userID) {
            var message = NSSendMessage({ id: request.userID, SaleItem: request.item, ItemGroup: request.itemRef.volID.slice(0, 3), selectedStyles: request.selectedStyles });

            fetch(system.ITEM.url, {
                method: "PUT",
                headers: {
                    Authorization: NSAuth(system.ITEM.url, "put"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: message
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "similar-strains", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: -1 } });
                } else {
                    var message = NSReceiveMessage(response);
                    if (message.alternateStrains.length > 0) {
                        message.alternateStrains.forEach(function(y) {
                            y.alternateItem = true;
                            y.purepitch = true;
                        });

                        res.send(message.alternateStrains);
                    } else {
                        res.send({ error: { message: "No alternate strains were found", code: 0 } });
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in", code: -1 } });
        }
    });

    /**
     * Get alternate sizes for a particular item
     *
     * @param {int} userID - ID of user logged in
     * @param {Object} item - the yeast item being exchanged
     * @param {Object} itemRef - the inventory item reference to the yeast item
     *
     * @return [Object] - array of strains
     */
    server.post("/alternate-sizes", function(req, res, next) {
        var request = req.body.request;

        if (request.userID) {
            var message = NSSendMessage({
                alternateSizes: true,
                id: request.userID,
                SaleItem: request.item,
                ItemGroup: request.itemRef.volID.slice(0, 3),
                subsidiary: parseInt(request.subsidiary)
            });

            fetch(system.ITEM.url, {
                method: "PUT",
                headers: {
                    Authorization: NSAuth(system.ITEM.id, "put"),
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: message
            })
            .then(response => response.json())
            .then(response => {
                if (response.type == "error.SuiteScriptError") {
                    res.send({ error: { message: response.message, code: -1 } });
                } else if (response.error) {
                    if (!(response.error.code == "WS_CONCUR_SESSION_DISALLWD" || response.error.code == "WS_REQUEST_BLOCKED" || response.error.code == -1)) {
                        console.log("server", "alternate-sizes", response, true);
                    }

                    res.send({ error: { message: response.error.message, code: -1 } });
                } else {
                    var message = NSReceiveMessage(response);
                    if (message.alternateSizes.length > 0) {
                        message.alternateSizes.forEach(function(x) {
                            x.forEach(function(y) {
                                if (y) {
                                    y.Name = String(itemRef.Name);
                                    y.salesCategory = parseInt(itemRef.salesCategory);
                                    y.alternateItem = true;
                                    y.purepitch = true;
                                }
                            });
                        });

                        res.send(message.alternateSizes);
                    } else {
                        reject({ message: "No alternative size combinations were found", code: 0 });
                    }
                }
            })
            .catch(error => {
                res.send({ error: { message: error, code: -1 } });
            });
        } else {
            res.send({ error: { message: "User is not logged in", code: -1 } });
        }
    });

    server.get("*", (req, res, next) => {
        return handle(req, res, next);
    });

    server.listen(4000, error => {
        if (error) throw error;
        console.log("> Ready on http://localhost:4000");
    });
})
.catch(ex => {
    console.error(ex.stack);
    process.exit(1);
});
