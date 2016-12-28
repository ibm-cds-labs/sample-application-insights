//-------------------------------------------------------------------------------
// Copyright IBM Corp. 2016
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//-------------------------------------------------------------------------------

'use strict';

const cfenv = require('cfenv');
const compression = require('compression');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// to enable debugging, set environment variable DEBUG to dtsa or *
const debug = require('debug')('dtsa');

var appEnv = cfenv.getAppEnv();

// load service binding for repository database if running locally
if(appEnv.isLocal) {
	try {
  		appEnv = cfenv.getAppEnv({vcap: {services: require('./vcap_services.json')}});
	}
	catch(ex) { 
		// ignore 
	}
}

debug('Application environment: ' + JSON.stringify(appEnv));

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

// use https://www.npmjs.com/package/express-handlebars as view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', 'public');

app.use(express.static(path.join(__dirname, 'public')));

const url = (appEnv.app.application_uris) ? appEnv.app.application_uris[0] : 'localhost:' + appEnv.port;

/*
 *  public endpoints:
 *   index.html
 */
app.get('/', function(req,res) {
	res.render('index', {SSS_URL: 'https://sss-deployment-info.mybluemix.net'});
});



//
// start server on the specified port and binding host
//
app.listen(appEnv.port, '0.0.0.0', function() {
	console.log('Server starting on ' + url);
});
