var bunyan = require('bunyan'),
	async = require('async'),
	request = require('request'),
	fs = require('fs'),
	_ = require('lodash'),
	moment = require('moment'),
	Feed = require('feed'),
	sanitizeHtml = require('sanitize-html');

var baseLinkUrl = 'http://localhost/url?id='; //just making something up. should got to wherever the full article content is located

var log = bunyan.createLogger({name: 'searcher'});
log.level(bunyan.TRACE);	

var searchUrl = process.env.SEARCH_URL || 'http://localhost:3001';

exports.Search = function(req, res, app) {

	request(searchUrl + '/api/search' + req.SearchQuery, function (error, response, rawData) {
		if (error) {
			log.fatal('Unable to connect to search service.');
			res.end(500, 'Unable to connect to search service.');
		}
		else {

			var data = JSON.parse(rawData);
			var feed = new Feed({
				title: 'TRC search results',
				link: 'http://trc.com'
			});

			log.info(searchUrl + '/api/search' + req.SearchQuery + ', Total hits: ' + data.hits.total);

			for (var i = data.hits.hits.length - 1; i >= 0; i--) {
				//data.hits.hits[i]
				feed.addItem({
			        title:          data.hits.hits[i]._source.Title,
			        link:           'http://trc.com',
			        description:    'Not Available',
			        date:           moment(data.hits.hits[i]._source.Date).toDate(),
			        content: 		data.hits.hits[i]._source.Content
			    });
			};

			res.end(feed.render('atom-1.0'));			
		}
	});


}

exports.SearchHtml = function(req, res) {

	var debugMode = !!req.param('debug');

	request(searchUrl + '/api/search' + req.SearchQuery, function (error, response, rawData) {
		if (error) {
			log.fatal('Unable to connect to search service.');
			res.end(500, 'Unable to connect to search service.');
		}
		else {
			
			var jsonData = JSON.parse(rawData);
			log.info(searchUrl + '/api/search' + req.SearchQuery + ', Total hits: ' + jsonData.hits.total);

			var htmlFile = "results.html";
			var fileContents = fs.readFile(htmlFile, function(err, data) {
				if (err) throw err;

				var results = jsonData.hits.hits;
				_.each(results, function(item) {
					item._source.Content = sanitizeHtml(item._source.Content);
				});

				var templateData = { totalResults: jsonData.hits.total, results: results, baseLinkUrl: baseLinkUrl, InfoButton: req.InfoButton, debugMode: debugMode };

				var compiled = _.template(data);
				res.end(compiled(templateData));

			});
		}
	});


}