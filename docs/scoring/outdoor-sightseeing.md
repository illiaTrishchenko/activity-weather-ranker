### Initial research

For outdoor sightseeing, I define a good day as one that is suitable for a typical visitor walking around a town or city during daylight hours. It is not a score for hiking, cycling, or a specific person's heat or cold tolerance.

The main factors identified for this score are:

- precipitation amount and duration
- thermal comfort
- wind
- sunshine
- severe weather conditions

Temperature, precipitation, wind, and sunshine are the main weather factors I consider relevant for general outdoor sightseeing.

Precipitation has the strongest negative impact because prolonged or heavy rain directly disrupts walking and visiting outdoor attractions.

Temperature is also important, but I use a relatively broad comfort range because visitors can adapt to moderately warm or cold conditions with appropriate clothing.

Sunshine improves the experience but is not required for sightseeing, while strong wind mainly acts as an additional comfort penalty.

### Open-Meteo data

Open-Meteo provides daily forecast variables that are sufficient for this score:

- `apparent_temperature_max`
- `precipitation_sum`
- `precipitation_hours`
- `wind_speed_10m_max`
- `sunshine_duration`
- `daylight_duration`
- `weather_code`

I use daily data rather than aggregating hourly values. The result is one explainable score per day and avoids complexity that is not necessary for a general sightseeing forecast.

### Decision

Use a weighted score from 0 to 100:

- precipitation: 35%
- apparent temperature: 30%
- sunshine: 20%
- wind: 15%

Precipitation has the highest weight because it directly disrupts walking and viewing outdoor attractions. Both amount and duration matter: a short light shower is less disruptive than rain spread through most of the day.

Apparent temperature is used instead of air temperature because it better represents the conditions a visitor feels. Its score rewards a broad comfortable range rather than assuming that hotter is always better.

Sunshine is a positive factor, but not a prerequisite. A dry, overcast day can still be suitable for outdoor sightseeing.

Wind has the smallest weight. Moderate wind reduces comfort, especially in cold weather, but should not dominate the result in otherwise good conditions.

`weather_code` is not given a separate weight because it overlaps with precipitation and sunshine. It is instead used for severe-weather caps.

### Scoring model

#### Apparent temperature

`apparent_temperature_max` is used as a simple proxy for daytime sightseeing comfort.

Initial thresholds:

- 16°C to 25°C: excellent
- 10°C to 16°C or 25°C to 29°C: good
- 5°C to 10°C or 29°C to 32°C: moderate
- 0°C to 5°C or 32°C to 35°C: poor
- below 0°C or above 35°C: very poor

The broad 10°C to 29°C usable range reflects the fact that city tourists can adapt with clothing, while very cold and very hot conditions substantially reduce the comfort of a full day outdoors.

Using the daily maximum is intentionally a simplification. It does not capture temperature variation throughout the day, but avoids introducing hourly aggregation for a general day-level recommendation. A more detailed version could evaluate apparent temperature during typical sightseeing hours.

#### Precipitation

`precipitation_sum` and `precipitation_hours` are evaluated together.

Initial thresholds:

- 0 mm: excellent
- up to 1 mm and up to 2 precipitation hours: good
- up to 3 mm and up to 4 precipitation hours: moderate
- up to 8 mm or 4 to 8 precipitation hours: poor
- above 8 mm or above 8 precipitation hours: very poor

The use of `or` in the final two bands intentionally treats sustained precipitation as poor even when its total amount is relatively low.

#### Wind

`wind_speed_10m_max` is used to reflect the least comfortable part of the day.

Initial thresholds:

- below 15 km/h: excellent
- 15 to 25 km/h: good
- 25 to 35 km/h: moderate
- 35 to 50 km/h: poor
- above 50 km/h: very poor

#### Sunshine

Use `sunshine_duration / daylight_duration` rather than a fixed number of sunshine hours. This avoids penalising short winter days and locations with different day lengths.

Initial thresholds:

- 70% or more of daylight hours: excellent
- 40% to 70%: good
- 20% to 40%: moderate
- below 20%: low, but still usable

Even the lowest sunshine band retains some score because overcast but dry weather is still usable for city sightseeing.

### Severe-weather guards

A weighted average can be misleading when an otherwise comfortable day includes conditions that make outdoor plans impractical or unsafe.

Open-Meteo uses WMO weather codes. The relevant codes are:

- 45 and 48: fog
- 65: heavy rain
- 67: heavy freezing rain
- 75: heavy snow fall
- 82: violent rain showers
- 86: heavy snow showers
- 95, 96, and 99: thunderstorms, including hail

Decision:

- if `weather_code` is 95, 96, or 99, cap the final score at 20
- if `weather_code` is 65, 67, 75, 82, or 86, cap the final score at 35
- if `weather_code` is 45 or 48, cap the final score at 50

This allows short light rain to remain usable while preventing a high score for thunderstorms, severe precipitation, or fog that significantly reduces viewing conditions.

### Sanity checking

Before implementation, I tested the model against a few synthetic scenarios:

- 21°C apparent temperature, dry, light wind, and mostly sunny → very high score
- 18°C, 2 mm of rain over two hours, light wind, and cloudy → still a good but not excellent score
- 20°C, dry, 45 km/h wind, and sunny → reduced score because the day is uncomfortable despite otherwise attractive weather
- 22°C, dry, light wind, and a thunderstorm code → capped at 20 despite strong weighted inputs
- 34°C, dry, sunny, and calm → reduced score because excessive heat makes prolonged walking less comfortable
- 12°C, dry, calm, and overcast → reasonable score because cloud cover alone should not make sightseeing a poor option

The resulting behaviour appears reasonable for a general city sightseeing score.

The exact thresholds are intentionally approximate. The goal is a consistent and explainable suitability score rather than a personalised thermal-comfort or safety model.

### Remaining uncertainty

The outdoor sightseeing score does not account for:

- a visitor's fitness, clothing, health, or personal heat and cold tolerance
- shade, urban heat-island effects, or street-level wind conditions
- air quality, which can materially affect outdoor comfort
- attraction opening hours, crowding, closures, or local events
- the difference between weather at the geocoded town or city and conditions at a nearby attraction

These are treated as out of scope for this exercise.