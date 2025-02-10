"use client";

import { UserButton } from "@clerk/nextjs";
// import { MenuItem } from "@mui/material";
// import Link from "next/link";

export default function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonPopoverCard: "py-2",
          userButtonTrigger:
            "focus:outline-none focus:ring-2 focus:ring-primary",
        },
      }}
      afterSignOutUrl="/"
      // afterCreateOrganizationUrl="/dashboard"
      showName={true}
      userProfileMode="navigation"
      userProfileUrl="/manage-team" // This will make the whole button navigate to team management
      // menu={MenuItems} // Custom menu items
    />
  );
}

// function MenuItems() {
//   return (
//     <>
//       <MenuItem component={Link} href="/manage-team">
//         Manage Team
//       </MenuItem>
//       <MenuItem component={Link} href="/account">
//         Manage Account
//       </MenuItem>
//     </>
//   );
// }
