# UniLib Demo Script — Reader Flow (3 Minutes)

- **Duration:** ~3 minutes (`SCR-01` -> `SCR-05` -> `SCR-06` -> `SCR-09` -> `SCR-11`)
- **Precondition:** Backend & database seeded (`npm run db:reset` + seed), frontend running with `VITE_USE_MOCK=false`, browser ready at `1440x900` (with a quick check at `1024px` and `1920px`).

## 0:00 – 0:30 · Sign In & Role Routing (`SCR-01`)
1. Open `/login` (`Welcome to UniLib`).
2. Briefly show invalid credentials returning a generic message (`Invalid username/email or password`) without revealing which field is wrong.
3. Sign in with a valid `Reader` account and verify automatic redirect to `/reader/catalog`.

## 0:30 – 1:15 · Catalog Search, Filter, Sort & Pagination (`SCR-05`)
1. Search by keyword (title, author, or ISBN) in the search bar.
2. Filter by `Category` and toggle `Available now`, then switch sort (`Title` / `Publication Year`) and check pagination (`10` items/page).
3. Select a title with `Available Copies = 0` (or inspect availability) and click `View Details`.

## 1:15 – 2:00 · Book Details & Reservation Modal (`SCR-06` -> `SCR-09`)
1. On `SCR-06`, point out the title metadata, `Total Copies` / `Available Copies` / `Borrowed Copies` / `Reserved Copies`, and the copies table (`Barcode`, `Shelf Location`, `Status`).
2. Confirm `Reserve Book` is enabled only when `Available Copies = 0` (`BR-05`) and eligibility rules pass (`BR-04`/`BR-06`).
3. Click `Reserve Book` to open `SCR-09`, review title, location, and the **72-hour** hold rule, then click `Confirm Reservation`.

## 2:00 – 2:45 · Reader Dashboard, Renewal & Cancellation (`SCR-11`)
1. Navigate to `My Dashboard` (`/reader/dashboard`).
2. Show the newly created reservation with its `Queue Position` and text-labeled status badge, then demonstrate `Cancel`.
3. Show the loans table (`Due Date`, `Days Remaining`), point out `Renew` being disabled with a clear reason when ineligible (e.g., overdue/restricted/ineligible), and show the overdue warning banner when applicable (`BR-04`).

## 2:45 – 3:00 · Wrap-Up & Responsive Note (`NFR-07`)
1. Summarize end-to-end persistence from Reader actions to backend/database and confirm clean layout across `1024px`, `1440px`, and `1920px` without console errors.