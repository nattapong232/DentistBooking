const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    apptDate: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    dentist: {
      type: mongoose.Schema.ObjectId,
      ref: "Dentist",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
