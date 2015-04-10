/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var MisfitAPI = require('misfit-cloud-api');
var passport = require('passport');
var fs = require('fs');

module.exports = {

	login: function(req, res){
		res.view();
	},

	logout: function(req, res){
		req.session.user = null;
		req.session.flash = 'you have logged out';
		res.redirect('/user/login');
	},

	userdata: function(req, res){
		if (req.session.authenticated){
			var user = req.session.user;
			var accessToken = req.session.user.accessToken;

			//setup misfitapi
			var misfitApi = new MisfitAPI({
      			clientID: '',
      			clientSecret: ''
			});

			//get summary
			misfitApi.getSummary({
				token: accessToken,
				start_date:'2015-01-17',
				end_date:'2015-01-23',
				detail: true
			}, function(err,result){
				if(err || !result){
					console.log("error: " + err);
					return callback(err);
				}

				//load test user data
				var testData = JSON.parse(fs.readFileSync('assets/rand_data.txt', 'utf8'));

				res.json({userData:result.summary, testData:testData});
			});
		}
		else{
			res.redirect('/');
		}

	}

	testdata: function(req, res){
		var data = JSON.parse(fs.readFileSync('assets/rand_data.txt','utf8'));
		res.json(data);
	}
	
};

