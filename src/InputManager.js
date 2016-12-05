var prompt = require('prompt');

function InputManager() {
  var self = this;

  self.requestSearchParameters = requestSearchParameters;
  self.requestDirectoryForDataStorage = requestDirectoryForDataStorage;
  self.requestYesNoAnswer = requestYesNoAnswer;

  function requestSearchParameters(callback) {
      var properties = [
        {
          name: 'service',
          description: 'What service are you interested in?',
          require: true,
          message: 'Cannot continue without a service.'
        },
        {
          name: 'location',
          description: 'And what location would you like this service to be found in?',
          require: true,
          message: 'Cannot continue without a location.'
        }
      ];

      prompt.start();
      prompt.get(properties, callback);
  };

  function requestDirectoryForDataStorage(callback) {
    var properties = [
      {
        name: 'directory',
        description: 'In which directory would you like to save contact data?',
        default: '/tmp/yellowPagesContacts'
      }
    ];

    prompt.start();
    prompt.get(properties, callback);
  };

  function requestYesNoAnswer(msg, required, callback) {
    var properties = [
      {
          name: 'answer',
          description: msg,
          pattern: /^(?:Yes\b|No\b)/i,
          require: required,
          message: 'Must answer yes or no!'

      }
    ];

    prompt.start();
    prompt.get(properties, callback);
  };

};

module.exports = InputManager;
