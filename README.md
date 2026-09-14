# Activity Weather Ranker

Activity Weather Ranker takes a city or town and scores the next seven days for:

- skiing
- surfing
- outdoor sightseeing
- indoor sightseeing

The backend geocodes the place and fetches weather and marine forecasts from Open-Meteo. It converts those measurements into explainable scores exposed through GraphQL. The React interface lets a user search for a place, compare daily scores, and see why an activity received its result.

## Stack

- NestJS, TypeScript, GraphQL and Apollo Server
- React, TypeScript, Vite and Apollo Client
- Open-Meteo Geocoding, Weather Forecast and Marine APIs
- Vitest, Supertest, Oxlint, ESLint and Prettier

## Running locally

Requirements: a recent Node.js LTS release and npm. Open-Meteo does not require an API key.

Start the backend:

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Fill every variable in `backend/.env` with the corresponding Open-Meteo base URL and desired result/day counts before starting the server.

The GraphQL endpoint is available at `http://localhost:3000/graphql`.

In another terminal, start the frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Set `VITE_GRAPHQL_URL` in `frontend/.env` to the backend GraphQL endpoint before starting Vite.

Open the URL printed by Vite, normally `http://localhost:5173`.

## GraphQL example

```graphql
query ActivityForecast($input: ActivityForecastInput!) {
  activityForecast(input: $input) {
    location {
      name
      country
    }
    days {
      date
      skiing {
        score
        reasons
      }
      surfing {
        available
        score
        reasons
        bestHour
        unavailableReason
      }
      outdoorSightseeing {
        score
        reasons
      }
      indoorSightseeing {
        score
        reasons
      }
    }
  }
}
```

Variables:

```json
{
  "input": {
    "place": "London"
  }
}
```

## Scoring decisions

Scores are absolute values from 0 to 100 rather than rankings relative to the other six days. This makes the same score carry roughly the same meaning across searches.

- Skiing combines snow depth, fresh snowfall, apparent temperature, wind and weather conditions. Insufficient snow caps the score.
- Surfing scores each daylight hour using wave height, wave period, wind and severe-weather guards, then returns the best valid hour for the day.
- Outdoor sightseeing combines precipitation, apparent temperature, sunshine and wind, with caps for severe weather and fog.
- Indoor sightseeing starts from a neutral baseline and receives bonuses when weather makes outdoor plans less attractive. Severe weather caps the result because travelling to an attraction may still be unsafe.

The thresholds, weights, research and synthetic sanity checks are documented in [the scoring notes](./docs/scoring/README.md).

## Product assumptions

- The first Open-Meteo geocoding match is used and the resolved name and country are shown to make that decision visible.
- Input must contain at least one letter so postal-code fragments such as `123` are not treated as city names.
- Skiing represents weather suitability at the geocoded location, not conditions at a specific resort or slope.
- Surfing targets a recreational intermediate surfer and represents general nearby marine conditions, not a specific surf break.
- Surfing is unavailable when Open-Meteo has no usable marine data or the selected sea grid cell is more than 25 km from the searched place.
- No forecasts are persisted; Open-Meteo is called for each search.

## Known limitations

- Ambiguous place names are not presented as a list of choices.
- Resort altitude, lift operations and avalanche conditions are outside the skiing model.
- Surf-break orientation, swell direction, tides, currents and local safety warnings are outside the surfing model.
- Attraction availability, opening hours and transport disruption are not considered.
- The result is a weather-suitability aid, not professional safety advice.

## Verification

Run backend checks:

```bash
cd backend
npm run check
npm run test:e2e
```

Run frontend checks:

```bash
cd frontend
npm run check
```

Regenerate frontend GraphQL types while the backend is running:

```bash
cd frontend
npm run codegen
```

## Working trail

The repository intentionally keeps the reasoning behind the implementation visible:

- [Working notes and product assumptions](./docs/NOTES.md)
- [Open-Meteo research](./docs/open-meteo.md)
- [Scoring research and decisions](./docs/scoring/README.md)
- Git history showing the progression from research to scoring, API integration and interface work

The notes include questions that would normally be raised with a product manager, the assumptions used to keep moving, and limitations deliberately left outside the half-day scope.
