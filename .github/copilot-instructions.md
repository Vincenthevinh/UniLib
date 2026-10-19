# UniLib Project Instructions

UniLib is a university library management web application.

## Main Roles

- Reader
- Librarian
- Administrator

## Core Workflows

- Authentication and authorization
- Book and physical copy management
- Search and reservation
- Borrowing and returning books
- Tracking overdue loans

## Code Review Guidelines

- Check authorization for every protected operation.
- Validate inputs and error handling.
- Review book-copy, loan and reservation state consistency.
- Check for hardcoded passwords or API keys.
- Identify missing tests and unclear implementation.
- Keep code understandable for student developers.
- Avoid adding features outside the approved scope.

## Team Rules

- Do not merge changes automatically.
- CI success does not replace human review.
- Record meaningful AI usage in the PA AI Usage Log.
- Quân owns the PA1 Section 3.2 technology proposal; Ánh reviews it before team confirmation.
- Treat React, Node.js, Express, and PostgreSQL as proposals until that review and confirmation.
- Preserve the required `src/` skeleton; create its internal application structure only after team confirmation.
