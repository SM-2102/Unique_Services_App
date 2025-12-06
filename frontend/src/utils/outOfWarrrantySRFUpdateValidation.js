/**
 * Validate change password form fields
 * @param {object} form
 * @returns {object} errors object
 */

function parseDDMMYYYY(dateStr) {
  if (!dateStr) return NaN;
  const [dd, mm, yyyy] = dateStr.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
}

function validateOutOfWarrantyUpdate(form) {
  const errs = [];
  const errs_label = {};
  // Validate each spare row (max 6)
  for (let i = 1; i <= 6; i++) {
    const desc = form[`spare${i}`];
    const qty = form[`cost${i}`];
    // Only validate if description is present
    if (desc && !qty) {
      errs.push(`Cost for Spare ${i} is required`);
      errs_label[`cost${i}`] = true;
    }
  }
  if (!form.vendor_date1 && form.vendor_date2)  {
    errs.push("Create Challan First");
    errs_label["vendor_date1"] = true;
  }
  if (form.vendor_date1 && !form.vendor_date2 && form.repair_date)  {
    errs.push("Return Date Required");
    errs_label["repair_date"] = true;
  }
  if (form.repair_date && !form.estimate_date)  {
    errs.push("Estimate Date Required");
    errs_label["estimate_date"] = true;
  }
  if (form.estimate_date && form.vendor_date1 && !form.vendor_date2)  {
    errs.push("Return Date Required");
    errs_label["vendor_date2"] = true;
  }
  if(!form.repair_date && form.delivery_date) {
    errs.push("Repair Date Required");
    errs_label["repair_date"] = true;
  }
  if(form.vendor_cost1 > 0 && (!form.vendor_date1 || !form.vendor_date2)) {
    errs.push("Vendor Dates Required for Cost to Vendor");
    errs_label["vendor_date1"] = true;
    errs_label["vendor_date2"] = true;
  }
  if (form.vendor_date1 && form.vendor_date2) {
    const vendorDate1 = new Date(form.vendor_date1);
    const vendorDate2 = new Date(form.vendor_date2);
    if (!isNaN(vendorDate1) && !isNaN(vendorDate2)) {
      if (vendorDate1 > vendorDate2) {
        errs.push("Invalid Return Date");
        errs_label["vendor_date2"] = true;
        errs_label["vendor_date1"] = true;
      }
    }
  }

  if (form.estimate_date) {
    const estimateDate = new Date(form.estimate_date);
    const srfDate = parseDDMMYYYY(form.srf_date);
    if (!isNaN(estimateDate) && !isNaN(srfDate)) {
      if (srfDate > estimateDate) {
        errs.push("Invalid Estimate Date");
        errs_label["estimate_date"] = true;
      }
    }
  }

  if(form.estimate_date && form.repair_date) {
    const estimateDate = new Date(form.estimate_date);
    const repairDate = new Date(form.repair_date);
    if (!isNaN(estimateDate) && !isNaN(repairDate)) {
      if (estimateDate > repairDate) {
        errs.push("Invalid Repair Date");
        errs_label["repair_date"] = true;
      }
    }
  }

  if(form.vendor_date2 && form.repair_date) {
    const vendorDate2 = new Date(form.vendor_date2);
    const repairDate = new Date(form.repair_date);
    if (!isNaN(vendorDate2) && !isNaN(repairDate)) {
      if (vendorDate2 > repairDate) {
        errs.push("Invalid Repair Date");
        errs_label["repair_date"] = true;
      }
    }
  }
  if(form.repair_date && form.delivery_date) {
    const repairDate = new Date(form.repair_date);
    const deliveryDate = new Date(form.delivery_date);
    if (!isNaN(repairDate) && !isNaN(deliveryDate)) {
      if (repairDate > deliveryDate) {
        errs.push("Invalid Delivery Date");
        errs_label["delivery_date"] = true;
      }
    }
  }
  const minRewinding = form.vendor_cost1 * 1.2;

  if (form.rewinding_cost) {
    if (form.rewinding_cost < minRewinding) {
      errs.push(`Minimum rewinding_cost : ${minRewinding.toFixed(2)})`);
      errs_label["rewinding_cost"] = true;
    }
  }

  if(form.delivery_date && !form.work_done) {
    errs.push("Work Done is required");
    errs_label["work_done"] = true;
  }

  if(form.delivery_date && form.receive_amount != form.final_amount) {
    errs.push("Full Payment Not Received");
    errs_label["receive_amount"] = true;
  }
  if(form.final_status === 'Y') {
    if(!form.delivery_date) {
      errs.push("Delivery Date is required");
      errs_label["delivery_date"] = true;
    }
    if(!form.pc_number && form.gst === 'N') {
      errs.push("PC Number is required");
      errs_label["pc_number"] = true;
    }
    if(!form.invoice_number && form.gst === 'Y') {
      errs.push("Invoice Number is required");
      errs_label["invoice_number"] = true;
    }
  }


  return [errs, errs_label];
}

export { validateOutOfWarrantyUpdate };
