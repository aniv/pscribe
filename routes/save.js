exports.home = function(req, res){
	res.render('index', { title: 'Save' });
};

exports.save = function(req, res){
	var mongo = require('mongodb').MongoClient;
	res.set('Content-Type', 'application/json');
	
	mongo_conn = process.env.VCAP_SERVICES['mongodb-1.8'].credentials.url; //'mongodb://localhost:27017/prsm'

	mongo.connect(mongo_conn, function(err, db) {
		if (err) {
			console.log("Unable to connect to db; error: ");
			console.dir(err);
		}
		
		var prsm = req.body;
		var collection;
		
		switch ('dev') //prsm.interest.key
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
			case 'dev':
				collection = db.collection('prsm');
				break;
			default:
				collection = db.collection('default');
		}
		
		collection.insert(prsm.docs, {safe:false}, function(err, result) { 
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