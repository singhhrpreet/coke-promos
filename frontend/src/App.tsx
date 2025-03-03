import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPromotions, 
  addPromotion, 
  updatePromotion, 
  deletePromotion,
  setDateFilter,
  clearDateFilter,
  Promotion
} from './store/promotionsSlice';
import { RootState, AppDispatch } from './store';
import PromotionForm from './components/PromotionForm';
import PromotionList from './components/PromotionList';
import Dashboard from './components/Dashboard';
import { BarChart2, ListPlus } from 'lucide-react';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, dateFilter } = useSelector((state: RootState) => state.promotions);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPromotions());
    }
  }, [status, dispatch]);

  const handleAddPromotion = (promotion: Promotion) => {
    dispatch(addPromotion(promotion));
  };

  const handleUpdatePromotion = (promotion: Promotion) => {
    dispatch(updatePromotion(promotion));
  };

  const handleDeletePromotion = (id: string) => {
    dispatch(deletePromotion(id));
  };

  const handleFilterChange = (startDate: string | null, endDate: string | null) => {
    dispatch(setDateFilter({ startDate, endDate }));
  };

  const handleClearFilter = () => {
    dispatch(clearDateFilter());
  };

  const filteredPromotions = items.filter(promotion => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      return true;
    }
    
    const promotionStart = new Date(promotion.startDate).getTime();
    const promotionEnd = new Date(promotion.endDate).getTime();
    
    const filterStart = dateFilter.startDate ? new Date(dateFilter.startDate).getTime() : 0;
    const filterEnd = dateFilter.endDate ? new Date(dateFilter.endDate).getTime() : Infinity;
    
    return (
      (promotionStart >= filterStart && promotionStart <= filterEnd) ||
      (promotionEnd >= filterStart && promotionEnd <= filterEnd) ||
      (promotionStart <= filterStart && promotionEnd >= filterEnd)
    );
  });

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Promotional Activities Dashboard</h1>
      
      <Tab.Container id="app-tabs" activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
        <Row className="mb-4">
          <Col>
            <Nav variant="pills" className="justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="dashboard" className="d-flex align-items-center">
                  <BarChart2 size={18} className="me-2" />
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="manage" className="d-flex align-items-center">
                  <ListPlus size={18} className="me-2" />
                  Manage Promotions
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        
        <Tab.Content>
          <Tab.Pane eventKey="dashboard">
            <Dashboard 
              promotions={filteredPromotions} 
              onFilterChange={handleFilterChange}
              clearFilter={handleClearFilter}
            />
          </Tab.Pane>
          
          <Tab.Pane eventKey="manage">
            <Row>
              <Col>
                <Card className="mb-4">
                  <Card.Header>
                    <h4 className="mb-0">Add New Promotion</h4>
                  </Card.Header>
                  <Card.Body>
                    <PromotionForm onSubmit={handleAddPromotion} />
                  </Card.Body>
                </Card>
                
                <Card>
                  <Card.Header>
                    <h4 className="mb-0">Promotions List</h4>
                  </Card.Header>
                  <Card.Body>
                    <PromotionList 
                      promotions={items} 
                      onUpdate={handleUpdatePromotion} 
                      onDelete={handleDeletePromotion}
                      loading={status === 'loading'}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default App;