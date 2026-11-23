import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") {
  throw new Error("Demo seed is blocked in production without explicit ALLOW_DEMO_SEED=true");
}

const prisma = new PrismaClient();
const now = new Date();
const day = 24 * 60 * 60 * 1000;
const demoPassword = process.env.DEMO_PASSWORD || "UniLibDemo!2026";

function id(group, index) {
  const h = crypto.createHash("sha256").update("UniLib-W1-" + group + "-" + index).digest("hex");
  const version = "4" + h.slice(13, 16);
  const variant = ((parseInt(h[16], 16) & 3) | 8).toString(16) + h.slice(17, 20);
  return [h.slice(0, 8), h.slice(8, 12), version, variant, h.slice(20, 32)].join("-");
}

const users = [
  { username: "admin", role: "Administrator", fullName: "Demo Administrator" },
  { username: "librarian1", role: "Librarian", fullName: "Demo Librarian One" },
  { username: "librarian2", role: "Librarian", fullName: "Demo Librarian Two" },
  ...Array.from({ length: 6 }, (_, i) => ({
    username: "reader" + (i + 1),
    role: "Reader",
    fullName: "Demo Reader " + (i + 1),
  })),
];

const categories = ["Software Engineering", "Databases", "Networks", "Information Systems", "Algorithms"];
const titleNames = [
  "Database Systems", "Clean Code", "Operating Systems", "Software Architecture",
  "Computer Networks", "Data Structures", "Information Retrieval", "Distributed Systems",
  "Web Development", "Machine Learning", "Computer Security", "Object-Oriented Design",
  "Database Design", "Cloud Computing", "Programming Languages", "Data Engineering",
  "Systems Analysis", "Human Computer Interaction", "Software Testing", "Digital Libraries",
  "Algorithms and Complexity", "Database Administration", "Mobile Applications",
  "Computer Graphics", "Artificial Intelligence", "Network Security",
  "Requirements Engineering", "Project Management", "Information Architecture",
  "Advanced Programming",
];

async function main() {
  const [existingLoans, existingHolds] = await Promise.all([
    prisma.loan.count(), prisma.reservation.count(),
  ]);
  if (existingLoans || existingHolds) {
    throw new Error("Demo seed requires no existing circulation records; use db:reset only on disposable development data.");
  }
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const userIds = {};
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const userId = id("user", i + 1);
    userIds[user.username] = userId;
    await prisma.user.upsert({
      where: { id: userId },
      update: { username: user.username, email: user.username + "@unilib.demo.invalid", fullName: user.fullName, passwordHash, role: user.role, isActive: true },
      create: { id: userId, username: user.username, email: user.username + "@unilib.demo.invalid", fullName: user.fullName, passwordHash, role: user.role, isActive: true },
    });
  }

  const copies = [];
  for (let i = 0; i < 30; i += 1) {
    const titleId = id("title", i + 1);
    const isbnBase = "978100000" + String(i + 1).padStart(3, "0");
    const checksum = (10 - [...isbnBase].reduce((sum, digit, pos) => sum + Number(digit) * (pos % 2 === 0 ? 1 : 3), 0) % 10) % 10;
    const isbn = isbnBase + checksum;
    const titleData = {
      isbn, title: titleNames[i], author: "UniLib Academic Editors",
      category: categories[i % categories.length], publisher: "Demo Press",
      publicationYear: 2000 + (i % 25), isActive: true,
    };
    await prisma.bookTitle.upsert({
      where: { id: titleId },
      update: titleData,
      create: { id: titleId, ...titleData },
    });
    const numberOfCopies = i < 20 ? 3 : 2;
    for (let j = 0; j < numberOfCopies; j += 1) {
      const copyId = id("copy", i * 3 + j + 1);
      const barcode = "UNI-" + String(i + 1).padStart(3, "0") + "-" + String(j + 1).padStart(2, "0");
      await prisma.bookCopy.upsert({
        where: { id: copyId },
        update: { titleId, barcode, shelfLocation: "S-" + String((i % 10) + 1).padStart(2, "0"), status: "Available", conditionNotes: null },
        create: { id: copyId, titleId, barcode, shelfLocation: "S-" + String((i % 10) + 1).padStart(2, "0"), status: "Available" },
      });
      copies.push({ id: copyId, titleId, titleNumber: i + 1, copyNumber: j + 1 });
    }
  }

  const loanSeeds = [
    { reader: "reader1", title: 1, copy: 1, checkoutDaysAgo: 3, dueDaysAhead: 11 },
    { reader: "reader2", title: 1, copy: 2, checkoutDaysAgo: 4, dueDaysAhead: 10 },
    { reader: "reader3", title: 1, copy: 3, checkoutDaysAgo: 5, dueDaysAhead: 9 },
    { reader: "reader4", title: 2, copy: 1, checkoutDaysAgo: 2, dueDaysAhead: 12 },
    { reader: "reader1", title: 3, copy: 1, checkoutDaysAgo: 20, dueDaysAhead: -6 },
  ];
  for (let i = 0; i < loanSeeds.length; i += 1) {
    const item = loanSeeds[i];
    const copy = copies.find((entry) => entry.titleNumber === item.title && entry.copyNumber === item.copy);
    const loanData = {
      readerId: userIds[item.reader], copyId: copy.id,
      checkedOutAt: new Date(now.getTime() - item.checkoutDaysAgo * day),
      dueAt: new Date(now.getTime() + item.dueDaysAhead * day),
      returnedAt: null, renewedAt: null,
    };
    await prisma.loan.upsert({
      where: { id: id("loan", i + 1) },
      update: loanData,
      create: { id: id("loan", i + 1), ...loanData },
    });
    await prisma.bookCopy.update({ where: { id: copy.id }, data: { status: "Borrowed" } });
  }

  const reservedTitleId = id("title", 1);
  for (let i = 0; i < 2; i += 1) {
    const reservationData = {
      readerId: userIds["reader" + (i + 4)], titleId: reservedTitleId,
      heldCopyId: null, status: "Pending",
      createdAt: new Date(now.getTime() - (2 - i) * 60 * 60 * 1000),
      readyAt: null, expiresAt: null, fulfilledAt: null, cancelledAt: null,
    };
    await prisma.reservation.upsert({
      where: { id: id("reservation", i + 1) },
      update: reservationData,
      create: { id: id("reservation", i + 1), ...reservationData },
    });
  }

  const [userCount, titleCount, copyCount, loanCount, holdCount] = await Promise.all([
    prisma.user.count(), prisma.bookTitle.count(), prisma.bookCopy.count(),
    prisma.loan.count(), prisma.reservation.count(),
  ]);
  console.log(JSON.stringify({
    users: userCount, titles: titleCount, copies: copyCount,
    activeLoans: loanCount, reservations: holdCount,
    overdueLoans: 1, demoPasswordSource: process.env.DEMO_PASSWORD ? "environment" : "local demo default",
  }, null, 2));
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}