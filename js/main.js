 $(function() {
 
  'use strict'

  var db = new PouchDB('http://localhost:5984/maintenance_log');


  db.changes({
      since: 'now',
      live: true
    }).on('change', showLogs);
  

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

  function deleteLog(element) {
      // Get the clicked rows date column
      var index = element.parentNode.parentNode.rowIndex;
      var date = document.getElementById("logTable").rows[index].cells[0].innerText;
      // Convert date in json doc id
      var dateId = new Date(date).toJSON();

      // Remove from db by setting deleted parameter to be true
      db.get(dateId).then(function(doc) {
          doc._deleted = true;
          return db.put(doc);
        }).then(function (result) {
          console.log("Successfully deleted document from database...");
          console.log(result);
        }).catch(function (err) {
          console.log(err);
        });
        
  }
  
  function showLogs() {

      $("logTableBody").empty();

      var allDocs = db.allDocs({
          include_docs: true,
        }).then(function (result) {

          var length = result.total_rows;
          var i;

          for (i = 0; i < length; i++) {
              
              fillRow(
                  result.rows[i].doc._id, 
                  result.rows[i].doc.description, 
                  result.rows[i].doc.odometer, 
                  result.rows[i].doc.notes
              ); 
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

      content += "<td>\
              <button type=\"button\" class=\"btn btn-success\"><i class=\"fa fa-edit\"></i></button>\
              <button type=\"button\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>\
              </td>";

      content += "</tr>";

      $("#logTableBody").append(content);

  }

  $('#editVehicleModal').on('shown.bs.modal', function () {
    $('#editVehicle').trigger('focus')
  });

  function editVehicle() {

    var year = $("#car-years").val();
    var make = $("#car-makes").val();
    var model = $("#car-models").val();

    localStorage.setItem('carYear', year);
    localStorage.setItem('carMake', make);
    localStorage.setItem('carModel' ,model);
    
  }

  function vehicleDislpay() {
    var year = localStorage.getItem('carYear');
    var make = localStorage.getItem('carMake');
    var model = localStorage.getItem('carModel');

    if (year == null || make == null || model == null) {
      $("#vehicleDisplay").text("Vehicle not specified");
    } else {
      // Make sure make is capatilized
      make = make[0].toUpperCase() + make.slice(1);
      $("#vehicleDisplay").text(year + " " + make + " " + model);
    }
  }

  $("#addLogBtn").on("click", addToLog);
  $("#editVehicleBtn").on("click", editVehicle);

  vehicleDislpay();
  showLogs();

 });