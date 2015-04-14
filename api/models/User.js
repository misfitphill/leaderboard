var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username : { type: 'string', unique: true, required: true },
    data: {type:'string', required: true}
  },

  massCreate: function (userData) {
    Object.keys(userData).forEach(function(key){
      //User.create({username:key, data:JSON.stringify(userData[key])});
    });
  }
};

module.exports = User;
