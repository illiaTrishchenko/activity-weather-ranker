# Working Notes

## Initial plan

Goal: rank the next 7 days for:

* skiing
* surfing
* outdoor sightseeing
* indoor sightseeing

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

* Each activity will receive a score from 0 to 100.
* Higher scores mean better conditions.
* Scores should be absolute rather than relative to the other six days.
* No persistence is required.
* Open-Meteo can be called for each request.
* Skiing and surfing will initially represent weather suitability rather than whether a ski resort or surf spot actually exists at the location.

These assumptions may change after exploring the available Open-Meteo data.

## Scope

Prioritize:

* clear and explainable scoring
* GraphQL API
* simple React interface
* loading and error states
* tests for scoring logic

---

## Open-Meteo research

### Geocoding

Open-Meteo provides a Geocoding API that can resolve a city or town name to coordinates.

The forecast APIs work with latitude and longitude, so the location entered by the user needs to be resolved before requesting forecast data.

Initial decision:
Use the top geocoding result and its latitude/longitude for forecast requests.

Trade-off:
Ambiguous place names may resolve to an unexpected location.

Possible improvement:
Return multiple matching locations and allow the user to choose the intended one.

### Weather forecast

The regular forecast API provides weather measurements that can be useful for skiing and sightseeing.

Potentially relevant measurements include:

* temperature
* precipitation
* snowfall
* wind speed
* weather conditions / weather code

Next step:
Decide which measurements are useful for each activity and how they should contribute to the final score.

### Marine forecast

The regular weather forecast doesn't provide enough information to evaluate surfing conditions.

Open-Meteo has a separate Marine API that provides data such as:

* wave height
* wave period
* wave direction
* swell wave height
* swell wave period
* swell wave direction

Initial decision:
Use Marine API data as part of the surfing score.

Open question:
How should surfing be handled for inland locations where marine data is not applicable?