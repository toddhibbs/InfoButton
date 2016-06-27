var express = require('express');
var bodyParser = require('body-parser');
var infoButtonParser = require('./infobutton-parser');
var searchQueryBuilder = require('./search-query-builder');
var searchcontroller = require('./controllers/infobutton')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(infoButtonParser());
app.use(searchQueryBuilder());
app.use(function(req, res, next) {
	req.InfoButton.SearchQuery = req.SearchQuery;
	req.InfoButton.SearchParameters = req.SearchParameters;
	next();
});

app.get('/debug', function(req, res) {
	return res.json(req.InfoButton);
});
app.post('/debug', function(req, res) {
	return res.json(req.InfoButton);
});

app.get('/search', searchcontroller.Search);
app.post('/search', searchcontroller.Search);

app.get('/search/html', searchcontroller.SearchHtml);
app.post('/search/html', searchcontroller.SearchHtml);

app.set('port', process.env.PORT || 3002);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});




