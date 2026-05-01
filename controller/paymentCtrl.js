const crypto = require("crypto");

const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_HSSeDI22muUrLR",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "sRO0YkBxvgMg0PvWHJN16Uf7",
});

const checkout = async (req, res) => {
  const { amount } = req.body;
  const option = {
    amount: amount * 100,  // Razorpay expects amount in paise
    currency: "INR",
  };
  try {
    const order = await instance.orders.create(option);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
  // Generate expected signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "sRO0YkBxvgMg0PvWHJN16Uf7")
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  // Verify signature
  if (generatedSignature === razorpaySignature) {
    res.json({
      success: true,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: "paid",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  checkout,
  paymentVerification,
};
