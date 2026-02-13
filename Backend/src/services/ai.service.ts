import { analyzeSmallData } from './ai/small.service';
import { analyzeLargeData } from './ai/large.service';

const LARGE_DATA_THRESHOLD = 500;

export const analyzeData = async (data: any[]): Promise<any> => {
    if (data.length > LARGE_DATA_THRESHOLD) {
        return analyzeLargeData(data);
    }
    return analyzeSmallData(data);
};
