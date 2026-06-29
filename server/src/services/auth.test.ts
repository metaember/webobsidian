import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mutable doubles so each test can toggle whether an override / user password exists.
const { cfg, settings } = vi.hoisted(() => ({
  cfg: { initialPassword: undefined as string | undefined },
  settings: { auth: { jwtSecret: 'x'.repeat(64), userPasswordHash: '', passwordHash: '' } },
}));

vi.mock('../config.js', () => ({ config: cfg }));
vi.mock('./settings.js', () => ({
  getSettings: vi.fn(async () => settings),
  updateSettings: vi.fn(),
}));

const { checkPassword } = await import('./auth.js');

beforeEach(() => {
  cfg.initialPassword = undefined;
  settings.auth.userPasswordHash = '';
  settings.auth.passwordHash = '';
});

describe('checkPassword — default (123456) is disabled once an override password exists', () => {
  it('accepts the default with zero config (no override, no user password)', async () => {
    expect(await checkPassword('123456')).toBe(true);
  });

  it('REJECTS the default once the WEBOBSIDIAN_PASSWORD override is set', async () => {
    cfg.initialPassword = 'super-secret';
    expect(await checkPassword('123456')).toBe(false);
  });

  it('still accepts the override password itself', async () => {
    cfg.initialPassword = 'super-secret';
    expect(await checkPassword('super-secret')).toBe(true);
  });

  it('REJECTS the default when a manual override hash (auth.passwordHash) exists', async () => {
    settings.auth.passwordHash = 'scrypt$00$00'; // truthy override; won't match 123456
    expect(await checkPassword('123456')).toBe(false);
  });

  it('rejects an unrelated wrong password regardless', async () => {
    expect(await checkPassword('hunter2')).toBe(false);
  });
});
