import { faker } from '@faker-js/faker';
import { defaultTestUser } from '../data/users';
import { TestUser } from '../types/user.types';

const MAIL_DOMAIN = process.env.MAILINATOR_DOMAIN ?? 'mailinator.com';

export function buildTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const unique = Date.now().toString(36);
  const nicknameBase = faker.person.firstName().replace(/[^a-zA-Z0-9]/g, '');
  const nickname = (nicknameBase.slice(0, 6) + unique.slice(-2)).slice(0, 10);

  return {
    email: `qa.auto.${unique}@${MAIL_DOMAIN}`,
    password: `Ts!${faker.string.alphanumeric(10)}1`,
    nickname,
    state: defaultTestUser.state,
    country: defaultTestUser.country,
    ...overrides,
  };
}
