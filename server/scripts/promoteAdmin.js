import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";
import { normalizeAdminEmail } from "../utils/adminEmails.js";

dotenv.config();

const TARGET_EMAILS = [
  "karansharma202005@gmail.com",
  "karansharma20205@gmail.com",
].map(normalizeAdminEmail);

async function promoteAdmin() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URI_FALLBACK;
  if (!uri) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  for (const email of TARGET_EMAILS) {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true }
    );

    if (user) {
      console.log(`Promoted to admin: ${user.email} (${user.username})`);
    }
  }

  const fuzzy = await User.findOneAndUpdate(
    { email: { $regex: /^karansharma.*@gmail\.com$/i } },
    { $set: { role: "admin" } },
    { new: true }
  );

  if (fuzzy && !TARGET_EMAILS.includes(normalizeAdminEmail(fuzzy.email))) {
    console.log(`Promoted to admin (matched): ${fuzzy.email} (${fuzzy.username})`);
  }

  const admins = await User.find({ role: "admin" })
    .select("username email role")
    .lean();

  console.log("\nCurrent admins:");
  admins.forEach((u) => console.log(`  - ${u.email} (${u.username})`));

  await mongoose.disconnect();
  process.exit(0);
}

promoteAdmin().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
