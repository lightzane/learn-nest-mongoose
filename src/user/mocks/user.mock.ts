import { User } from '../schemas/user.schema';

export const mockUser = (): User => ({
  name: 'Lightzane',
  email: 'lightzane@email.com',
  tags: ['lightning', 'speed', 'force'],
});
