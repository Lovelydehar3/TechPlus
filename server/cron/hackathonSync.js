import cron from 'node-cron';
import { syncHackathonsFromAPI } from '../services/hackathonService.js';

// ============ SYNC HACKATHONS EVERY 12 HOURS ============
export const startHackathonSyncJob = () => {
  // Run at 00:00 and 12:00 every day
  const task = cron.schedule('0 0,12 * * *', async () => {
    try {
      await syncHackathonsFromAPI();
    } catch {
      /* scheduled sync failure is non-fatal */
    }
  });

  syncHackathonsFromAPI().catch(() => {});

  return task;
};
