# UniLib PA2 — Circulation State Transitions

**Owner:** Tran Ha Anh Quan | **Task:** PA2-Q4 | **Reviewer:** Nguyen / Vinh
**Status:** Ready for review | **Authority:** pa/PA2/00-id-registry.md (FR-F03, FR-F05, FR-F06; BR-01..BR-10)

The diagram labels describe requirements-level concepts, not an approved database enum. The frozen ID Registry does not settle the canonical persistence labels for Loan and Reservation states; these names must be approved before PA3 migrations. Do not treat the following as a deployed or tested state machine.

## 1. Book Copy lifecycle

~~~mermaid
stateDiagram-v2
    [*] --> Available: Register new copy (UC-04)
    Available --> Borrowed: Checkout to eligible Reader (UC-07)
    Borrowed --> Available: Check-in, no eligible queued hold (UC-08)
    Borrowed --> Reserved: Check-in, assign FIFO hold (UC-08)
    Reserved --> Borrowed: Assigned Reader picks up (UC-07)
    Reserved --> Reserved: 72h expiry / cancellation, next FIFO reader
    Reserved --> Available: 72h expiry / cancellation, no next hold
    Available --> Damaged: Mark non-circulating damage
    Available --> Lost: Mark lost
    Available --> [*]: Decommission if unreferenced (UC-04)
    Damaged --> [*]: Decommission if unreferenced (UC-04)
    Lost --> [*]: Decommission if unreferenced (UC-04)
    note right of Reserved
      One held copy belongs to exactly one
      allocated reservation until pickup or release.
    end note
~~~

**Guard conditions**

| Transition | Mandatory guard | Atomic effects | Trace |
| --- | --- | --- | --- |
| Available -> Borrowed | Active Reader, < 3 active Loans, no Overdue, selected Copy Available | Create Active Loan, set Due Date +14 calendar days, set Copy Borrowed | FR-F05-01..03; BR-01/02/04; AC-F05-01 |
| Borrowed -> Available | Active Loan, no eligible queued Reservation | Loan Returned with timestamp, Copy Available | FR-F05-04/05; AC-F05-03 |
| Borrowed -> Reserved | Active Loan, earliest eligible FIFO hold waiting | Loan Returned, allocate copy to hold, set 72h pickup deadline, Copy Reserved | FR-F05-05; FR-F06-04; BR-07/08; AC-F05-04 |
| Reserved -> Borrowed | Matching holding Reader, pickup not expired and eligible | Mark hold Fulfilled, create Loan, Copy Borrowed | FR-F06-06 |
| Reserved -> Reserved | Current hold expired/cancelled; another eligible FIFO hold exists | Expire/cancel current, assign next, reset 72h deadline | FR-F06-05; BR-07/08 |
| Reserved -> Available | Current hold expired/cancelled; no waiting eligible hold | Expire/cancel hold, release copy | FR-F06-05; AC-F06-03 |
| Eligible state -> Decommission | Copy neither Borrowed nor Reserved; no active Loan/allocated hold references it | Remove/decommission copy without orphaning links | FR-F03-04; BR-09 |

The frozen state list writes "Damaged/Lost" as one expression. The diagram separates the physical conditions visually, but PA3 must confirm whether these are two distinct stored values. No automatic return from Damaged/Lost to Available is authorized here. A return that discovers damage must not silently route an unusable copy to the next hold.

## 2. Loan lifecycle

~~~mermaid
stateDiagram-v2
    [*] --> Active: Checkout accepted
    Active --> Active: One permitted renewal (+14 days)
    Active --> Returned: Check-in
    Returned --> [*]
    note right of Active
      Overdue can be derived as:
      now > due_at AND returned_at is empty.
      Persisted Overdue enum is not yet approved.
    end note
~~~

- A Loan links exactly one physical Copy and one Reader.
- No two Active Loans may reference the same Copy at the same time.
- A Loan may be renewed once only if it is not Overdue and no Reservation is pending for the Book Title (BR-03).
- Overdue prevents new checkout and new reservation for that Reader (BR-04), but does not itself close a Loan.
- A Return Timestamp is recorded exactly once on check-in (FR-F05-04).

## 3. Reservation lifecycle (conceptual)

~~~mermaid
stateDiagram-v2
    [*] --> Queued: Eligible title reservation placed
    Queued --> Held: Returned copy allocated in FIFO order
    Queued --> Cancelled: Reader cancels
    Held --> Fulfilled: Assigned Reader checks out copy
    Held --> Cancelled: Reader cancels
    Held --> Expired: 72h pickup window passes
    Cancelled --> [*]
    Expired --> [*]
    Fulfilled --> [*]
~~~

These descriptive state labels must not be copied as canonical database values before BA/PM review.

- A Reservation belongs to a **Book Title**, not an unassigned arbitrary Copy. Copy assignment occurs when a returned copy is allocated.
- New Reservation is permitted only when zero copies of the Book Title are Available, the Reader has no active Loan for that title, fewer than two active Reservations and no overdue Loan (BR-04/05/06).
- Waiting order is FIFO by creation timestamp (BR-07). Use a stable database tie-breaker for equal timestamps.
- Pickup deadline is allocation time +72 hours, not reservation creation time (BR-08).
- A Reader cancelling a held reservation must cause atomic reallocation/release of that held Copy, not leave it Reserved indefinitely.
- Automated expiry should be idempotent and should not expire a hold already Fulfilled at pickup.

## 4. Transaction boundaries and lock strategy

Every checkout, check-in, renewal, reservation creation, hold cancellation, hold allocation and expiry needs a single PostgreSQL transaction. Re-check preconditions after obtaining row locks. Store mutations and related status changes together; failed operations roll back the full transaction. Use a consistent lock ordering and appropriate constraints for uniqueness and foreign keys; the precise SQL contract is a PA3 deliverable, not an implementation claim.

**Concurrency acceptance scenarios:**

1. Two requests attempt to borrow the final Available Copy -> one Loan succeeds.
2. Two check-ins process the same active Loan -> only one Return succeeds.
3. Check-in and cancellation/expiry target the same title -> no duplicated allocation and FIFO remains valid.
4. Pickup and timer expiry race for one held copy -> either pickup commits or expiry commits, never both.
5. A Reader places competing reservations approaching the two-hold limit -> active Reservation count never exceeds 2.

## 5. Unresolved domain decisions

The source business-rules file already flags Maintenance vs Damaged/Lost, canonical Loan/Reservation status values, treatment of damaged returns and whether Overdue is derived. Additional questions: how to handle an ineligible head-of-FIFO Reader, whether a held reservation may be cancelled and instantly reassigned, and the exact timezone/clock semantics for 14-day duration and 72-hour pickup. Review these before PA3 schema freeze, without changing frozen IDs unilaterally.
