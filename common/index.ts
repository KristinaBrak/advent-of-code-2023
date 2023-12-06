import * as fs from 'fs';

export const getInput = (): string[] => {
    try {
        const file = fs.readFileSync(`./${process.env.TASK}/input.txt`, { encoding: 'utf-8' });
        return file.split('\n').filter(Boolean);
    } catch (e) {
        throw new Error('No file found');
    }
};
