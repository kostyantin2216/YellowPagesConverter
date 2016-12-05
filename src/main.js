var InputManager = require('./InputManager'),
    YellowPagesClient = require('./YellowPages').Client;

var yellowPagesClient = new YellowPagesClient();

InputManager.requestSearchParameters(function(err, result) {
  if(err) {
    console.log('Error occured while trying to get user input:', err);
  } else {
    result.page = 1;
    yellowPagesClient.search(result, function(err, result) {
      if(err) {
        console.log('Error occured during search:', err);
      } else {
        console.log('RESULT:', result);
      }
    })
  }
});
