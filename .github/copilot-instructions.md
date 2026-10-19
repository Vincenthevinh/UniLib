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
- Treat React, Node.js, Express, and PostgreSQL as proposals until Ánh confirms PA1 Section 3.
- Create application directories only after the team confirms the source structure.
