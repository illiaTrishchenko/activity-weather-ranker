import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('GraphQL endpoint (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('serves a health query at /graphql', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ health }' })
      .expect(200);

    expect(response.body).toEqual({ data: { health: 'ok' } });
  });
});
