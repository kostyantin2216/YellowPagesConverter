var http = require('http'),
    cheerio = require('cheerio');

function YellowPagesClient() {
  var self = this;

  var converter = new YellowPagesConverter();

  self.search = search;

  function search(options, callback) {
    console.log('Executing search with options:', options);

    var pages = options.pages;
    var allResults = [];

    getPagesRecursive(1);

    function getPagesRecursive(i) {
      console.log('Getting page:', i);
      getPage(i, options, function(err, results) {
        if(err) {
          callback(err, allResults);
        } else {
          allResults.push(results);
          if(i >= pages || results.length === 0) {
            callback(0, allResults);
          } else {
            getPagesRecursive(++i);
          }
        }
      });
    };
  };

  function getPage(index, options, callback) {
    var path = '/Search/' + options.service + '/' + options.location + '/' + index;
    http.get({
      host: 'www.yellowpages.co.za',
      path: path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
      }
    }, function(response) {
      var body = '';
      response.on('data', function(data) {
        body += data;
      }).on('end', function() {
        converter.convertSearchResults(body, function(results) {
          callback(0, results);
        });
      }).on('error', function(err) {
        callback('Could not get search results for path "' + path + '" becuase of err: ' + err);
      });
    });
  }
};

function YellowPagesConverter() {
  var self = this;

  self.convertSearchResults = convertSearchResults;

  function convertSearchResults(resultsHtml, callback) {
    console.log('Converting results html content length: ' + resultsHtml.length);

    var results = [];
    var $ = cheerio.load(resultsHtml);

    var resultElements = $('.result');
    if(resultElements) {
      resultElements.each(function(i, elem) {
        var name = $('.prod-title', this).text();
        var address = $('.resultAddress', this).text();
        var telephone = $('.resultMainNumber', this).text().replace(/[\n\t\r]/g,"").trim();

        var result = new YellowPagesSearchResult(name.trim(), address.trim(), telephone.trim());
        results.push(result);
      });
    } else {
      console.log('No results to convert');
    }
    
    callback(results);
  };
};

function YellowPagesSearchResult(name, address, telephone) {
  this.name = name;
  this.address = address;
  this.telephone = telephone;
};

module.exports.Client = YellowPagesClient;
module.exports.Converter = YellowPagesConverter;
module.exports.SearchResult = YellowPagesSearchResult;
