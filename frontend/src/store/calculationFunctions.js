function calculateGST(basePrice, gstPercent) {
    console.log("base: ", basePrice, "gst: ", gstPercent);

    const base = Number(basePrice) || 0;
    const gst = Number(gstPercent) || 0;

    const gstAmount = (base * gst) / 100;
    const total = base + gstAmount;

    return gstAmount
}
function calculateDiscount(basePrice, discountAmt, type) {
    console.log(basePrice, discountAmt, type);

    const base = Number(basePrice) || 0;
    const discount = Number(discountAmt) || 0;

    let discountAmount = 0;

    if (type === "6976d97a34585fb711fa6a29") {
        discountAmount = (base * discount) / 100;
    } else if (type === "6976d97a34585fb711fa6a28") {
        discountAmount = discount;
    }

    return discountAmount;
}


export { calculateGST, calculateDiscount };