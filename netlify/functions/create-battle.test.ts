
import { describe, it, expect } from 'vitest';
import { handler } from './create-battle';

describe('create-battle function', () => {
    it('should create a battle with valid inputs', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ rounds: 5, difficulty: 'hard' }),
        } as any;

        const response = await handler(event, {} as any, () => {});
        expect(response?.statusCode).toBe(200);
        const body = JSON.parse(response?.body || '{}');
        expect(body.rounds).toBe(5);
        expect(body.difficulty).toBe('hard');
    });

    it('should reject rounds less than 1', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ rounds: 0, difficulty: 'normal' }),
        } as any;

        const response = await handler(event, {} as any, () => {});
        expect(response?.statusCode).toBe(400);
        const body = JSON.parse(response?.body || '{}');
        expect(body.error).toContain('rounds must be an integer');
    });

    it('should reject rounds greater than 10', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ rounds: 11, difficulty: 'normal' }),
        } as any;

        const response = await handler(event, {} as any, () => {});
        expect(response?.statusCode).toBe(400);
        const body = JSON.parse(response?.body || '{}');
        expect(body.error).toContain('rounds must be an integer');
    });

    it('should reject invalid difficulty', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ rounds: 3, difficulty: 'extreme' }),
        } as any;

        const response = await handler(event, {} as any, () => {});
        expect(response?.statusCode).toBe(400);
        const body = JSON.parse(response?.body || '{}');
        expect(body.error).toContain('difficulty must be one of');
    });

     it('should reject non-integer rounds', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ rounds: 3.5, difficulty: 'normal' }),
        } as any;

        const response = await handler(event, {} as any, () => {});
        expect(response?.statusCode).toBe(400);
    });
});
