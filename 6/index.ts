import * as fs from 'fs';

const getInput = (path: string): number[][] => {
    const file = fs.readFileSync(path, { encoding: 'utf-8' });
    const lines = file.split('\n');

    const timeLine = lines[0].trim();
    const timeInputs = timeLine.split(':')[1].trim();
    const times = timeInputs.split(/\s+/).map(Number);

    const distanceLine = lines[1].trim();
    const distanceInputs = distanceLine.split(':')[1].trim();
    const distances = distanceInputs.split(/\s+/).map(Number);
    return [times, distances];
};

const getTotalWaysToBeat = (time: number, distance: number): number => {
    let waysToBeat: number = 0;
    for (let hold = 0; hold <= time; hold++) {
        const timeLeftToMove = time - hold;
        // speed is equal to hold => 1ms -> 1mm
        const possibleDistance = timeLeftToMove * hold;
        if (possibleDistance > distance) {
            waysToBeat = waysToBeat + 1;
        }
    }
    return waysToBeat;
};

const multiply = (totalWaysToBeatList: number[]): number => {
    return totalWaysToBeatList.reduce((acc, curr) => {
        return acc * curr;
    }, 1);
};

const getPartOne = (path: string): number => {
    const [times, distances] = getInput(path);
    console.log(times, distances);

    let totalWaysToBeatList: number[] = [];
    for (let i = 0; i < times.length; i++) {
        const total = getTotalWaysToBeat(times[i], distances[i]);
        console.log(total);
        totalWaysToBeatList = [...totalWaysToBeatList, total];
    }

    return multiply(totalWaysToBeatList);
};

const getInputPartTwo = (path: string) => {
    const file = fs.readFileSync(path, { encoding: 'utf-8' });
    const lines = file.split('\n');

    const timeLine = lines[0].trim();
    const timeInputs = timeLine.split(':')[1].trim();
    const time = timeInputs.split(/\s+/).reduce<string>((acc, curr) => {
        return acc + curr;
    }, '');

    const distanceLine = lines[1].trim();
    const distanceInputs = distanceLine.split(':')[1].trim();
    const distance = distanceInputs.split(/\s+/).reduce<string>((acc, curr) => {
        return acc + curr;
    }, '');
    return [Number(time), Number(distance)];
};

const getPartTwo = (path: string) => {
    //how many ways
    const [time, distance] = getInputPartTwo(path);

    const result = getTotalWaysToBeat(time, distance);
    return result;
};
export default () => {
    console.log('Day 6',);

    const result = getPartTwo('./6/input.txt');

    console.log('result: ', result);
};