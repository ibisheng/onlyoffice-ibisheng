if(process.argv.length < 5)
{
	console.log("Wrong parameter count!");
	console.log("Usage: node merge.js <base_file_name> <changes_dir_name> <output_file_name>");
	return;
}

var base_file = process.argv[2];
var changes_dir = process.argv[3];
var output_file = process.argv[4];

setTimeout( main, 0, base_file, changes_dir, output_file);

function main(base_file, changes_dir, output_file)
{
	var error_code = 1;
	try {
		//var TimeStart = new Date();
		var sdk_all = require('./sdk-all.js');
		var editor = new sdk_all.asc_docs_merge_api();

		var fs = require('fs');
		var base_doc = fs.readFileSync(base_file, 'utf-8');
		editor.LoadDocument( base_doc );
		
		var doc_changes = [];
		var changes_file_array = fs.readdirSync(changes_dir);
		for(var i in changes_file_array)
		{
			var changes_file_name = changes_file_array[i];
			if(changes_file_name.match(/changes[\d]*.json/i))
			{
				var doc_changes_tmp = fs.readFileSync(changes_dir + "/" + changes_file_name, 'utf-8');
				doc_changes_tmp = JSON.parse(doc_changes_tmp);
				doc_changes = doc_changes.concat(doc_changes_tmp);
			}
		}
		
		editor.ApplyChanges( doc_changes );

		var changed_doc = editor.Save();
		fs.writeFileSync(output_file, changed_doc, 'utf-8');

		//var TimeEnd = new Date();
		//console.log("Execution duration:", TimeEnd - TimeStart, " ms.");
		
		error_code = 0;
	}

	catch(err) {
		console.log("Error:", err);
	}

	finally	{
		process.exit(error_code);
	}
}
