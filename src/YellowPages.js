var http = require('http'),
    cheerio = require('cheerio');

function YellowPagesClient() {
  var self = this;

  var converter = new YellowPagesConverter();

  self.search = search;

  function search(options, callback) {
    var path = '/Search/' + options.service + '/' + options.location + '/' + options.page;
    console.log('Executing search with options:', options);
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
  };
};

function YellowPagesConverter() {
  var self = this;

  self.convertSearchResults = convertSearchResults;

  function convertSearchResults(resultsHtml, callback) {
    console.log('Converting results html');

    var results = [];
    var $ = cheerio.load(resultsHtml);

    $('.result', '#searchResults').each(function(i, elem) {
      var name = $('.resultName', this).text();
      var address = $('.resultAddress', this).text();
      var telephone = $('.resultContact', this).children().first().text();

      var result = new YellowPagesSearchResult(name.trim(), address.trim(), telephone.trim());
      console.log('Created result:', result);
      results.push(result);
    });

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
