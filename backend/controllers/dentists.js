const Dentist = require("../models/Dentist");

//@desc     Get all dentists
//@route    GET /api/v1/dentists
//@access   Public
exports.getDentists = async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  // console.log(reqQuery);

  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);
  // console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Dentist.find(JSON.parse(queryStr)).populate("bookings");

  //Select
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // console.log(req.query.select);

  //Sort
  if (req.query.sort) {
    const fields = (sortBy = req.query.sort.split(",").join(" "));
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Dentist.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const dentists = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: dentists.length,
      pagination,
      data: dentists,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get single dentists
//@route    GET /api/v1/dentists/:id
//@access   Public
exports.getDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Show dentist ${req.params.id}` });
};

//@desc     Create all dentists
//@route    POST /api/v1/dentists
//@access   Private
exports.createDentist = async (req, res, next) => {
  const dentist = await Dentist.create(req.body);
  res.status(201).json({ success: true, data: dentist });
};

//@desc     Update dentist
//@route    PUT /api/v1/dentists
//@access   Private
exports.updateDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete dentist
//@route    DELETE /api/v1/dentists
//@access   Private
exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    await dentist.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
