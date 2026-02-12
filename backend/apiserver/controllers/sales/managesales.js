import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const salerouter = express.Router()
const DBSERVERURL = process.env.DBSERVERURL

salerouter.post('/addsale', async (req, res) => {
    try {
        const { sales, summary, payment, branchid, staffid } = req.body;


        /* ---------------- VALIDATION ---------------- */

        if (
            !Array.isArray(sales) ||
            sales.length === 0 ||
            !summary ||
            !summary.totalAmount ||
            !branchid ||
            !staffid ||
            !payment
        ) {
            return res.status(500).json({
                error: "Missing required sale data",
            });
        }

        /* ---------------- SALE MASTER DATA ---------------- */

        const saleUniqueId =
            Date.now().toString().slice(-9) +
            Math.floor(Math.random() * 100).toString().padStart(2, "0");

        const totalmode = payment.cash + payment.card + payment.upi

        const balance =
            summary.totalAmount > totalmode
                ? summary.totalAmount - totalmode
                : 0;

        const change =
            summary.totalAmount < totalmode
                ? totalmode - summary.totalAmount
                : 0;


        const saleMasterData = {
            branchId: branchid,

            billno: sales[0].billno,      // SI/73592
            saleUniqueId: saleUniqueId,   // GENERATED ID

            saleDate: sales[0].saledate,
            memberId: sales[0].memberid,
            creadtedBy: staffid,

            baseAmount: summary.totalBasePrice,
            discountAmount: summary.totalDiscount || 0,
            gstPercent: summary.totalGST || 0,
            gstAmount: summary.totalGST || 0,
            nettAmount: summary.totalAmount,
            paidAmount: totalmode,
            balance,
            change,
            paymentMode: {
                cash: payment.cash || 0,
                card: payment.card || 0,
                upi: payment.upi || 0,
            },
        };

        /* ---------------- MEMBER PLAN DATA ---------------- */

        const memberPlanData = [];

        for (const item of sales) {
            if (
                !item.plan ||
                !item.billno ||
                !item.duration ||
                Number(item.duration) <= 0
            ) {
                return res.status(500).json({
                    error: "Missing or invalid member plan fields",
                });
            }

            // Start date = TODAY (as you requested)
            const startDate = new Date();

            // Expiry = startDate + duration (months)
            const expiryDate = new Date(startDate);
            expiryDate.setMonth(expiryDate.getMonth() + Number(item.duration));

            memberPlanData.push({
                branchId: branchid,
                memberId: item.memberid,
                planId: item.plan,
                saleUniqueId: saleUniqueId, // SAME ID
                startDate: startDate.toISOString().split("T")[0],
                expiryDate: expiryDate.toISOString().split("T")[0],
                durationInMonths: Number(item.duration),
                allotedstaff: item.staff,
                isActive: true,
                isExpired: false,
            });
        }

        /* ---------------- CONSOLE OUTPUT ---------------- */
        const response = await axios.post(
            `${DBSERVERURL}/db/sales/addsale`,
            {
                saleMasterData,
                memberPlanData
            }
        );

        if (response.data.status !== "success") {
            res.json({
                status: "error",
                message: "Error in Handling the Sale",
            });
        }

        /* ---------------- TEMP RESPONSE ---------------- */

        res.json({
            status: response.data.status,
            message: "Sale Generated Successfully",
        });

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).json({
            error: "Internal server error",
        });
    }



});

export default salerouter;
