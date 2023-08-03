async function choosePositiveInvoice() {
  await awaitClickByQuery('th.o_list_number_th', 3000);
  for (let row of document.querySelectorArray('.o_data_row')) {
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
  document.querySelectorArray(`tr.o_selected_row>td>div[name="${name}"]>div>input`)[0].value = value;
  document.querySelectorArray(`tr.o_selected_row>td>div[name="${name}"]>div>input`)[0].dispatchEvent(new KeyboardEvent('keydown', {'key':'a'}));
  await awaitClickByQuery('ul.ui-autocomplete.ui-front.ui-menu>li', 1000);
}

async function changeFormField(name, value) {
  document.getElementByNamesArray(name)[0].value = value;
  document.getElementByNamesArray(name)[0].dispatchEvent(new KeyboardEvent('keydown', {'key':'a'}));
}

async function changeSimpleField(name, value) {
  let selector = `[name=${name}]`;
  $(selector).val(value);
  $(selector).trigger("change");
}

function findColumnIndexByName(name) {
  return [...document.querySelectorArray('th')].findIndex(row => row.textContent === name);
}

async function deleteNegativeLines() {
  await awaitClickByQuery('th', 100, 12, 50);
  await sleep(500);
  let subtotal = findColumnIndexByName('Subtotal');
  let product = findColumnIndexByName('Product');
  // console.log(subtotal, product);
  for (let row of document.querySelectorArray('table.o_section_and_note_list_view tbody tr.o_data_row')) {
    console.log(parseFloat(row.querySelectorAll('td')[subtotal].textContent.replace(/[^\d.-]/g, '')));
    if (parseFloat(row.querySelectorAll('td')[subtotal].textContent.replace(/[^\d.-]/g, '')) <= 0
      || row.querySelectorArray('td')[product].textContent.includes('Delivery_007')) {
      row.querySelectorAll('[name="delete"]')[0].click();
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

async function openInvoiceFromSO() {
  let inv;
  inv = +document.getElementByNamesArray('invoice_count')[0]
    .querySelectorArray('.o_stat_value')[0].textContent;
  await awaitClickByName('action_view_invoice',200, 0, 30, 1000);
  if (inv > 1) await choosePositiveInvoice();
}

async function updateAmount(amount) {
  let taxCoefficient = [...document.querySelectorArray('.o_badge_text')].reduce((sum, span) => {
    const num = parseFloat(span.textContent.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? sum : sum + num;
  }, 0) / 100 + 1;
  let untaxed = amount / taxCoefficient;
  untaxed = Number(untaxed.toFixed(2));
  await changeSimpleField('price_unit', untaxed);
}

async function newInvoice(amount) {
  await duplicateRecord();
  await sleep(1000);
  await deleteNegativeLines();
  await awaitClickByQuery('.o_data_row td',500,2);
  await changeSelectionField('account_id', '22405');
  await changeSimpleField('quantity',1);
  // amount = 7223.99;
  await updateAmount(amount);
}

async function newInvoiceFromCSRM(amount) {
  await openInvoiceFromCSRM();
  await sleep(1000);
  await newInvoice(amount);
}
nic = newInvoiceFromCSRM

async function newInvoiceFromSO(amount) {
  await openInvoiceFromSO();
  await sleep(1000);
  await newInvoice(amount);
}
nis = newInvoiceFromSO

async function editCreditNote(amount) {
  await awaitClickByQuery('.o_form_button_edit');
  await changeSimpleField('reason_code', '"Customer - Order Mistake"');
  await deleteNegativeLines();
  await awaitClickByQuery('.o_data_row td', 500, 2);
  await changeSelectionField('account_id', '22405');
  await awaitClickByQuery('.modal-footer .btn-primary', 300);
  await changeSelectionField('credit_sale_line_id2', '111');
  await changeSimpleField('quantity', 1);
  // amount = 7223.99;
  await updateAmount(amount);
}

async function newCreditNoteFromInvoice(amount) {
  await awaitClickByName('269');
  await awaitClickByName('invoice_refund');
  await awaitClickByQuery('.o_data_row td', 1000, 2);
  await sleep(1000);
  await editCreditNote(amount);
}

async function newCreditNote(amount) {
  await newInvoice(amount);
  await sleep(1000);
  await InvoiceToCreditNote();
}

async function newCreditNoteFromSO(amount) {
  await openInvoiceFromSO();
  await sleep(1000);
  await newCreditNote(amount);
}
ncs = newCreditNoteFromSO

async function newCreditNoteFromCSRM(amount) {
  await openInvoiceFromCSRM();
  await sleep(1000);
  await newCreditNote(amount);
}
ncc = newCreditNoteFromCSRM

async function creditNoteToInvoice() {
  await changeSimpleField('type','"out_invoice"');
}
ctoi = creditNoteToInvoice

async function InvoiceToCreditNote() {
  await changeSimpleField('type','"out_refund"');
  await changeSimpleField('reason_code', '"Customer - Order Mistake"');
}
itoc = InvoiceToCreditNote

async function copyActiveLine(amount) {
  // Create an additional line if can't fix the discrepancy for couple pennies
  console.log('not finished')
}

async function getActiveLineValueByColumnName(name) {
  let index = await findColumnIndexByName(name);
  return document.querySelectorArray(`tr.o_selected_row>td`)[index].querySelectorArray('div>div>input')[0].value.replace(/\[.*?\] /, '');
}