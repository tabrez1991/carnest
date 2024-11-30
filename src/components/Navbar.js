import React, { useState } from 'react'
import { AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import CarnestLogo from '../assets/car-sharing-logo.png';
import { Search, DirectionsCar, List, Message, Person } from '@mui/icons-material';
import { removeToken } from '../services/LocalStorageService';
import { useSelector, useDispatch } from 'react-redux';
import { unSetUserToken } from '../features/authSlice';


const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   // Access the token and derive `isLoggedIn` from Redux state
  const { access_token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(access_token);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Search', path: '/search', icon: <Search /> },
    { name: 'Post Ride', path: '/PostRide', icon: <DirectionsCar /> },
    { name: 'Your Rides', path: '/YourRides', icon: <List /> },
    { name: 'Messages', path: '/Messages', icon: <Message /> },
  ];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(unSetUserToken())
    removeToken()
    dispatch(unSetUserToken()); // Clear token from Redux
    handleClose();
    navigate('/search');
  };

  return (
  <AppBar position="static" sx={{backgroundColor: 'background.paper', borderRadius:'30px', boxShadow: 'none'}}>
    <Toolbar sx={{ justifyContent: 'space-between' }}>

      {/* Logo and Brand Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={CarnestLogo} alt="Carnest Logo" style={{ height: '35px', marginRight: '5px', marginBottom: '10px'}} />
          <Typography variant="h6" component={NavLink} to="/search" sx={{ textDecoration: 'none', color: 'text.primary' }}>
            Carnest
          </Typography>
        </Box>

      {/* Desktop Menu Items */}
      {!isMobile && isLoggedIn && (
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            {menuItems.map((item) => (
              <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({margin: '0 8px',textDecoration: 'none', color: isActive ? '#FF6436' : 'black', fontWeight: isActive ? 'bold' : 'normal', 
                                        display: 'flex', alignItems: 'center',})}>
              {item.icon}
              <Typography sx={{ ml: 1 }}>{item.name}</Typography>
            </NavLink>
            ))}
          </Box>
      )}

      {/* Login/Signup or Profile Icon */}
      {isLoggedIn ? (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="black"
            >
              <Person />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate('/userprofile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/Vehicles')}>Vehicles</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Box>
            <Button backgroundColor="text.secondary" component={NavLink} to="/login">
              Login
            </Button>
          </Box>
        )
      }
      
    {/* Mobile Bottom Navigation */}
    {isMobile && isLoggedIn && (
      <BottomNavigation
        showLabels
        sx={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.name}
            label={item.name}
            icon={item.icon}
            component={NavLink}
            to={item.path}
            sx={{
              '&.active': {
                color: '#FF6436', // Active menu color
              },
              color: 'text.primary', // Default menu color
            }}
          />
        ))}
      </BottomNavigation>
    )}







    </Toolbar>
  </AppBar>
  )
}

export default Navbar
