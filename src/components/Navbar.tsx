"use client";
import Link from "next/link";
import Image from "next/image";
import { AppBar, Toolbar, IconButton, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/donation", label: "Donation" },
  { href: "/register-ngo", label: "Register Your NGO" },
  { href: "/reviews", label: "What People Say" },
  { href: "/initiative", label: "Initiative" },
  { href: "/contact", label: "Contact Us" },
];

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'DONOR' | 'RECEIVER' | 'SUPERADMIN';
  status: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setProfileMenuAnchor(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'SUPERADMIN': return '/admin';
      case 'DONOR': return '/donor';
      case 'RECEIVER': return '/receiver';
      default: return '/profile';
    }
  };

  return (
    <>
      <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 0 } }}>
              <Box component={Link} href="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 2 }}>
                <Image
                  src="/images/logo.png"
                  alt="SajhaThali"
                  width={56}
                  height={56}
                  style={{ borderRadius: 4 }}
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: "white", 
                    fontFamily: "Varela Round, sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.5px"
                  }}
                >
                  SAJHA THALI
                </Typography>
              </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {links.map((l) => (
              <Button 
                key={l.href} 
                color="inherit" 
                component={Link} 
                href={l.href}
                sx={{ fontFamily: "Varela Round, sans-serif" }}
              >
                {l.label}
              </Button>
            ))}
            
            {/* Profile Icon */}
            <IconButton 
              color="inherit" 
              onClick={user ? handleProfileMenuClick : () => setLoginModalOpen(true)}
              sx={{ ml: 1 }}
              aria-label="user profile"
            >
              <AccountCircleIcon />
            </IconButton>

            {/* User Status Indicator */}
            {user && (
              <Typography variant="caption" sx={{ ml: 1, opacity: 0.8 }}>
                {user.firstName} ({user.role})
              </Typography>
            )}
          </Box>

          <Box sx={{ display: { xs: "inline-flex", md: "none" }, alignItems: "center", gap: 1 }}>
            {/* Profile Icon for Mobile */}
            <IconButton 
              color="inherit" 
              onClick={user ? handleProfileMenuClick : () => setLoginModalOpen(true)}
              aria-label="user profile"
            >
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setOpen(!open)} aria-label="toggle navigation">
              <MenuIcon />
            </IconButton>
          </Box>

          <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
              <List>
                {links.map((l) => (
                    <ListItem key={l.href} disablePadding>
                      <ListItemButton component={Link} href={l.href}>
                        <ListItemText 
                          primary={l.label} 
                          primaryTypographyProps={{ 
                            fontFamily: "Varela Round, sans-serif" 
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          </Toolbar>
        </Box>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem component={Link} href={getDashboardLink()} onClick={handleProfileMenuClose}>
          Dashboard
        </MenuItem>
        <MenuItem component={Link} href="/profile" onClick={handleProfileMenuClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
}


