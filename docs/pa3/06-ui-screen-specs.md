# PA3 — Screen Specifications (SCR-01, SCR-05, SCR-06, SCR-09, SCR-11)

## SCR-01: Login (`/login` · UC-01 · AC-F01-02)
- **Design Reference:** `pa/PA2/img/SCR-01.png` (live app capture in A5: `docs/design/screens/scr-01.png`).

| Control | Type | Validation | Event |
| :--- | :--- | :--- | :--- |
| Username or Email | Text Input | Required (non-empty) | `onChange` updates state and clears per-field validation error |
| Password | Password Input | Required (non-empty) | `onChange` updates state and clears per-field validation error |
| Show / Hide Password | Button | N/A | `onClick` toggles `password` / `text` input type |
| Sign In | Submit Button | Disabled while `submitting === true` | `onSubmit` calls `api.auth.login(...)`; failure shows a generic error without revealing which field failed; success redirects by role (`Reader`, `Librarian`, `Administrator`) |

## SCR-05: Catalog Search (`/reader/catalog` · UC-05 · AC-F04-02/03)
- **Design Reference:** `pa/PA2/img/SCR-05.png` (live app capture in A5: `docs/design/screens/scr-05.png`).

| Control | Type | Validation | Event |
| :--- | :--- | :--- | :--- |
| Search Input | Search Input | Free text matching Title, Author, Category, ISBN | `onChange` updates query and resets page to `1` |
| Category | Select | All categories or a specific category | `onChange` filters by category and resets page to `1` |
| Available now | Checkbox | Boolean (`true` / `false`) | `onChange` filters titles with `Available > 0` and resets page to `1` |
| Sort by | Select | `title:asc`, `title:desc`, `year:desc`, `year:asc` | `onChange` sorts by Title or Year and resets page to `1` |
| Pagination | Pagination | `10` titles per page | `onClick` navigates across pages |

## SCR-06: Book Title Detail (`/reader/books/:bookId` · UC-06, UC-10 · BR-05)
- **Design Reference:** `pa/PA2/img/SCR-06.png` (live app capture in A5: `docs/design/screens/scr-06.png`).

| Control | Type | Validation | Event |
| :--- | :--- | :--- | :--- |
| Copy Summary | Summary | Counts `Total`, `Available`, `Borrowed`, `Reserved` | Updates automatically from title and copy data |
| Reserve | Button | Enabled only when `Available = 0` (`BR-05`) and no `BR-04`/`BR-06` restriction applies | `onClick` opens the reservation confirmation modal (`SCR-09`) |
| Copies Table | Table | Displays `Barcode`, `Shelf Location`, `Copy Status` (`Available`, `Borrowed`, `Reserved`, `Damaged`, `Lost`, `Inactive`) | Displays status with text label alongside badge |

## SCR-09: Reserve Modal (`ReserveModal` · UC-10 · BR-04/05/06)
- **Design Reference:** `pa/PA2/img/SCR-09.png` (live app capture in A5: `docs/design/screens/scr-09.png`).

| Control | Type | Validation | Event |
| :--- | :--- | :--- | :--- |
| Reservation Details | Modal Content | Displays book title, estimated shelf/hold location, and 72-hour pickup hold rule | Opens from `SCR-06` Reserve action and displays `BR-04`/`BR-05`/`BR-06` error alerts on failure |
| Confirm Reservation | Submit Button | Disabled while submitting or when `BR-04`/`BR-05`/`BR-06` eligibility rules block reservation | `onClick` / `onSubmit` submits reservation request; shows error alert on rule violation or closes modal and updates dashboard state on success |
| Cancel | Button | Enabled unless request is actively in flight | `onClick` closes modal without creating a reservation |

## SCR-11: Reader Dashboard (`/reader/dashboard` · UC-09, UC-11, UC-12 · FR-F07-01/02)
- **Design Reference:** `pa/PA2/img/SCR-11.png` (live app capture in A5: `docs/design/screens/scr-11.png`).

| Control | Type | Validation | Event |
| :--- | :--- | :--- | :--- |
| Overdue & Restriction Banner | Alert Banner | Shown when reader has overdue loans or `BR-04` borrowing restriction | Displays overdue warning and `BR-04` borrowing restriction notice with text labels |
| Loans Table | Table | Displays `dueDate`, `daysRemaining`, and status badges paired with text labels | Renders active/overdue loans and status text clearly alongside color |
| Renew | Action Button | Disabled when loan is ineligible (overdue, already renewed, or queued reservation), with reason tooltip/label | `onClick` renews eligible loan and updates `dueDate` and `daysRemaining` |
| Reservations Table | Table | Displays `queuePosition`, status badges paired with text labels, and `Cancel` action | Renders active reservations and `queuePosition` alongside status text |
| Cancel Reservation | Action Button | Enabled for eligible active reservations; disabled while cancelling | `onClick` cancels selected reservation and refreshes reservations list |