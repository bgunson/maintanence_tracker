var db = new PouchDB('http://localhost:5984/maintanence_log');

function addToLog() {
    
    // Create log 
    var logRow = {
        _id: new Date($("#logDate").val()).toJSON(),
        description: $("#logDescription").val(),
        odometer: $("#logOdo").val(),
        notes: $("#logNotes").val()
    };
    
    db.put(logRow).then(function (response) {
        console.log("Added document to database...");
        console.log(response);
    }).catch(function (err) {
        console.log("Failed to add document to database...");
        console.log(err);
    });


};
 
function showLogs() {
    var allDocs = db.allDocs({
        include_docs: true,
      }).then(function (result) {

        var length = result.total_rows;
        var i;

        for (i = 0; i < length; i++) {
            
            fillRow(result.rows[i].doc._id, result.rows[i].doc.description, result.rows[i].doc.odometer, result.rows[i].doc.notes); 
        }

        console.log("All docs retrieved");

      }).catch(function (err) {
        console.log(err);
      });

}

function fillRow(date, description, odometer, notes) {

    date = date.split("T")[0];

    var newDate = new Date(date).toJSON();
    
    var content = "<tr>";
    content += "<td>" + date + "</td>";
    content += "<td>" + description + "</td>"; 
    content += "<td>" + odometer + "</td>";
    content += "<td>" + notes + "</td>";
    content += "</tr>"

    //content += "<td><a>Remove</a></td>";

    $("#logTable").append(content);

}

showLogs();