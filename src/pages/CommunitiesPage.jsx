import React, { useEffect, useState } from "react";
import { Row, Col, Button, ProgressBar, Modal, Form } from "react-bootstrap";
import { FaUser, FaSearch, FaFilter, FaSort } from "react-icons/fa";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const CommunitiesPage = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    contribution: "",
    targetAmount: "",
    image: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [communities, setCommunities] = useState([
    {
      id: 1,
      image: "https://placehold.co/60",
      title: "Small Business Boosters",
      subtitle:
        "Helping small business owners pool funds for shared costs and growth.",
      members: 5,
      contribution: "Ksh. 500 (Weekly)",
      currentAmount: "Ksh. 50,000",
      targetAmount: "Ksh. 120,000",
      progress: 42,
    },
    {
      id: 2,
      image: "https://placehold.co/60",
      title: "Education Support Group",
      subtitle: "Pooling to fund education for members or their children.",
      members: 15,
      contribution: "Ksh. 500 (Weekly)",
      currentAmount: "Ksh. 150,000",
      targetAmount: "Ksh. 200,000",
      progress: 75,
    },
    {
      id: 3,
      image: "https://placehold.co/60",
      title: "Women's Empowerment Circle",
      subtitle:
        "Focused on empowering women through collective actions and icons.",
      members: 55,
      contribution: "Ksh. 800 (Weekly)",
      currentAmount: "Ksh. 300,000",
      targetAmount: "Ksh. 500,000",
      progress: 60,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterCommunity = () => {
    const community = {
      id: communities.length + 1,
      image: previewImage || "https://placehold.co/60",
      title: newCommunity.name,
      subtitle: newCommunity.description,
      members: 0,
      contribution: `Ksh. ${newCommunity.contribution} (Weekly)`,
      currentAmount: "Ksh. 0",
      targetAmount: `Ksh. ${newCommunity.targetAmount}`,
      progress: 0,
    };
    setCommunities((prev) => [...prev, community]);
    setNewCommunity({
      name: "",
      description: "",
      contribution: "",
      targetAmount: "",
      image: "",
    });
    setPreviewImage(null);
    setShowRegisterModal(false);
  };

  return (
    <div className="communities-page-container" style={{ padding: "20px" }}>
      <Header userImage="https://placehold.co/50" userName="Brian" />

      <section className="communities-page" style={{ marginBottom: "150px" }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold">Communities</h5>

          <Button variant="primary" onClick={() => setShowRegisterModal(true)}>
            Register Community
          </Button>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div
            className="rounded-pill d-flex align-items-center justify-content-around px-3 py-2 shadow"
            style={{
              background: "#f8f9fa",
              minWidth: "120px",
            }}
          >
            <FaSearch
              size={18}
              className="text-secondary"
              style={{ cursor: "pointer" }}
            />
            <FaFilter
              size={18}
              className="text-secondary mx-3"
              style={{ cursor: "pointer" }}
            />
            <FaSort
              size={18}
              className="text-secondary"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {communities.map((community) => (
          <div
            key={community.id}
            className="community-card p-3 rounded shadow-sm mb-4"
            style={{ background: "white" }}
          >
            <Row>
              <Col xs={2} className="text-center">
                <img
                  src={community.image}
                  alt={community.title}
                  className="rounded-circle"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              </Col>
              <Col xs={10}>
                <h6 className="fw-bold mb-1">{community.title}</h6>
                <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                  {community.subtitle}
                </p>
                <div className="d-flex align-items-center mb-2">
                  <FaUser size={14} className="me-1 text-secondary" />
                  <span
                    style={{ fontSize: "0.9rem" }}
                    className="text-secondary"
                  >
                    {community.members}
                  </span>
                  <span
                    className="ms-3 text-secondary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {community.contribution}
                  </span>
                </div>
                <ProgressBar
                  now={community.progress}
                  className="mb-2"
                  style={{ height: "10px", backgroundColor: "#f0f0f0" }}
                  variant="warning"
                />
                <p
                  className="mb-0 text-secondary"
                  style={{ fontSize: "0.85rem" }}
                >
                  {community.currentAmount} / {community.targetAmount}
                </p>
              </Col>
            </Row>
          </div>
        ))}
      </section>

      <BottomNavigation />

      {/* Register Community Modal */}
      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Register a Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Community Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCommunity.name}
                onChange={handleInputChange}
                placeholder="Enter community name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newCommunity.description}
                onChange={handleInputChange}
                placeholder="Enter community description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contribution Amount (Weekly)</Form.Label>
              <Form.Control
                type="number"
                name="contribution"
                value={newCommunity.contribution}
                onChange={handleInputChange}
                placeholder="Enter weekly contribution amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Amount</Form.Label>
              <Form.Control
                type="number"
                name="targetAmount"
                value={newCommunity.targetAmount}
                onChange={handleInputChange}
                placeholder="Enter target amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Community Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-3 rounded"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRegisterModal(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={handleRegisterCommunity}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommunitiesPage;
