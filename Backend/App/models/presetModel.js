const mongoose = require("mongoose");

const presetSchema = new mongoose.Schema(
  {
    name: {type: String, required: false, default: 'Sample Design'},
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
      validate: {
        validator: Number.isInteger,
        message: "Size must be an integer with no decimals",
      },
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Preset = mongoose.model("Preset", presetSchema);

module.exports = Preset;