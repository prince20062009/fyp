import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: false
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: false
  },
  diagnosis: {
    type: String,
    required: false
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid", "overdue", "cancelled"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "bank_transfer", "card", "cash", "razorpay"],
    required: false
  },
  paymentDetails: {
    transactionId: {
      type: String,
      required: false
    },
    upiId: {
      type: String,
      required: false
    },
    bankAccount: {
      type: String,
      required: false
    },
    paymentDate: {
      type: Date,
      required: false
    }
  },
  dueDate: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const Billing = mongoose.model("Billing", billingSchema);