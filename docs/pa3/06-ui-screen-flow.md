# UniLib — UI Screen List and Screen Flow (PA3)

## 1. Screen Navigation Flow

```mermaid
flowchart TD
    SCR01["SCR-01: Authentication & Login\n(/login)"]

    subgraph AdminShell["Admin Shell (/admin/*)"]
        SCR02["SCR-02: Admin User Management\n(/admin/users)"]
    end

    subgraph ReaderShell["Reader Shell (/reader/*)"]
        SCR11["SCR-11: Reader Personal Dashboard\n(/reader/dashboard)"]
        SCR05R["SCR-05: Catalog Search & Browse\n(/reader/catalog)"]
        SCR06R["SCR-06: Book Title Detail & Availability\n(/reader/books/:id)"]
        SCR09["SCR-09: Book Reservation Modal / View\n(/reader/reservations/confirm)"]
    end

    subgraph LibrarianShell["Librarian Shell (/librarian/*)"]
        SCR07["SCR-07: Circulation Desk — Borrow\n(/librarian/borrow)"]
        SCR08["SCR-08: Circulation Desk — Return\n(/librarian/return)"]
        SCR03["SCR-03: Book Catalog Management\n(/librarian/catalog)"]
        SCR04["SCR-04: Book Copy Inventory\n(/librarian/copies)"]
        SCR05L["SCR-05: Catalog Lookup\n(/librarian/search)"]
        SCR06L["SCR-06: Book Title Detail\n(/librarian/books/:id)"]
        SCR10["SCR-10: Hold Shelf & Reservation Queue\n(/librarian/holds)"]
        SCR12["SCR-12: Overdue & Circulation Monitoring\n(/librarian/overdue)"]
    end

    SCR01 -->|"Role: Administrator"| SCR02
    SCR01 -->|"Role: Reader"| SCR11
    SCR01 -->|"Role: Librarian"| SCR07

    SCR11 <--> SCR05R
    SCR05R --> SCR06R
    SCR06R --> SCR09
    SCR09 --> SCR11

    SCR07 <--> SCR08
    SCR03 --> SCR04
    SCR05L --> SCR06L
    SCR08 --> SCR10
    SCR07 <--> SCR12