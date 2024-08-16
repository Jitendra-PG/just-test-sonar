let mysql = require('db-mysql');
let http = require('http');
let out;
let valTom;
let req = http.request(options, function(res)
{
	res.on('data', function(chunk)
	{
		valTom = chunk;
	}
	);
}
);
new mysql.Database(
{
	hostname: 'localhost',
	user: 'user',
	password: 'password',
	database: 'test'
}
).connect(function(error)
{
	let the_Query =
	"INSERT INTO Customers (CustomerName, ContactName) VALUES ('Tom'," +
	valTom + ")";
	this.query(the_Query).execute(function(error, result)
	{
		if (error)
		{
			console.log("Error: " + error);
		}
		else
		{
			console.log('GENERATED id: ' + result.id);
		}
	}
	);
	out = resIn;
}
);
