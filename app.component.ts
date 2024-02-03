import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  weatherData: any; // Define a variable to store weather data
  cityInput: string = 'london'; // Variable to store the user-input city

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeatherData();
  }

  getWeatherData() {
    const apiKey = 'baf5c70020130c2d5e57cdd3de61f39d';

    // Ensure the user has entered a city name
    if (this.cityInput.trim() === '') {
      console.error('Please enter a city name.');
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityInput}&appid=${apiKey}`;

    this.http.get(apiUrl)
      .pipe(
        tap((data) => console.log('Weather data:', data)),
        catchError((error) => {
          console.error('Error fetching weather data:', error);
          return throwError(error);
        })
      )
      .subscribe((data: any) => {
        // Convert temperature from Kelvin to Celsius
        if (data && data.main && data.main.temp && data.wind && data.main.humidity) {
          data.main.temp = this.convertKelvinToCelsius(data.main.temp);
          data.wind.speed = this.convertSpeedToKmPerHour(data.wind.speed);
        }

        this.weatherData = data;
      });
  }

  convertKelvinToCelsius(tempInKelvin: number): number {
    return tempInKelvin - 273.15;
  }

  convertSpeedToKmPerHour(speedInMetersPerSecond: number): number {
    return speedInMetersPerSecond * 3.6;
  }

  convertHumidityToPercentage(humidity: number): number {
    return humidity;
    // You can add conversion logic if needed
  }
}
