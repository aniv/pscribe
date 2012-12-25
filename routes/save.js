exports.home = function(req, res){
	res.render('index', { title: 'Save' });
};

exports.save = function(req, res){
	var mongo = require('mongodb').MongoClient;
	res.set('Content-Type', 'application/json');

	mongo_conn = JSON.parse(process.env.VCAP_SERVICES)['mongodb-1.8'][0]['credentials']['url']; //'mongodb://localhost:27017/prsm'

	mongo.connect(mongo_conn, function(err, db) {
		if (err) {
			console.log("Unable to connect to db; error: ");
			console.dir(err);
		}
		
		var prsm = req.body;
		var docs = prsm.docs;
		var collection;
		
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
		
		collection.insert(docs, {safe:false}, function(err, result) { 
			if (err) { 
				console.log("Failed to save records"); 
				res.send("{'Status': 'ERROR'}");
			}
			else {
				console.log("Saved all records");
				res.send("{'Status': 'OK'}");
			}
		});
		console.log('Done');
	});
}