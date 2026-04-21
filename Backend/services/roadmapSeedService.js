import { Roadmap } from "../models/roadmapModel.js"
import {
  ROADMAPS,
  ROADMAP_QUESTIONS,
  COURSE_SUGGESTIONS
} from "../data/roadmapData.js"

export async function ensureRoadmapsSeeded() {
  const existing = await Roadmap.countDocuments()
  if (existing > 0) {
    return { inserted: false, count: existing }
  }

  const documents = ROADMAPS.map((roadmap) => ({
    roadmapId: roadmap.id,
    title: roadmap.title,
    badge: roadmap.badge,
    description: roadmap.description,
    color: roadmap.color || "var(--accent-purple)",
    steps: roadmap.steps || [],
    questions: ROADMAP_QUESTIONS[roadmap.id] || [],
    courseSuggestions: COURSE_SUGGESTIONS[roadmap.id] || []
  }))

  if (documents.length > 0) {
    await Roadmap.insertMany(documents)
  }

  return { inserted: true, count: documents.length }
}
