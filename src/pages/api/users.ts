import { NextApiRequest, NextApiResponse } from 'next';
import { generateFakeData } from '../../utils/generateFakeData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const data = generateFakeData(1000);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / limit);

  res.status(200).json({
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: data.length,
      itemsPerPage: limit
    }
  });
}