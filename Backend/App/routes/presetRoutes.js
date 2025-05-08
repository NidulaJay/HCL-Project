const express = require("express");
const router = express.Router();
const Preset = require("../models/presetModel");

router.post("/:userId", async (req, res) => {
  try {
    const { color, size, model } = req.body;
    const userId = req.params.userId;

    if (!Number.isInteger(Number(size))) {
      return res.status(400).json({ message: "Size must be an integer" });
    }

    const newPreset = await Preset.create({
      color,
      size: Number(size),
      model,
      user: userId,
    });

    res.status(201).json({
      success: true,
      data: newPreset,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const presets = await Preset.find({ user: userId });

    res.status(200).json({
      success: true,
      count: presets.length,
      data: presets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:presetId", async (req, res) => {
  try {
    const { color, size, model } = req.body;
    const presetId = req.params.presetId;

    if (size !== undefined && !Number.isInteger(Number(size))) {
      return res.status(400).json({ message: "Size must be an integer" });
    }

    const updatedPreset = await Preset.findByIdAndUpdate(
      presetId,
      {
        ...(color && { color }),
        ...(size !== undefined && { size: Number(size) }),
        ...(model && { model }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPreset) {
      return res.status(404).json({
        success: false,
        message: "Preset not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPreset,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:presetId", async (req, res) => {
  try {
    const presetId = req.params.presetId;
    const deletedPreset = await Preset.findByIdAndDelete(presetId);

    if (!deletedPreset) {
      return res.status(404).json({
        success: false,
        message: "Preset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Preset deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/presetId", async (req, res) => {
  try {
    const presetId = req.query.presetId;
    const preset = await Preset.findById(presetId);

    if (!preset) {
      return res.status(404).json({success: false, message: "Preset not found",});
    }

    res.status(200).json({success: true, data: preset,});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

module.exports = router;
