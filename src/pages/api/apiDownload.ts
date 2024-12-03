import { NextApiRequest, NextApiResponse } from 'next';
import { generateFakeData } from '../../utils/generateFakeData';
import _ from 'lodash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set headers for streaming response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    const generateFakeDatas = generateFakeData(1000);
    const datas = _.chunk(generateFakeDatas, 10);
    
    // Stream data in batches
    res.write('[')
    for (let i = 0; i < datas.length; i++) {
      res.write(JSON.stringify(datas[i]));
      
      // Avoid adding a comma after the last chunk
      if (i < datas.length - 1) {
        res.write(',');
      }
    }
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while streaming data' });
  }
}
