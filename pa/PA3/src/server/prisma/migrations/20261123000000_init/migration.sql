-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Reader', 'Librarian', 'Administrator');

-- CreateEnum
CREATE TYPE "CopyStatus" AS ENUM ('Available', 'Borrowed', 'Reserved', 'Damaged', 'Lost');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Pending', 'Ready', 'Fulfilled', 'Cancelled', 'Expired');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(160) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Reader',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_titles" (
    "id" UUID NOT NULL,
    "isbn" VARCHAR(32) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "author" VARCHAR(300) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "publisher" VARCHAR(160),
    "publication_year" SMALLINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "book_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_copies" (
    "id" UUID NOT NULL,
    "title_id" UUID NOT NULL,
    "barcode" VARCHAR(80) NOT NULL,
    "shelf_location" VARCHAR(100) NOT NULL,
    "condition_notes" TEXT,
    "status" "CopyStatus" NOT NULL DEFAULT 'Available',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "book_copies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" UUID NOT NULL,
    "reader_id" UUID NOT NULL,
    "copy_id" UUID NOT NULL,
    "checked_out_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMPTZ(3) NOT NULL,
    "returned_at" TIMESTAMPTZ(3),
    "renewed_at" TIMESTAMPTZ(3),

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" UUID NOT NULL,
    "reader_id" UUID NOT NULL,
    "title_id" UUID NOT NULL,
    "held_copy_id" UUID,
    "status" "ReservationStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ready_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3),
    "fulfilled_at" TIMESTAMPTZ(3),
    "cancelled_at" TIMESTAMPTZ(3),

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "book_titles_isbn_key" ON "book_titles"("isbn");

-- CreateIndex
CREATE INDEX "book_titles_title_idx" ON "book_titles"("title");

-- CreateIndex
CREATE INDEX "book_titles_category_publication_year_idx" ON "book_titles"("category", "publication_year");

-- CreateIndex
CREATE UNIQUE INDEX "book_copies_barcode_key" ON "book_copies"("barcode");

-- CreateIndex
CREATE INDEX "book_copies_title_id_status_idx" ON "book_copies"("title_id", "status");

-- CreateIndex
CREATE INDEX "loans_reader_id_returned_at_idx" ON "loans"("reader_id", "returned_at");

-- CreateIndex
CREATE INDEX "loans_copy_id_returned_at_idx" ON "loans"("copy_id", "returned_at");

-- CreateIndex
CREATE INDEX "loans_due_at_returned_at_idx" ON "loans"("due_at", "returned_at");

-- CreateIndex
CREATE INDEX "reservations_title_id_created_at_idx" ON "reservations"("title_id", "created_at");

-- CreateIndex
CREATE INDEX "reservations_title_id_status_created_at_idx" ON "reservations"("title_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "reservations_reader_id_status_idx" ON "reservations"("reader_id", "status");

-- CreateIndex
CREATE INDEX "reservations_status_expires_at_idx" ON "reservations"("status", "expires_at");

-- AddForeignKey
ALTER TABLE "book_copies" ADD CONSTRAINT "book_copies_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "book_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_copy_id_fkey" FOREIGN KEY ("copy_id") REFERENCES "book_copies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "book_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_held_copy_id_fkey" FOREIGN KEY ("held_copy_id") REFERENCES "book_copies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- PostgreSQL partial indexes enforce circulation state uniqueness (NFR-05).
CREATE UNIQUE INDEX "loans_copy_active_unique" ON "loans"("copy_id") WHERE "returned_at" IS NULL;
CREATE UNIQUE INDEX "reservations_ready_copy_unique" ON "reservations"("held_copy_id") WHERE "status" = 'Ready' AND "held_copy_id" IS NOT NULL;
CREATE UNIQUE INDEX "reservations_active_reader_title_unique" ON "reservations"("reader_id","title_id") WHERE "status" IN ('Pending','Ready');
-- Case-insensitive substring search at larger catalog sizes (F04 / NFR-01).
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "book_titles_title_trgm" ON "book_titles" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "book_titles_author_trgm" ON "book_titles" USING GIN ("author" gin_trgm_ops);
CREATE INDEX "book_titles_category_trgm" ON "book_titles" USING GIN ("category" gin_trgm_ops);
CREATE INDEX "book_titles_isbn_trgm" ON "book_titles" USING GIN ("isbn" gin_trgm_ops);