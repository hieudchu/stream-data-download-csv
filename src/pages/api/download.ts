import { NextApiRequest, NextApiResponse } from 'next';
import { generateFakeData } from '../../utils/generateFakeData';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper function to convert JSON data to CSV format
const convertToCSV = (jsonData: any[]) => {
  return jsonData
    .map(({ id, name, email, phone, company }) =>
      [id, name, email, `"${phone}"`, company].join(',')
    )
    .join('\n');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Write CSV header
  res.write('ID,Name,Email,Phone,Company\n');

  const response = await fetch(`${BASE_URL}/api/apiDownload`);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let a = 0; // Counter to track the first chunk

  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      // Decode the chunk and append it to the buffer
      buffer += decoder.decode(value, { stream: true });

      try {
        // Check if the buffer contains a complete JSON array or object
        const boundary = buffer.lastIndexOf(']');
        if (boundary !== -1) {
          // Split the buffer into complete and partial data
          const completeJSON = buffer.slice(0, boundary + 1);
          const remaining = buffer.slice(boundary + 1);
          const jsonData = a === 0 
            ? JSON.parse(`${completeJSON}]`)  // First chunk
            : JSON.parse(`[${completeJSON.slice(1)}]`);  // Subsequent chunks

          // Process the chunk and write to the response
          for (const chunk of jsonData){
            const csvContent = convertToCSV(chunk);
            res.write(csvContent + '\n');
          }
          // Set the buffer to the remaining incomplete data
          buffer = remaining;
          a++;
        }
      } catch (error) {
        res.status(500);
        res.end();
      }
    }

    if (done) {
      res.end();
      break;
    }
  }
}