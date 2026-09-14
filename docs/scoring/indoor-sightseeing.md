# Indoor Sightseeing Scoring

## Initial research

Indoor sightseeing is different from the other activities because it is relatively insensitive to weather.

A museum, gallery, indoor attraction, or similar activity can still be suitable on a sunny and comfortable day. Bad weather mainly makes indoor sightseeing more attractive compared with outdoor alternatives.

Because of this, I do not use the inverse of the outdoor sightseeing score.

For example, an outdoor sightseeing score of 90 should not imply that indoor sightseeing deserves only 10. Good weather does not make an indoor activity unsuitable.

The main weather factors I consider relevant are:

- precipitation
- uncomfortable temperature
- strong wind
- lack of sunshine
- severe weather conditions

## Open-Meteo data

The indoor score can reuse the same daily Open-Meteo measurements used for outdoor sightseeing:

- `apparent_temperature_max`
- `precipitation_sum`
- `precipitation_hours`
- `wind_speed_10m_max`
- `sunshine_duration`
- `daylight_duration`
- `weather_code`

No additional weather request is needed.

## Decision

Indoor sightseeing starts from a baseline score of 50.

Weather conditions can increase the score when being outside becomes less attractive:

- precipitation: up to +20
- uncomfortable temperature: up to +15
- wind: up to +10
- low sunshine: up to +5

The final score is capped at 100.

This differs intentionally from the weighted models used for outdoor activities. Indoor attractions remain generally viable regardless of normal weather, so a baseline-plus-bonuses model better reflects the activity.

## Scoring model

### Baseline

Start with:

`score = 50`

This represents a neutral day where indoor sightseeing is still a reasonable option but weather does not provide a strong reason to prefer it.

### Precipitation bonus

Rain makes indoor activities more attractive because it directly reduces the comfort of walking and visiting outdoor attractions.

Use `precipitation_sum` and `precipitation_hours` together.

Initial bonuses:

- no precipitation: +0
- up to 1 mm and up to 2 precipitation hours: +5
- up to 3 mm and up to 4 precipitation hours: +10
- up to 8 mm or 4 to 8 precipitation hours: +15
- above 8 mm or above 8 precipitation hours: +20

### Temperature discomfort bonus

Comfortable temperatures should not penalise indoor sightseeing, while uncomfortable heat or cold make indoor alternatives more attractive.

Using `apparent_temperature_max`:

- 10°C to 29°C: +0
- 5°C to 10°C or 29°C to 32°C: +5
- 0°C to 5°C or 32°C to 35°C: +10
- below 0°C or above 35°C: +15

The range is intentionally broad because moderately warm or cold weather does not by itself create a strong reason to stay indoors.

### Wind bonus

Strong wind can make outdoor sightseeing uncomfortable even without rain.

Using `wind_speed_10m_max`:

- below 15 km/h: +0
- 15 to 25 km/h: +2
- 25 to 35 km/h: +5
- 35 to 50 km/h: +8
- above 50 km/h: +10

### Low-sunshine bonus

Sunshine has only a small influence on the indoor score.

Use:

`sunshine_duration / daylight_duration`

Initial bonuses:

- 70% or more: +0
- 40% to 70%: +1
- 20% to 40%: +3
- below 20%: +5

Cloudy weather can make indoor activities more appealing, but cloud cover alone should not dominate the recommendation.

## Severe-weather guards

Very severe weather creates a different problem.

A thunderstorm or extreme precipitation may make an indoor destination attractive in theory, but travelling to the attraction may itself be uncomfortable or unsafe.

For this reason, severe weather should not automatically result in an extremely high indoor score.

Decision:

- if `weather_code` is 95, 96, or 99, cap the final score at 60
- if `weather_code` is 65, 67, 75, 82, or 86, cap the final score at 70

This distinguishes between "bad weather makes a museum a good alternative" and "weather is severe enough that travelling around the city may be undesirable."

## Sanity checking

I tested the model against several synthetic scenarios:

- 22°C, dry, calm, and sunny → around 50, because indoor sightseeing is still viable but weather provides no reason to prefer it
- 18°C with several hours of rain → higher score because indoor activities become more attractive
- 34°C, dry, sunny, and calm → increased score because prolonged outdoor walking may be uncomfortable
- 10°C, dry, windy, and overcast → moderately increased score
- heavy rain with strong wind → high score because indoor sightseeing is preferable to outdoor alternatives
- otherwise favourable conditions with a thunderstorm code → score is capped because travelling to the attraction may be undesirable

The resulting behaviour is intentionally different from simply calculating `100 - outdoorScore`.

## Remaining uncertainty

The indoor sightseeing score does not account for:

- availability or quality of indoor attractions
- attraction opening hours
- ticket availability
- travel distance to the attraction
- whether transport is mostly indoors or outdoors
- local flooding, transport disruption, or official weather warnings

These are treated as out of scope for this exercise.
