import asyncHandler from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { ApiError } from "../utilis/ApiError.js";
import { Billing } from "../models/billing.model.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

// Create a new bill
export const createBill = asyncHandler(async (req, res) => {
    const { patient, doctor, appointment, diagnosis, items, tax, discount, notes, dueDate } = req.body;
    
    // Validate required fields
    if (!patient || !items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Patient and items are required");
    }
    
    // Only doctors and admins can create bills
    if (req.user && req.user.role !== "Doctor" && req.user.role !== "Admin") {
        throw new ApiError(403, "Access denied. Only doctors and admins can create bills.");
    }
    
    // If doctor is creating the bill, set the doctor field
    let doctorId = doctor;
    if (req.user && req.user.role === "Doctor") {
        doctorId = req.user._id;
    }
    
    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map(item => {
        const totalPrice = item.quantity * item.unitPrice;
        subtotal += totalPrice;
        return {
            ...item,
            totalPrice
        };
    });
    
    const totalAmount = subtotal + (tax || 0) - (discount || 0);
    
    // Create the bill
    const bill = await Billing.create({
        patient,
        doctor: doctorId,
        appointment: appointment || null,
        diagnosis: diagnosis || null,
        items: processedItems,
        subtotal,
        tax: tax || 0,
        discount: discount || 0,
        totalAmount,
        notes,
        dueDate: dueDate ? new Date(dueDate) : null
    });
    
    // Populate patient and doctor details
    const createdBill = await Billing.findById(bill._id)
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName email department")
        .populate("appointment");
    
    return res.status(201).json(
        new ApiResponse(201, createdBill, "Bill created successfully")
    );
});

// Get all bills for a patient
export const getPatientBills = asyncHandler(async (req, res) => {
    const patientId = req.user._id;
    
    const bills = await Billing.find({ patient: patientId })
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName department")
        .populate("appointment")
        .sort({ createdAt: -1 });
    
    // For patients, only show limited information
    const patientBillsView = bills.map(bill => ({
        _id: bill._id,
        totalAmount: bill.totalAmount,
        status: bill.status,
        createdAt: bill.createdAt,
        dueDate: bill.dueDate,
        paymentOptions: ["upi", "bank_transfer", "card", "cash", "razorpay"]
    }));
    
    return res.status(200).json(
        new ApiResponse(200, patientBillsView, "Bills fetched successfully")
    );
});

// Get all bills created by a doctor
export const getDoctorBills = asyncHandler(async (req, res) => {
    const doctorId = req.user._id;
    
    const bills = await Billing.find({ doctor: doctorId })
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName department")
        .populate("appointment")
        .sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, bills, "Bills fetched successfully")
    );
});

// Get all bills (admin only)
export const getAllBills = asyncHandler(async (req, res) => {
    // Only admins can access all bills
    if (req.user.role !== "Admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }
    
    const bills = await Billing.find({})
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName department")
        .populate("appointment")
        .sort({ createdAt: -1 });
    
    // Enhance the bills with additional payment history information
    const enhancedBills = bills.map(bill => ({
        ...bill.toObject(),
        paymentHistory: {
            hasBeenPaid: bill.status === "paid",
            paymentDate: bill.paymentDetails?.paymentDate || null,
            paymentMethod: bill.paymentMethod || null,
            transactionId: bill.paymentDetails?.transactionId || null
        }
    }));
    
    return res.status(200).json(
        new ApiResponse(200, enhancedBills, "All bills fetched successfully")
    );
});

// Get a specific bill by ID
export const getBillById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const bill = await Billing.findById(id)
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName department")
        .populate("appointment");
    
    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }
    
    // Check if user has permission to view this bill
    if (req.user.role !== "Admin" && 
        req.user.role !== "Doctor" && 
        bill.patient._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied. You don't have permission to view this bill.");
    }
    
    // For patients, only show limited information
    if (req.user.role === "Patient") {
        const patientBillView = {
            _id: bill._id,
            totalAmount: bill.totalAmount,
            status: bill.status,
            createdAt: bill.createdAt,
            dueDate: bill.dueDate,
            paymentOptions: ["upi", "bank_transfer", "card", "cash", "razorpay"]
        };
        return res.status(200).json(
            new ApiResponse(200, patientBillView, "Bill fetched successfully")
        );
    }
    
    return res.status(200).json(
        new ApiResponse(200, bill, "Bill fetched successfully")
    );
});

// Update bill status and payment details
export const updateBillPayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentMethod, paymentDetails } = req.body;
    
    const bill = await Billing.findById(id);
    
    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }
    
    // Check if user has permission to update this bill
    if (req.user.role !== "Admin" && 
        req.user.role !== "Doctor" && 
        bill.patient._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied. You don't have permission to update this bill.");
    }
    
    // Update bill
    bill.status = status || bill.status;
    bill.paymentMethod = paymentMethod || bill.paymentMethod;
    bill.paymentDetails = paymentDetails || bill.paymentDetails;
    
    if (status === "paid" && !bill.paymentDetails.paymentDate) {
        bill.paymentDetails.paymentDate = new Date();
    }
    
    const updatedBill = await bill.save();
    
    // Populate details
    await updatedBill.populate([
        { path: "patient", select: "firstName lastName email" },
        { path: "doctor", select: "firstName lastName department" },
        { path: "appointment" }
    ]);
    
    return res.status(200).json(
        new ApiResponse(200, updatedBill, "Bill updated successfully")
    );
});

// Delete a bill (admin only)
export const deleteBill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Only admins can delete bills
    if (req.user.role !== "Admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }
    
    const bill = await Billing.findByIdAndDelete(id);
    
    if (!bill) {
        throw new ApiError(404, "Bill not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, null, "Bill deleted successfully")
    );
});