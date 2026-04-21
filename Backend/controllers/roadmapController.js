import { Roadmap } from "../models/roadmapModel.js"

export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({})
      .sort({ title: 1 })
      .lean()

    res.status(200).json({
      success: true,
      count: roadmaps.length,
      roadmaps: roadmaps.map((roadmap) => ({
        ...roadmap,
        id: roadmap.roadmapId
      }))
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ roadmapId: req.params.id }).lean()
    if (!roadmap) {
      return res.status(404).json({ success: false, message: "Roadmap not found" })
    }

    res.status(200).json({
      success: true,
      roadmap: {
        ...roadmap,
        id: roadmap.roadmapId
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
