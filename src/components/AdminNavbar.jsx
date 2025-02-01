import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand
          style={{ fontWeight: 'bold', fontSize: '24px', color: '#1FC17B', cursor: 'pointer' }}
          onClick={() => navigate('/admin/dashboard')}
        >
          iFund Admin
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/admin/dashboard')}>Dashboard</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title="Account"
              id="admin-account-dropdown"
              align="end"
              menuVariant="dark"
            >
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
