# Partner Referral Flow

This document describes the complete referral flow from a partner sharing their link to automatic referral tracking.

## Overview

The referral system allows Partners to share a unique link with potential clients. When a client signs up using this link, a Referral record is automatically created, tracking the relationship and enabling commission calculations.

## Flow Steps

### 1. Partner Gets Their Referral Link

Partners can find their referral link in the Partner Portal at `/partner-portal`. The link includes their unique referral code as a URL parameter:

```
https://mystrengthrx.com/signup?ref=TRAINERJOHN
```

The `ReferralLinkCard` component displays:

- The partner's referral code
- The full referral link
- A copy button for easy sharing

### 2. Client Clicks the Referral Link

When a potential client clicks the partner's referral link, they are directed to:

```
/signup?ref=TRAINERJOHN
```

The signup page:

1. Extracts the `ref` parameter from the URL
2. Calls `/api/verify-referral?code=TRAINERJOHN` to verify the code
3. Displays the partner's name if valid
4. Shows an error if the code is invalid or the partner is inactive

### 3. Client Completes Signup

The client fills out the signup form with:

- First Name
- Last Name
- Email
- Phone (optional)
- Date of Birth
- Password

When submitted, the form data is sent to `/api/signup` including the `referralCode`.

### 4. Backend Creates Client and Referral

The `/api/signup` endpoint:

1. **Validates the referral code** (if provided)
   - Finds an active Partner with matching `referralCode`
   - Retrieves the Partner's ID

2. **Creates the Client record**
   - All signup form data
   - `assignedTrainer` set to Partner ID (if valid code)
   - Initial status fields set to defaults

3. **Creates a Referral record** (if partner code was valid)
   - `trainer`: Partner ID
   - `client`: New Client ID
   - `publicId`: Auto-generated (e.g., "REF-8821")
   - `status`: "lead_created"
   - `commissionSnapshot`: 0 (updated when they pay)
   - `marketingSource`: The referral code used

4. **Logs the client in automatically**
   - Creates auth token
   - Sets `payload-token` cookie

5. **Returns success response**
   - Client is redirected to `/client-portal`

## API Endpoints

### GET /api/verify-referral

Verifies a referral code before signup.

**Query Parameters:**

- `code` (string): The referral code to verify

**Response:**

```json
{
  "valid": true,
  "partnerName": "John Doe",
  "partnerId": 123
}
```

### POST /api/signup

Creates a new client account with optional referral tracking.

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "securepass123",
  "dateOfBirth": "1990-01-15",
  "phone": "6025551234",
  "referralCode": "TRAINERJOHN"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": 456,
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

## Database Collections

### Partners Collection

- `referralCode`: Unique code (e.g., "TRAINERJOHN")
- `status`: Must be "active" for referrals to work
- `commissionRate`: Percentage earned per referral
- `totalEarnings`: Auto-calculated via hooks

### Clients Collection

- `assignedTrainer`: Relationship to Partner (set if referred)
- `paperworkStatus`, `labStatus`, `medicalReviewStatus`: Track journey
- All standard auth fields (email, password, etc.)

### Referrals Collection

- `trainer`: Relationship to Partner
- `client`: Relationship to Client
- `publicId`: Safe ID for partner display (HIPAA compliant)
- `status`: Tracks referral progression
- `commissionSnapshot`: Current/potential earnings
- `marketingSource`: Original referral code

## HIPAA Compliance

The Referrals collection uses a `publicId` (e.g., "REF-8821") for partner-facing displays. Partners cannot see client personal information directly - only admins have full access to client data through the Referral relationship.

## Testing the Flow

1. **Create a Partner:**

   ```
   Go to /admin
   Create a Partner with referralCode "TESTCODE" and status "active"
   ```

2. **Share the link:**

   ```
   http://localhost:3001/signup?ref=TESTCODE
   ```

3. **Sign up a new client**
   - Fill out the form
   - Submit

4. **Verify creation:**
   - Client should be logged in and redirected to /client-portal
   - Check /admin → Referrals to see the new record
   - Client should have `assignedTrainer` set to the Partner

## Future Enhancements

- Email notifications when referrals convert
- Webhook to Stripe for commission calculations
- Partner dashboard showing detailed referral analytics
- QR code generation for in-person referrals
- UTM parameter tracking for marketing campaigns
