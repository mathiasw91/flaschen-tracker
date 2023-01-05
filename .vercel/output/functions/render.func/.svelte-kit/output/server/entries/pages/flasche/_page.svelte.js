import { c as create_ssr_component, d as add_attribute, f as each, e as escape } from "../../../chunks/index.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".form-row.svelte-1piw2x{display:flex;align-items:center;margin:10px 0}.headrow.svelte-1piw2x{display:grid;grid-template-columns:90px 60px;margin-top:30px;font-weight:bold}.row.svelte-1piw2x{display:grid;grid-template-columns:90px 60px 40px 60px 40px 60px;margin:10px 0px;padding:2px;border:1px solid lightgrey;border-radius:var(--border-radius);align-items:center}.row.even.svelte-1piw2x{background-color:var(--tuerkis)}.icn-btn.svelte-1piw2x{font-size:16px;border:0;background:none;cursor:pointer}",
  map: null
};
function formatDate(str) {
  const date = new Date(str);
  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const days = [];
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
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<h1>🍼Flasche gegeben</h1>
<form method="${"POST"}" action="${"?/add"}"><div class="${"form-row svelte-1piw2x"}"><input name="${"uhrzeit"}" type="${"time"}" placeholder="${"Uhrzeit"}" style="${"margin-right: 4px"}"${add_attribute(
    "value",
    new Date().toLocaleTimeString("de", {
      hour12: false,
      hour: "numeric",
      minute: "numeric"
    }),
    0
  )}>
		<input name="${"datum"}" type="${"date"}" placeholder="${"Datum"}"${add_attribute("value", new Date().toISOString().slice(0, 10), 0)}></div>
	<div class="${"form-row svelte-1piw2x"}"><input name="${"getrunken"}" type="${"number"}" placeholder="${"getrunken"}" style="${"width:100px"}">
		<span style="${"margin: 0 4px"}">von</span>
		<input name="${"flascheninhalt"}" type="${"number"}" placeholder="${"Flascheninhalt"}" style="${"width:100px"}">
		<button class="${"icn-btn svelte-1piw2x"}">💾</button></div></form>
<br>
${each(days, (day) => {
    return `<div class="${"headrow svelte-1piw2x"}"><div>${escape(formatDate(day.datum))}</div>
		<div style="${"text-align:right"}">${escape(day.getrunken)} ml</div></div>
	${each(day.items, (item, i) => {
      return `<div class="${["row svelte-1piw2x", i % 2 === 0 ? "even" : ""].join(" ").trim()}"><div>${escape(item.uhrzeit)}</div>
			<div style="${"text-align:right"}">${escape(item.getrunken)} ml</div>
			<div style="${"text-align:right"}">von</div>
			<div style="${"text-align:right"}">${escape(item.flascheninhalt)} ml</div>
			<div style="${"text-align:center"}">${escape(item.getrunken === item.flascheninhalt ? "✅" : "")}</div>
			<div style="${"text-align:right"}"><form method="${"POST"}" action="${"?/delete"}"><input type="${"hidden"}" name="${"id"}"${add_attribute("value", item.id, 0)}>
					<button class="${"icn-btn svelte-1piw2x"}">🗑️</button>
				</form></div>
		</div>`;
    })}
	<hr>`;
  })}`;
});
export {
  Page as default
};
