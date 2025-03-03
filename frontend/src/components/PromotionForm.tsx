import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Promotion } from '../store/promotionsSlice';

interface PromotionFormProps {
  onSubmit: (promotion: Promotion) => void;
  initialValues?: Promotion;
  isEditing?: boolean;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false
}) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState('');
  const [expectedSalesImpact, setExpectedSalesImpact] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setStartDate(initialValues.startDate ? new Date(initialValues.startDate) : null);
      setEndDate(initialValues.endDate ? new Date(initialValues.endDate) : null);
      setBudget(initialValues.budget.toString());
      setExpectedSalesImpact(initialValues.expectedSalesImpact?.toString() || '');
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Promotion name is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!budget) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(Number(budget)) || Number(budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    if (expectedSalesImpact && (isNaN(Number(expectedSalesImpact)) || Number(expectedSalesImpact) < 0)) {
      newErrors.expectedSalesImpact = 'Expected sales impact must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const promotionData: Promotion = {
      ...initialValues,
      name,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
      budget: Number(budget),
      expectedSalesImpact: expectedSalesImpact ? Number(expectedSalesImpact) : undefined,
    };

    onSubmit(promotionData);

    if (!isEditing) {
      // Reset form if not editing
      setName('');
      setStartDate(null);
      setEndDate(null);
      setBudget('');
      setExpectedSalesImpact('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Promotion Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              dateFormat="yyyy-MM-dd"
            />
            {errors.startDate && (
              <div className="invalid-feedback d-block">{errors.startDate}</div>
            )}
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
              dateFormat="yyyy-MM-dd"
              minDate={startDate || undefined}
            />
            {errors.endDate && (
              <div className="invalid-feedback d-block">{errors.endDate}</div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Budget ($)</Form.Label>
            <Form.Control
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              isInvalid={!!errors.budget}
              min="0"
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">{errors.budget}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expected Sales Impact ($) (Optional)</Form.Label>
            <Form.Control
              type="number"
              value={expectedSalesImpact}
              onChange={(e) => setExpectedSalesImpact(e.target.value)}
              isInvalid={!!errors.expectedSalesImpact}
              min="0"
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">{errors.expectedSalesImpact}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-end">

        <Button variant="primary" type="submit" >
          {isEditing ? 'Update Promotion' : 'Add Promotion'}
        </Button>
      </div>
    </Form>
  );
};

export default PromotionForm;