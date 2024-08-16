

//safeLoadAll and jsyaml.safeLoad are vulnerable if DEFAULT_FULL_SCHEMA is used 
const jsyaml = require("js-yaml");

let express = require('express');
let app = express();
app.post('/store/:id', function(req, res) {
  let data;
  let unsafeConfig = { schema: jsyaml.DEFAULT_FULL_SCHEMA };
  data = jsyaml.safeLoad(req.params.data, unsafeConfig); 
