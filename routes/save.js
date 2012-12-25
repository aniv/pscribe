exports.home = function(req, res){
	res.render('index', { title: 'Save' });
};

exports.save = function(req, res){
	var mongo = require('mongodb').MongoClient;
	res.set('Content-Type', 'application/json');

	// Get timestamp from POST
	var start = req.body.next['query-params'].start;

	mongo_conn = JSON.parse(process.env.VCAP_SERVICES)['mongodb-1.8'][0]['credentials']['url']; //'mongodb://localhost:27017/prsm'
	mongo.connect(mongo_conn, function(err, db) {
		if (err) {
			console.log("Unable to connect to db; error: ");
			console.dir(err);
			res.send("{'Status': 'FATAL'}");
		}
		else
		{
			var collection;
			var prsm = req.body;
			switch (prsm.interest.key) //'dev'
			{
				case 'share':
					collection = db.collection('shared');
					break;
				case 'recommend':
					collection = db.collection('recommended');
					break;
				case 'save':
					collection = db.collection('saved');
					break;
				default:
					collection = db.collection('default');
			}
		
			// If timestamp is in DB, skip and return 'done' status message
			collection.find({'start':''+start}).toArray(function(err, items) {
				// If timestamp is not in DB, write to DB
				if (items.length == 0) {
					var docs = {'start': ''+start, 'docs': prsm.docs};

					collection.insert(docs, {safe:false}, function(err, result) { 
						if (err) { 
							console.log("Failed to save articles"); 
							res.send("{'Status': 'ERROR'}");
						}
						else {
							console.log("Saved all articles");
							res.send("{'Status': 'OK'}");
						}
					});
				}
				else {
					console.log("Duplicate article set found for key: " + start); 
					res.send("{'Status': 'DONE'}");
				}
			});
		

		}
		console.log('Done');
	});
}