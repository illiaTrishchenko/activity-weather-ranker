# Scoring Research

## General approach

Each activity will receive an absolute score from 0 to 100.

The scores are intended to answer:

> How suitable are the forecast conditions for this activity on this day?

They are not relative rankings within the seven-day forecast. This means a score of 80 should represent broadly good conditions even if every other day that week is better.

The scoring models should remain small and explainable. I prefer a few meaningful weather factors over using every measurement available from Open-Meteo.

---

## Skiing

### Initial research

The main factors I identified for a general skiing weather score are:

- snow availability
- temperature
- wind
- severe weather conditions

Snow availability should have the largest influence because otherwise suitable weather without enough snow does not make a useful skiing day.

Temperature matters because temperatures around or below freezing help preserve snow, while warmer conditions increase melting.

Wind should reduce the score as it becomes stronger. Strong winds can make skiing uncomfortable and potentially unsafe.

Fresh snowfall can improve conditions, but heavy snowfall combined with strong wind can also reduce visibility and make conditions worse.

### Snow depth

During the Open-Meteo research I initially planned to avoid hourly data.

However, `snowfall_sum` only describes new snowfall. A day with no new snowfall could still have excellent skiing conditions if substantial snow is already on the ground.

Open-Meteo exposes `snow_depth` as an hourly variable.

### Decision

Use `snow_depth` in addition to daily snowfall for the skiing score.

This introduces hourly data and requires a daily aggregation, but snow availability is important enough to justify the additional complexity.

### Initial scoring direction

- snow conditions: 45%
- temperature: 25%
- wind: 20%
- weather severity: 10%

These weights and their thresholds still need to be sanity-checked before implementation.