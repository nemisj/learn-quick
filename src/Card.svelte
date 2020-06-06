<script>
	import { createEventDispatcher } from 'svelte';

	export let back;
	export let front;
	export let flipped;

	const dispatch = createEventDispatcher();

	const onClick = (res) => {
		dispatch('click', res);
	};
</script>

<div class="scene">
	<div class="zork {flipped && 'flipped'}">
		<div class="text" style="visibility: hidden">{back.length > front.length ? back : front}</div>
		<h1 class="card text back">{back}</h1>
		<h1 class="card text">{front}</h1>
		<div class="buttons-container">
			<div class="good" on:click={() => onClick(true)} />
			<div class="bad" on:click={() => onClick(false)} />
		</div>
	</div>
</div>

<style>
	.scene {
		perspective: 600px;
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

	.back {
		color: transparent;
		background: #ff3e00;
		transform: rotateY( 180deg );
	}

	.flipped .back {
		color: #fff;
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

	.flipped .buttons-container {
		transform: rotateY(180deg);
		cursor: inherit;
	}
</style>
