const newman = require('newman');
// Runs Postman Backend API tests
newman.run(
    {
      collection: require('./iCare_Tests.json'),
      environment: require('./iCare_Environment.json'),
      reporters: 'cli'
    }, 
    function (err) {
      if (err) { throw err; }
      console.log('iCare Collection Run Complete!');
    }
  );