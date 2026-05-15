import { Roadmap } from "../models/roadmapModel.js"
import cacheService from "../services/cacheService.js"

export const getRoadmaps = async (req, res) => {
  try {
    // Use cache with 30 minute TTL (roadmaps rarely change)
    const roadmaps = await cacheService.getOrCompute(
      'roadmaps-all-v2',
      () => Roadmap.find({})
        .select('roadmapId title badge description color pdfPath steps')
        .sort({ title: 1 })
        .lean(),
      30 * 60 * 1000 // 30 minutes
    );

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
