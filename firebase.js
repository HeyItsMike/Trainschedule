// Initialize Firebase
var config = {
    apiKey: "AIzaSyDm-Aeqjwm8fWaK7cMQYAn_Uoqp9yUAIPI",
    authDomain: "trainschedule-14672.firebaseapp.com",
    databaseURL: "https://trainschedule-14672.firebaseio.com",
    projectId: "trainschedule-14672",
    storageBucket: "trainschedule-14672.appspot.com",
    messagingSenderId: "334370990242"
};

firebase.initializeApp(config);
var database = firebase.database();
var empName = "";
var role = "";
var startDate = "";
var monthlyRate = 0;
var IDCounter = 0;


$(document).ready(function () {

    $(document).on("click", "#submitButton", function () {
        addEmployee();
    });

    database.ref().on("child_added", function (snapshot) {
        if (snapshot.val() !== null) {
            console.log(snapshot);
            createRecord(snapshot);
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    })
});


function addEmployee() {
    event.preventDefault();

    empName = $("#empName").val().trim();
    role = $("#role").val().trim();
    startDate = $("#startDate").val().trim();
    monthlyRate = $("#MonthlyRate").val().trim();

    // && Number.isInteger(parseInt(monthlyRate))
    if (moment(startDate).isValid()) {

        database.ref().push({
            empName: empName,
            role: role,
            startDate: startDate,
            monthlyRate: monthlyRate
        });
    }
}



function createRecord(snapshot) {
    var tr = $("<tr>");

    /* var th = $("<th>");
    $(th).attr("scope", "row");
    $(th).text(IDCounter);
    IDCounter++;
    $(tr).append(th); */

    var nameTd = $("<td>");
    $(nameTd).text(snapshot.val().empName);
    $(tr).append(nameTd);

    var roleTd = $("<td>");
    $(roleTd).text(snapshot.val().role);
    $(tr).append(roleTd);

    var startDateTd = $("<td>");
    $(startDateTd).text(snapshot.val().startDate);
    $(tr).append(startDateTd);

    var monthlyRateTd = $("<td>");
    $(monthlyRateTd).text(snapshot.val().monthlyRate);
    $(tr).append(monthlyRateTd);

    var monthsWorked = getMonthsWorked(snapshot.val().startDate);
    var monthsWorkedTd = $("<td>");
    $(monthsWorkedTd).text(monthsWorked);
    $(tr).append(monthsWorkedTd);

    var totalBilledTd = $("<td>");
    $(totalBilledTd).text(getTotalBilled(monthsWorked, snapshot.val().monthlyRate));
    $(tr).append(totalBilledTd);

    $("#results").append(tr);
}

function getMonthsWorked(StartDate) {
    var currentDate = moment().format("MM/DD/YYYY");
    console.log(currentDate);
    console.log(StartDate);
    // 31 Oct 2013 - 31 Jan 2014
    var monthsDiff = moment(currentDate).diff(moment(StartDate), 'months', true)
    monthsDiff = Math.floor(monthsDiff);
    console.log(monthsDiff);
    return monthsDiff
}

function getTotalBilled(monthsWorked, monthlyRate) {
    return parseInt(monthsWorked) * parseInt(monthlyRate);
}

