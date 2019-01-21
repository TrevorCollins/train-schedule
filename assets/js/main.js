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
console.log("Current Time: " + currentTime);

var name = "";
var destination = "";
var rate = "";
var firstTime = "";
var nextTrain;
var minutes;

// ====================================================================

// on click function
$("#submit-btn").on("click", function() {
    event.preventDefault();

    // gets the input values
    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    firstTime = moment($("#start-time"), "HH:mm");
    rate = $("#frequency").val().trim();

    // var timeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTime), "minutes");
    var remainder = diffTime % frequency;
    var minutesTillTrain = frequency - remainder;
    nextTrain = moment().add(minutesTillTrain, "minutes");

    renderTable();

    console.log("Name: " + name);
    console.log("Destination: " + destination);
    console.log("First Time: " + firstTime);
    // console.log("Time Converted: " + timeConverted);
    console.log("Difference in Time: " + diffTime);
    console.log("Remainder: " + remainder);
    console.log("Minutes till Next Train: " + minutesTillTrain);
    console.log("Next Train: " + nextTrain);

    // pushes to the database
    database.ref().push({
        name: name,
        destination: destination,
        startTime: firstTime,
        rate: rate
    });
});

// ====================================================================

database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();

    name = sv.name;
    destination = sv.destination;
    firstTime= sv.startTime;
    rate = sv.rate;

    time = moment(firstTime, "MM/DD/YYYY");
    minutes = moment().diff(time, "minutes");
    nextTrain = minutes * rate;

    renderTable();

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// ====================================================================

function renderTable() {
  
    var row = $("<tr>");

    row.append($("<td>" + name + "</td>"));
    row.append($("<td>" + destination + "</td>"));
    row.append($("<td>" + rate + "</td>"));
    row.append($("<td>" + firstTime + "</td>"));
    row.append($("<td>" + nextTrain + "</td>"));
    row.append($("<td>" + minutes + "</td>"));

    $("#employee-table").append(row);
};


// ====================================================================
// ====================================================================


// var tFrequency = 3;

// // Time is 3:30 AM
// var firstTime = "03:30";

// // First Time (pushed back 1 year to make sure it comes before current time)
// var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
// console.log(firstTimeConverted);

// // Current Time
// var currentTime = moment();
// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// // Difference between the times
// var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
// console.log("DIFFERENCE IN TIME: " + diffTime);

// // Time apart (remainder)
// var tRemainder = diffTime % tFrequency;
// console.log(tRemainder);

// // Minute Until Train
// var tMinutesTillTrain = tFrequency - tRemainder;
// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// // Next Train
// var nextTrain = moment().add(tMinutesTillTrain, "minutes");
// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));