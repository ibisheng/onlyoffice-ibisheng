if(process.argv.length < 4)
{
	console.log("Wrong parameter count!");
	console.log("Usage: node fonts_char_map.js <document_file_name> <output_file_name>");
	return;
}

var base_file = process.argv[2];
var output_file = process.argv[3];

try{
	var sdk_all = require('../sdk-all.js');
	var editor = new sdk_all.asc_docs_api();

	var fs = require('fs');
	var base_doc = fs.readFileSync(base_file, 'utf-8');
	editor.LoadDocument( base_doc );

	var char_map = editor.CreateFontsCharMap();
	fs.writeFileSync(output_file, char_map, 'utf-8');
}
catch(err){
	console.log("Error:", err);
}
