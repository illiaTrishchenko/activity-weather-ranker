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
- Skiing represents weather suitability at the geocoded location rather than conditions at a specific resort.
- Surfing is available only when the nearest selected sea grid cell is within 25 km; it represents general nearby marine conditions rather than a specific surf break.

These assumptions may change as I explore the available data and scoring requirements.

## Scope

Prioritize:

- clear and explainable scoring
- GraphQL API
- simple React interface
- loading and error states
- tests for scoring logic

## Decision log

### Score interpretation

Question: Should the scores rank only the seven forecast days, or have an absolute meaning?

Assumption: Each activity receives an absolute score from 0 to 100. A score of 80 represents broadly good conditions even if every other forecast day has a higher score.

Reasoning: An absolute scale is easier to explain in the interface and makes an activity score meaningful without comparing every date in the forecast.

### Best-day presentation

Question: Should the interface explicitly select a best day for each activity?

Assumption: No. The MVP presents the seven days chronologically with absolute 0–100 scores, allowing users to compare them while preserving calendar context.

Reasoning: Highlighting or sorting the best days could make the answer faster to scan, but it is an interface enhancement rather than a requirement of the scoring model. It remains a possible future improvement.

### Activity availability

Question: Should an activity that cannot be meaningfully evaluated for a location receive a low numeric score?

Assumption: Return the activity as unavailable with an explanation rather than assigning a low score.

Reasoning: A low score implies that the activity was evaluated and conditions are poor. When the data is not applicable, this would be misleading.

### Surfing for inland locations

Question: How should surfing be handled when the searched city or town is not on the coast?

Assumption: Use the closest sea grid cell returned by Open-Meteo's Marine API only when it is within 25 km of the geocoded location. Otherwise return surfing as unavailable.

Reasoning: The Marine API forecasts an offshore model grid cell, not a named surf break. The 25 km limit permits a geocoded town centre slightly inland but avoids presenting a surf forecast for a clearly inland place.

### Surfing target user

Question: What constitutes a good surfing day when surfer experience is not provided?

Assumption: Score conditions for a recreational intermediate surfer.

Reasoning: This establishes usable wave-height and period thresholds without optimising for either a beginner or an expert seeking larger surf.

### Skiing target user

Question: What kind of skiing does the score represent?

Assumption: Score conditions for a general recreational skier at a managed ski resort, using marked and groomed pistes.

Reasoning: This keeps the model focused on weather suitability and excludes backcountry-specific factors such as avalanche risk, route selection, and unmarked terrain.

### Geocoding ambiguity

Question: What should happen if a place name has more than one valid geocoding result?

Assumption: Use the first result returned by Open-Meteo Geocoding API in the MVP and show the resolved place name and country in the interface.

Reasoning: This keeps the initial flow small while making the implicit choice visible to the user. A future version could offer a result picker.

### Place input validation

Question: Should a value such as `123` be passed directly to the geocoding API?

Assumption: A place must contain at least one Unicode letter. Leading and trailing whitespace is removed before validation.

Reasoning: Open-Meteo can interpret numeric input as a postal-code fragment; for example, `123` resolves to Vienna because its postal codes include `1230`. Requiring a letter keeps the input aligned with the requested city-or-town interface while still accepting names with diacritics and non-Latin scripts.

### Indoor and outdoor sightseeing

Question: Should the indoor sightseeing score be the inverse of outdoor sightseeing?

Assumption: No. Indoor sightseeing has a neutral baseline score of 50 and receives bonuses for conditions that make outdoor activities less appealing.

Reasoning: Good outdoor weather does not make museums and galleries unsuitable; it only makes outdoor alternatives more attractive.

### Open-Meteo research

I explored the Geocoding, Forecast and Marine APIs.

I decided to primarily use daily forecast data because the product ranks entire days rather than individual hours. Skiing and surfing are explicit exceptions where hourly data prevents misleading results.

While investigating skiing conditions, I found one important limitation: daily snowfall describes new snowfall but does not describe how much snow is already on the ground.

Detailed findings: [Open-Meteo research](./open-meteo.md)

### Scoring

I started defining the activity scores after identifying the forecast data available from Open-Meteo.

The initial approach is to keep each score explainable rather than trying to model every possible weather factor.

Detailed reasoning: [Scoring research](./scoring/README.md)
