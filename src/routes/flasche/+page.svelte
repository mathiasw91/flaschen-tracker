<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	$: days = data.items;

	let timeInput: HTMLInputElement;
	let dateInput: HTMLInputElement;

	function updateDateInputs() {
		timeInput.value = formatTimeForInput(new Date());
		dateInput.value = formatDateForInput(new Date());
	}

	function formatDateForHeadline(str: string) {
		const date = new Date(str);
		return date.toLocaleDateString('de', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	function formatDateForInput(date: Date) {
		return date.toISOString().slice(0, 10);
	}

	function formatTimeForInput(date: Date) {
		return date.toLocaleTimeString('de', {
			hour12: false,
			hour: 'numeric',
			minute: 'numeric'
		});
	}
</script>

<header>
	<a href="/" class="icn-btn">🔙</a>
	<h1>🍼Flasche</h1>
</header>
<form method="POST" action="?/add" use:enhance>
	<div class="form-row">
		<input
			name="uhrzeit"
			type="time"
			placeholder="Uhrzeit"
			style="margin-right: 4px"
			bind:this={timeInput}
			value={formatTimeForInput(new Date())}
		/>
		<input
			name="datum"
			type="date"
			placeholder="Datum"
			bind:this={dateInput}
			value={formatDateForInput(new Date())}
		/>
		<button class="icn-btn" type="button" style="margin-left:10px" on:click={updateDateInputs}>🔄</button>
	</div>
	<div class="form-row">
		<input name="getrunken" type="number" placeholder="getrunken" style="width:100px" />
		<span style="margin: 0 4px">von</span>
		<input name="flascheninhalt" type="number" placeholder="Flascheninhalt" style="width:100px" />
		<button class="icn-btn" style="margin-left:10px">💾</button>
	</div>
</form>
<br />
{#each days as day, i (day.datum)}
	<div class="headrow">
		<div>{formatDateForHeadline(day.datum)}</div>
		<div style="text-align:right;margin-right:4px;">{day.getrunken} ml</div>
		<div>aus {day.items.length} {day.items.length === 1 ? 'Mahlzeit' : 'Mahlzeiten'}</div>
	</div>
	{#if i < 3}
		{#each day.items as item, j (item.id)}
			<div class="row" class:even={j % 2 === 0}>
				<div>{item.uhrzeit}</div>
				<div style="text-align:right">{item.getrunken} ml</div>
				<div style="text-align:right">von</div>
				<div style="text-align:right">{item.flascheninhalt} ml</div>
				<div style="text-align:center">{item.getrunken === item.flascheninhalt ? '✅' : ''}</div>
				<div style="text-align:right">
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={item.id} />
						<button class="icn-btn">🗑️</button>
					</form>
				</div>
			</div>
		{/each}
	{/if}
{/each}

<style>
	.form-row {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}
	.headrow {
		display: grid;
		grid-template-columns: 90px 60px 1fr;
		margin-top: 30px;
		font-weight: bold;
	}
	.row {
		display: grid;
		grid-template-columns: 90px 60px 40px 60px 40px 60px;
		margin: 10px 0px;
		padding: 2px;
		border: 1px solid lightgrey;
		border-radius: var(--border-radius);
		align-items: center;
	}
	.row.even {
		background-color: var(--tuerkis);
	}
</style>
