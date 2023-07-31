function sleep(ms) {
    // async pause for programs

    return new Promise( resolve => setTimeout(resolve,ms));
}

Node.prototype.getElementByNamesArray = function(names) {
  // Look for specific DOM Elements by matching input names
  // If parameter is an Array, search for first existed name in DOM
  // If parameter is a String, similar to standard function

  const find = this.getElementsByName.bind(this);
  if(Array.isArray(names)) {
    const match = names.find(name => find(name).length);
    return match ? find(match) : [];
  } else if(typeof names === 'string') {
    return find(names);
  } else return [];
};

async function waitForName(names, delay = 1, N = 20, step = 500) {
  // wait when app load the new screen or change the target state to active

  let i = 0;
  await sleep(delay);
  while (
    (typeof document.getElementByNamesArray(names)[0] == 'undefined')
    || (document.getElementByNamesArray(names)[0].classList.contains('o_invisible_modifier'))
  ) {
    if(i >= N) return i;
      console.log(i);
    i++;
    await sleep(step);
  }
  return i;
}

async function awaitClickByName(names, delay = 1, order = 0, N = 20, step = 500) {
	// async func that wait for availability to click the button
	// defined by name property or array of names
	// uses modified array search documentGetElementByNamesArray

  let count;
  console.log(names);
  await sleep(delay);
  await waitForName(names, delay, N, step).then(res => count = res);
	if (count >= N) console.log('over ' + count)
	else {
    console.log(names, order)
		document.getElementByNamesArray(names)[order].click();
		console.log('after ' + count)
	}
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

Node.prototype.querySelectorArray = function(queries) {
	// Look for specific DOM Elements by matching queries
	// If parameter is an Array, search for first matched query in DOM
	// If parameter is a String, similar to standart function

  const query = this.querySelectorAll.bind(this);
  if (Array.isArray(queries)) {
    const match = queries.find(q => query(q).length > 0);
    return match ? query(match) : [];
  } else if(typeof queries === 'string') {
    return query(queries);
  } else return query('_');
};

async function waitForQuery(query, N = 20, step = 500) {
  // wait when app load the new screen or change the target state to active

  let i = 0;
  while (
    (typeof document.querySelectorArray(query)[0] == 'undefined')
    || (document.querySelectorArray(query)[0] == null)
    || document.querySelectorArray(query)[0].classList.contains('o_invisible_modifier')
  ) {
    if(i > N) return i;
      console.log(i);
    i++;
    await sleep(step);
  }
  return i;
}

async function awaitClickByQuery(query, delay = 1, order = 0, N = 20, step = 500) {
  // async func that wait for availability to click the button
  // defined by query string
  // or array of queries
  // uses modified array search documentQuerySelectorArray
  // delay = ms before click try
  // order =

  let count;
  console.log(query);
  await sleep(delay);
  await waitForQuery(query, N, step).then(res => count = res);
  // Old code
  /* while ((
    (typeof document.querySelectorArray(query)[0] == 'undefined')
    || (typeof document.querySelectorArray(query)[0] == 'null')
    || document.querySelectorArray(query)[0].classList.contains('o_invisible_modifier'))
  ) && (count < N)) {
    await sleep(step);
    count++;
  } */

  if (count >= N) console.log('over ' + count)
  else {
    if (typeof order == "string")
      if (order == "last")
        order = document.querySelectorArray(query).length - 1;
    	else
        throw new Error('unrecognized order string')
    else if (
      typeof order == "number"
      && order >= 0
      && isFinite(order)
      && Math.floor(order) === order
    ) {}
    else
      throw new Error('wrong order number')
    document.querySelectorArray(query)[order].click();
    console.log('after ' + count)
  }
}

// ---------------------------------------

function tya() {
	// Two Years Ago function
	// change start date of partner ledger view to Jan 1 2020

	awaitClickByName('fa fa-calendar');
	awaitClickByName('dropdown-item js_foldable_trigger o_closed_menu');
	document.getElementsByName('date_from')[0].value = "01/01/2020";
	awaitClickByName('btn btn-primary js_account_report_date_filter');
}

async function sta() {
	// open for edit the invoice/credit note/payment
	// Imitate clicks: Edit -> Cancel -> To draft

	awaitClickByQuery('.o_form_button_edit');
	// document.getElementsByClassName('o_form_button_edit')[0].click();
	awaitClickByName(['action_invoice_cancel','cancel'], 100);
	awaitClickByName(['action_invoice_draft','action_draft'], 100);
}

async function fin() {
	// close and save after edit the invoice/credit note/payment
	// Imitate the clicks: Save -> Confirm

	awaitClickByName('o_form_button_save');
	// document.getElementsByClassName('o_form_button_save')[0].click();
	awaitClickByName(['action_invoice_open','post'], 1500);
}

async function reo() {
	// open and close the invoice/credit note/payment
	// don't change the data, only recalculate all automatic fields
	// Imitate the clicks: Cancel -> To draft -> Confirm

	// awaitClickByName('o_form_button_edit');
	awaitClickByName(['action_invoice_cancel','cancel'], 100);
	awaitClickByName(['action_invoice_draft','action_draft'], 1500);

	// awaitClickByName('o_form_button_save');
	awaitClickByName(['action_invoice_open','post'], 1500);
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