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

	getsummary: function(req, res){
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
				var testUsers = genTestData(result.summary, 3);
				res.json({"MisfitUser":result.summary,"TestUsers":testUsers});
			});
		}
		else{
			res.redirect('/auth/misfit');
		}

	}
	
};

/*
Generate random data for fake users
@param userData - an array of objects with the current user's data (from the Misfit server)
@param num - an integer representing the number of fake users to generate

@returns a JSON object in the same format as [@param userData] but with the possibility for multiple users
*/
var genTestData = function(userData,num){
	var numDays = userData.length;
	var testUsers = [];

	for(var i = 0; i < num; i++){
		var tUserData = [];
		//for each test user, generate data for the same dates as the current user
		for(var j = 0; j < numDays; j++){
			var dayData = {};
			dayData['date'] = userData[j]['date'];
			dayData['points'] = Math.round(((Math.random() * 5000) + 5) * 10) / 10;
			dayData['steps'] = Math.floor((Math.random() * 10000) + 10);
			dayData['calories'] = Math.round(((Math.random() * 700) + 10) * 10) / 10;
			dayData['activityCalories'] = dayData['calories'];
			dayData['distance'] = Math.round(((Math.random() * 8)) * 10000) / 10000;

			//add day_data to this TEST user's data
			tUserData.push(dayData);
		}
		var newObj = {};
		newObj["User" + (i + 1)] = tUserData;
		testUsers.push(newObj);
	}
	return testUsers;
}

