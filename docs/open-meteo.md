
## Open-Meteo research

### Geocoding

Open-Meteo provides a Geocoding API that can resolve a city or town name to coordinates.

The forecast APIs use latitude and longitude, so the user input needs to be resolved before requesting forecast data.

Initial decision:
Use the top geocoding result for the initial implementation.

Trade-off:
Ambiguous place names may resolve to an unexpected location. A more complete version could return multiple matches and let the user choose.

### Weather forecast

Open-Meteo provides both hourly and daily weather variables.

Since the product ranks entire days, I plan to use daily aggregates where possible. This keeps the scoring model simpler and avoids introducing hourly-to-daily aggregation unless it provides meaningful value.

Relevant daily measurements:
- weather code
- maximum/minimum temperature
- maximum apparent temperature
- precipitation sum
- maximum precipitation probability
- snowfall sum
- maximum wind speed
- sunshine duration

One limitation for skiing is that snowfall represents new snow during the day rather than the amount of snow already on the ground. Snow depth is available as an hourly variable.

Decision:
Start with daily weather data. I will only introduce hourly data if snow depth proves important enough to justify the additional aggregation.

### Marine forecast

Open-Meteo provides a separate Marine API with both hourly and daily marine forecasts.

Relevant daily measurements for surfing:
- maximum wave height
- maximum wave period
- maximum swell wave height
- maximum swell wave period

Wind speed can come from the regular weather forecast.

Decision:
Use daily marine aggregates rather than hourly marine data, since the product ranks days rather than individual hours.

I considered wave and swell direction, but decided not to include them initially. Whether a particular direction is good depends on the orientation of the specific surf break, which this service does not know.

Limitation:
The surfing score will represent general sea and weather conditions rather than the quality of a specific surf spot.

Open question:
How should surfing be represented for inland locations where marine data is unavailable?

### Forecast granularity

Open-Meteo exposes many additional hourly and 15-minute variables, including visibility, humidity, snow depth and atmospheric measurements.

Decision:
Prefer daily aggregates for the initial implementation and only introduce more granular data when it materially improves an activity score.

This keeps the implementation small and the scoring model easier to explain.  