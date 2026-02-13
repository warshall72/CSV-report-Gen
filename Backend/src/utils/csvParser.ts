import fs from 'fs';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

export const parseCsv = (input: string | Buffer): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        let stream;

        if (Buffer.isBuffer(input)) {
            stream = Readable.from(input);
        } else {
            stream = fs.createReadStream(input);
        }

        stream
            .pipe(parse({ columns: true, trim: true, skip_empty_lines: true }))
            .on('data', (data) => results.push(data))
            .on('error', (err) => reject(err))
            .on('end', () => resolve(results));
    });
};
