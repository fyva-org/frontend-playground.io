let currentTime = new Date().getTime();

function parseDate(date) {
    const [day, month, year] = date.split("/").map(Number);
    if ([day, month, year].some(isNaN)) {
        throw new Error(`Invalid date format. Expected dd/mm/yyyy. Received day: ${day}, month: ${month}, year: ${year}.`);
    }
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate;
}

export function currentDate() {
    const currentDate = new Date().toLocaleDateString("en-GB");
    return parseDate(currentDate);
}

export function toTimestamp(dateStr) {
    let [day, month, year, hour, minute] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).getTime();
}

export function normalizeDate(dateStr) {
    return parseDate(dateStr.replace(/-/g, '/'));
}

export function parseCurrentTime() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes;
}

export function parseTime(time) {
    const [hour, minute] = time.split('-').map(Number);
    const ConvertToMinutes = hour * 60 + minute;
    return ConvertToMinutes;
}

export function hasDateExpired(endDate) {
    if (currentTime <= endDate) {
        return true;
    }
    return false;
}

export function hasDateBegun(startDate) {
    if (currentTime >= startDate) {
        return true;
    }
    return false;
}