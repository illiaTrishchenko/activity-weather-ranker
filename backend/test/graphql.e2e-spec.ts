import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';
import { ForecastService } from '../src/forecast/forecast.service.js';
import { vi } from 'vitest';

describe('GraphQL endpoint (e2e)', () => {
  let app: INestApplication<App>;
  const getActivityForecast = vi.fn().mockResolvedValue({
    location: {
      id: 2643743,
      name: 'London',
      latitude: 51.50853,
      longitude: -0.12574,
      country: 'United Kingdom',
    },
    days: [
      {
        date: '2026-09-14',
        skiing: { score: 20, reasons: ['No usable snow is forecast'] },
        outdoorSightseeing: {
          score: 83,
          reasons: ['Comfortable conditions for sightseeing'],
        },
        indoorSightseeing: {
          score: 50,
          reasons: ['Indoor attractions remain a viable option'],
        },
        surfing: {
          available: false,
          unavailableReason: 'No nearby marine forecast data is available',
        },
      },
    ],
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ForecastService)
      .useValue({ getActivityForecast })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  it('serves a health query at /graphql', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ health }' })
      .expect(200);

    expect(response.body).toEqual({ data: { health: 'ok' } });
  });

  it('serves an activity forecast query at /graphql', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query ActivityForecast($input: ActivityForecastInput!) {
            activityForecast(input: $input) {
              location { name country }
              days {
                date
                skiing { score reasons }
                surfing { available unavailableReason }
              }
            }
          }
        `,
        variables: { input: { place: 'London' } },
      })
      .expect(200);

    expect(response.body).toEqual({
      data: {
        activityForecast: {
          location: { name: 'London', country: 'United Kingdom' },
          days: [
            {
              date: '2026-09-14',
              skiing: {
                score: 20,
                reasons: ['No usable snow is forecast'],
              },
              surfing: {
                available: false,
                unavailableReason:
                  'No nearby marine forecast data is available',
              },
            },
          ],
        },
      },
    });
  });

  it('rejects a place without letters', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query ActivityForecast($input: ActivityForecastInput!) {
            activityForecast(input: $input) { location { name } }
          }
        `,
        variables: { input: { place: '123' } },
      })
      .expect(200);

    expect(response.body).toMatchObject({
      data: null,
      errors: [
        {
          extensions: {
            code: 'BAD_REQUEST',
            originalError: {
              message: ['Place must contain at least one letter'],
            },
          },
        },
      ],
    });
  });
});
