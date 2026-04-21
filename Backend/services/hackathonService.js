import axios from "axios";
import { Hackathon } from "../models/hackathonModel.js";

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80";

// Fully curated future-dated hackathon dataset (15 entries, India + Global)
function getFutureCuratedHackathons() {
  const now = Date.now();
  const d = (daysFromNow) => new Date(now + daysFromNow * 24 * 60 * 60 * 1000);

  return [
    {
      title: "Smart India Hackathon 2026 — Software Edition",
      description: "Nationwide student innovation marathon hosted across India with industry problem statements from top PSUs and ministries.",
      mode: "Hybrid", location: "Pan India (Multi-city finals)",
      startDate: d(30), endDate: d(32),
      prize: "₹10L+ in prizes", tags: ["India", "GovTech", "Open Innovation"],
      registrationLink: "https://www.sih.gov.in/",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
      platform: "Unstop", region: "IN"
    },
    {
      title: "HackIndia Spark 6.0",
      description: "India's largest Web3 & AI hackathon — 36-hour offline event with ₹50L+ in bounties across 20+ cities.",
      mode: "Offline", location: "Multiple Cities, India",
      startDate: d(45), endDate: d(47),
      prize: "₹50L+", tags: ["Web3", "AI", "Blockchain", "India"],
      registrationLink: "https://hackindia.org",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
      platform: "Manual", region: "IN"
    },
    {
      title: "ETHGlobal New Delhi",
      description: "Ethereum-focused build weekend with top Web3 mentors, protocol bounties, and hiring opportunities.",
      mode: "Offline", location: "New Delhi, India",
      startDate: d(55), endDate: d(57),
      prize: "$50k in sponsor prizes", tags: ["Web3", "Ethereum", "DeFi", "India"],
      registrationLink: "https://ethglobal.com/",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
      platform: "Devpost", region: "IN"
    },
    {
      title: "Unstop Campus League — Tech Track",
      description: "Inter-college hackathon league with 500+ participating colleges, hiring partner showcases, and internship offers.",
      mode: "Online", location: "India (Online)",
      startDate: d(20), endDate: d(22),
      prize: "Internships + ₹5L cash", tags: ["Campus", "India", "Hiring", "Web"],
      registrationLink: "https://unstop.com/",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
      platform: "Unstop", region: "IN"
    },
    {
      title: "Google Developer Groups — Cloud Hackathon",
      description: "Hands-on Kubernetes, Cloud Run, and Firebase mini-hack with Google engineers as mentors. Certifications for all participants.",
      mode: "Online", location: "Global (Online)",
      startDate: d(12), endDate: d(13),
      prize: "Cloud credits + Certifications", tags: ["Cloud", "GCP", "Firebase", "Global"],
      registrationLink: "https://developers.google.com/events",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
      platform: "Manual", region: "Global"
    },
    {
      title: "DevFest Bengaluru Build Day",
      description: "Regional DevFest build track with Firebase, AI tooling, and Google sponsor prizes. Great for beginners and pros alike.",
      mode: "Hybrid", location: "Bengaluru, India",
      startDate: d(28), endDate: d(29),
      prize: "Sponsor grants + Swag", tags: ["Firebase", "India", "AI", "Beginner-Friendly"],
      registrationLink: "https://gdg.community.dev/",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
      platform: "Manual", region: "IN"
    },
    {
      title: "London Climate Tech Hack 2026",
      description: "Build sustainability, clean energy, and carbon tracking tools with EU climate-tech mentors and investors.",
      mode: "Hybrid", location: "London, UK",
      startDate: d(35), endDate: d(37),
      prize: "£25,000", tags: ["Climate", "EU", "Sustainability", "Hardware"],
      registrationLink: "https://climatehack.ai/",
      image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80",
      platform: "Devpost", region: "EU"
    },
    {
      title: "Singapore FinTech Build Week",
      description: "APAC-focused fintech prototypes — open banking APIs, payment rails, and RegTech challenges with S$40K prize pool.",
      mode: "Offline", location: "Singapore",
      startDate: d(40), endDate: d(42),
      prize: "S$40,000", tags: ["FinTech", "APAC", "OpenBanking", "APIs"],
      registrationLink: "https://fintechfestival.sg/",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
      platform: "Devpost", region: "APAC"
    },
    {
      title: "HackMol 8.0 — NIT Jalandhar",
      description: "Flagship 30-hour hackathon at NIT Jalandhar, bringing India's top student developers to solve real industry problems.",
      mode: "Hybrid", location: "NIT Jalandhar, Punjab, India",
      startDate: d(50), endDate: d(52),
      prize: "₹2.5L", tags: ["IoT", "Web", "Mobile", "India", "Student"],
      registrationLink: "https://hackmol.devfolio.co",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
      platform: "Manual", region: "IN"
    },
    {
      title: "GenAI Forge 2026",
      description: "India's largest remote GenAI hackathon — build autonomous agents, LLM apps, and AI-powered tools.",
      mode: "Online", location: "Remote",
      startDate: d(60), endDate: d(62),
      prize: "₹10L+", tags: ["AI", "GenAI", "LLM", "Agents", "India"],
      registrationLink: "https://devfolio.co/hackathons",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
      platform: "Manual", region: "IN"
    },
    {
      title: "MIT Reality Hack 2026",
      description: "Five-day AR/VR/XR hackathon at MIT Media Lab. Build immersive spatial computing experiences with Meta, Microsoft, and Apple mentors.",
      mode: "Offline", location: "MIT, Cambridge, USA",
      startDate: d(70), endDate: d(75),
      prize: "$15,000 + Hardware", tags: ["AR", "VR", "XR", "USA", "SpatialComputing"],
      registrationLink: "https://mitrealityhack.com/",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&q=80",
      platform: "Devpost", region: "US"
    },
    {
      title: "HealthTech Innovation Sprint",
      description: "48-hour online sprint developing AI diagnostics, telemedicine tools, and patient data solutions for India's healthcare system.",
      mode: "Online", location: "Remote",
      startDate: d(18), endDate: d(20),
      prize: "₹3L + Mentorship", tags: ["Healthcare", "AI", "Mobile", "India"],
      registrationLink: "https://devfolio.co/hackathons",
      image: "https://images.unsplash.com/photo-1576091160550-112173f7f8f0?w=600&q=80",
      platform: "Manual", region: "IN"
    },
    {
      title: "Hack the North 2026",
      description: "Canada's biggest hackathon at University of Waterloo — $100K in prizes, world-class mentors, and 3,000+ hackers.",
      mode: "Offline", location: "University of Waterloo, Canada",
      startDate: d(80), endDate: d(82),
      prize: "$100,000 CAD", tags: ["Global", "AI", "Web", "Mobile", "Canada"],
      registrationLink: "https://hackthenorth.com/",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
      platform: "Devpost", region: "CA"
    },
    {
      title: "Mumbai Smart City Hackathon",
      description: "48-hour offline hackathon focused on traffic management, waste reduction, and urban mobility for smart city challenges.",
      mode: "Offline", location: "Mumbai, Maharashtra, India",
      startDate: d(25), endDate: d(27),
      prize: "₹5L", tags: ["SmartCity", "IoT", "India", "Sustainability"],
      registrationLink: "https://unstop.com/hackathons",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      platform: "Unstop", region: "IN"
    },
    {
      title: "Devfolio Buildathon — Cybersecurity Track",
      description: "24-hour online hackathon for ethical hackers, security researchers, and CTF enthusiasts. Build security tools and win big.",
      mode: "Online", location: "Remote",
      startDate: d(15), endDate: d(16),
      prize: "₹2L + Job Offers", tags: ["Cybersecurity", "CTF", "India", "Security"],
      registrationLink: "https://devfolio.co/hackathons",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
      platform: "Devpost", region: "IN"
    }
  ];
}

function normalizeTitleKey(title) {
  return (title || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function dateKeyFromDate(d) {
  if (!d || Number.isNaN(new Date(d).getTime())) return null;
  return new Date(d).toISOString().slice(0, 10);
}

export function computeKeys(title, startDate) {
  return {
    titleKey: normalizeTitleKey(title),
    dateKey: dateKeyFromDate(startDate)
  };
}

async function removeDuplicateHackathonsByKey() {
  const seen = await Hackathon.aggregate([
    { $match: { titleKey: { $exists: true, $ne: null }, dateKey: { $exists: true, $ne: null } } },
    { $group: { _id: { t: "$titleKey", d: "$dateKey" }, ids: { $push: "$_id" }, n: { $sum: 1 } } },
    { $match: { n: { $gt: 1 } } }
  ]);

  for (const row of seen) {
    const [, ...rest] = row.ids.map((id) => id.toString());
    if (rest.length) await Hackathon.deleteMany({ _id: { $in: rest } });
  }
}

export const syncHackathonsFromAPI = async () => {
  try {
    await removeDuplicateHackathonsByKey();

    const curated = getFutureCuratedHackathons();
    let createdCount = 0;
    let skipped = 0;

    for (const raw of curated) {
      const { titleKey, dateKey } = computeKeys(raw.title, raw.startDate);
      if (!titleKey || !dateKey) { skipped++; continue; }

      const externalId = `${raw.platform}-${titleKey}-${raw.startDate.getTime()}`;

      try {
        const res = await Hackathon.updateOne(
          { titleKey, dateKey },
          {
            $setOnInsert: {
              titleKey, dateKey, externalId,
              title: raw.title,
              description: raw.description,
              platform: raw.platform,
              mode: raw.mode,
              location: raw.location,
              startDate: raw.startDate,
              endDate: raw.endDate,
              prize: raw.prize,
              tags: raw.tags,
              registrationLink: raw.registrationLink,
              image: raw.image || IMAGE_FALLBACK,
              participants: 0
            }
          },
          { upsert: true }
        );
        if (res.upsertedCount === 1) createdCount++;
        else skipped++;
      } catch {
        skipped++;
      }
    }

    return { createdCount, skipped, totalNormalized: curated.length };
  } catch (error) {
    return { error: error.message, createdCount: 0, skipped: 0, totalNormalized: 0 };
  }
};

function dedupeResponseDocs(docs) {
  const map = new Map();
  for (const h of docs) {
    const { titleKey, dateKey } = computeKeys(h.title, h.startDate);
    const key = titleKey && dateKey ? `${titleKey}|${dateKey}` : String(h._id);
    if (!map.has(key)) map.set(key, h);
  }
  return [...map.values()];
}

export const getAllHackathons = async (filters = {}) => {
  try {
    const query = {};
    if (filters.mode) query.mode = filters.mode;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { tags: { $in: [new RegExp(filters.search, "i")] } }
      ];
    }
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    // Always only show upcoming/ongoing events
    query.endDate = { $gte: new Date() };

    let hackathons = await Hackathon.find(query)
      .sort({ startDate: 1 })
      .limit(200)
      .lean();

    hackathons = dedupeResponseDocs(hackathons);
    hackathons = hackathons.map((h) => ({
      ...h,
      image: h.image && h.image.length ? h.image : IMAGE_FALLBACK
    }));

    return hackathons.slice(0, 50);
  } catch {
    return [];
  }
};

export const getHackathonById = async (id) => {
  try {
    const hackathon = await Hackathon.findById(id).lean();
    if (hackathon && !(hackathon.image && String(hackathon.image).trim())) {
      hackathon.image = IMAGE_FALLBACK;
    }
    return hackathon;
  } catch {
    return null;
  }
};

export const bookmarkHackathon = async (userId, hackathonId) => {
  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) throw new Error("Hackathon not found");

  if (hackathon.bookmarkedBy.some((bid) => bid.toString() === userId.toString())) {
    return { message: "Already bookmarked" };
  }

  await Hackathon.findByIdAndUpdate(hackathonId, { $push: { bookmarkedBy: userId } }, { new: true });
  return { success: true };
};

export const removeHackathonBookmark = async (userId, hackathonId) => {
  await Hackathon.findByIdAndUpdate(hackathonId, { $pull: { bookmarkedBy: userId } }, { new: true });
  return { success: true };
};

export const getUserBookmarkedHackathons = async (userId) => {
  try {
    const hackathons = await Hackathon.find({ bookmarkedBy: userId }).sort({ startDate: 1 });
    return hackathons.map((h) => ({
      ...h.toObject(),
      image: h.image && h.image.length ? h.image : IMAGE_FALLBACK
    }));
  } catch {
    return [];
  }
};
