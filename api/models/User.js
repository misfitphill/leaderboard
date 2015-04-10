var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    misfitId  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' }
  }
};

module.exports = User;
/*
  	userId:{
  		type: 'string',
  		required: true,
  		unique: true
  	},
  	firstName:{
  		type: 'string',
  		required: true
  	},
  	lastName:{
  		type: 'string',
  		required: true
  	},
  	gender: {
  		type: 'string',
  		required: true
  	}*/