const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

const { sendConfirmationEmail } = require("../middleware/mail");

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "user"), addBooking, sendConfirmationEmail);
router
  .route("/:id")
  .get(protect, getBooking)
  .put(
    protect,
    authorize("admin", "user"),
    updateBooking,
    sendConfirmationEmail
  )
  .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;
