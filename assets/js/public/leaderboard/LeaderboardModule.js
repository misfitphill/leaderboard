var app = angular.module('LeaderboardModule', ['ui.bootstrap','googlechart','ui.grid','ui.grid.selection']);

app.factory("UserService", function($http) {
  	var userData;
  	var fields = [];
  	var lastGET;
  	var curAttr = 'points';
  	var scopes = {};
  	return {
  		/*
		provides access to the scopes of each controller that is set with this funciton.
  		*/
  		setScope: function(controller, scope){
	  		scopes[controller] = scope;
	  	},

	  	/*
		sets up the leaderboard grid display and populates the grid with data retrieved from
		the MisfitAPI.
	  	*/
	  	getSummary: function(){
	  		scopes['leaderboard'].gridOptions = {
            	enableSorting: false,
            	enableRowSelection: true,
            	enableHighlighting: true,
            	noUnselect: true,
            	multiSelect: false,
            	showSelectionCheckbox: false,
            	onRegisterApi: function(gridApi) {
      				scopes['leaderboard'].gridApi = gridApi;

      				//handles selection changes
      				scopes['leaderboard'].gridApi.selection.on.rowSelectionChanged(scopes['leaderboard'],function(rows){
            			scopes['leaderboard'].selectedItems = gridApi.selection.getSelectedRows();
            			//send ONLY the data for the selected user to chart
            			scopes['chart'].$emit('userSelectEvent',{data:userData[scopes['leaderboard'].selectedItems[0]['username']],
            												attr:curAttr,
            												username:scopes['leaderboard'].selectedItems[0]['username']});
        			});
    			}
       		};

	  		if(lastGET !== "summary"){
				var promise = $http.get('/user/getsummary').then(function(response){
					 userData = response.data;
					 lastGET = "summary";

				     //inform DropdownCtrl that the user data has been retrieved and
				     //send the fields to populate the dropdown
				     var fields = [];
						Object.keys(userData[Object.keys(userData)[0]][0]).forEach(function(key){
							if(key !== 'date' && key !== 'activityCalories')
								fields.push(key.charAt(0).toUpperCase() + key.slice(1));
						});
						
					
					scopes['dropdown'].$emit('dropdownEvent',{fields:fields});

					//return the user data
					 return userData;
				});
				return promise;
			}else{
				return userData;
			}
	  	},

	  	/*
		Called when the dropdown menu is changed. When this happens,
		each of the subscribed controllers should be notified in order to display
		the correct data.
	  	*/
	    updateAttr: function(attr){
	    	curAttr = attr;
	    	scopes['leaderboard'].$emit('updateAttrEvent',{attr:attr});
	    	scopes['chart'].$emit('updateAttrEvent',{attr:attr});
	    }
    };
});



