import React, { useState } from 'react';
import { Card, Row, Col, Form, Table, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { BarChart, Activity, DollarSign } from 'lucide-react';
import { Promotion } from '../store/promotionsSlice';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, ColumnDef, SortingState} from '@tanstack/react-table';

interface DashboardProps {
  promotions: Promotion[];
  onFilterChange: (startDate: string | null, endDate: string | null) => void;
  clearFilter: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  promotions,
  onFilterChange,
  clearFilter
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const totalPromotions = promotions.length;

  const totalBudget = promotions.reduce(
    (sum, promotion) => sum + promotion.budget,
    0
  );

  const promotionsWithSalesImpact = promotions.filter(
    (promotion) => promotion.expectedSalesImpact !== undefined
  );

  const averageSalesImpact = promotionsWithSalesImpact.length > 0
    ? promotionsWithSalesImpact.reduce(
      (sum, promotion) => sum + (promotion.expectedSalesImpact || 0),
      0
    ) / promotionsWithSalesImpact.length
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleApplyFilter = () => {
    onFilterChange(
      startDate ? startDate.toISOString() : null,
      endDate ? endDate.toISOString() : null
    );
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    clearFilter();
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<any>('');


  const columns = React.useMemo<ColumnDef<Promotion>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        sortingFn: 'alphanumeric',
      },
      {
        accessorKey: 'startDate',
        header: () => 'Start Date',
        cell: ({ row }) => formatDate(row.original.startDate),
      },
      {
        accessorKey: 'endDate',
        header: () => 'End Date',
        cell: ({ row }) => formatDate(row.original.endDate),
      },
      {
        accessorKey: 'budget',
        header: 'Budget',
        cell: ({ row }) => `$${row.original.budget.toLocaleString()}`,
      },
      {
        accessorKey: 'expectedSalesImpact',
        header: 'Expected Sales Impact',
        cell: ({ row }) =>
          row.original.expectedSalesImpact
            ? `$${row.original.expectedSalesImpact.toLocaleString()}`
            : 'N/A',
      },
    ],
    []
  )

  const table = useReactTable({
    columns: columns,
    data: promotions,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    state: {
      sorting,
      // columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    // getColumnCanGlobalFilter: function () { return true }
  })

  return (
    <div>
      <h2 className="mb-4">Promotions Dashboard</h2>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Filter Promotions</h5>
        </Card.Header>
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3 mb-md-0">
                <Button>Filter</Button>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Total Promotions</h6>
                  <h2 className="mt-2 mb-0">{totalPromotions}</h2>
                </div>
                <BarChart size={40} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Total Budget</h6>
                  <h2 className="mt-2 mb-0">${totalBudget.toLocaleString()}</h2>
                </div>
                <DollarSign size={40} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Avg. Sales Impact</h6>
                  <h2 className="mt-2 mb-0">
                    ${averageSalesImpact.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <Activity size={40} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows
              .map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;