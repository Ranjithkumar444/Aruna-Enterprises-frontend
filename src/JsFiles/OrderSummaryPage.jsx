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
import moment from 'moment';
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
  const [date, setDate] = useState(moment());
  const [startDate, setStartDate] = useState(moment().startOf('week'));
  const [endDate, setEndDate] = useState(moment().endOf('week'));
  const [dailySummary, setDailySummary] = useState(null);
  const [rangeSummaries, setRangeSummaries] = useState([]);
  const [reelHistory, setReelHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);

  useEffect(() => {
    fetchDailySummary(date);
    fetchRangeSummaries(startDate, endDate);
  }, []);

  const fetchDailySummary = async (date) => {
    setLoading(true);
    try {
      const response = await api.get(`/order-summaries/daily/${date.format('YYYY-MM-DD')}`);
      setDailySummary(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch daily summary');
    } finally {
      setLoading(false);
    }
  };

  const fetchRangeSummaries = async (start, end) => {
    setLoading(true);
    try {
      const response = await api.get(`/order-summaries/range`, {
        params: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD')
        }
      });
      setRangeSummaries(response.data);

      const historyResponse = await api.get(`/order-summaries/reel-history`, {
        params: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD')
        }
      });
      setReelHistory(historyResponse.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch range summaries');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthSummary = async (year, month) => {
    setCalendarLoading(true);
    try {
      const start = moment().year(year).month(month - 1).startOf('month');
      const end = moment().year(year).month(month - 1).endOf('month');
      const response = await api.get(`/order-summaries/range`, {
        params: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD')
        }
      });
      setRangeSummaries(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch month summary');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleApiError = (error, defaultMessage) => {
    console.error(error);
    if (error.response?.status === 401) {
      message.error('Session expired. Please login again.');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    } else {
      message.error(error.response?.data?.message || defaultMessage);
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
    fetchDailySummary(date);
  };

  const handleStartDateChange = (date) => {
    const newStartDate = startDate.clone().date(date);
    setStartDate(newStartDate);
    if (newStartDate.isAfter(endDate)) {
      setEndDate(newStartDate.clone().add(1, 'day'));
      fetchRangeSummaries(newStartDate, newStartDate.clone().add(1, 'day'));
    } else {
      fetchRangeSummaries(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    const newEndDate = endDate.clone().date(date);
    setEndDate(newEndDate);
    if (newEndDate.isBefore(startDate)) {
      setStartDate(newEndDate.clone().subtract(1, 'day'));
      fetchRangeSummaries(newEndDate.clone().subtract(1, 'day'), newEndDate);
    } else {
      fetchRangeSummaries(startDate, newEndDate);
    }
  };

  const handleStartMonthChange = (month) => {
    const newStartDate = startDate.clone().month(month - 1);
    setStartDate(newStartDate);
    if (newStartDate.isAfter(endDate)) {
      setEndDate(newStartDate.clone().add(1, 'day'));
      fetchRangeSummaries(newStartDate, newStartDate.clone().add(1, 'day'));
    } else {
      fetchRangeSummaries(newStartDate, endDate);
    }
  };

  const handleEndMonthChange = (month) => {
    const newEndDate = endDate.clone().month(month - 1);
    setEndDate(newEndDate);
    if (newEndDate.isBefore(startDate)) {
      setStartDate(newEndDate.clone().subtract(1, 'day'));
      fetchRangeSummaries(newEndDate.clone().subtract(1, 'day'), newEndDate);
    } else {
      fetchRangeSummaries(startDate, newEndDate);
    }
  };

  const handleStartYearChange = (year) => {
    const newStartDate = startDate.clone().year(year);
    setStartDate(newStartDate);
    if (newStartDate.isAfter(endDate)) {
      setEndDate(newStartDate.clone().add(1, 'day'));
      fetchRangeSummaries(newStartDate, newStartDate.clone().add(1, 'day'));
    } else {
      fetchRangeSummaries(newStartDate, endDate);
    }
  };

  const handleEndYearChange = (year) => {
    const newEndDate = endDate.clone().year(year);
    setEndDate(newEndDate);
    if (newEndDate.isBefore(startDate)) {
      setStartDate(newEndDate.clone().subtract(1, 'day'));
      fetchRangeSummaries(newEndDate.clone().subtract(1, 'day'), newEndDate);
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
    try {
      await api.post(`/order-summaries/generate/${date.format('YYYY-MM-DD')}`);
      message.success('Daily summary generated successfully');
      fetchDailySummary(date);
    } catch (error) {
      handleApiError(error, 'Failed to generate summary');
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
      render: date => moment(date).format('LLL')
    },
    { title: 'Reel Set', dataIndex: 'reelSet', key: 'reelSet' },
    { title: 'Box Details', dataIndex: 'boxDetails', key: 'boxDetails' }
  ];

  const rangeSummaryColumns = [
    {
      title: 'Date',
      dataIndex: 'summaryDate',
      key: 'summaryDate',
      render: date => moment(date).format('LL')
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

  const renderCalendarCell = (date) => {
    const summary = rangeSummaries.find(s => moment(s.summaryDate).isSame(date, 'day'));
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
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={8}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Select
                    style={{ width: '120px' }}
                    value={date.year()}
                    onChange={(year) => {
                      const newDate = date.clone().year(year);
                      setDate(newDate);
                      fetchDailySummary(newDate);
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: '120px' }}
                    value={date.month() + 1}
                    onChange={(month) => {
                      const newDate = date.clone().month(month - 1);
                      setDate(newDate);
                      fetchDailySummary(newDate);
                    }}
                  >
                    {moment.months().map((month, index) => (
                      <Option key={index + 1} value={index + 1}>{month}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: '120px' }}
                    value={date.date()}
                    onChange={(day) => {
                      const newDate = date.clone().date(day);
                      setDate(newDate);
                      fetchDailySummary(newDate);
                    }}
                  >
                    {Array.from({ length: date.daysInMonth() }, (_, i) => i + 1).map(day => (
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

            {dailySummary && (
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
                        value={startDate.year()}
                        onChange={handleStartYearChange}
                      >
                        {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                          <Option key={year} value={year}>{year}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '120px' }}
                        value={startDate.month() + 1}
                        onChange={handleStartMonthChange}
                      >
                        {moment.months().map((month, index) => (
                          <Option key={index + 1} value={index + 1}>{month}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '80px' }}
                        value={startDate.date()}
                        onChange={handleStartDateChange}
                      >
                        {Array.from({ length: startDate.daysInMonth() }, (_, i) => i + 1).map(day => (
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
                        value={endDate.year()}
                        onChange={handleEndYearChange}
                      >
                        {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                          <Option key={year} value={year}>{year}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '120px' }}
                        value={endDate.month() + 1}
                        onChange={handleEndMonthChange}
                      >
                        {moment.months().map((month, index) => (
                          <Option key={index + 1} value={index + 1}>{month}</Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '80px' }}
                        value={endDate.date()}
                        onChange={handleEndDateChange}
                      >
                        {Array.from({ length: endDate.daysInMonth() }, (_, i) => i + 1).map(day => (
                          <Option key={day} value={day}>{day}</Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {rangeSummaries.length > 0 && (
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
                  {[2023, 2024, 2025, 2026].map(year => (
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                    <Option key={month} value={month}>
                      {moment().month(month - 1).format('MMMM')}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Spin spinning={calendarLoading}>
              <Calendar
                mode="month"
                validRange={[moment().year(selectedYear).month(selectedMonth - 1).startOf('month'), 
                            moment().year(selectedYear).month(selectedMonth - 1).endOf('month')]}
                dateFullCellRender={renderCalendarCell}
                onPanelChange={(date, mode) => {
                  if (mode === 'month') {
                    setSelectedYear(date.year());
                    setSelectedMonth(date.month() + 1);
                    fetchMonthSummary(date.year(), date.month() + 1);
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