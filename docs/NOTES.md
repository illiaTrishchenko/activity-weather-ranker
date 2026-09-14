# Working Notes

## Initial plan

Goal: rank the next 7 days for:

- skiing
- surfing
- outdoor sightseeing
- indoor sightseeing

High-level flow:

location
→ geocoding
→ weather / marine data
→ activity scoring
→ GraphQL API
→ React UI

## Initial questions

Before implementing the scoring, I need to understand what data Open-Meteo provides and decide how to handle a few ambiguous parts of the task:

1. Which Open-Meteo measurements are useful for each activity?
2. What makes a good skiing day?
3. What makes a good surfing day?
4. How should outdoor and indoor sightseeing differ in scoring?
5. What should happen when skiing or surfing isn't applicable to a location?
6. How should ambiguous location names be handled?
7. Should scores be absolute (0–100) or relative to the other days in the 7-day forecast?
8. How much explanation should the API return alongside a score?

## Initial assumptions

- Each activity will receive a score from 0 to 100.
- Higher scores mean better conditions.
- Scores should be absolute rather than relative to the other six days.
- No persistence is required.
- Open-Meteo can be called for each request.
- Skiing and surfing will initially represent weather suitability rather than whether a ski resort or surf spot actually exists at the location.

These assumptions may change as I explore the available data and scoring requirements.

## Scope

Prioritize:

- clear and explainable scoring
- GraphQL API
- simple React interface
- loading and error states
- tests for scoring logic


## Decision log

### Open-Meteo research

I explored the Geocoding, Forecast and Marine APIs.

I decided to primarily use daily forecast data because the product ranks entire days rather than individual hours.

While investigating skiing conditions, I found one important limitation: daily snowfall describes new snowfall but does not describe how much snow is already on the ground.

Detailed findings: [Open-Meteo research](./open-meteo.md)

### Scoring

I started defining the activity scores after identifying the forecast data available from Open-Meteo.

The initial approach is to keep each score explainable rather than trying to model every possible weather factor.

Detailed reasoning: [Scoring research](./scoring/README.md)
