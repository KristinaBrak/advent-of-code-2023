// (function () {
//     console.log('im here 2');
// })();

import { getInput } from "../common";


// red: 12,
// green: 13,
// blue: 14,

const extractNumber = (countAndColor: string, color: string): number => {
    const indexOfColor = countAndColor.indexOf(color);
    if (indexOfColor === -1) {
        return 0;
    }
    const blueCountString = countAndColor.substring(0, indexOfColor).trim();
    const blueCount = Number(blueCountString);
    return blueCount;
};

const getTurnValues = (turn: string): Record<'red' | 'green' | 'blue', number> => {
    //3 blue, 4 red
    const cubes = turn.split(',');

    let defaultValues = { red: 0, green: 0, blue: 0 };

    return cubes.reduce((acc, cubeCountAndColor) => {
        if (cubeCountAndColor.includes('red')) {
            const red = extractNumber(cubeCountAndColor, 'red');
            return { ...acc, red };
        }
        if (cubeCountAndColor.includes('green')) {
            const green = extractNumber(cubeCountAndColor, 'green');
            return { ...acc, green };

        }
        if (cubeCountAndColor.includes('blue')) {
            const blue = extractNumber(cubeCountAndColor, 'blue');
            return { ...acc, blue };

        }
        return acc;
    }, defaultValues);
};

const getCubeInput = (input: string[]) => {
    // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    return input.reduce<Record<number, ReturnType<typeof getTurnValues>[]>>((acc, line, idx) => {
        const gameIndex = idx + 1;
        const game = line.split(`Game ${gameIndex}:`)[1];

        const turns = game.split(';').map(getTurnValues);

        return { ...acc, [gameIndex]: turns };
    }, {});
};

const getPartOne = (games: Record<number, Record<"red" | "green" | "blue", number>[]>): number => {

    const validValues = {
        red: 12,
        green: 13,
        blue: 14
    };

    const possibleGameIndexes = Object.entries(games).reduce<number[]>((acc, curr) => {
        const [idx, game] = curr;
        const impossibleGames = game.filter(({ red, green, blue }) =>
            red > validValues.red || green > validValues.green || blue > validValues.blue
        );

        return !impossibleGames.length ? [...acc, Number(idx)] : acc;
    }, []);

    return possibleGameIndexes.reduce((acc, curr) => {
        return acc + curr;
    }, 0);
};



const getPartTwo = (games: Record<number, Record<"red" | "green" | "blue", number>[]>): number => {
    const power = Object.entries(games).map(([_idx, game]) => {
        const maxCubeValues = Object.entries(game).reduce((acc, [_idx, turn]) => {
            const { red, blue, green } = turn;
            if (acc[0] <= red) {
                acc[0] = red;
            }
            if (acc[1] <= blue) {
                acc[1] = blue;
            }
            if (acc[2] <= green) {
                acc[2] = green;
            }
            return acc;
        }, [0, 0, 0]);

        console.log(maxCubeValues);

        const powerOfSet = maxCubeValues[0] * maxCubeValues[1] * maxCubeValues[2];
        //red, blue, green
        return powerOfSet;
    });

    const sumOfPowers = power.reduce((acc, curr) => {
        return acc + curr;
    }, 0);

    return sumOfPowers;
};


export default () => {
    console.log('Day 2',);
    const input = getInput();
    const games = getCubeInput(input);

    const partOneResult = getPartOne(games);
    const partTwoResult = getPartTwo(games);


    console.log('result: ', partTwoResult);
};