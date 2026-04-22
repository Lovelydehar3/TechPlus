import mongoose from "mongoose";
import { Hackathon } from "../models/hackathonModel.js";
import { syncHackathonsFromAPI } from "../services/hackathonService.js";
import dotenv from "dotenv";

dotenv.config();

async function seedHackathons() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Hackathon.deleteMany({});
    console.log("Cleared existing hackathons");

    const result = await syncHackathonsFromAPI();
    console.log(`Seeded ${result.createdCount} hackathons`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding hackathons:", error.message);
    process.exit(1);
  }
}

seedHackathons();
