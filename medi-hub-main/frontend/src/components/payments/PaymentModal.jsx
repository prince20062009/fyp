import { useState } from "react";
import { toast } from "react-toastify";
import { updateBillPayment } from "../../utils/api";
import PropTypes from "prop-types";

const PaymentModal = ({ bill, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate required fields based on payment method
      if (paymentMethod === "upi" && !upiId) {
        toast.error("Please enter UPI ID");
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === "bank_transfer" && !bankAccount) {
        toast.error("Please enter bank account details");
        setIsProcessing(false);
        return;
      }

      if (!transactionId) {
        toast.error("Please enter transaction ID");
        setIsProcessing(false);
        return;
      }

      // Prepare payment data
      const paymentData = {
        status: "paid",
        paymentMethod,
        paymentDetails: {
          transactionId,
          paymentDate: new Date().toISOString()
        }
      };

      // Add method-specific details
      if (paymentMethod === "upi") {
        paymentData.paymentDetails.upiId = upiId;
      } else if (paymentMethod === "bank_transfer") {
        paymentData.paymentDetails.bankAccount = bankAccount;
      }

      // Update bill payment status
      await updateBillPayment(bill._id, paymentData);
      
      toast.success("Payment processed successfully!");
      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Make Payment</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">Bill Amount: ₹{bill.totalAmount}</p>
          <p className="text-gray-600">Bill ID: {bill._id}</p>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`py-2 px-4 border rounded-md text-center ${
                  paymentMethod === "upi"
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`py-2 px-4 border rounded-md text-center ${
                  paymentMethod === "bank_transfer"
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Bank Transfer
              </button>
            </div>
          </div>

          {paymentMethod === "upi" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g., username@upi"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI ID (e.g., mobile@upi)
              </p>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Details
              </label>
              <textarea
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Enter bank name, account number, IFSC code"
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide your bank account details for transfer
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction reference"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the UPI or bank transfer reference number
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  bill: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired
};

export default PaymentModal;