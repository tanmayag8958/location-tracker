const successCallback = (position) => {
    let trackingDetails = getTrackingDetails();
    trackingDetails[position['timestamp']] = {
        'latitude': position['coords']['latitude'],
        'longitude': position['coords']['longitude'],
        'altitude': position['coords']['altitude'],
        'accuracy': position['coords']['accuracy']
    };
    setTrackingDetails(trackingDetails);
};
const errorCallback = (error) => {
    clearInterval(tracking_interval);
    clearTrackingDetails();
    document.getElementById("track-name").disabled = false;
    document.getElementById("track-name").value = '';
    let trackingDetails = getTrackingDetails();
    trackingDetails['error'] = error;
    setTrackingDetails(trackingDetails);
};
let tracking_interval = null;


function getTrackingDetails() {
    let trackName = document.getElementById('track-name').value;
    let trackingDetails = localStorage.getItem(trackName);
    if (trackingDetails === '""') {
        trackingDetails = {};
    } else {
        trackingDetails = JSON.parse(trackingDetails);
    }
    return trackingDetails;
}


function setTrackingDetails(trackingDetails) {
    let trackName = document.getElementById('track-name').value;
    if (trackName === '') {
        alert('No tracking name was given!');
        return false
    }
    localStorage.setItem(trackName, JSON.stringify(trackingDetails));
    return true;
}


function clearTrackingDetails() {
    let trackName = document.getElementById('track-name').value;
    localStorage.removeItem(trackName);
}


function startTracking() {
    if (setTrackingDetails('')) {
        document.getElementById("track-name").disabled = true;
        document.getElementById("start-btn").disabled = true;
        document.getElementById("stop-btn").disabled = false;
        tracking_interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                successCallback,
                errorCallback,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                }
            );
        }, 1000);
    }
}


function stopTracking() {
    clearInterval(tracking_interval);
    createLocationTable(getTrackingDetails());
    clearTrackingDetails();
    document.getElementById("track-name").disabled = false;
    document.getElementById("track-name").value = '';
    document.getElementById("start-btn").disabled = false;
    document.getElementById("stop-btn").disabled = true;
}


// Functions to create table with tracking data.
function getTagWithContent(tagName, content) {
    const newTagNode = document.createElement(tagName);
    const contentNode = document.createTextNode(content);
    newTagNode.appendChild(contentNode);
    return newTagNode;
}


function createLocationTable(trackingDetails) {
    const trackingTableBody = document.getElementById("tracking-table-body");
    trackingTableBody.innerHTML = '';

    Object.keys(trackingDetails).forEach((timestamp) => {
        const newDataRow = document.createElement("tr");
        let dateObject = new Date(parseInt(timestamp));
        let dateString = dateObject.getDate() + "-" + (dateObject.getMonth() + 1) + "-" + dateObject.getFullYear() + " " +
            dateObject.getHours() + ":" + dateObject.getMinutes() + ":" + dateObject.getSeconds();
        newDataRow.appendChild(getTagWithContent('td', dateString));
        Object.values(trackingDetails[timestamp]).forEach((_value) => {
            newDataRow.appendChild(getTagWithContent('td', _value));
        });
        trackingTableBody.appendChild(newDataRow);
    });
}
