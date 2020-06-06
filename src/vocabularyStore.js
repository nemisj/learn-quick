import { writable } from 'svelte/store';
import { existingWords } from './words.js';

if (typeof window.localStorage === 'undefined') {
	throw new Error('No localStorage support, sorry');
}

const key = 'words';

const sync = (words) => {
	const wordsCount = words.bad.length + words.good.length;
	if (wordsCount === existingWords.length) {
		// do not do this, only if words are added
		return words;
	}

	// move all the words from existingWords to 'bad' if they're not in good
	const goodsMap = words.good.reduce((res, { it }) => {
		res[it] = true;
		return res;
	}, {});

	words.bad = [];
	existingWords.forEach((word) => {
		if (!goodsMap[word.it]) {
			words.bad.push(word);	
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
