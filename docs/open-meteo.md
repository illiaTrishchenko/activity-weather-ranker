# Open-Meteo Research

## Geocoding

Open-Meteo provides a Geocoding API that can resolve a city or town name to coordinates.

The forecast APIs use latitude and longitude, so the user input needs to be resolved before requesting forecast data.

### Decision

Use the top geocoding result for the initial implementation.

### Trade-off

Ambiguous place names may resolve to an unexpected location. A more complete version could return multiple matches and let the user choose.

---

## Weather forecast

Open-Meteo provides both hourly and daily weather variables.

Since the product ranks entire days, I plan to use daily aggregates where possible. This keeps the scoring model simpler and avoids introducing hourly-to-daily aggregation unless it provides meaningful value.

Relevant daily measurements:

- weather code
- maximum/minimum temperature
- maximum apparent temperature
- precipitation sum
- precipitation hours
- snowfall sum
- maximum wind speed
- sunshine duration
- daylight duration

One limitation for skiing is that snowfall represents new snow during the day rather than the amount of snow already on the ground.

Snow depth is available as an hourly variable.

### Decision

Use daily weather data for outdoor and indoor sightseeing, where the product needs one explainable score for each day.

Use hourly weather data when it materially improves an activity score:

- skiing uses hourly `snow_depth`, aggregated for each day
- surfing uses hourly wind speed, weather code, and daylight status

---

## Marine forecast

Open-Meteo provides a separate Marine API with both hourly and daily marine forecasts.

Relevant hourly measurements for surfing:

- wave height
- wave period

Wind speed, weather code, and daylight status come from the regular weather forecast.

### Decision

Use hourly marine values rather than daily aggregates. Daily maximum wave height and daily maximum wave period can occur in different hours, which would create an artificial combination of the best values.

For each day, calculate an hourly surf score during daylight and use the best valid hour as the daily score.

Request the weather forecast at the Marine API's returned grid-cell coordinates, so wind is measured near the waves rather than at the centre of the searched town.

I considered wave and swell direction, but decided not to include them initially.

Whether a particular direction is good depends on the orientation of the specific surf break, which this service does not know.

### Location availability

Request the Marine API with `cell_selection=sea` and compare the returned sea grid-cell coordinates with the geocoded city or town coordinates.

Only provide a surfing score when the selected sea cell is within 25 km. Otherwise return surfing as unavailable rather than producing a misleading score for an inland location.

### Limitation

The surfing score represents general marine and weather conditions near a place, not the quality or safety of a specific surf spot.

---

## Forecast granularity

Open-Meteo exposes many additional hourly and 15-minute variables, including visibility, humidity, snow depth and atmospheric measurements.

### Decision

Prefer daily aggregates for the initial implementation and only introduce more granular data when it materially improves an activity score.

This keeps the implementation small and the scoring model easier to explain.
