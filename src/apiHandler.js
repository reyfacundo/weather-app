async function apiCall(location, unit) {
    try {
        const responseApi = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=${unit}&include=current&key=5T28JLR3M5PN3NKVXUEQ4N8HC&contentType=json&include=days&elements=conditions,datetime,description,icon,sunrise,sunset,temp,tempmax,tempmin,datetimeEpoch`
        );
        const response = await responseApi.json();
        return {
            address: response.address,
            days: [...response.days.slice(0, 7)],
            current: response.currentConditions,
        };
    } catch (error) {
        console.error(error);
    }
}

export class apiHandler {
    static response = null;
    static weekDays = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
    };

    static async initialize(location, unit) {
        try {
            let unitGroup;
            if (unit === "C" || unit === undefined || unit === null) {
                unitGroup = "metric";
            } else if (unit === "F") unitGroup = "us";
            const resolved = await apiCall(location, unitGroup);
            this.response = resolved;
        } catch (error) {
            console.error(error);
        }
    }
    static getDay(day) {
        const getDay = new Date(day.datetime);
        const dayNumber = getDay.getDay();
        const date = this.weekDays[dayNumber];
        return date;
    }
    static iconAndTime(day, index) {
        let dayOrNight = "day";
        let icon = day.icon;
        if (icon === "partly-cloudy-day") {
            icon = "cloudy";
        } else if (icon === "clear-day") {
            icon = "clear";
        } else if (icon === "partly-cloudy-night") {
            icon = "cloudy";
            dayOrNight = "night";
        } else if (icon === "clear-night") {
            icon = "cloudy";
            dayOrNight = "night";
        } else if (icon === "snow") {
            icon = "snowing";
        } else if (icon === "rain") {
            icon = "raining";
        } else if (icon === "fog") {
            icon = "foggy";
        } else if (icon === "wind") {
            icon = "windy";
        }
        if (index === 0) {
            const sunRise = this.response.current.sunrise.slice(0, 2);
            const sunSet = this.response.current.sunset.slice(0, 2);
            const time = this.response.current.datetime.slice(0, 2);
            if (!(time <= sunSet && time >= sunRise)) {
                dayOrNight = "night";
            }
        }
        return [dayOrNight, icon];
    }
    static getWeek() {
        const week = [];
        this.response.days.forEach((day, index) => {
            const date = this.getDay(day);
            const temp = day.temp;
            const [dayOrNight, icon] = this.iconAndTime(day, index);
            week.push({
                date: date,
                temperature: temp,
                weather: icon,
                time: dayOrNight,
            });
        });
        week.unshift({ address: this.response.address });
        return week;
    }
}
