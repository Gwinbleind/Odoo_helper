function documentGetElementByNamesArray(names) {
	// DEPRECATED
	// Look for specific DOM Elements by matching input names
	// If parameter is an Array, search for first existed name in DOM
	// If parameter is a String, similar to standart function

	let ind = -1;
	if (Array.isArray(names)) {
		if (names.some((name,index) => {
			ind = index;
			return document.getElementsByName(name).length > 0;
		})) return document.getElementsByName(names[ind]);
	} else if (typeof names == 'string') {
		return document.getElementsByName(names);
	} else return undefined
}

function documentQuerySelectorArray(queries) {
	// DEPRECATED
	// Look for specific DOM Elements by matching queries
	// If parameter is an Array, search for first matched query in DOM
	// If parameter is a String, similar to standart function

	let ind = -1;
	if (Array.isArray(queries)) {
		if (queries.some((query,index) => {
			ind = index;
			return document.querySelectorAll(query).length > 0;
		})) return document.querySelectorAll(queries[ind]);
	} else if (typeof queries == 'string') {
		return document.querySelectorAll(queries);
	} else return document.querySelectorAll('_');
}

// async function test() {
//   let inv;
//   await awaitClickByName('sale_id');
//   await waitForName('action_view_invoice',500, 60, 500).then(() => {
//     inv = +document.getElementByNamesArray('invoice_count')[0]
//       .querySelectorArray('.o_stat_value')[0].textContent;
//   })
//   await awaitClickByName('action_view_invoice',200, 0, 30, 1000);
//   if (inv > 1) await choosePositiveInvoice();
// }