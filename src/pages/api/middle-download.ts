import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Fetch from the download API
    const response = await fetch(`${BASE_URL}/api/download`);
    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('Failed to get reader from download API');
    }

    // Stream the response
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        res.end();
        break;
      }

      // Forward the chunks to the client
      res.write(value);
      
      // Add a small delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  } catch (error) {
    console.error('Error in middle-download:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}