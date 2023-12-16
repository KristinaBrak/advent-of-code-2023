import { getInput } from "../common";

const getHand = (hand: string): string[] => hand.split('');

const getGroups = (hand: string[]): Record<string, number> => {
    return hand.reduce<Record<string, number>>((acc, card) => {
        const keys = Object.keys(acc);
        const isKeyFound = !!keys.find((key) => key === card);

        if (isKeyFound) {
            return { ...acc, [card]: acc[card] + 1 };
        }

        return { ...acc, [card]: 1 };
    }, {});
};

const isHighCard = (groups: ReturnType<typeof getGroups>): boolean => {
    return Object.values(groups).reduce<boolean>((acc, value) => {
        if (value !== 1) {
            return false;
        }
        return acc;
    }, true);
};

const isPair = (groups: ReturnType<typeof getGroups>): boolean => {
    const values = Object.values(groups);
    return values.reduce<number>((acc, value) => {
        if (value === 2) {
            return acc + 1;
        }
        return acc;
    }, 0) === 1 && values.length > 2;
};

const isTwoPairs = (groups: ReturnType<typeof getGroups>): boolean => {
    const values = Object.values(groups);
    return values.reduce<number>((acc, value) => {
        if (value === 2) {
            return acc + 1;
        }
        return acc;
    }, 0) === 2 && values.length > 2;
};

const isThreeOfKind = (groups: ReturnType<typeof getGroups>): boolean => {
    const values = Object.values(groups);
    return values.reduce<number>((acc, value) => {
        if (value === 3) {
            return acc + 1;
        }
        return acc;
    }, 0) === 1 && values.length > 2;
};

const isFullHouse = (groups: ReturnType<typeof getGroups>): boolean => {
    const values = Object.values(groups);
    if (values.length === 2) {
        return (values[0] === 2 && values[1] === 3) || (values[0] === 3 && values[1] === 2);
    }
    return false;
};

const isFourOfKind = (groups: ReturnType<typeof getGroups>): boolean => {
    const values = Object.values(groups);
    if (values.length === 2) {
        return (values[0] === 4 && values[1] === 1) || (values[0] === 1 && values[1] === 4);
    }
    return false;
};

const isFiveOfKind = (groups: ReturnType<typeof getGroups>): boolean => {
    return Object.keys(groups).length === 1;
};


const CardRank: Record<string, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const CardRankWithJoker: Record<string, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, 'J': 1
};


enum TypeRank {
    HIGH = 0,
    PAIR = 1,
    TWO_PAIRS = 2,
    THREE_OF_KIND = 3,
    FULL_HOUSE = 4,
    FOUR_OF_KIND = 5,
    FIVE_OF_KIND = 6,
    NONE = -1,
};

const getTypeRank = (hand: string[]) => {
    const groups = getGroups(hand);

    if (isHighCard(groups)) {
        return TypeRank.HIGH;
    } else if (isPair(groups)) {
        return TypeRank.PAIR;
    } else if (isTwoPairs(groups)) {
        return TypeRank.TWO_PAIRS;
    } else if (isThreeOfKind(groups)) {
        return TypeRank.THREE_OF_KIND;
    } else if (isFullHouse(groups)) {
        return TypeRank.FULL_HOUSE;
    } else if (isFourOfKind(groups)) {
        return TypeRank.FOUR_OF_KIND;
    } else if (isFiveOfKind(groups)) {
        return TypeRank.FIVE_OF_KIND;
    }
    return TypeRank.NONE;
};

const sortHands = (hand1: string[], hand2: string[]): 1 | 0 | -1 => {
    const hand1Rank = getTypeRank(hand1);
    const hand2Rank = getTypeRank(hand2);

    if (hand1Rank > hand2Rank) {
        return 1;
    }
    if (hand1Rank < hand2Rank) {
        return -1;
    }

    for (let i = 0; i < hand1.length; i++) {
        const hand1Card = hand1[i];
        const hand2Card = hand2[i];
        if (CardRank[hand1Card] > CardRank[hand2Card]) {
            return 1;
        }
        if (CardRank[hand1Card] < CardRank[hand2Card]) {
            return -1;
        }
    };
    return 0;
};


const getHandAndBidList = (input: string[]) => {
    return input.map((line) => line.split(' '));
};

const calculateTotalWinnings = (cardsAndBidList: string[][]): number => {
    const sorted = cardsAndBidList.sort((cardsAndBid1, cardsAndBid2) => sortHands(getHand(cardsAndBid1[0]), getHand(cardsAndBid2[0])));
    return sorted.reduce<number>((acc, [_cards, bid], idx) => {
        return acc + Number(bid) * (idx + 1);
    }, 0);
};

const getRankWhenOneJoker = (groups: ReturnType<typeof getGroups>) => {
    const values = Object.values(groups);
    const groupCount = values.length;

    if (groupCount === 2) {
        return TypeRank.FIVE_OF_KIND;
    }

    const foundCardPairs = values.filter((value) => value === 2);

    if (groupCount === 3 && !foundCardPairs.length) {
        return TypeRank.FOUR_OF_KIND;
    }
    if (groupCount === 3 && foundCardPairs.length === 2) {
        return TypeRank.FULL_HOUSE;
    }
    if (groupCount === 3 && foundCardPairs.length === 1) {
        return TypeRank.THREE_OF_KIND;
    }
    if(groupCount === 4){
        return TypeRank.THREE_OF_KIND;
    }
    return TypeRank.PAIR;
};

const getRankWhenTwoJokers = (groups: ReturnType<typeof getGroups>) => {
    const values = Object.values(groups);
    const groupCount = values.length;
    if (groupCount === 2) {
        return TypeRank.FIVE_OF_KIND;
    }
    if (groupCount === 3) {
        return TypeRank.FOUR_OF_KIND;
    }
    return TypeRank.THREE_OF_KIND;
};

const getRankWhenThreeJokers = (groups: ReturnType<typeof getGroups>) => {
    const groupCount = Object.values(groups).length;
    if (groupCount === 2) {
        return TypeRank.FIVE_OF_KIND;
    }
    return TypeRank.FOUR_OF_KIND;
};

const getTypeRankWithJoker = (hand: string[]) => {
    const groups = getGroups(hand);

    const jokerCount = groups['J'];
    if (!jokerCount) {
        return getTypeRank(hand);
    }

    switch (jokerCount) {
        case 5:
            return TypeRank.FIVE_OF_KIND;
        case 4:
            return TypeRank.FIVE_OF_KIND;
        case 3:
            return getRankWhenThreeJokers(groups);
        case 2:
            return getRankWhenTwoJokers(groups);
        case 1:
            return getRankWhenOneJoker(groups);
        default:
            return TypeRank.NONE;
    }

};

const sortHandsWithJoker = (hand1: string[], hand2: string[]): 1 | 0 | -1 => {
    const hand1Rank = getTypeRankWithJoker(hand1);
    const hand2Rank = getTypeRankWithJoker(hand2);

    if (hand1Rank > hand2Rank) {
        return 1;
    }
    if (hand1Rank < hand2Rank) {
        return -1;
    }

    for (let i = 0; i < hand1.length; i++) {
        const hand1Card = hand1[i];
        const hand2Card = hand2[i];
        if (CardRankWithJoker[hand1Card] > CardRankWithJoker[hand2Card]) {
            return 1;
        }
        if (CardRankWithJoker[hand1Card] < CardRankWithJoker[hand2Card]) {
            return -1;
        }
    };
    return 0;
};

const calculateTotalWinningsWithJoker = (cardsAndBidList: string[][]): number => {
    const sorted = cardsAndBidList.sort((cardsAndBid1, cardsAndBid2) => sortHandsWithJoker(getHand(cardsAndBid1[0]), getHand(cardsAndBid2[0])));
    return sorted.reduce<number>((acc, [_cards, bid], idx) => {
        return acc + (Number(bid.trim()) * (idx + 1));
    }, 0);
};

export default () => {
    console.log('Day 7',);

    const input = getInput();
    const handAndBidList = getHandAndBidList(input);

    const result1 = calculateTotalWinnings(handAndBidList);
    const result2 = calculateTotalWinningsWithJoker(handAndBidList);
    console.log('result: ', result2);

};