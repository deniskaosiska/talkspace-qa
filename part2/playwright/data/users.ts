import { TestUser } from '../types/user.types';

export const defaultTestUser: Pick<TestUser, 'state' | 'country'> = {
  state: 'California',
  country: 'United States',
};

export const weakPassword = '123';
