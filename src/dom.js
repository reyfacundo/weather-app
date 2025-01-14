import sunnyDay from "./assets/sunny-icon.png";
import sunnyDayBg from "./assets/sunny.png";
import cloudyDay from "./assets/cloudy-icon.png";
import cloudyDayBg from "./assets/cloudy.png";
import rainyDay from "./assets/rain-icon.png";
import rainyDayBg from "./assets/rainy.png";
import snowDay from "./assets/snow-icon.png";
import snowDayBg from "./assets/snowy.png";
import fogDay from "./assets/fog-icon.png";
import fogDayBg from "./assets/dayFoggy.png";
import windy from "./assets/windy.png";
import clearNight from "./assets/night-icon.png";
import clearNightBg from "./assets/night.png";
import cloudyNight from "./assets/nightCloudy-icon.png";
import cloudyNightBg from "./assets/cloudyNight.png";
import rainyNight from "./assets/rain-icon.png";
import rainyNightBg from "./assets/nightRain.png";
import snowyNight from "./assets/snow-icon.png";
import snowyNightBg from "./assets/nightSnow.png";
import fogNight from "./assets/fog-icon.png";
import fogNightBg from "./assets/nightFoggy.png";
import { apiHandler } from "./apiHandler";

export class Dom {
    static weatherAssets = {
        day: {
            clear: {
                background: sunnyDayBg,
                icon: sunnyDay,
            },
            cloudy: {
                background: cloudyDayBg,
                icon: cloudyDay,
            },
            raining: {
                background: rainyDayBg,
                icon: rainyDay,
            },
            snowing: {
                background: snowDayBg,
                icon: snowDay,
            },
            foggy: {
                background: fogDayBg,
                icon: fogDay,
            },
            windy: {
                background: cloudyDayBg,
                icon: windy,
            },
        },
        night: {
            clear: {
                background: clearNightBg,
                icon: clearNight,
            },
            cloudy: {
                background: cloudyNightBg,
                icon: cloudyNight,
            },
            raining: {
                background: rainyNightBg,
                icon: rainyNight,
            },
            snowing: {
                background: snowyNightBg,
                icon: snowyNight,
            },
            foggy: {
                background: fogNightBg,
                icon: fogNight,
            },
            windy: {
                background: cloudyNight,
                icon: windy,
            },
        },
    };
    static async populateWeek(location = "new york", unit) {
        try {
            document.querySelector(".content").textContent = "";
            await apiHandler.initialize(location, unit);
            const weekData = apiHandler.getWeek();
            console.log(weekData, "data");

            document.querySelector(".weather");
            document.querySelector(".temp");
            document.querySelector("input");
            const content = document.querySelector(".content");

            weekData.forEach((day, index) => {
                if (index === 0) return;
                const { date, temperature, time, weather } = day;
                const dayCard = document.createElement("div");
                const dateElement = document.createElement("h3");
                const img = document.createElement("img");
                const temp = document.createElement("h3");
                if (index === 1) {
                    dayCard.classList.add("current-day");
                    this.displayMain(
                        weather,
                        weekData[0].address,
                        temperature,
                        this.getWeatherAsset(time, weather).background
                    );
                }
                dayCard.classList.add("day-card");
                dayCard.dataset.weather = weather;
                dayCard.dataset.time = time;

                dateElement.textContent = date;
                img.src = this.getWeatherAsset(time, weather).icon;
                temp.textContent = `${temperature}`;
                temp.classList.add("card-temp");

                dayCard.append(dateElement, img, temp);
                content.appendChild(dayCard);
            });
        } catch (error) {
            console.error(error);
        }
    }
    static getWeatherAsset(time, weather) {
        return this.weatherAssets[time][weather];
    }
    static displayMain(weather, location, temperature, background) {
        const backgroundQuery = document.querySelector(".background");
        const weatherQuery = document.querySelector(".weather");
        const locationQuery = document.querySelector("input");
        const temperatureQuery = document.querySelector(".temp");
        const address = location.charAt(0).toUpperCase() + location.slice(1);
        const weatherUpperCased =
            weather.charAt(0).toUpperCase() + weather.slice(1);
        locationQuery.value = address;
        weatherQuery.textContent = weatherUpperCased;
        backgroundQuery.style.backgroundImage = `url('${background}')`;
        temperatureQuery.textContent = `${temperature}°`;
    }
}

document.querySelector(".content").addEventListener("click", async (e) => {
    const card = e.target.closest(".day-card");
    if (card) {
        document.querySelectorAll(".day-card").forEach((e) => {
            if (e.classList.contains("selected-day"))
                e.classList.remove("selected-day");
        });
        card.classList.add("selected-day");
        const temp = card.querySelector(".card-temp").textContent;
        const locationQuery = document.querySelector("input").value;
        const time = card.dataset.time;
        const weather = card.dataset.weather;
        Dom.displayMain(
            weather,
            locationQuery,
            temp,
            Dom.getWeatherAsset(time, weather).background
        );
    }
});
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const unit = document.querySelector(".checkbox").dataset.unit;
        const queryValue = e.currentTarget.querySelector("input").value;
        await Dom.populateWeek(queryValue, unit);
    } catch (error) {
        console.error(error);
    }
});
document.querySelector(".checkbox").addEventListener("click", async () => {
    try {
        const unit = document.querySelector(".checkbox").dataset.unit;
        const queryValue = document.querySelector("input").value;
        const newUnit = unit === "C" ? "F" : "C";
        document.querySelector(".checkbox").dataset.unit = newUnit;
        await Dom.populateWeek(queryValue, newUnit);
    } catch (error) {
        console.error(error);
    }
});
