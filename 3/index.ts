import { getInput } from "../common";

const getInputTable = (input: string[]) => {
    return input.reduce<string[][]>((acc, line) => {
        acc.push(line.split(''));
        return acc;
    }, []);
};

const isNumber = (ch: string) => {
    if (ch === '0') {
        return true;
    }
    return !!Number(ch);
};

const getNumbers = (line: string): { start: number, end: number, value: number; }[] => {
    const result: { start: number, end: number, value: number; }[] = [];
    let currNum = '';
    for (let i = 0; i < line.length; i++) {
        const ch = line.charAt(i);
        if (isNumber(ch)) {
            currNum = currNum + ch;
        } else if (!isNumber(ch) && currNum !== '') {
            const num = Number(currNum);
            result.push({ value: num, start: i - currNum.length, end: i - 1 });
            currNum = '';
        }
    }
    return result;
};

const getNumberWithIndexes = (input: string[]) => {
    //lineIdx: { startIdx: number; endIdx: number; value: number; } ;
    const foundNumberIndexesByLine = input.reduce<Record<string, { startIdx: number; endIdx: number; value: number; }[]>>((acc, line, lineIdx) => {
        // const found = line.match(/\d+/g);

        // if (!found) {
        //     return { ...acc, [lineIdx]: [] };
        // }

        //     const numbers: {
        //         startIdx: number; endIdx: number; value: number;
        //     }[] = found.map((num) => {
        //         const firstDigitIndex = line.indexOf(num);
        //         const lastDigitIndex = firstDigitIndex + num.length - 1;

        //         if (lineIdx === 0) {
        //             console.log(firstDigitIndex);
        //         }
        //         return { startIdx: firstDigitIndex, endIdx: lastDigitIndex, value: Number(num) };
        //     });
        //     return { ...acc, [lineIdx]: numbers };
        const numbers = getNumbers(line);

        return { ...acc, [lineIdx]: numbers };
    }, {});

    // console.log(foundNumberIndexesByLine);
    return foundNumberIndexesByLine;
};

const isNumberAdjacentToSymbol = (table: ReturnType<typeof getInputTable>, lineIdxAndNumberIndexes: [number, { startIdx: number, endIdx: number, value: number; }]): boolean => {
    const [lineIdx, number] = lineIdxAndNumberIndexes;
    const { startIdx, endIdx } = number;
    console.log(lineIdxAndNumberIndexes);
    const currLine = table[lineIdx];

    if (startIdx !== 0) {
        const isLeftASymbol = currLine[startIdx - 1] !== '.' && !isNumber(currLine[startIdx - 1]);
        if (isLeftASymbol) {
            console.log('left', currLine);
            return true;
        }
    }

    if (endIdx !== currLine.length - 1) {
        const isRightASymbol = currLine[endIdx + 1] !== '.' && !isNumber(currLine[endIdx + 1]);
        if (isRightASymbol) {
            console.log('right');
            return true;
        }
    }

    if (lineIdx !== 0) {
        const topLine = table[lineIdx - 1];

        const topLineStartIdx = startIdx === 0 ? startIdx : startIdx - 1;
        const topLineEndIdx = endIdx === table.length - 1 ? endIdx : endIdx + 1;

        const foundTopSymbol = topLine.filter((ch, idx) => ch !== '.' && !isNumber(ch) && topLineStartIdx <= idx && idx <= topLineEndIdx);
        if (foundTopSymbol.length) {
            console.log('top');
            return true;
        }
    }

    if (lineIdx !== table.length - 1) {
        const bottomLine = table[lineIdx + 1];

        const bottomLineStartIdx = startIdx === 0 ? startIdx : startIdx - 1;
        const bottomLineEndIdx = endIdx === table.length - 1 ? endIdx : endIdx + 1;

        const foundBottomSymbol = bottomLine.filter((ch, idx) => ch !== '.' && !isNumber(ch) && bottomLineStartIdx <= idx && idx <= bottomLineEndIdx);
        if (foundBottomSymbol.length) {
            console.log('bottom');
            return true;
        }

    }


    return false;
};

export default () => {
    console.log('Day 3',);
    const input = getInput();
    const inputTable = getInputTable(input);
    // console.log(inputTable);
    const numbersByLine = getNumberWithIndexes(input);

    // console.log(getNumbers(input[0]));
    // console.log(numbersByLine);
    const result = Object.entries(numbersByLine).reduce((acc, [lineIdx, numbers]) => {
        // console.log('here', lineIdx, numbers);
        const sumOfLine = numbers.reduce((sum, num) => {
            // console.log('no here', sum, num);
            const isAdjacent = isNumberAdjacentToSymbol(inputTable, [Number(lineIdx), { ...num }]);
            // console.log(num.value, isAdjacent);
            return isAdjacent ? sum + num.value : sum;
        }, 0);

        // console.log(acc, sumOfLine);
        return acc + sumOfLine;
    }, 0);

    console.log('result: ', result);
};