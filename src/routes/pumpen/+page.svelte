<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	type Item = PageData['items'][0] & { gesamt: Number; };

	interface Day {
		datum: string;
		items: Item[];
		summe: number;
	}

	export let data: PageData;

	function groupItems(items: Item[]) {
		const days: Day[] = [];
		items.forEach((item) => {
			const day = days.find((d) => d.datum === item.datum);
			if (!day) {
				days.push({
					datum: item.datum,
					items: [item],
					summe: item.gesamt
				});
			} else {
				day.items.push(item);
				day.summe += item.gesamt;
			}
		})
		return days;
	}

	$: days = groupItems(data.items);

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

<h1>🐄Abgepumpt</h1>
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
		<input name="links" type="number" placeholder="links" style="width:100px; margin-right: 4px" />
		<input name="rechts" type="number" placeholder="rechts" style="width:100px" />
		<button class="icn-btn" style="margin-left: 10px">💾</button>
	</div>
</form>
<br />
{#each days as day (day.datum)}
	<div class="headrow">
		<div>{formatDateForHeadline(day.datum)}</div>
		<div style="text-align:right">{day.items.length} {day.items.length === 1 ? 'Pumpung' : 'Pumpungen'} für </div>
		<div style="text-align:right;margin-left:4px;">{day.summe} ml</div>
	</div>
	{#each day.items as item, i (item.id)}
		<div class="row" class:even={i % 2 === 0}>
			<div>{item.uhrzeit}</div>
			<div style="text-align:right">{item.links} ml</div>
			<div style="text-align:center">+</div>
			<div style="text-align:right">{item.rechts} ml</div>
			<div style="text-align:center">=</div>
			<div style="text-align:right">{item.gesamt} ml</div>
			<div style="text-align:right">
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="id" value={item.id} />
					<button class="icn-btn">🗑️</button>
				</form>
			</div>
		</div>
	{/each}
	<hr />
{/each}

<style>
	.form-row {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}
	.headrow {
		display: grid;
		grid-template-columns: 90px 180px 60px;
		margin-top: 30px;
		font-weight: bold;
	}
	.row {
		display: grid;
		grid-template-columns: 90px 60px 30px 60px 30px 60px 50px;
		margin: 10px 0px;
		padding: 2px;
		border: 1px solid lightgrey;
		border-radius: var(--border-radius);
		align-items: center;
	}
	.row.even {
		background-color: var(--tuerkis);
	}
	.icn-btn {
		font-size: 16px;
		border: 0;
		background: none;
		cursor: pointer;
	}
</style>
