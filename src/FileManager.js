var fs = require('fs');

function FileManager() {
  var self = this;

  self.directoryExists = directoryExists;

  function directoryExists(path, callback) {
    fs.lstat(path, function(err, stats) {
      if(err) {
        if(err.code === 'ENOENT') {
          callback(0, false);
        } else {
          callback('Error during look up for path "' + path + '": ' + err);
        }
      } else {
        if(stats.isDirectory()) {
          callback(0, true);
        } else {
          callback('Path "' + path + '" is a file and not a directory');
        }
      }
    });
  };
}

module.exports = FileManager;
