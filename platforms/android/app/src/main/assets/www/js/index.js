/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function showDatePicker(event){
    if(typeof(cordova) != 'undefined'){
        event.preventDefault();
        var myDate = new Date(); // From model.
        cordova.plugins.DateTimePicker.show({
            mode: "datetime",
            date: myDate,
            allowOldDates: false,
            allowFutureDates: true,
            minDate: new Date(),
            maxDate: null,
            minuteInterval: 1,
            locale: "EN",
            okText: "Select",
            cancelText: "Cancel",
            android: {
                theme: 16974126, // Theme_DeviceDefault_Dialog
                calendar: false,
                is24HourView: false
            },
            success: function(newDate) {
                // Handle new date.
                console.info(newDate);
                $("#datepicker").val(newDate);
            },
            cancel: function() {
                console.info("Cancelled");
            },
            error: function (err) {
                // Handle error.
                console.error(err);
            }
        });
    }
}

function getDateInFormat(date){
    return (date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes());
}

function convertDateToLocalDate(dateTime){
    //var localDateTime = new Date(dateTime + " GMT");
    var localDateTime = new Date(dateTime + "+00:00");
    return getDateInFormat(localDateTime);
}

function getTimeCountDown(dueDateTime){
    var dueDateTimeSplit = dueDateTime.split(" ");
    dueDateTime = dueDateTimeSplit[0] + "T" + dueDateTimeSplit[1];
    var unit = "Day(s)";
    const date1 = new Date();
    const date2 = new Date(dueDateTime);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if(diffDays <= 1){
        unit = "Hour(s)";
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60));
    }
    if(diffDays <= 1){
        unit = "Minute(s)";
        diffDays = Math.ceil(diffTime / (1000 * 60));
    }
    return diffDays + " " + unit;
}