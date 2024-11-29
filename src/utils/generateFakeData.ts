import { User } from '../types/user';

export function generateFakeData(count: number): User[] {
  const data: User[] = [];
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook'];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+1-555-${String(Math.floor(1000 + Math.random() * 9000))}`,
      company: companies[Math.floor(Math.random() * companies.length)]
    });
  }

  return data;
}