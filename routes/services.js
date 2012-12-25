exports.services = function(req, res) {
	console.log(process.env.VCAP_SERVICES);
  	res.render('index', { title: 'Services' });
}