const API_KEY = 'RXKSQZMSIAKW'; // <-- Replace with your real API key here

const cities = [
  "Europe/London",
  "America/New_York",
  "Asia/Tokyo",
  "Africa/Kigali",
  "Australia/Sydney"
];

const clocksContainer = document.getElementById('clocks');
const fromZone = document.getElementById('from-zone');
const toZone = document.getElementById('to-zone');
const fromTimeInput = document.getElementById('from-time');
const resultDisplay = document.getElementById('converted-result');
const convertBtn = document.getElementById('convert-btn');

// Populate dropdowns only once
cities.forEach(zone => {
  fromZone.appendChild(new Option(zone, zone));
  toZone.appendChild(new Option(zone, zone));
});

// Fetch time data from TimeZoneDB API
async function fetchTime(zone) {
  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=zone&zone=${zone}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API request failed');
  const data = await res.json();
  if (data.status !== "OK") throw new Error(data.message || 'API returned error');
  return data;
}

// Update the world clocks display
async function updateClocks() {
  clocksContainer.innerHTML = '';
  for (const zone of cities) {
    try {
      const data = await fetchTime(zone);
      // data.formatted looks like "2021-07-03 12:12:22"
      const timeStr = data.formatted.replace(' ', 'T');
      const dateObj = new Date(timeStr);
      const time = dateObj.toLocaleTimeString('en-US', { hour12: false });

      const clock = document.createElement('div');
      clock.className = 'clock';
      clock.innerHTML = `<div>${zone}</div><div>${time}</div>`;
      clocksContainer.appendChild(clock);
    } catch (error) {
      console.error(`Error loading clock for ${zone}:`, error);
      const clock = document.createElement('div');
      clock.className = 'clock';
      clock.textContent = `${zone}: Error loading time`;
      clocksContainer.appendChild(clock);
    }
  }
}

// Helper: parse input datetime as if it's in FROM timezone (using gmtOffset)
function parseDateTimeInZone(dateTimeStr, gmtOffsetSeconds) {
  const [datePart, timePart] = dateTimeStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  // Create a UTC timestamp for the given date & time ignoring local browser timezone
  const utcDate = Date.UTC(year, month - 1, day, hour, minute);

  // Subtract the FROM timezone offset to get true UTC time
  return new Date(utcDate - gmtOffsetSeconds * 1000);
}

// Convert time between time zones using offsets
async function convertTime() {
  const fromZoneValue = fromZone.value;
  const toZoneValue = toZone.value;
  const fromDateTimeString = fromTimeInput.value;

  if (!fromDateTimeString) {
    resultDisplay.textContent = 'Please select date and time to convert.';
    return;
  }

  try {
    const [fromData, toData] = await Promise.all([
      fetchTime(fromZoneValue),
      fetchTime(toZoneValue)
    ]);

    const fromOffset = fromData.gmtOffset; // in seconds
const toOffset = toData.gmtOffset;     // in seconds

// Parse input datetime as local time (browser)
const inputDate = new Date(fromDateTimeString);

// Calculate offset difference in milliseconds
const offsetDiffMs = (toOffset - fromOffset) * 1000;

// Adjust input date by offset difference
const convertedDate = new Date(inputDate.getTime() + offsetDiffMs);


    // Format nicely
    const formattedResult = convertedDate.toLocaleString('en-US', {
        hour12: false
});


    resultDisplay.textContent = `Converted Time: ${formattedResult}`;
  } catch (error) {
    console.error('Conversion error:', error);
    resultDisplay.textContent = 'Failed to convert time. Please try again.';
  }
}

// Setup event listener once
convertBtn.addEventListener('click', convertTime);

