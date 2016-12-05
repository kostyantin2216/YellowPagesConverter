var http = require('http');

http.get({
  host: 'www.yellowpages.co.za',
  path: '/Search/plumber/gauteng/1',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
  }
}, function(response) {
  var body = '';
  console.log('RESPONSE:', response);
  response.on('data', function(data) {
    console.log('received data:', data);
    body += data;
  }).on('end', function() {
    console.log('Finished gathering data:', body);
  }).on('error', function(err) {
    console.log('ERROR:', err)
  });
});
