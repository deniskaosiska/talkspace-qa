import { buildTestUser } from '../utils/faker';
import { TestUser } from '../types/user.types';

export function createFreshUser(overrides: Partial<TestUser> = {}): TestUser {
  return buildTestUser(overrides);
}
