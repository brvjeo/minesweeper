import ReactionSad from '../assets/reactions/sad.png';
import ReactionSmile from '../assets/reactions/smile.png';
import ReactionPushedSmile from '../assets/reactions/smile_pushed.png';
import ReactionWow from '../assets/reactions/wow.png';
import ReactionGlasses from '../assets/reactions/glasses.png';
import FieldUnknown from '../assets/fields/unknown.png';
import FieldBomb from '../assets/fields/bomb.png';
import FieldClear from '../assets/fields/clear.png';
import FieldFlag from '../assets/fields/flag.png';
import FieldExploded from '../assets/fields/exploded.png';
import FieldWrong from '../assets/fields/wrong.png';
import FieldQuestion from '../assets/fields/question.png';
import FieldPushedQuestion from '../assets/fields/question_pushed.png';
import DigitZero from '../assets/digits/0.png';
import DigitOne from '../assets/digits/1.png';
import DigitTwo from '../assets/digits/2.png';
import DigitThree from '../assets/digits/3.png';
import DigitFour from '../assets/digits/4.png';
import DigitFive from '../assets/digits/5.png';
import DigitSix from '../assets/digits/6.png';
import DigitSeven from '../assets/digits/7.png';
import DigitEight from '../assets/digits/8.png';
import DigitNine from '../assets/digits/9.png';
import CountOne from '../assets/counts/1.png';
import CountTwo from '../assets/counts/2.png';
import CountThree from '../assets/counts/3.png';
import CountFour from '../assets/counts/4.png';
import CountFive from '../assets/counts/5.png';
import CountSix from '../assets/counts/6.png';
import CountSeven from '../assets/counts/7.png';
import CountEight from '../assets/counts/8.png';

export const Reactions = {
	ReactionSad,
	ReactionSmile,
	ReactionPushedSmile,
	ReactionWow,
	ReactionGlasses,
} as const;

export const Fields = {
	FieldUnknown,
	FieldBomb,
	FieldClear,
	FieldFlag,
	FieldWrong,
	FieldExploded,
	FieldQuestion,
	FieldPushedQuestion,
} as const;

export const Digits = [
	DigitZero,
	DigitOne,
	DigitTwo,
	DigitThree,
	DigitFour,
	DigitFive,
	DigitSix,
	DigitSeven,
	DigitEight,
	DigitNine,
];

export const Counts = [
	'',
	CountOne,
	CountTwo,
	CountThree,
	CountFour,
	CountFive,
	CountSix,
	CountSeven,
	CountEight,
];

export const BOMBS_COUNT = 40;
export const GRID_WIDTH = 16;
export const GRID_HEIGHT = 16;
