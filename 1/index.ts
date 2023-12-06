import { getInput } from "../common";

const spelledToNumber: Record<string, number> = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'oneight': 18,
    'twone': 21,
    'threeight': 38,
    'fiveight': 58,
    'sevenine': 79,
    'eightwo': 82,
    'eighthree': 83,
    'nineight': 98
};

const convertToNumber = (value: string, includeSpelled?: boolean): number => {
    if (includeSpelled) {
        return spelledToNumber[value] || Number(value);
    }

    return Number(value);
};

const extractTwoDigitNumber = (value: string, includeSpelled?: boolean): number | null => {
    const firstPartRegExp = /\d/g;
    const secPartRegExp = /\d|oneight|twone|threeight|fiveight|sevenine|eightwo|eighthree|nineight|one|two|three|four|five|six|seven|eight|nine/g;

    const values = value.match(includeSpelled ? secPartRegExp : firstPartRegExp);

    if (!values || !values.length) {
        return null;
    }

    const convertedNumbers = values.reduce<number[]>((acc, curr) => {
        const converted = convertToNumber(curr, includeSpelled);
        if (Math.floor(converted / 10)) {
            return [...acc, Math.floor(converted / 10), converted % 10];
        }
        return [...acc, converted];
    }, []);

    return convertedNumbers[0] * 10 + convertedNumbers[convertedNumbers.length - 1];
};

export default () => {
    const input = getInput();
    const result = input.reduce((acc, curr) => {
        const extractedNumber = extractTwoDigitNumber(curr, true);
        return extractedNumber ? acc + extractedNumber : acc;
    }, 0);

    console.log('result: ', result);
};

