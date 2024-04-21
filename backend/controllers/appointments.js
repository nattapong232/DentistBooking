const Appointment = require("../models/Appointment");
const Dentist = require("../models/Dentist");
// const User = require("../models/User");

//@desc     Get all appointments
//@route    Get /api/v1/appointments
//@access   Private
exports.getAppointments = async (req, res, next) => {
  let query;
  //General users can see only their appointments!
  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "dentist",
      select: "name province tel",
    });
  } else {
    if (req.params.dentistId) {
      query = Appointment.find({ dentist: req.params.dentistId }).populate({
        path: "dentist",
        select: "name province tel",
      });
    } else {
      query = Appointment.find().populate({
        path: "dentist",
        select: "name province tel",
      });
    }
  }
  try {
    const appointments = await query;
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find Appointment",
    });
  }
};

//@desc     Get one appointment
//@route    Get /api/v1/appointments/:id
//@access   Public
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "dentist",
      select: "name description tel",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: `Cannot find Appointment`,
    });
  }
};

//@desc     Add single appointment
//@route    POST /api/v1/dentists/:dentistId/appointments/
//@access   Private
exports.addAppointment = async (req, res, next) => {
  try {
    // Check if the user already has an active appointment
    const existingAppointment = await Appointment.findOne({
      user: req.user.id,
    });

    // If an appointment exists, prevent creating a new one
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "User already has an active appointment",
      });
    }

    // Proceed to create a new appointment if no existing one is found
    const appointment = await Appointment.create({
      apptDate: req.body.apptDate,
      user: req.user.id,
      dentist: req.params.dentistId,
    });

    req.appointment = appointment;
    req.dentist = await Dentist.findById(req.params.dentistId);

    console.log("Create booking successfully");

    res.status(201).json({
      success: true,
      data: appointment,
    });

    next();
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot create appointment",
    });
  }
};

//@desc     Update appointment
//@route    PUT /api/v1/appointments/:id
//@access   Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: `No appt with id ${req.params.id}` });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    req.appointment = appointment;
    req.dentist = await Dentist.findById(req.appointment.dentist.toString());

    res.status(200).json({ success: true, data: req.appointment });

    next();
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Appointment" });
  }
};

//@desc     Delete appointment
//@route    DELETE /api/v1/appointments/:id
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: `No appt with id ${req.params.id}` });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this appointment`,
      });
    }

    await appointment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Appointment" });
  }
};
