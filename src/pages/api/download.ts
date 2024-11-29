import { NextApiRequest, NextApiResponse } from 'next';
import { generateFakeData } from '../../utils/generateFakeData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Write CSV header
  res.write('ID,Name,Email,Phone,Company\n');

  const data = generateFakeData(1000);
  const batchSize = 10;

  // Stream data in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const csvContent = batch
      .map(user => `${user.id},${user.name},${user.email},${user.phone},${user.company}`)
      .join('\n');

    res.write(csvContent + '\n');
    
    // Simulate network delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  res.end();
}