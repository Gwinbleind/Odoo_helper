awaitClickByName('sale_id');
awaitClickByName('action_view_invoice');

for (let row of documentQuerySelectorArray('.o_data_row')) {
  if (parseFloat(row.querySelectorAll('td')[11].textContent.replace(/[^\d.-]/g, '')) > 0) {
    row.click();
    break;
  }
}

documentQuerySelectorArray('.o_dropdown_toggler_btn')[1].click()
documentQuerySelectorArray('.o_dropdown_menu.show > a')[1].click()

// documentQuerySelectorArray('.o_form_button_edit')[0].click()
// Delete negatives
for (let row of documentQuerySelectorArray('table.o_section_and_note_list_view tbody tr.o_data_row')) {
  if (parseFloat(row.querySelectorAll('td')[13].textContent.replace(/[^\d.-]/g, '')) <= 0) {
    row.querySelectorAll('td')[14].click();
  }
}


// -- Stops here --

// Change selection field
documentQuerySelectorArray('tr.o_selected_row>td>div[name="account_id"]>div>input')[0].value = '22405';
documentQuerySelectorArray('tr.o_selected_row>td>div[name="account_id"]>div>input')[0].dispatchEvent(new KeyboardEvent('keydown', {'key':'a'}));
await awaitClickByQuery('ul.ui-autocomplete.ui-front.ui-menu>li', 1000);

//Change normal field
  $('[name=quantity]').val(1);
  $('[name=quantity]').trigger("change");

// Taxes
amount = 7223.99;
untaxed = amount/([...documentQuerySelectorArray('.o_badge_text')].reduce((sum, span) => {
    const num = parseFloat(span.textContent.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? sum : sum + num;
  }, 0)/100 + 1);
untaxed = Number(untaxed.toFixed(2));

changeSimpleField('price_unit', untaxed);

  $('[name=price_unit]').val(untaxed);
  $('[name=price_unit]').trigger("change");

//change jQuery to:
const input = documentGetElementByNamesArray('price_unit')[0];
input.value = untaxed;
const changeEvent = new Event('change');
input.dispatchEvent(changeEvent);

	awaitClickByQuery('.o_form_button_save');
	awaitClickByName(['action_invoice_open','post'], 1500);

// --------------------------------------

async function choosePositiveInvoice() {
  await awaitClickByQuery('th.o_list_number_th', 3000);
  for (let row of documentQuerySelectorArray('.o_data_row')) {
    if (parseFloat(row.querySelectorAll('td')[11].textContent.replace(/[^\d.-]/g, '')) > 0) {
      row.click();
      break;
    }
  }
}

async function duplicateRecord() {
  await awaitClickByQuery('.o_dropdown_toggler_btn', 2000, 1);
  await awaitClickByQuery('.o_dropdown_menu.show > a',300,1);
}

async function changeSelectionField(name, value) {
  documentQuerySelectorArray(`tr.o_selected_row>td>div[name="${name}"]>div>input`)[0].value = value;
  documentQuerySelectorArray(`tr.o_selected_row>td>div[name="${name}"]>div>input`)[0].dispatchEvent(new KeyboardEvent('keydown', {'key':'a'}));
  await awaitClickByQuery('ul.ui-autocomplete.ui-front.ui-menu>li', 1000);
}

async function changeSimpleField(name, value) {
  $(`[name=${name}]`).val(value);
  $(`[name=${name}]`).trigger("change");
}

async function deleteNegativeLines() {
  await awaitClickByQuery('th', 100, 12, 50);
  for (let row of documentQuerySelectorArray('table.o_section_and_note_list_view tbody tr.o_data_row')) {
    if (parseFloat(row.querySelectorAll('td')[13].textContent.replace(/[^\d.-]/g, '')) <= 0) {
      row.querySelectorAll('td')[14].click();
    }
  }
}

async function openInvoiceFromCSRM() {
  let inv;
  await awaitClickByName('sale_id');
  await waitForName('action_view_invoice',500, 60, 500).then(() => {
    inv = +document.getElementByNamesArray('invoice_count')[0]
      .querySelectorArray('.o_stat_value')[0].textContent;
  })
  await awaitClickByName('action_view_invoice',200, 0, 30, 1000);
  if (inv > 1) await choosePositiveInvoice();
}

function updateAmount(amount) {
  taxCoefficient = [...documentQuerySelectorArray('.o_badge_text')].reduce((sum, span) => {
    const num = parseFloat(span.textContent.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? sum : sum + num;
  }, 0) / 100 + 1;
  untaxed = amount / taxCoefficient;
  untaxed = Number(untaxed.toFixed(2));
  changeSimpleField('price_unit', untaxed);
}

async function newInvoice(amount) {
  await openInvoiceFromCSRM();
  await sleep(1000);
  await duplicateRecord();
  await sleep(1000);
  await deleteNegativeLines();
  await awaitClickByQuery('.o_data_row td',500,2);
  await changeSelectionField('account_id', '22405');
  await changeSimpleField('quantity',1);
  // amount = 7223.99;
  updateAmount(amount);
}

await newInvoice(531.26)