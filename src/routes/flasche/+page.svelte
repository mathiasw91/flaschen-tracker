<script lang="ts">
	import type { PageData } from './$types';

	interface Item {
		id: number;
		uhrzeit: string;
		datum: string;
		getrunken: number;
		flascheninhalt: number;
	}

	interface Day {
		datum: string;
		items: Item[];
		getrunken: number;
	}

	export let data: PageData;

	const days: Day[] = [];
	data.items.forEach((item) => {
		const day = days.find((d) => d.datum === item.datum);
		if (!day) {
			days.push({
				datum: item.datum,
				items: [item],
				getrunken: item.getrunken
			});
		} else {
			day.items.push(item);
			day.getrunken += item.getrunken;
		}
	});

	function formatDate(str: string) {
		const date = new Date(str);
		return date.toLocaleDateString('de', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}
</script>

<h1>🍼Flasche gegeben</h1>
<form method="POST" action="?/add">
	<div class="form-row">
		<input
			name="uhrzeit"
			type="time"
			placeholder="Uhrzeit"
			style="margin-right: 4px"
			value={new Date().toLocaleTimeString('de', {
				hour12: false,
				hour: 'numeric',
				minute: 'numeric'
			})}
		/>
		<input
			name="datum"
			type="date"
			placeholder="Datum"
			value={new Date().toISOString().slice(0, 10)}
		/>
	</div>
	<div class="form-row">
		<input name="getrunken" type="number" placeholder="getrunken" style="width:100px" />
		<span style="margin: 0 4px">von</span>
		<input name="flascheninhalt" type="number" placeholder="Flascheninhalt" style="width:100px" />
		<button class="icn-btn">💾</button>
	</div>
</form>
<br />
{#each days as day (day.datum)}
	<div class="headrow">
		<div>{formatDate(day.datum)}</div>
		<div style="text-align:right">{day.getrunken} ml</div>
	</div>
	{#each day.items as item, i (item.id)}
		<div class="row" class:even={i % 2 === 0}>
			<div>{item.uhrzeit}</div>
			<div style="text-align:right">{item.getrunken} ml</div>
			<div style="text-align:right">von</div>
			<div style="text-align:right">{item.flascheninhalt} ml</div>
			<div style="text-align:center">{item.getrunken === item.flascheninhalt ? '✅' : ''}</div>
			<div style="text-align:right">
				<form method="POST" action="?/delete">
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
		grid-template-columns: 90px 60px;
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
	.icn-btn {
		font-size: 16px;
		border: 0;
		background: none;
		cursor: pointer;
	}
</style>
