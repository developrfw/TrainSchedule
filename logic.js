var config = {

  // apiKey: "AIzaSyBN_MI68X7mcbU2BEwR4y2XkHA4Cc-feFQ",
  // authDomain: "train-time-b5010.firebaseapp.com",
  // databaseURL: "https://train-time-b5010.firebaseio.com",
  // projectId: "train-time-b5010",
  // storageBucket: "",
  // messagingSenderId: "335199564551",
  // appId: "1:335199564551:web:e56373cac5528a13"
  // // https://train-time-b5010.appspot.com

  apiKey: "AIzaSyBN_MI68X7mcbU2BEwR4y2XkHA4Cc-feFQ",
    authDomain: "train-time-b5010.firebaseapp.com",
    databaseURL: "https://train-time-b5010.firebaseio.com",
    projectId: "train-time-b5010",
    storageBucket: "train-time-b5010.appspot.com",
    messagingSenderId: "335199564551",
    appId: "1:335199564551:web:e56373cac5528a13"

};

// Initializing Firebase
firebase.initializeApp(config);

var trainData = firebase.database();


$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
  

  // Grabbing the user input in the below code
  var trainName = $("#train-name-input").val().trim();

  var destination = $("#destination-input").val().trim();

  var firstTrain = $("#first-train-input").val().trim();

  var frequency = $("#frequency-input").val().trim();

  var newTrain = {
  name: trainName,
  destination: destination,
  firstTrain: firstTrain,
  frequency: frequency,

  };

  console.log(newTrain);
  // Uploading train data to the database
  trainData.ref().push(newTrain);

  alert("Train has been added!")

  // Clears Text
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});


// Creating a Firebase event for adding trains to the data base as well as creating a row in the HTML when the user makes a new entry
trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {
  
  console.log(childSnapshot.val());

  // Storing everything in a variable
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

    if (tFirstTrain){
      
      var timeArr = tFirstTrain ? tFirstTrain.split(":") : null;
      var trainTime = moment()
        .hours(timeArr[0])
        .minutes(timeArr[1]);
      var maxMoment = moment.max(moment(), trainTime);
      var tMinutes;
      var tArrival;

      // If first train is later than the current time, set arrival to the first train time

      if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");

      } else {
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;

        tArrival = moment()
          .add(tMinutes, "m")
          .format("hh:mm A");
      }
      console.log("tMinutes:", tMinutes);
      console.log("tArrival:", tArrival);

      // Add each train's data into the table
      $("#train-table > tbody").append(
        $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
      );
    }
  
});