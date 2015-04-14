/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {

  misfit:{
    name: 'Misfit',
    protocol: 'oauth2',
    strategy: require('passport-misfit').Strategy,
    options:{
      clientID: '',
      clientSecret: '',
      callbackURL: 'http://localhost:1337/auth/misfit/callback'
    },
    scope: ['user']
  }
};
