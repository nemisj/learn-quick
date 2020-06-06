<script>
	import Card from './Card.svelte';
	import { existingWords } from './words.js';
	import { onMount } from 'svelte';

	if (typeof window.localStorage === 'undefined') {
		throw new Error('No localStorage support, sorry');
	}

	const getVocabulary = () => {
		const wordsStr = localStorage.getItem('words');
		let words;
		if (wordsStr) {
			try {
				return JSON.parse(wordsStr);
			} catch (err) {
			}
		}

		return {
			bad: [],
			good: [],
		};
	};

	const setVocabulary= (words) => {
		localStorage.setItem('words', JSON.stringify(words));
	};

	const sync = () => {
		const words = getVocabulary();
		const wordsCount = words.bad.length + words.good.length;
		if (wordsCount === existingWords.length) {
			// do not do this, only if words are added
			return;
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

		setVocabulary(words);
	};

	let flipped = '';

	let index = -1;
	let current;

	const shuffle = (word) => {
	// randomly it or en or ru 
	const reverse = Math.floor(Math.random() * 6) % 2 === 0;
	if (reverse ) {
		return [
			word.it,
			word.ru || word.en,
		];
	} else {
		return [
			word.ru || word.en,
			word.it,
		];
	}
	};

	const start = () => {
		// take the random word from bad
		const words = getVocabulary();
		const bad = words.bad;
		const length = bad.length;
		if (length === 0) {
			current = undefined;
			return;
		} else if (length === 1) {
			current = shuffle(bad[0]);
			return;
		}

		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * length);
		} while (newIndex === index);
		index = newIndex;

		current = shuffle(bad[index]);
	};

	const next = (isGood) => {
		if (flipped) {
			// we are already turned. switch to the next word
			const words = getVocabulary();
			const the = words.bad[index];
			if (isGood) {
				words.good.push(the);
				words.bad.splice(index, 1);
				setVocabulary(words);
			}
			start();
			flipped = false;
		} else {
			flipped = true;
		}
	};

	onMount(() => {
		sync();
		start();
	});
</script>

<main>
	{#if current}
		<Card back={current[0]} front={current[1]} flipped={flipped} onClick={next} />
	{/if}
	{#if !current}
		There are no words anymore. Genius;
	{/if}
</main>

<style>

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

</style>
