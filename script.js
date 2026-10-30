// Selecting HTML Elements

let currentTime = document.querySelector("#current-time");

let hoursSelect = document.querySelector("#hours");
let minutesSelect = document.querySelector("#minutes");
let ampmSelect = document.querySelector("#ampm");

let setAlarmBtn = document.querySelector("#set-alarm");
let stopAlarmBtn = document.querySelector("#stop-alarm");

let alarmMessage = document.querySelector("#alarm-message");


// Variables

let alarmTime = null;
let alarmInterval = null;
let isAlarmPlaying = false;


// Create Hours Options

for (let i = 1; i <= 12; i++) {

    let hour = i < 10 ? "0" + i : i;

    let option = document.createElement("option");

    option.value = hour;
    option.textContent = hour;

    hoursSelect.appendChild(option);

}


// Create Minutes Options

for (let i = 0; i < 60; i++) {

    let minute = i < 10 ? "0" + i : i;

    let option = document.createElement("option");

    option.value = minute;
    option.textContent = minute;

    minutesSelect.appendChild(option);

}


// Display Current Time

function updateClock() {

    let date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    currentTime.textContent =
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

}


// Update Clock Every Second

setInterval(updateClock, 1000);

updateClock();


// Set Alarm Function

function setAlarm() {

    let selectedHour = hoursSelect.value;
    let selectedMinute = minutesSelect.value;
    let selectedAmPm = ampmSelect.value;

    if (selectedHour === "" || selectedMinute === "") {

        alarmMessage.textContent = "Please select hour and minute!";

        return;

    }


    let hour = parseInt(selectedHour);

    let minute = parseInt(selectedMinute);


    // Convert 12-hour time to 24-hour time

    if (selectedAmPm === "PM" && hour !== 12) {

        hour = hour + 12;

    }

    if (selectedAmPm === "AM" && hour === 12) {

        hour = 0;

    }


    // Save Alarm Time

    alarmTime = {
        hour: hour,
        minute: minute
    };


    alarmMessage.textContent =
        `Alarm set for ${selectedHour}:${selectedMinute} ${selectedAmPm}`;


    setAlarmBtn.textContent = "Clear Alarm";

    stopAlarmBtn.style.display = "none";


    // Check Alarm Every Second

    if (alarmInterval !== null) {

        clearInterval(alarmInterval);

    }

    alarmInterval = setInterval(checkAlarm, 1000);

}


// Check Alarm Function

function checkAlarm() {

    let now = new Date();

    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();
    let currentSecond = now.getSeconds();


    if (
        alarmTime !== null &&
        currentHour === alarmTime.hour &&
        currentMinute === alarmTime.minute &&
        currentSecond === 0 &&
        !isAlarmPlaying
    ) {

        playAlarm();

    }

}


// Sound Generator

let audioContext = null;
let oscillator = null;
let gainNode = null;

function playAlarm() {

    isAlarmPlaying = true;

    alarmMessage.textContent = "Wake Up! Alarm is ringing!";

    setAlarmBtn.textContent = "Alarm Ringing";

    stopAlarmBtn.style.display = "block";


    // Create Audio

    audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    oscillator = audioContext.createOscillator();

    gainNode = audioContext.createGain();

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";

    oscillator.frequency.value = 800;

    gainNode.gain.value = 0.3;

    oscillator.start();


    // Change Sound Frequency

    let high = false;

    alarmSoundInterval = setInterval(() => {

        high = !high;

        oscillator.frequency.value = high ? 1000 : 600;

    }, 500);

}


// Stop Alarm Function

function stopAlarm() {

    if (oscillator !== null) {

        oscillator.stop();

        oscillator.disconnect();

        oscillator = null;

    }

    if (audioContext !== null) {

        audioContext.close();

        audioContext = null;

    }

    clearInterval(alarmSoundInterval);

    isAlarmPlaying = false;

    alarmTime = null;

    alarmMessage.textContent = "Alarm stopped!";

    setAlarmBtn.textContent = "Set Alarm";

    stopAlarmBtn.style.display = "none";

}


// Clear Alarm Function

function clearAlarm() {

    alarmTime = null;

    clearInterval(alarmInterval);

    alarmInterval = null;

    alarmMessage.textContent = "Alarm cleared!";

    setAlarmBtn.textContent = "Set Alarm";

}


// Alarm Button Click Event

setAlarmBtn.addEventListener("click", function () {

    if (alarmTime !== null) {

        clearAlarm();

    } else {

        setAlarm();

    }

});


// Stop Button Click Event

stopAlarmBtn.addEventListener("click", stopAlarm);


// Sound Interval Variable

let alarmSoundInterval = null;