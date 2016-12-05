var fs = require('fs'),
    InputManager = require('./InputManager'),
    FileManager = require('./FileManager'),
    YellowPagesClient = require('./YellowPages').Client;

var yellowPagesClient = new YellowPagesClient(),
    fileManager = new FileManager(),
    inputManager = new InputManager();


initStorageDirectory();

var directory = '';

function initStorageDirectory() {
  var dataStoragePromptCallback = function(err, result) {
    if(err) {
      console.log('Error occured while trying to get user input:', err);
    } else {
      fileManager.directoryExists(result.directory, function(err, exists) {
        if(err) {
          console.log('Error during directory check:', err);
        } else {
          directory = result.directory;
          if(exists) {
            inputManager.requestYesNoAnswer(
              'Directory "' + result.directory + '" already exists would you like to use it anyway?',
              true,
              function(err, result) {
                if(result.answer.toLowerCase() === 'yes') {
                  complete();
                } else {
                  inputManager.requestDirectoryForDataStorage(dataStoragePromptCallback);
                }
            });
          } else {
            complete();
          }
        }
      });
    }
  };

  inputManager.requestDirectoryForDataStorage(dataStoragePromptCallback);

  function complete() {
    console.log('Using directory:', directory);
    startSearching();
  };
};

function startSearching() {
  inputManager.requestSearchParameters(function(err, result) {
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
};
