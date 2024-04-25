const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");
// const User = require("../models/User");

//@desc     Get all bookings
//@route    Get /api/v1/bookings
//@access   Private
exports.getBookings = async (req, res, next) => {
  let query;
  //General users can see only their bookings!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "dentist",
      select: "name experience area",
    });
  } else {
    if (req.params.dentistId) {
      query = Booking.find({ dentist: req.params.dentistId }).populate({
        path: "dentist",
        select: "name experience area",
      });
    } else {
      query = Booking.find().populate({
        path: "dentist",
        select: "name experience area",
      });
    }
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find Booking",
    });
  }
};

//@desc     Get one booking
//@route    Get /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "dentist",
      select: "name experience area",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: `Cannot find Booking`,
    });
  }
};

//@desc     Add single booking
//@route    POST /api/v1/dentists/:dentistId/bookings/
//@access   Private
exports.addBooking = async (req, res, next) => {
  try {
    // Check if the user already has an active booking
    const existingBooking = await Booking.findOne({
      user: req.user.id,
    });

    // If an booking exists, prevent creating a new one
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "User already has an active booking",
      });
    }

    // Proceed to create a new booking if no existing one is found
    const booking = await Booking.create({
      apptDate: req.body.apptDate,
      user: req.user.id,
      dentist: req.params.dentistId,
    });

    req.booking = booking;
    req.dentist = await Dentist.findById(req.params.dentistId);

    console.log("Create booking successfully");

    res.status(201).json({
      success: true,
      data: booking,
    });

    next();
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot create booking",
    });
  }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: `No appt with id ${req.params.id}` });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    req.booking = booking;
    req.dentist = await Dentist.findById(req.booking.dentist.toString());

    res.status(200).json({ success: true, data: req.booking });

    next();
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: `No appt with id ${req.params.id}` });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
