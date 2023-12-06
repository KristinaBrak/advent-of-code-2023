import { getInput } from "../common";

const getNumbers = (numberList: string): number[] => {
    return numberList.split(' ').map((val) => {
        return val === '' ? null : Number(val);
    }).filter((num) => num !== null) as number[];
};

const parse = (input: string[]): Record<number, [number[], number[]]> => {
    return input.reduce((acc, line) => {
        const gameTitleAndCards = line.split(':');
        const gameIdx = gameTitleAndCards[0].match(/\d+/g)?.[0];
        // console.log(gameIdx);
        if (!gameIdx) {
            return acc;
        }

        const winningNumbers = getNumbers(gameTitleAndCards[1].split('|')[0].trim());
        const cardNumbers = getNumbers(gameTitleAndCards[1].split('|')[1].trim());
        return { ...acc, [gameIdx]: [winningNumbers, cardNumbers] };
    }, {});
};

const getCardTotal = (winningNumbers: number[], cardNumbers: number[]): number => {
    const power = winningNumbers.reduce((acc, curr) => {
        const found = cardNumbers.findIndex((num) => num === curr);
        if (found === -1) {
            return acc;
        }
        return acc + 1;
    }, -1);
    return power === -1 ? 0 : 2 ** power;
};

const getPartOne = (cards: ReturnType<typeof parse>): number => {
    return Object.entries(cards).reduce((acc, [cardIdx, [winningNumbers, cardNumbers]]) => {
        const cardTotal = getCardTotal(winningNumbers, cardNumbers);
        // console.log(cardIdx, '->', cardTotal);
        return acc + cardTotal;
    }, 0);
};


const matching = (winningNumbers: number[], cardNumbers: number[]): number => {
    return winningNumbers.reduce((acc, curr) => {
        const found = cardNumbers.findIndex((num) => num === curr);
        if (found === -1) {
            return acc;
        }
        return acc + 1;
    }, 0);
};

const getPartTwo = (cards: ReturnType<typeof parse>): number => {
    const allCards = Object.entries(cards).reduce<Record<number, number>>((acc, [cardIdx, [winningNumbers, cardNumbers]]) => {
        const currIdx = Number(cardIdx);
        const updatedValue = acc[currIdx] ? acc[currIdx] + 1 : 1;

        //1
        // currValue: acc[1] : 0
        // add original: acc[1] + 1 = 0 + 1  = 1
        //totalMatching: 4
        //2, 3, 4, 5
        // currValue(2,3,4,5): undefined
        //acc[2/3/4/5] = 0 + acc[1] = 0 + 1;

        //2
        //currValue: acc[2]:  1
        //add original: acc[2] + 1 = 1 + 1
        //totalMatching: 2
        //3,4
        //currValue(3,4): 1
        //acc[3,4]: acc[3,4] + acc[2]: 1 + 2 = 3

        //3
        //currValue: acc[3] : 3
        //add original: acc[3] + 1 = 3+1 = 4 //add original
        //totalMatching: 2
        //4,5
        //currValue(4,5): 3 , 1
        //acc[4]: acc[4] + acc[3]: 3 + 4 = 7
        //acc[5]: acc[5] + acc[3]: 1 + 4 = 5

        //4
        //currValue: acc[4]: 7
        //add original: acc[4] + 1 = 7 + 1 = 8
        // totalMatching: 1
        // 5
        //currValue(5): 5
        //acc[5]: acc[5] + acc[4] = 5 + 8 = 13

        //5
        //currValue: acc[5]: 13
        //totalMatching: 0
        //add original: acc[5] + 1 = 13 + 1 = 14

        //6
        //currValue: acc[6]: 0
        // add original: acc[6] + 1 = 1

        const totalMatching = matching(winningNumbers, cardNumbers);
        console.log('currIdx', currIdx);
        console.log('totalMatching', totalMatching);
        if (!totalMatching) {
            return { ...acc, [currIdx]: updatedValue, };
        }

        const update: Record<number, number> = { ...acc, [currIdx]: updatedValue, };
        for (let i = currIdx + 1; i <= currIdx + totalMatching; i++) {
            const copyValue = acc[i];
            // console.log(currValue);
            if (!copyValue) {
                update[i] = updatedValue;
            } else {
                update[i] = copyValue + updatedValue;
            }
            console.log('updated:', i, update[i]);
        }


        console.log(update);
        return update;
    }, {});

    const sum = Object.values(allCards).reduce<number>((acc, curr) => {
        return acc + curr;
    }, 0);
    console.log('sum :', sum);
    return sum;
};


export default () => {
    console.log('Day 4',);
    const input = getInput();
    const cards = parse(input);
    // const result = getPartOne(cards);
    const result = getPartTwo(cards);
    console.log('result: ', result);
};