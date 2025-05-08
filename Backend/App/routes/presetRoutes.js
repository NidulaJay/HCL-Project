const express = require("express");
const router = express.Router();
const Preset = require("../models/presetModel");

router.post("/:userId", async (req, res) => {
  try {
    const { name, color, size, model } = req.body;
    const userId = req.params.userId;

    if (!Number.isInteger(Number(size))) {
      return res.status(400).json({ message: "Size must be an integer" });
    }

    const newPreset = await Preset.create({
      color,
      size: Number(size),
      model,
      user: userId,
      name: name
    });

    payload = {
      id: newPreset._id,
      name: newPreset.name,
      color: newPreset.color,
      size: newPreset.size,
      model: newPreset.model
    }

    res.status(200).json(payload);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const presets = await Preset.find({ user: userId });


    const payload = presets.map((preset) => ({
      id: preset._id,
      name: preset.name,
      color: preset.color,
      size: preset.size,
      model: preset.model
    }));

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:presetId", async (req, res) => {
  try {
    const { name, color, size, model } = req.body;
    const presetId = req.params.presetId;

    if (size !== undefined && !Number.isInteger(Number(size))) {
      return res.status(400).json({ message: "Size must be an integer" });
    }

    const updatedPreset = await Preset.findByIdAndUpdate(
      presetId,
      {
        ...(name && {name}),
        ...(color && { color }),
        ...(size !== undefined && { size: Number(size) }),
        ...(model && { model }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPreset) {
      return res.status(404).json("Failed");
    }

    payload = {
      id: updatedPreset._id,
      name: updatedPreset.name,
      color: updatedPreset.color,
      size: updatedPreset.size,
      model: updatedPreset.model
    }

    res.status(200).json(payload);
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
      return res.status(404).json(false);
    }

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(false);
  }
});

router.get("/:presetId", async (req, res) => {
  try {
    const presetId = req.params.presetId;
    const preset = await Preset.findById(presetId);

    if (!preset) {
      return res.status(404).json({success: false, message: "Preset not found",});
    }

    payload = {
      id: preset._id,
      name: preset.name,
      color: preset.color,
      size: preset.size,
      model: preset.model
    }

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

module.exports = router;