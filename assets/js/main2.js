// set up the database
var config = {
    apiKey: "AIzaSyB_bkivgAmm5v5kKjF7rK6_P6cAbMRim9Y",
    authDomain: "train-schedule-82e98.firebaseapp.com",
    databaseURL: "https://train-schedule-82e98.firebaseio.com",
    projectId: "train-schedule-82e98",
    storageBucket: "train-schedule-82e98.appspot.com",
    messagingSenderId: "710658915991"
  };
  firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// ====================================================================

// GLOBAL VARIABLES

var currentTime = moment(currentTime).format("hh:mm");

var name = "";
var destination = "";
var firstTime = "";
var rate = "";
var firstTimeConverted;
var diffTime;
var remainder;
var remainingMinutes;
var nextTrain;
var nextTrainConverted = "";

// ====================================================================

$("#submit-btn").on("click", function(event) {
    event.preventDefault();

    // get input values
    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    firstTime = $("#first-time").val().trim();
    frequency = $("#frequency").val().trim();

    // time calculations
    firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("firstTimeConverted " + firstTimeConverted);
    diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("diffTime " + diffTime);
    remainder = diffTime % frequency;
    console.log("Remainder " + remainder);
    remainingMinutes = frequency - remainder;
    console.log("remaining minutes " + remainingMinutes);
    nextTrain = moment().add(remainingMinutes, "minutes");
    console.log("Next Train " + nextTrain);
    nextTrainConverted = moment(nextTrain).format("HH:mm");

    renderTable();

    // pushes to the database
    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });
});

// ====================================================================

database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();

    name = sv.name;
    destination = sv.destination;
    firstTime= sv.firstTime;
    frequency = sv.frequency;

    // time calculations
    firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    remainder = diffTime % frequency;
    remainingMinutes = frequency - remainder;
    nextTrain = moment().add(remainingMinutes, "minutes");
    nextTrainConverted = moment(nextTrain).format("HH:mm");

    renderTable();

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// ====================================================================

function renderTable() {
  
    var row = $("<tr>");

    row.append($("<td>" + name + "</td>"));
    row.append($("<td>" + destination + "</td>"));
    row.append($("<td>" + frequency + "</td>"));
    row.append($("<td>" + nextTrainConverted + "</td>"));
    row.append($("<td>" + remainingMinutes + "</td>"));

    $("#train-table").append(row);
};

// ====================================================================
