import { writable } from 'svelte/store';
import { existingWords } from './words.js';

if (typeof window.localStorage === 'undefined') {
	throw new Error('No localStorage support, sorry');
}

const key = 'words';

const sync = (words) => {
	const wordsCount = words.bad.length + words.good.length;

	// move all the words from existingWords to 'bad' if they're not in good
	const goodsMap = words.good.reduce((res, { it }) => {
		res[it] = true;
		return res;
	}, {});

	const namesMap = {};

	words.good = [];
	words.bad = [];
	existingWords.forEach((word) => {
		if (!word.it) {
			throw new Error(`${JSON.stringify(word)} no italian`);
		} else if (!word.ru && !word.en) {
			throw new Error(`${JSON.stringify(word)} no translation`);
		} else if (namesMap[word.it]) {
			throw new Error(`"${word.it}" already exist`);
		} else if (word.conjugation) {
			if (word.conjugation.length != 6) {
				throw new Error(`"${word.it}" has incorrect conjugations`);
			}
		}
		namesMap[word.it] = true;

		if (!goodsMap[word.it]) {
			// a couple of rules
			words.bad.push(word);	
		} else {
			words.good.push(word);
		}
	});

	return words;
};

const getVocabulary = () => {
	const wordsStr = localStorage.getItem(key);
	let words;
	if (wordsStr) {
		try {
			words = JSON.parse(wordsStr);
		} catch (err) {
		}
	}

	if (!words) {
		words = {
			bad: [],
			good: []
		}
	}

	return sync(words);
};

const value = getVocabulary();
export const vocabulary = writable(value);

vocabulary.subscribe(value => {
	localStorage.setItem(key, JSON.stringify(value));
});
