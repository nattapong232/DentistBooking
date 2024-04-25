const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    experience: {
      type: Number,
      required: [true, "Please add year of experience"],
      min: 0,
    },
    area: {
      type: String,
      required: [true, "Please add an area of expertise"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Reverse populate
DentistSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "dentist",
  justOne: false,
});

//Cascade delete bookings when a dentist is deleted
DentistSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Bookings with dentist ${this._id} being removed`);
    await this.model("Booking").deleteMany({ dentist: this._id });
    next();
  }
);

module.exports = mongoose.model("Dentist", DentistSchema);
