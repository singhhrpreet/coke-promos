import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react';
import { Promotion } from '../store/promotionsSlice';
import PromotionForm from './PromotionForm';

interface PromotionListProps {
  promotions: Promotion[];
  onUpdate: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const PromotionList: React.FC<PromotionListProps> = ({
  promotions,
  onUpdate,
  onDelete,
  loading
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);

  const handleEdit = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setShowEditModal(true);
  };

  const handleDelete = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (currentPromotion && currentPromotion._id) {
      onDelete(currentPromotion._id);
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = (updatedPromotion: Promotion) => {
    onUpdate(updatedPromotion);
    setShowEditModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center my-4">Loading promotions...</div>;
  }

  if (promotions.length === 0) {
    return <div className="text-center my-4">No promotions found. Add one to get started!</div>;
  }

  return (
    <>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Budget ($)</th>
              <th>Expected Sales Impact ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => (
              <tr key={promotion._id}>
                <td>{promotion.name}</td>
                <td>{formatDate(promotion.startDate)}</td>
                <td>{formatDate(promotion.endDate)}</td>
                <td>${promotion.budget.toLocaleString()}</td>
                <td>
                  {promotion.expectedSalesImpact
                    ? `$${promotion.expectedSalesImpact.toLocaleString()}`
                    : 'N/A'}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon"
                    onClick={() => handleEdit(promotion)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="btn-icon"
                    onClick={() => handleDelete(promotion)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} size='lg' onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPromotion && (
            <PromotionForm
              onSubmit={handleUpdate}
              initialValues={currentPromotion}
              isEditing={true}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the promotion "{currentPromotion?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PromotionList;