var prompt = require('prompt');

module.exports.requestSearchParameters = function(callback) {
  var properties = [
    {
      name: 'service'
    },
    {
      name: 'location'
    }
  ];

  prompt.start();

  prompt.get(properties, callback);
}
