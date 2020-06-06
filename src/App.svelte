<script>
	import Card from './Card.svelte';
	import { onMount } from 'svelte';
	import { vocabulary } from './vocabularyStore.js';

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
		const words = $vocabulary;
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

	const next = ({ detail }) => {
		if (flipped) {
			// we are already turned. switch to the next word
			const words = $vocabulary;
			const the = words.bad[index];
			if (detail) {
				words.good.push(the);
				words.bad.splice(index, 1);
				$vocabulary = words;
			}
			start();
			flipped = false;
		} else {
			flipped = true;
		}
	};

	onMount(() => {
		start();
	});
</script>

<main>
	{#if current}
		<Card back={current[0]} front={current[1]} flipped={flipped} on:click={next} />
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
