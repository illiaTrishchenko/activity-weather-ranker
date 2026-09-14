# Skiing Scoring

## Initial research

The main factors I identified for a general skiing weather score are:

- snow availability
- temperature
- wind
- severe weather conditions

Snow availability should have the largest influence because otherwise suitable weather without enough snow does not make a useful skiing day.

Temperature matters because temperatures around or below freezing help preserve snow, while warmer conditions increase melting.

Wind should reduce the score as it becomes stronger. Strong winds can make skiing uncomfortable and potentially unsafe.

Fresh snowfall can improve conditions, but heavy snowfall combined with strong wind can also reduce visibility and make conditions worse.

## Snow depth

During the Open-Meteo research I initially planned to avoid hourly data.

However, `snowfall_sum` only describes new snowfall. A day with no new snowfall could still have excellent skiing conditions if substantial snow is already on the ground.

Open-Meteo exposes `snow_depth` as an hourly variable.

## Decision

Use `snow_depth` in addition to daily snowfall for the skiing score.

This introduces hourly data and requires a daily aggregation, but snow availability is important enough to justify the additional complexity.

## Scoring model

I decided to use a weighted score from 0 to 100:

- existing snow depth: 35%
- fresh snowfall: 10%
- temperature: 25%
- wind: 20%
- weather severity: 10%

Snow depth has the largest individual weight because suitable temperature and wind conditions are not useful for skiing if there is not enough snow on the ground.

Fresh snowfall is treated separately from existing snow. No fresh snow does not necessarily mean poor skiing conditions, while moderate fresh snow can improve them.

### Snow depth

Initial thresholds:

- 50 cm or more: excellent
- 30–50 cm: good
- 15–30 cm: limited
- 5–15 cm: poor
- below 5 cm: effectively unsuitable

### Fresh snowfall

Moderate fresh snowfall is positive, but very heavy snowfall is not treated as automatically better because it can also make conditions more difficult.

Initial thresholds:

- 5–15 cm: excellent
- 2–5 cm: good
- 0–2 cm: neutral
- 15–30 cm: good but less ideal
- above 30 cm: reduced score

### Temperature

I prefer a small range below freezing rather than simply rewarding colder temperatures.

Initial thresholds:

- -10°C to -2°C: excellent
- -15°C to -10°C: good
- -2°C to 2°C: acceptable
- 2°C to 5°C: poor
- above 5°C: increasingly unsuitable
- below -15°C: reduced due to comfort

### Wind

Wind progressively reduces the score:

- below 15 km/h: excellent
- 15–25 km/h: good
- 25–40 km/h: moderate
- 40–60 km/h: poor
- above 60 km/h: unsuitable

### Weather severity

Weather codes are used as a smaller adjustment.

Clear, cloudy and light snow conditions receive little or no penalty.

Fog, heavy precipitation and thunderstorms reduce the score.

The exact mapping will be based on Open-Meteo weather codes during implementation.

## Snow availability guard

A weighted average can produce misleading results if weather is otherwise excellent but there is effectively no snow.

Decision:

If snow depth is below 5 cm and fresh snowfall is below 2 cm, cap the final skiing score at 20.

This prevents a cold, sunny, windless day with no usable snow from being classified as a good skiing day.

## Sanity checking

Before implementing the scoring model, I tested it against a few synthetic scenarios.

One scenario exposed a problem with using only a weighted average:

- snow depth: 0 cm
- fresh snowfall: 0 cm
- temperature: -5°C
- wind: 5 km/h
- weather: clear

Using the initial scoring model, this produces approximately 61/100 because temperature, wind and weather conditions are excellent.

This is misleading. Snow availability is a prerequisite for skiing rather than just another independent weather factor.

### Additional sanity checks

I also considered several other scenarios:

- deep snow + moderate fresh snow + light wind + below-freezing temperature → very high score
- existing snow + no fresh snow + slightly positive temperature → still usable, but lower score
- sufficient snow + extreme wind → strongly reduced score

The resulting behavior appears reasonable for a general recreational skiing score.

The exact thresholds are intentionally approximate. The goal is a consistent and explainable suitability score rather than a professional mountain safety model.

## Remaining uncertainty

The skiing score does not account for:

- resort grooming
- piste maintenance
- avalanche risk
- slope altitude
- local terrain
- lift operation
- the difference between weather at the searched city or town and conditions at a nearby ski resort

The score uses weather at the geocoded location of the searched place, not data from a specific resort. In particular, snow depth in a town can differ substantially from snow depth at higher nearby slopes.

These are treated as out of scope for this exercise.
