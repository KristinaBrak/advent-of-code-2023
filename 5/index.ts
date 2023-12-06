
import * as fs from 'fs';

const getSeeds = (path: string): number[] => {
    const file = fs.readFileSync(path, { encoding: 'utf-8' });
    const firstLine = file.split('\n')[0];
    const seedNumbers = firstLine.split(':')[1].trim();
    return seedNumbers.split(' ').map(Number);
};


// const maps: {
//     ['seed-to-soil']: {
//         seed: 98,
//         soil: 50,
//         range: 2;
//     };
// };
const getMaps = (path: string): Record<string, {
    from: number;
    to: number;
    range: number;
}[]> => {
    const file = fs.readFileSync(path, { encoding: 'utf-8' });
    const lines = file.split('\n\n');
    const [_seeds, ...maps] = lines;
    // console.log(maps);
    return maps.reduce((acc, line) => {
        const [mapTitle, ...config] = line.split('\n');
        const title = mapTitle.split(' ')[0];
        const mapping = config.map((conf) => {
            const [to, from, range] = conf.split(' ').map(Number);
            return { 'from': from, 'to': to, 'range': range };
        });
        // console.log(curr);
        return {
            ...acc, [title]: mapping
        };
    }, {});

};

//maps: {['seed-to-soil']: [
//          { to: 50, from: 98, range: 2},
//          { to: 52, from: 50, range: 48},
//      ],
//      ['seed-to-soil']: [
//          { to: 0, from: 15, range: 37},
//          { to: 37, from: 52, range: 2},
//          { to: 39, from: 0, range: 15},
//      ]}

// seed: 79
// find map where title starts with 'seed' 
// seed-to-soil
// is 79 in sts[0]: from <= 79 <= from + range: 98 <= 79 <= 98 + 2: false
// is 79 in sts[1]: from <= 79 <= from + range: 50 <= 79 <= 50 + 48: true
// found in sts[1]
// soil mappedValue: 79 - 50 = 29 -> 52 + 29 = 81

// soil: 81
// find map where title starts with 'soil' 
// soil-to-fertilizer
// is 81 in stf[0]: from <= 81 <= from + range: 15 <= 81 <= 52: false
// is 81 in stf[1]: ... : 52 <= 81 <= 54: false
// is 81 in stf[2]: ... : 0 <= 81 <= 15: false
// not found in map
// fertilizer mappedValue: 81

//...

// location: 82
// find map where title starts with 'location'
const findLast = (maps: ReturnType<typeof getMaps>, num: number, subTitle: string): number => {
    const title = Object.keys(maps).find((mapTitle) => { return mapTitle.includes(`${subTitle}-to`, 0); });
    // console.log(num, subTitle, title);
    if (!title) {
        return num;
    }

    const mapping = maps[title];
    const foundNum = mapping.reduce<null | number>((foundNumber, { from, to, range }) => {
        if (foundNumber !== null) {
            return foundNumber;
        }

        if (from <= num && num <= from + range) {
            return (to + num - from);
        }

        return null;
    }, null);

    const newSubTitle = title.split('-to-')[1];
    return findLast(maps, foundNum === null ? num : foundNum, newSubTitle);
};

const findSmallestLocation = (seeds: number[], maps: ReturnType<typeof getMaps>) => {
    const allLocations = seeds.map((seed) => findLast(maps, seed, 'seed'));
    console.log(allLocations.sort((a, b) => a - b));
    return allLocations.sort((a, b) => a - b)[0];
};

const getPartOne = () => {
    const seeds = getSeeds('./5/input.txt');
    const maps = getMaps('./5/input.txt');
    return findSmallestLocation(seeds, maps);
};

const getSeedRanges = (path: string): number[][] => {
    const seeds = getSeeds('./5/input.txt');
    // console.log('seeds', seeds);
    const result: number[][] = [];
    for (let i = 0; i < seeds.length - 1; i = i + 2) {
        // console.log(i, [seeds[i], seeds[i + 1]]);
        result.push([seeds[i], seeds[i + 1]]);
    }
    return result;
};

const getPartTwo = () => {
    const seedRanges = getSeedRanges('./5/input.txt');
    const maps = getMaps('./5/input.txt');
    // console.log('seedRanges', seedRanges);


    const seedNumbers = seedRanges.map((ranges) => {
        const [num, length] = ranges;
        let result: number[] = [];
        for (let i = num; i < num + length; i++) {
            console.log(i);
            result.push(i);
        }
        return result;
    });
    // console.log(seedNumbers);
    const seeds = seedNumbers.flat();
    // console.log(seeds.length);
    const allLocations = seeds.map((seed) => findLast(maps, seed, 'seed'));
    // console.log(allLocations.sort((a, b) => a - b));
    return allLocations.sort((a, b) => a - b)[0];
};

export default () => {
    console.log('Day 5',);

    // const result = getPartOne();
    const result = getPartTwo();



    // const result = findLast(maps, seeds[1], 'seed');
    // const result = maps;
    console.log('result: ', result);
};