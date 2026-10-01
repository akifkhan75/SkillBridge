import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/api/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.service).toBe('skillbridge-api');
        });
    });
  });

  describe('Auth Flow', () => {
    const testUser = {
      name: 'E2E Test User',
      email: `e2e-${Date.now()}@test.com`,
      password: 'password123',
      type: 'customer' as const,
    };
    let authToken: string;

    it('/api/auth/signup (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.token).toBeDefined();
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.type).toBe('customer');
          authToken = res.body.token;
        });
    });

    it('/api/auth/signup (POST) - duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send(testUser)
        .expect(409);
    });

    it('/api/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.token).toBeDefined();
          authToken = res.body.token;
        });
    });

    it('/api/auth/login (POST) - wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('/api/job-requests (GET) - requires auth', () => {
      return request(app.getHttpServer())
        .get('/api/job-requests')
        .expect(401);
    });

    it('/api/job-requests (GET) - with auth', () => {
      return request(app.getHttpServer())
        .get('/api/job-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Workers', () => {
    it('/api/workers (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/workers')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Services', () => {
    it('/api/service-packages (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/service-packages')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/api/subscription-plans (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/subscription-plans')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
