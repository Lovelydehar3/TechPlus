import { Club } from "../models/clubModel.js";
import { ClubEvent } from "../models/clubEventModel.js";
import { Bookmark } from "../models/bookmarkModel.js";

// ─── Helper: admin gate ──────────────────────────────────────────────────────
const requireAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin only" });
    return false;
  }
  return true;
};

// ─── Seed default clubs if DB is empty ──────────────────────────────────────
export const ensureClubsSeeded = async () => {
  // Auto-migrate legacy "comic-club" documents if they exist
  try {
    await Club.updateOne(
      { slug: "comic-club" },
      {
        $set: {
          slug: "cosmic-club",
          name: "Cosmic Club",
          description: "Where art meets narrative. The Cosmic Club celebrates creativity through comics, illustration, and visual storytelling — from manga to superhero panels."
        }
      }
    );
  } catch (err) {
    console.error("[ClubSeed] Migration failed:", err.message);
  }

  const count = await Club.countDocuments();
  if (count > 0) return;

  await Club.insertMany([
    {
      slug: "cosmic-club",
      name: "Cosmic Club",
      tagline: "Art, Story & Imagination",
      description:
        "Where art meets narrative. The Cosmic Club celebrates creativity through comics, illustration, and visual storytelling — from manga to superhero panels.",
      logoUrl: "",
      isActive: true,
    },
    {
      slug: "data-science-club",
      name: "Data Science Club",
      tagline: "Data. Insights. Impact.",
      description:
        "Empowering students with cutting-edge data skills. We explore machine learning, AI, data visualization, and real-world analytics projects.",
      logoUrl: "",
      isActive: true,
    },
  ]);
  console.log("[ClubSeed] Default clubs seeded.");
};

// ============ GET ALL CLUBS ============
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true }).lean();
    return res.status(200).json({ success: true, clubs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clubs",
      error: error.message,
    });
  }
};

// ============ GET SINGLE CLUB BY SLUG ============
export const getClubBySlug = async (req, res) => {
  try {
    const club = await Club.findOne({ slug: req.params.slug }).lean();
    if (!club)
      return res.status(404).json({ success: false, message: "Club not found" });

    return res.status(200).json({ success: true, club });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch club",
      error: error.message,
    });
  }
};

// ============ GET EVENTS FOR A CLUB ============
export const getClubEvents = async (req, res) => {
  try {
    const club = await Club.findOne({ slug: req.params.slug }).lean();
    if (!club)
      return res.status(404).json({ success: false, message: "Club not found" });

    const events = await ClubEvent.find({ club: club._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

// ============ ADMIN: CREATE EVENT ============
export const createEvent = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const { clubId, title, description, image, venue, date, time, registrationUrl, status } =
      req.body;

    if (!clubId || !title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Club and event title are required",
      });
    }

    const club = await Club.findById(clubId);
    if (!club)
      return res.status(404).json({ success: false, message: "Club not found" });

    const event = await ClubEvent.create({
      club: clubId,
      title: title.trim(),
      description: description?.trim() || "",
      image: image?.trim() || "",
      venue: venue?.trim() || "",
      date: date?.trim() || "",
      time: time?.trim() || "",
      registrationUrl: registrationUrl?.trim() || "",
      status: status || "Upcoming",
    });

    return res.status(201).json({ success: true, event });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// ============ ADMIN: UPDATE EVENT ============
export const updateEvent = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { title, description, image, venue, date, time, registrationUrl, status } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const event = await ClubEvent.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description?.trim() || "",
        image: image?.trim() || "",
        venue: venue?.trim() || "",
        date: date?.trim() || "",
        time: time?.trim() || "",
        registrationUrl: registrationUrl?.trim() || "",
        status: status || "Upcoming",
      },
      { new: true, runValidators: true }
    );

    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    return res.status(200).json({ success: true, event });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// ============ ADMIN: DELETE EVENT ============
export const deleteEvent = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const event = await ClubEvent.findByIdAndDelete(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    // Clean up any bookmarks that reference this event's image
    if (event.image) {
      await Bookmark.deleteMany({ articleImage: event.image }).catch(() => {});
    }

    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// ============ ADMIN: GET ALL EVENTS (for management view) ============
export const getAllEvents = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const { clubId } = req.query;
    const filter = clubId ? { club: clubId } : {};
    const events = await ClubEvent.find(filter)
      .populate("club", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};
