import { ReadableStream } from 'stream/web';

export async function streamToResponse(stream: ReadableStream, res: any) {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        res.end();
        break;
      }

      res.write(value);
    }
  } finally {
    reader.releaseLock();
  }
}