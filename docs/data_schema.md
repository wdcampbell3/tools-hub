# Data Schema

This document outlines the current data structure of the Firestore database.

**Status**: Active / Migrated to Firebase

## Collections

### `profiles`
User profile information, keyed by Firebase Auth `uid`.

| Field | Type | Description |
|---|---|---|
| `id` | string (ID) | Matches Firebase Auth UID |
| `full_name` | string | User's display name |
| `company_name` | string | User's company |
| `website` | string | Company website URL |
| `unsubscribed` | boolean | If true, user has opted out of emails |
| `updated_at` | timestamp | Last update time |

### `stripe_customers`
Maps Firebase Users to Stripe Customer IDs.

| Field | Type | Description |
|---|---|---|
| `user_id` | string | Firebase Auth UID |
| `stripe_customer_id` | string | Stripe Customer ID (`cus_...`) |
| `updated_at` | timestamp | Creation timestamp |

### `contact_requests`
Form submissions from the "Contact Us" page.

| Field | Type | Description |
|---|---|---|
| `first_name` | string | Sender's first name |
| `last_name` | string | Sender's last name |
| `email` | string | Sender's email |
| `company_name` | string | Sender's company |
| `phone` | string | Sender's phone number |
| `message_body` | string | The message content |
| `updated_at` | timestamp | Submission time |

## Future Considerations
- Plan to add `posts` collection if blog is migrated to DB from static files.
- Plan to add `audit_logs` for critical admin actions.
