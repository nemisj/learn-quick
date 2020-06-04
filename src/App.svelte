<script>
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
	<div class="scene">
		<div class="zork {flipped && 'flipped'}">
			<div class="text" style="visibility: hidden">{current[0].length > current[1].length ? current[0] : current[1]}</div>
			<h1 class="card text back">{current[0]}</h1>
			<h1 class="card text front">{current[1]}</h1>
			<div class="buttons-container">
				<div class="good" on:click="{() => next(true)}" />
				<div class="bad" on:click="{() => next(false)}" />
			</div>
		</div>
	</div>
	{/if}
	{#if !current}
		There are no words anymore. Genius;
	{/if}
</main>

<style>

	.scene {
		perspective: 600px;
	}

	.buttons-container {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
		display: flex;
	}

	.buttons-container > div {
		flex-grow: 1;
	}

	.good {
		cursor: w-resize;
	}

	.bad {
		cursor: e-resize;
	}

	.zork {
		display: inline-block;
		position: relative;
		perspective: 600px;
		transform-style: preserve-3d;
		transition: transform 2s;
	}

	.zork.flipped {
		transform: rotateY( 180deg );
	}

	.zork.flipped .buttons-container {
		transform: rotateY(180deg);
		cursor: inherit;
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	.card {
		position: relative;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		backface-visibility: hidden;
		background-color: #f4f4f4;
		border-radius: 10px;
	}

	.text {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin: 0;
		padding: 1rem 2rem;
		box-sizing: border-box;
		justify-content: center;
		display: flex;
		align-items: center;
	}

	.front {
	}

	.back {
		color: transparent;
		background: #ff3e00;
		transform: rotateY( 180deg );
	}

	.flipped .back {
		color: #fff;
	}

</style>
