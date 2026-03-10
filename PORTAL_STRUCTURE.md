# Portal Structure Documentation

## Overview

The portal pages have been separated from the main website flow using Next.js route groups. Each portal (admin, partner, and client) now has its own dedicated navigation and footer, independent from the main marketing website.

## Directory Structure

```
src/
├── app/
│   ├── (frontend)/          # Main website pages
│   │   ├── (marketing)/     # Marketing pages
│   │   ├── layout.tsx       # Main website layout with MainNav & SiteFooter
│   │   └── page.tsx
│   │
│   └── (portals)/           # Portal pages (NEW)
│       ├── layout.tsx       # Portal layout with PortalNav & PortalFooter
│       ├── admin-portal/
│       │   └── page.tsx
│       ├── partner-portal/
│       │   └── page.tsx
│       └── client-portal/
│           └── page.tsx
│
└── components/
    ├── portal/              # Portal-specific components (NEW)
    │   ├── PortalNav.tsx    # Portal navigation bar
    │   └── PortalFooter.tsx # Portal footer
    ├── header/              # Main website header
    └── footer/              # Main website footer
```

## Portal Navigation Features

### PortalNav Component

Located at `/src/components/portal/PortalNav.tsx`

**Features:**

- Automatically detects which portal is active (admin/partner/client)
- Displays appropriate navigation links based on portal type
- Responsive mobile menu
- User menu with Settings, Profile, and Logout options
- Sticky header that stays at the top while scrolling

**Portal-Specific Links:**

**Admin Portal:**

- Dashboard
- Clients
- Partners
- Reports

**Partner Portal:**

- Dashboard
- Referrals
- Earnings

**Client Portal:**

- Dashboard
- Appointments
- Documents

### PortalFooter Component

Located at `/src/components/portal/PortalFooter.tsx`

**Features:**

- Company information
- Support links (Contact, Phone, Privacy, Terms)
- HIPAA compliance notice
- Link back to main website
- Responsive design

## Routes

### Portal URLs

- **Admin Portal:** `/admin-portal`
- **Partner Portal:** `/partner-portal`
- **Client Portal:** `/client-portal`

### Main Website URLs

- **Home:** `/`
- **Marketing Pages:** `/about`, `/services`, `/contact`, etc.

## Layout Behavior

### Main Website Layout

- Uses `MainNav` component (top navigation with links)
- Uses `SiteFooter` component (full marketing footer)
- SEO optimized with full metadata
- Public-facing pages

### Portal Layout

- Uses `PortalNav` component (portal-specific navigation)
- Uses `PortalFooter` component (simplified footer)
- `robots: { index: false, follow: false }` to prevent search indexing
- Requires authentication (to be implemented)

## Styling

Both layouts share the same font configuration:

- **Body:** Inter font family
- **Headings:** Montserrat font family
- **Background:** Light gray (`bg-gray-50`) for portals
- Consistent Tailwind CSS classes throughout

## Future Enhancements

### Authentication

1. Add authentication middleware to protect portal routes
2. Redirect unauthenticated users to login pages
3. Implement role-based access control

### Navigation Enhancements

1. Add user profile dropdown in PortalNav
2. Implement notifications bell
3. Add breadcrumbs for nested portal pages
4. Active link highlighting based on nested routes

### Additional Portal Pages

1. Settings pages (`/[portal]/settings`)
2. Profile pages (`/[portal]/profile`)
3. Detail pages (e.g., `/admin-portal/clients/[id]`)

## Development Notes

### Adding a New Portal Page

1. Create a new directory in `src/app/(portals)/`
2. Add a `page.tsx` file
3. Update `PortalNav.tsx` to include new navigation links
4. The portal layout will automatically apply

### Customizing Portal Navigation

Edit `src/components/portal/PortalNav.tsx`:

- Modify the `getPortalLinks()` function to add/remove links
- Update the `getPortalName()` function for new portal types
- Customize the mobile menu behavior

### Testing

- Visit `/admin-portal`, `/partner-portal`, and `/client-portal`
- Verify navigation is portal-specific
- Test responsive mobile menu
- Ensure main website navigation is separate (visit `/` or `/about`)

## Summary

The portal structure is now completely independent from the main marketing website, providing:

- ✅ Separate navigation and footer for portals
- ✅ Role-specific navigation links
- ✅ Responsive design for all screen sizes
- ✅ Clean separation of concerns
- ✅ Easy to extend with new portal features
