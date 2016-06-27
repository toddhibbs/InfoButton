var _ = require('lodash');

module.exports = function SearchQueryBuilder() {
	return function SearchQueryBuilder(req, res, next) {


		//req should now contain an InfoButton object that was created by earlier middelware
		//This middelware decides on how the search will be performed and builds an
		//appropriate query string for the search engine

//	if (has search criteria) then
//		use criteria and any demographic data (age and gender) becomes additional filters
//		and any observations or medications are used to give additional boost to search results (? is this correct?)
//	else use demographics data (age and gender) to filter and 
//		use observations and medications to give additional boost to that content

		var parameters = [];
		var searchTerms = [];

		//Set search query string
		if(req.InfoButton.MainSearchCriteria.length > 0) {
			_.forEach(req.InfoButton.MainSearchCriteria, function(item) {
				searchTerms.push(item.displayName);
			});
		}
		else {
			//throw(err)
		}

		//Add medications to search terms
		if (req.InfoButton.Medications.length > 0) {			

			_.forEach(req.InfoButton.Medications, function(item) {
				if (item.value.code) {
					searchTerms.push(item.value.code);
				}
				if (item.value.displayName) {
					searchTerms.push(item.value.displayName);
				}
			});
		}

		//Add problems to search terms
		if (req.InfoButton.Problems.length > 0) {

			_.forEach(req.InfoButton.Problems, function(item) {
				if (item.value.code) {
					searchTerms.push(item.value.code);
				}
				if (item.value.displayName) {
					searchTerms.push(item.value.displayName);
				}
			});
		}


		if (req.InfoButton.Patient.isPregnant) {
			parameters.push({'pregnant':'pregnant'});
		}
		// if (req.InfoButton.Patient.isPregnant) {
		// 	searchTerms.push('TRC10'); //TRC10 is the TRC pregnancy category
		// }

		if (req.InfoButton.Patient.isLactating) {
			parameters.push({'lactation': 'lactation'})
		}

		parameters.push({'q': searchTerms.join(' ')});

		//Set which categories will be searched
		parameters.push({'category': 'PRL'});
		//parameters.push({'category': 'PL,PRL'});

		//Set which types of data are searched. Defaults to all content types
		//parameters.push({'t': 'newsletter'}); //limit to newsletters only
		//we could look at information recipient for example and filter to certain content types such as patient handouts


		//Set paging options. Default is 
		parameters.push({'from': '0'}); //defaults to initial set
		parameters.push({'size': '100'}); //defaults to return a maximum of 100 records
		//TODO: if we need to support actual paging, the Infobutton service must be extended somehow to collect paging data.
		//Whether and how this is done may depend on client support


		if (req.InfoButton.Patient.broadAgeGroup) {
			parameters.push({'age': req.InfoButton.Patient.broadAgeGroup});
		}

		//filter to gender
		if (req.InfoButton.Patient.administrativeGender.code) {
			parameters.push({'gender': req.InfoButton.Patient.administrativeGender.code});
		}

		//put search engine into infobutton mode so it will exclude pregnancy related articles from non-pregnant people
		parameters.push({'ib': 'on'});

		req.SearchParameters = parameters;
		var url = '';
		
		_.each(parameters, function(item, index) {
			var first = index == 0;
			_.each(item, function(value, key) {
				url += first ? '?' : '&';
				url += key + '=' + value;
			});
		});

		req.SearchQuery = url;

		next();
	}
}