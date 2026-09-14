# Surfing Scoring

## Initial research

Surfing differs from the other activities because suitable conditions depend heavily on both marine conditions and the characteristics of a specific surf break.

For this exercise, the score targets a recreational intermediate surfer. It is not intended for beginners, experts looking for large surf, or professional safety decisions.

The main factors identified for a general surfing score are:

- wave height
- wave period
- wind speed
- severe weather conditions

Wave height determines whether there is enough wave activity to surf, but larger waves are not automatically better.

Wave period is also important because waves with the same height can have very different characteristics. Longer-period waves generally carry more energy and tend to be more organised than short-period wind waves.

Wind can materially affect surface conditions. Strong wind generally makes conditions less attractive, while light wind is less disruptive.

Other factors such as swell direction, wind direction, tide, coastline orientation, and bathymetry are important for real surf forecasting. However, their effect depends on the characteristics of a specific surf break.

Because the application only receives a city or town, it does not have enough information to model those factors reliably.

## Location availability

A city or town is not necessarily close enough to the sea for a surfing recommendation to be meaningful.

The Marine API can select a sea grid cell for requested coordinates, but the existence of marine forecast data does not necessarily mean that the searched location itself is coastal or suitable for surfing.

Initial decision:

1. Geocode the searched city or town.
2. Request marine data using `cell_selection=sea`.
3. Compare the searched location with the coordinates represented by the marine forecast.
4. Only provide a surfing score when the marine forecast is sufficiently close to the searched location.

I initially use 25 km as the maximum distance.

This allows for towns whose geocoded centre is slightly inland while rejecting clearly inland locations.

The threshold is an application-level heuristic. Being within 25 km of a marine forecast does not guarantee that a surfable beach or surf break exists nearby.

If the marine forecast is outside this range, surfing is returned as unavailable rather than receiving a numeric score.

The exact behaviour of `cell_selection=sea` and the returned marine coordinates will be verified during implementation.

## Open-Meteo data

The surfing score combines Open-Meteo's Marine and Weather Forecast APIs.

Marine API hourly variables:

- `wave_height`
- `wave_period`

Weather Forecast API hourly variables:

- `wind_speed_10m`
- `weather_code`
- `is_day`

The weather forecast is requested for the selected marine coordinates rather than the centre of the searched town.

This keeps wind and weather measurements geographically closer to the marine conditions being evaluated.

## Hourly scoring

Unlike the other activity models, surfing uses hourly rather than daily scoring.

Using daily maximum values could combine conditions that do not occur at the same time. For example, the maximum wave height and maximum wave period may occur during different hours.

Decision:

1. Score each available hourly forecast during daylight (`is_day = 1`).
2. Calculate a surfing score for each valid hour.
3. Use the highest hourly score as the score for that day.
4. Retain the hour that produced the highest score as the best forecast window.

This makes the daily score answer:

> Is there a good time to surf during this day?

rather than assuming that conditions remain constant throughout the day.

## Scoring model

Use a weighted hourly score from 0 to 100:

- wave height: 40%
- wave period: 30%
- wind speed: 30%

Wave height receives the largest weight because there must first be enough wave activity for surfing.

Wave period has substantial weight because waves with similar heights can have different levels of energy and organisation.

Wind also receives significant weight because strong wind can materially reduce the quality of otherwise suitable conditions.

The model uses wind speed only.

Wind direction is intentionally excluded because without knowing the orientation of a particular surf break, the application cannot reliably determine whether the wind is onshore, offshore, or cross-shore.

### Wave height

`wave_height` represents the significant height of combined waves at the marine grid cell rather than the exact breaking-wave height at a beach.

Initial thresholds for a recreational intermediate surfer:

- 0.8 m to 1.8 m: excellent
- 0.5 m to 0.8 m or 1.8 m to 2.5 m: good
- 0.4 m to 0.5 m or 2.5 m to 3.0 m: limited
- below 0.4 m: effectively too small
- above 3.0 m: increasingly unsuitable

The scoring intentionally does not assume that larger waves are always better.

### Wave period

Initial thresholds:

- 12 to 15 seconds: excellent
- 9 to 12 seconds or 15 to 18 seconds: good
- 7 to 9 seconds: moderate
- below 7 seconds: poor
- above 18 seconds: reduced

Very short-period waves receive a lower score because they are generally less organised.

Very long periods are also slightly reduced because the additional wave energy can make conditions more demanding for the target recreational surfer.

### Wind speed

Initial thresholds:

- below 10 km/h: excellent
- 10 to 20 km/h: good
- 20 to 30 km/h: moderate
- 30 to 40 km/h: poor
- above 40 km/h: very poor

Light wind receives the highest score because it is less likely to disrupt the wave surface.

This remains an approximation. A light onshore wind can still be less favourable than an offshore wind, but the application cannot determine this reliably without information about the surf break.

## Safety and availability guards

A weighted average can produce misleading results when a prerequisite is missing or conditions become severe.

Decision:

- if wave height is below 0.4 m, cap the hourly score at 20
- if wave height is above 3.0 m, cap the hourly score at 35
- if wind speed is above 40 km/h, cap the hourly score at 30
- if `weather_code` is 95, 96, or 99, assign the hourly score as 0

The wave-height guards prevent otherwise favourable period and wind conditions from producing a high score when waves are either effectively too small or outside the intended recreational range.

The strong-wind guard prevents good wave measurements from dominating when surface conditions are likely to be poor.

The thunderstorm rule is treated as a safety guard rather than a surf-quality adjustment.

Because scoring is hourly, a thunderstorm during one part of the day does not automatically make the entire day unsuitable. A later daylight hour without a thunderstorm can still become the day's best window.

## Sanity checking

Before implementation, I tested the scoring model against several synthetic scenarios:

- 1.2 m waves, 13-second period, and 5 km/h wind → very high score
- 0.2 m waves, 14-second period, and light wind → capped at 20 because the waves are effectively too small
- 1.3 m waves, 6-second period, and light wind → reduced because the short period indicates less favourable conditions
- 2.8 m waves, 14-second period, and light wind → reduced because the conditions are more demanding for the target surfer
- 1.2 m waves, 13-second period, and 45 km/h wind → capped at 30 because of strong wind
- otherwise favourable conditions with a thunderstorm code → hourly score of 0
- marine forecast too far from the searched location → surfing unavailable rather than a numeric score

The resulting behaviour appears reasonable for a general and explainable surfing recommendation while avoiding claims of surf-break-level accuracy.

The exact thresholds are intentionally approximate. They are designed to produce consistent recommendations for this exercise rather than replace a dedicated surf forecast.

## Remaining uncertainty

The surfing score does not account for:

- surf-break orientation
- swell direction relative to a particular beach
- wind direction relative to the coast
- tide height or the preferred tide window of a surf break
- bathymetry, reefs, sandbanks, currents, or rip currents
- exact breaking-wave height at the shore
- water temperature
- surfer equipment
- local hazards
- official warnings
- beach closures
- lifeguard availability

These are treated as out of scope for this exercise.

The result should be presented as a general nearby-marine suitability forecast rather than surf-spot-specific guidance or safety advice.
