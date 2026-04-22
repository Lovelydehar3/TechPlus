import dotenv from "dotenv"
import { connectDB } from "../database/db.js"
import { seedPlaylistsFromCatalog } from "../services/playlistCatalogSeed.js"

dotenv.config()

const reset = process.argv.includes("--reset")

async function run() {
  await connectDB()

  const result = await seedPlaylistsFromCatalog({ reset })

  if (!result.inserted && !reset) {
    console.log("Playlists already in database. Run with --reset to replace.")
  } else if (result.inserted) {
    console.log(`Seeded ${result.count} playlists.`)
  }

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
