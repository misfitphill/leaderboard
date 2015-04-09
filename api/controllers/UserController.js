/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
var fs = require('fs');

module.exports = {

	testdata: function(req, res){
		var data = JSON.parse(fs.readFileSync('assets/rand_data.txt','utf8'));
		res.json(data);
	}
	
};

