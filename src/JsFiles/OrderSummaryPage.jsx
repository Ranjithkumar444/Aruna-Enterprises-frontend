import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Tabs,
  Calendar,
  message,
  Button,
  Typography,
  Select,
  Spin
} from 'antd';
// Importing specific functions from date-fns for better modularity and tree-shaking
import {
  format,
  parseISO, // Used for parsing ISO date strings from the backend
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getYear,
  getMonth,
  getDate,
  getDaysInMonth,
  isSameDay,
  isAfter,
  isBefore,
  addDays, // For adding days, replacing moment().add(1, 'day')
  subDays, // For subtracting days, replacing moment().subtract(1, 'day')
  setYear, // For setting the year
  setMonth, // For setting the month
  setDate as setDayOfMonth // For setting the day of the month
} from 'date-fns';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

// Configure axios instance
const api = axios.create({
  baseURL: 'https://arunaenterprises.azurewebsites.net/admin/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include admin token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const OrderSummaryPage = () => {
  // State variables for managing dates and data. Initialize with native Date objects.
  const [date, setDate] = useState(new Date()); // Currently selected date for daily summary
  const [startDate, setStartDate] = useState(startOfWeek(new Date())); // Start date for range summary
  const [endDate, setEndDate] = useState(endOfWeek(new Date())); // End date for range summary
  const [dailySummary, setDailySummary] = useState(null);
  const [rangeSummaries, setRangeSummaries] = useState([]);
  const [reelHistory, setReelHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date())); // Selected year for calendar view
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()) + 1); // Selected month for calendar view (1-indexed)

  useEffect(() => {
    fetchDailySummary(date);
    fetchRangeSummaries(startDate, endDate);
  }, []);

  const fetchDailySummary = async (selectedDate) => {
    setLoading(true);
    try {
      const response = await api.get(`/order-summaries/daily/${format(selectedDate, 'yyyy-MM-dd')}`);
      setDailySummary(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setDailySummary(null);
        message.info(`No summary found for ${format(selectedDate, 'PPP')}. You can generate it if orders were shipped.`);
      } else {
        handleApiError(error, 'Failed to fetch daily summary');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRangeSummaries = async (start, end) => {
    setLoading(true);
    try {
      const response = await api.get(`/order-summaries/range`, {
        params: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd')
        }
      });
      setRangeSummaries(response.data);

      const historyResponse = await api.get(`/order-summaries/reel-history`, {
        params: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd')
        }
      });
      setReelHistory(historyResponse.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch range summaries or reel history');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthSummary = async (year, month) => {
    setCalendarLoading(true);
    try {
      // Create new Date objects for start/end of month
      const tempDate = setMonth(setYear(new Date(), year), month - 1);
      const start = startOfMonth(tempDate);
      const end = endOfMonth(tempDate);
      
      const response = await api.get(`/order-summaries/range`, {
        params: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd')
        }
      });
      setRangeSummaries(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch month summary for calendar');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleApiError = (error, defaultMessage) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      message.error('Session expired or authentication required. Please ensure you are logged in.');
      localStorage.removeItem('adminToken');
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error(defaultMessage);
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    fetchDailySummary(selectedDate);
  };

  const handleStartDateChange = (day) => {
    const newStartDate = setDayOfMonth(startDate, day);
    setStartDate(newStartDate);
    if (isAfter(newStartDate, endDate)) {
      const newEndDate = addDays(newStartDate, 1);
      setEndDate(newEndDate);
      fetchRangeSummaries(newStartDate, newEndDate);
    } else {
      fetchRangeSummaries(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (day) => {
    const newEndDate = setDayOfMonth(endDate, day);
    setEndDate(newEndDate);
    if (isBefore(newEndDate, startDate)) {
      const newStartDate = subDays(newEndDate, 1);
      setStartDate(newStartDate);
      fetchRangeSummaries(newStartDate, newEndDate);
    } else {
      fetchRangeSummaries(startDate, newEndDate);
    }
  };

  const handleStartMonthChange = (month) => {
    const newStartDate = setMonth(startDate, month - 1);
    setStartDate(newStartDate);
    if (isAfter(newStartDate, endDate)) {
      const newEndDate = addDays(newStartDate, 1);
      setEndDate(newEndDate);
      fetchRangeSummaries(newStartDate, newEndDate);
    } else {
      fetchRangeSummaries(newStartDate, endDate);
    }
  };

  const handleEndMonthChange = (month) => {
    const newEndDate = setMonth(endDate, month - 1);
    setEndDate(newEndDate);
    if (isBefore(newEndDate, startDate)) {
      const newStartDate = subDays(newEndDate, 1);
      setStartDate(newStartDate);
      fetchRangeSummaries(newStartDate, newEndDate);
    } else {
      fetchRangeSummaries(startDate, newEndDate);
    }
  };

  const handleStartYearChange = (year) => {
    const newStartDate = setYear(startDate, year);
    setStartDate(newStartDate);
    if (isAfter(newStartDate, endDate)) {
      const newEndDate = addDays(newStartDate, 1);
      setEndDate(newEndDate);
      fetchRangeSummaries(newStartDate, newEndDate);
    } else {
      fetchRangeSummaries(newStartDate, endDate);
    }
  };

  const handleEndYearChange = (year) => {
    const newEndDate = setYear(endDate, year);
    setEndDate(newEndDate);
    if (isBefore(newEndDate, startDate)) {
      const newStartDate = subDays(newEndDate, 1);
      setStartDate(newStartDate);
      fetchRangeSummaries(newStartDate, newEndDate);
    } else {
      fetchRangeSummaries(startDate, newEndDate);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchMonthSummary(year, selectedMonth);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    fetchMonthSummary(selectedYear, month);
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      await api.post(`/order-summaries/generate/${format(date, 'yyyy-MM-dd')}`);
      message.success(`Daily summary generated successfully for ${format(date, 'PPP')}`);
      fetchDailySummary(date);
    } catch (error) {
      handleApiError(error, 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Product', dataIndex: 'productType', key: 'productType' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Total Weight (kg)',
      dataIndex: 'totalWeightConsumed',
      key: 'totalWeightConsumed',
      render: val => (val).toFixed(2)
    },
    {
      title: 'Revenue (₹)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: val => val ? `₹${val.toFixed(2)}` : '-'
    },
    {
      title: 'Profit (₹)',
      dataIndex: 'profit',
      key: 'profit',
      render: val => val ? `₹${val.toFixed(2)}` : '-'
    },
    {
      title: 'Profit %',
      dataIndex: 'profitPercentage',
      key: 'profitPercentage',
      render: val => val || '-'
    },
    {
      title: 'Wastage (kg)',
      dataIndex: 'totalReelWastage',
      key: 'totalReelWastage',
      render: val => val ? val.toFixed(2) : '-'
    }
  ];

  const reelColumns = [
    { title: 'Reel No', dataIndex: 'reelNo', key: 'reelNo' },
    { title: 'Barcode', dataIndex: 'barcodeId', key: 'barcode' },
    { title: 'Usage Type', dataIndex: 'usageType', key: 'usageType' },
    {
      title: 'Weight Used (kg)',
      dataIndex: 'weightConsumed',
      key: 'weightConsumed',
      render: val => (val).toFixed(2)
    },
    {
      title: 'Wastage (kg)',
      dataIndex: 'reelWastage',
      key: 'reelWastage',
      render: val => (val).toFixed(2)
    },
    {
      title: 'Wastage %',
      dataIndex: 'reelWastagePercentage',
      key: 'reelWastagePercentage'
    }
  ];

  const historyColumns = [
    { title: 'Reel No', dataIndex: 'reelNo', key: 'reelNo' },
    { title: 'Barcode', dataIndex: 'barcodeId', key: 'barcode' },
    {
      title: 'Weight Used (kg)',
      dataIndex: 'usedWeight',
      key: 'usedWeight',
      render: val => (val).toFixed(2)
    },
    {
      title: 'Used At',
      dataIndex: 'usedAt',
      key: 'usedAt',
      // Ensure the value is a valid Date object before formatting
      render: isoDateString => isoDateString ? format(parseISO(isoDateString), 'PPPp') : '-'
    },
    { title: 'Reel Set', dataIndex: 'reelSet', key: 'reelSet' },
    { title: 'Box Details', dataIndex: 'boxDetails', key: 'boxDetails' }
  ];

  const rangeSummaryColumns = [
    {
      title: 'Date',
      dataIndex: 'summaryDate',
      key: 'summaryDate',
      render: isoDateString => isoDateString ? format(parseISO(isoDateString), 'PPP') : '-'
    },
    {
      title: 'Orders Shipped',
      dataIndex: 'totalOrdersShipped',
      key: 'totalOrdersShipped'
    },
    {
      title: 'Total Weight (kg)',
      dataIndex: 'totalWeightConsumed',
      key: 'totalWeightConsumed',
      render: val => (val).toFixed(2)
    },
    {
      title: 'Revenue (₹)',
      dataIndex: 'totalRevenueOfDay',
      key: 'totalRevenueOfDay',
      render: val => val ? `₹${val.toFixed(2)}` : '-'
    },
    {
      title: 'Profit (₹)',
      dataIndex: 'totalProfitOfDay',
      key: 'totalProfitOfDay',
      render: val => val ? `₹${val.toFixed(2)}` : '-'
    },
    {
      title: 'Profit %',
      dataIndex: 'totalProfitOfDayPercentage',
      key: 'totalProfitOfDayPercentage'
    },
    {
      title: 'Wastage (kg)',
      dataIndex: 'totalReelWastageOfDay',
      key: 'totalReelWastageOfDay',
      render: val => val ? val.toFixed(2) : '-'
    }
  ];

  const renderCalendarCell = (currentDate) => {
    // Find if there's a summary for the current calendar date
    const summary = rangeSummaries.find(s => isSameDay(parseISO(s.summaryDate), currentDate));
    if (!summary) return null;

    return (
      <div style={{ background: '#f0f0f0', padding: '4px', borderRadius: '4px' }}>
        <div>Orders: {summary.totalOrdersShipped}</div>
        <div>Weight: {summary.totalWeightConsumed.toFixed(1)}kg</div>
        {summary.totalRevenueOfDay && <div>Revenue: ₹{summary.totalRevenueOfDay.toFixed(1)}</div>}
      </div>
    );
  };

  return (
    <div className="order-summary-page" style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Order Summaries</Title>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Daily Summary" key="1">
          <Card>
            <Row gutter={16} style={{ marginBottom: '20px', alignItems: 'flex-end' }}>
              <Col span={16}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Select
                    style={{ width: '120px' }}
                    value={getYear(date)}
                    onChange={(year) => {
                      const newDate = setYear(date, year);
                      handleDateChange(newDate);
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i).map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: '120px' }}
                    value={getMonth(date) + 1}
                    onChange={(month) => {
                      const newDate = setMonth(date, month - 1);
                      handleDateChange(newDate);
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <Option key={month} value={month}>{format(setMonth(new Date(), month - 1), 'MMMM')}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: '120px' }}
                    value={getDate(date)}
                    onChange={(day) => {
                      const newDate = setDayOfMonth(date, day);
                      handleDateChange(newDate);
                    }}
                  >
                    {Array.from({ length: getDaysInMonth(date) }, (_, i) => i + 1).map(day => (
                      <Option key={day} value={day}>{day}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={8}>
                <Button
                  type="primary"
                  onClick={generateSummary}
                  loading={loading}
                >
                  Generate Summary
                </Button>
              </Col>
            </Row>

            {dailySummary ? (
              <>
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Orders Shipped"
                        value={dailySummary.totalOrdersShipped}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Weight (kg)"
                        value={(dailySummary.totalWeightConsumed).toFixed(2)}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Revenue (₹)"
                        value={dailySummary.totalRevenueOfDay ? dailySummary.totalRevenueOfDay.toFixed(2) : 0}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Profit (₹)"
                        value={dailySummary.totalProfitOfDay ? dailySummary.totalProfitOfDay.toFixed(2) : 0}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={16} style={{ marginBottom: '20px' }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Profit Margin"
                        value={dailySummary.totalProfitOfDayPercentage || '0%'}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Wastage (kg)"
                        value={dailySummary.totalReelWastageOfDay ? dailySummary.totalReelWastageOfDay.toFixed(2) : 0}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Wastage %"
                        value={dailySummary.totalReelWastageOfDayPercentage || '0%'}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Avg Weight/Order (kg)"
                        value={
                          dailySummary.totalOrdersShipped > 0
                            ? (dailySummary.totalWeightConsumed / dailySummary.totalOrdersShipped).toFixed(2)
                            : 0
                        }
                      />
                    </Card>
                  </Col>
                </Row>

                <h3 style={{ marginBottom: '16px' }}>Order Details</h3>
                <Table
                  columns={orderColumns}
                  dataSource={dailySummary.orderDetails}
                  rowKey={record => record.orderId}
                  loading={loading}
                  expandable={{
                    expandedRowRender: record => (
                      <Table
                        columns={reelColumns}
                        dataSource={record.reelUsages}
                        rowKey="reelNo"
                        pagination={false}
                      />
                    )
                  }}
                />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin spinning={loading} size="large" tip="Loading daily summary...">
                  {!loading && <p>No daily summary data available for this date. Please select another date or generate the summary.</p>}
                </Spin>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Range Summary" key="2">
          <Card>
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <div style={{ marginBottom: '8px', fontWeight: '500' }}>Start Date</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Select
                        style={{ width: '100px' }}
                        value={getYear(startDate)}
                        onChange={handleStartYearChange}
                      >
                        {Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i).map(year => (
                          <Option key={year} value={year}>{year}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '120px' }}
                        value={getMonth(startDate) + 1}
                        onChange={handleStartMonthChange}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <Option key={month} value={month}>{format(setMonth(new Date(), month - 1), 'MMMM')}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '80px' }}
                        value={getDate(startDate)}
                        onChange={handleStartDateChange}
                      >
                        {Array.from({ length: getDaysInMonth(startDate) }, (_, i) => i + 1).map(day => (
                          <Option key={day} value={day}>{day}</Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '20px', paddingTop: '20px' }}>to</div>
                  
                  <div>
                    <div style={{ marginBottom: '8px', fontWeight: '500' }}>End Date</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Select
                        style={{ width: '100px' }}
                        value={getYear(endDate)}
                        onChange={handleEndYearChange}
                      >
                        {Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i).map(year => (
                          <Option key={year} value={year}>{year}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '120px' }}
                        value={getMonth(endDate) + 1}
                        onChange={handleEndMonthChange}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <Option key={month} value={month}>{format(setMonth(new Date(), month - 1), 'MMMM')}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '80px' }}
                        value={getDate(endDate)}
                        onChange={handleEndDateChange}
                      >
                        {Array.from({ length: getDaysInMonth(endDate) }, (_, i) => i + 1).map(day => (
                          <Option key={day} value={day}>{day}</Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {rangeSummaries.length > 0 ? (
              <>
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Orders"
                        value={rangeSummaries.reduce((sum, s) => sum + s.totalOrdersShipped, 0)}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Weight (kg)"
                        
                        value={rangeSummaries.reduce((sum, s) => sum + s.totalWeightConsumed, 0).toFixed(2)}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Revenue (₹)"
                        value={rangeSummaries.reduce((sum, s) => sum + (s.totalRevenueOfDay || 0), 0).toFixed(2)}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total Profit (₹)"
                        value={rangeSummaries.reduce((sum, s) => sum + (s.totalProfitOfDay || 0), 0).toFixed(2)}
                      />
                    </Card>
                  </Col>
                </Row>

                <h3 style={{ marginBottom: '16px' }}>Summary by Day</h3>
                <Table
                  columns={rangeSummaryColumns}
                  dataSource={rangeSummaries}
                  rowKey="id"
                  loading={loading}
                  expandable={{
                    expandedRowRender: record => (
                      <Table
                        columns={orderColumns}
                        dataSource={record.orderDetails}
                        rowKey={r => r.orderId}
                        pagination={false}
                      />
                    )
                  }}
                />

                <h3 style={{ margin: '20px 0 16px 0' }}>Reel Usage History</h3>
                <Table
                  columns={historyColumns}
                  dataSource={reelHistory}
                  rowKey="id"
                  loading={loading}
                />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                 <Spin spinning={loading} size="large" tip="Loading range summaries...">
                  {!loading && <p>No range summary data available for this period. Please adjust the dates.</p>}
                </Spin>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Calendar View" key="3">
          <Card>
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i).map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <Option key={month} value={month}>
                      {format(setMonth(new Date(), month - 1), 'MMMM')}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Spin spinning={calendarLoading}>
              <Calendar
                mode="month"
                // Construct Date objects for validRange
                validRange={[startOfMonth(setMonth(setYear(new Date(), selectedYear), selectedMonth - 1)), 
                            endOfMonth(setMonth(setYear(new Date(), selectedYear), selectedMonth - 1))]}
                dateFullCellRender={renderCalendarCell}
                onPanelChange={(newCalendarDate, mode) => {
                  if (mode === 'month') {
                    setSelectedYear(getYear(newCalendarDate));
                    setSelectedMonth(getMonth(newCalendarDate) + 1);
                    fetchMonthSummary(getYear(newCalendarDate), getMonth(newCalendarDate) + 1);
                  }
                }}
              />
            </Spin>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderSummaryPage;
