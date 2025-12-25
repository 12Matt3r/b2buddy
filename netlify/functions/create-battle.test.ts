import { describe, it, expect } from 'vitest';
import { handler } from './create-battle';

describe('create-battle handler', () => {
    it('should return 405 for non-POST requests', async () => {
        const result = await handler({ httpMethod: 'GET' } as any, {} as any);
        expect(result?.statusCode).toBe(405);
    });

    it('should reject invalid rounds (negative)', async () => {
        const body = JSON.stringify({ rounds: -5, difficulty: 'normal' });
        const result = await handler({ httpMethod: 'POST', body } as any, {} as any);

        expect(result?.statusCode).toBe(400);
        const parsed = JSON.parse(result?.body || '{}');
        expect(parsed.error).toBe('Validation failed');
        expect(parsed.details).toContain('Rounds must be between 1 and 10');
    });

    it('should reject invalid difficulty', async () => {
        const body = JSON.stringify({ rounds: 3, difficulty: 'impossible' });
        const result = await handler({ httpMethod: 'POST', body } as any, {} as any);

        expect(result?.statusCode).toBe(400);
        const parsed = JSON.parse(result?.body || '{}');
        expect(parsed.details[0]).toContain('Difficulty must be one of');
    });

    it('should reject massive number of rounds', async () => {
        const body = JSON.stringify({ rounds: 999999, difficulty: 'normal' });
        const result = await handler({ httpMethod: 'POST', body } as any, {} as any);
        expect(result?.statusCode).toBe(400);
    });

    it('should accept valid inputs', async () => {
        const body = JSON.stringify({ rounds: 5, difficulty: 'hard' });
        const result = await handler({ httpMethod: 'POST', body } as any, {} as any);

        expect(result?.statusCode).toBe(200);
        const parsed = JSON.parse(result?.body || '{}');
        expect(parsed.rounds).toBe(5);
        expect(parsed.difficulty).toBe('hard');
        expect(parsed.id).toBeDefined();
    });

    it('should use defaults for missing values if valid (assuming partial JSON or relying on fallback logic, though strict validation might require them)', async () => {
        // Our logic does: let { rounds = 3, difficulty = 'normal' } = body;
        // So sending empty object should work and result in defaults
        const body = JSON.stringify({});
        const result = await handler({ httpMethod: 'POST', body } as any, {} as any);

        expect(result?.statusCode).toBe(200);
        const parsed = JSON.parse(result?.body || '{}');
        expect(parsed.rounds).toBe(3);
        expect(parsed.difficulty).toBe('normal');
    });
});
