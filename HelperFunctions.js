function basic_Response_Validations(){
    describe("Basic Response Validatations", ()=> {
        
        it("Is Status Code 200?", ()=> {
            response.should.have.status(200);
        });

        it("Is response content-type is JSON?", ()=> {
            pm.response.contentInfo().contentType === ("text/json" || "application/json");
        });

        it("Is Response in JSON format?", ()=> {
            response.body.should.be.an("object");
        });

        it("Is \"infoID\" Zero?", ()=> {
            response.body.response.infoID.should.eql("0");
        });

        it("The object \"data\" should not be empty?", ()=> {
            response.body.response.data.should.not.be.empty;
        });

        it("Received response within 30,000 milli-seconds?", ()=> {
            response.time.should.at.most(30000);
        });

        if (request.name === "Init") {
            it("Does the response has the keys \"appID\" and \"msgID\"?", ()=> {
                response.body.response.data.should.contain.all.keys("appID");
                response.body.response.should.contain.all.keys("msgID");
            });
    
            it("Is \"appID\" not empty and Is a string?", ()=> {
                response.body.response.data.appID.should.not.be.empty;
                response.body.response.data.appID.should.be.a("string");
            });
    
        }
        else {
            it("Does the response has the keys \"appID\" and \"msgID\"?", ()=> {
                response.body.response.should.contain.all.keys("appID", "msgID");
            });
    
            it("Is \"appID\" not empty and Is a string?", ()=> {
                response.body.response.appID.should.not.be.empty;
                response.body.response.appID.should.be.a("string");
            });
        }

        it("Is \"msgID\" not empty and Is a string?", () =>{
            response.body.response.msgID.should.not.be.empty;
            response.body.response.msgID.should.be.a("string");
        });

    });
}

function basic_Request_Validations() {
    let requestJOSN = JSON.parse(request.data);
    describe("Basic Request validations", ()=> {

        it("Is Request in JSON format?", ()=> {
            requestJOSN.should.be.an("object");
        });

        it("Does request has the object \"requet\"", ()=> {
            requestJOSN.should.contain.all.keys("request");
        });

        it("Is Request has the key \"appID\"?", ()=> {
            requestJOSN.request.should.contain.all.keys("appID");
        });

        it("Does Request JSON has an object \"data\"?", ()=> {
            requestJOSN.request.should.contain.all.keys("data");
        });

        it("Is HTTP method POST?", ()=> {
            request.method.should.eql("POST");
        });
    });
}

function setPostmanBDD(){
    if (!environment.postman_bdd_path) {
        pm.globals.set('postman_bdd_path', 'https://jamesmessinger.com/postman-bdd/dist/postman-bdd.min.js');
    }
    pm.sendRequest(pm.globals.get('postman_bdd_path'), function (err, response) {
        pm.globals.set('postmanBDD', response.text());
    });
 }

function chart_Response_Validation(){

    var schema = 
    {
        "$schema": "http://json-schema.org/draft-07/schema",
        "$id": "http://example.com/example.json",
        "type": "object",
        "properties": {
            "response": {
            "$id": "#/properties/response",
            "type": "object",
            "required": [
                "appID",
                "data",
                "infoID",
                "msgID"
            ],
            "properties": {
                "appID": {
                    "$id": "#/properties/properties/appID",
                    "type": "string",
                    "minLength": 32,
                    "maxLength": 32
                },
                "infoID": {
                    "$id": "#/properties/properties/infoID",
                    "type": "string",
                    "minLength": 1
                },
                "msgID": {
                    "$id": "#/properties/properties/msgID",
                    "type": "string",
                    "minLength": 32,
                    "maxLength": 32
                },
                "data": {
                    "$id": "#/properties/properties/data",
                    "properties": {
                        "close": {
                            "$id": "#/properties/properties/data/properties/close",
                            "type": "array",
                            "items": {
                                "type": "number",
                                "minItems": 5
                            }
                        },
                        "date": {
                            "$id": "#/properties/properties/data/properties/date",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "pattern": "[0-9]{4}/[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}",
                                "minLength": 19,
                                "maxLength": 19
                            }
                        },
                        "high": {
                            "$id": "#/properties/properties/data/properties/high",
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "low": {
                            "$id": "#/properties/properties/data/properties/low",
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "open": {
                            "$id": "#/properties/properties/data/properties/open",
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "volume": {
                            "$id": "#/properties/properties/data/properties/volume",
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        },
                        "precision": {
                            "$id": "#/properties/properties/data/properties/precision",
                            "type": "integer"
                            }
                        },
                        "required": [
                            "close",
                            "open",
                            "high",
                            "low",
                            "date",
                            "precision"
                        ]
                    }
                }
            }
        }
    };

    it('Is schema valid', ()=>{
        pm.expect(response.body).to.have.jsonSchema(schema);
    });

    it('Is close price array is greater than one', ()=>{
        (response.body.response.data.close).length.should.be.above(1);
    });

    if(JSON.parse(request.data).request.data.contains.a.keys("indicatorsInput"))
    {
        it('Is ouputs array not empty', ()=> {
            response.body.response.data.indicatorsOutPut.forEach(function(indicators){
                (indicators.ouputs).should.not.be.empty;
            })
        });
    
        it('Is points array not empty', ()=> {
            response.body.response.data.indicatorsOutPut.forEach(function(indicators){
                indicators.ouputs.forEach(function(outputs){
                    (outputs.points).should.not.be.empty
                })
            })
        })
    }    
}

function chart_Request_Validation(){
    let requestJOSN = JSON.parse(request.data);
    describe("Chart Request Validations", ()=> {

        it("Does request has the object \"requet\"?", ()=> {
            requestJOSN.should.contain.all.keys("request");
        });

        if (it("Does the object \"data\" contains keys \"internal\" and \"symbol\" and are not empty?", ()=> {
                requestJOSN.request.data.should.contain.all.keys("interval", "symbol");
            }))
        {
            it("The objects \"interval\" and \"symbol\" should be a stringa and not empty", ()=> {
                requestJOSN.request.data.interval.should.be.a("string");
                requestJOSN.request.data.symbol.should.be.a("string");
                requestJOSN.request.data.interval.should.not.be.empty;
                requestJOSN.request.data.symbolName.should.not.be.empty;
            });
        }
    });
}