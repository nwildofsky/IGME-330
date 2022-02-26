// https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
export function getDateTimeString(date, minusYears=0, minusMonths=0, minusDays=0, minusHours=0) {
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (minusYears && year >= minusYears) {
        year -= minusYears;
    }
    if (minusMonths) {
        if (month <= minusMonths) {
            month -= minusMonths;
            year--;
            month = 12 + month;
        }
        else {
            month -= minusMonths;
        }
    }
    if (minusDays) {
        if (day <= minusDays) {
            day -= minusDays;
            month--;
            day = 30 + day;
        }
        else {
            day -= minusDays;
        }
    }
    if (minusHours) {
        if (hour <= minusHours) {
            hour -= minusHours;
            day--;
            hour = 24 + hour;
        }
        else {
            hour -= minusHours;
        }
    }

    let dateArray = [year, month, day, hour, minute, second];
    dateArray = dateArray.map(num => {
        return num.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
    })
    const string = dateArray[0]+'-'+dateArray[1]+'-'+dateArray[2]+'T'+dateArray[3]+':'+dateArray[4]+':'+dateArray[5];
    return string;
}

export function epochToDate(epochValue) {
    const date = new Date(epochValue);
    let dateString = getDateTimeString(date);
    dateString = dateString.replace('T', ' ');
    dateString += ' (UTC)';
    return dateString;
}