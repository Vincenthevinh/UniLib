import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./db.js";
import { sweepExpiredHolds } from "./services/reservations.js";

const port = Number(process.env.PORT || 3001);
const server = app.listen(port, () => console.log("UniLib API on :" + port));
const sweepMs = Number(process.env.RESERVATION_SWEEP_MS || 60000);
if (Number.isFinite(sweepMs) && sweepMs > 0) {
  let sweeping = false;
  const timer = setInterval(async () => {
    if (sweeping) return;
    sweeping = true;
    try {
      const result = await sweepExpiredHolds();
      if (result.expired) console.log("Expired holds:", result.expired);
    } catch (error) {
      console.error("Reservation sweep failed:", error?.message || error);
    } finally {
      sweeping = false;
    }
  }, sweepMs);
  timer.unref();
}

process.on("SIGINT", async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});