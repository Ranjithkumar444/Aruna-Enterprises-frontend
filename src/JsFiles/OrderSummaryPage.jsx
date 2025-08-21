import React, { useState, useEffect, useMemo } from 'react';
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
  Spin,
  Space,
  Empty
} from 'antd';
// Ensure moment is correctly installed alongside antd
import moment from 'moment';
import axios from 'axios';
import { RiseOutlined, FallOutlined, LineChartOutlined, DollarCircleOutlined, PoundCircleOutlined, TagOutlined, BoxPlotOutlined, WarningOutlined, PercentageOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

const api = axios.create({
  baseURL: 'https://arunaenterprises.azurewebsites.net/admin/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  const [unitASummary, setUnitASummary] = useState(null); // New state for Unit A
  const [unitBSummary, setUnitBSummary] = useState(null); // New state for Unit B
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
      const data = response.data;
      setDailySummary(data);

      // Process data for Unit A and Unit B
      const unitAOrders = data.orderDetails.filter(order => order.unit === 'A');
      const unitBOrders = data.orderDetails.filter(order => order.unit === 'B');

      // Helper to calculate summary for a list of orders
      const calculateUnitSummary = (orders) => {
        const totalWeight = orders.reduce((sum, order) => sum + order.totalWeightConsumed, 0);
        const totalRevenue = orders.reduce((sum, order) => sum + (order.revenue || 0), 0);
        const totalProfit = orders.reduce((sum, order) => sum + (order.profit || 0), 0);
        const totalWastage = orders.reduce((sum, order) => sum + (order.totalReelWastage || 0), 0);
        const totalOrders = orders.length;

        const profitPercentage = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) + '%' : '0.00%';
        const wastagePercentage = totalWeight > 0 ? ((totalWastage / totalWeight) * 100).toFixed(2) + '%' : '0.00%';

        return {
          totalOrdersShipped: totalOrders,
          totalWeightConsumed: totalWeight,
          totalRevenueOfDay: totalRevenue,
          totalProfitOfDay: totalProfit,
          totalProfitOfDayPercentage: profitPercentage,
          totalReelWastageOfDay: totalWastage,
          totalReelWastageOfDayPercentage: wastagePercentage,
          orderDetails: orders,
        };
      };

      setUnitASummary(calculateUnitSummary(unitAOrders));
      setUnitBSummary(calculateUnitSummary(unitBOrders));

    } catch (error) {
      handleApiError(error, 'Failed to fetch daily summary');
      setDailySummary(null); // Clear summary on error
      setUnitASummary(null);
      setUnitBSummary(null);
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
      setRangeSummaries([]);
      setReelHistory([]);
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
      setRangeSummaries([]);
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

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchDailySummary(newDate);
  };

  const handleRangeDateSelectChange = (setter) => (value) => {
    setter(prevDate => prevDate.clone().date(value));
  };
  const handleRangeMonthSelectChange = (setter) => (value) => {
    setter(prevDate => prevDate.clone().month(value - 1));
  };
  const handleRangeYearSelectChange = (setter) => (value) => {
    setter(prevDate => prevDate.clone().year(value));
  };

  // Debounce for range date selectors to avoid excessive API calls
  const debouncedFetchRangeSummaries = useMemo(() => {
    let timeout;
    return (start, end) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fetchRangeSummaries(start, end);
      }, 500); // Debounce for 500ms
    };
  }, []);

  useEffect(() => {
    debouncedFetchRangeSummaries(startDate, endDate);
  }, [startDate, endDate, debouncedFetchRangeSummaries]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchMonthSummary(year, selectedMonth);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    fetchMonthSummary(selectedYear, month);
  };

  const generateSummary = async () => {
    setLoading(true); // Set loading for the button click
    try {
      // The backend should generate/update the daily summary for the selected date
      // This endpoint usually triggers a computation on the server-side
      await api.post(`/order-summaries/generate/${date.format('YYYY-MM-DD')}`);
      message.success('Daily summary generated successfully');
      fetchDailySummary(date); // Fetch the newly generated summary
    } catch (error) {
      handleApiError(error, 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const commonTableColumns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', responsive: ['md'] },
    { title: 'Client', dataIndex: 'client', key: 'client', sorter: (a, b) => a.client.localeCompare(b.client) },
    { title: 'Product Type', dataIndex: 'productType', key: 'productType', responsive: ['md'] },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName', responsive: ['lg'] },
    { title: 'Type of Product', dataIndex: 'typeOfProduct', key: 'typeOfProduct', responsive: ['lg'] },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', responsive: ['sm'] },
    { title: 'Size', dataIndex: 'size', key: 'size', responsive: ['md'] },
    { title: 'Unit', dataIndex: 'unit', key: 'unit', responsive: ['sm'] },
    {
      title: 'Total Weight (kg)',
      dataIndex: 'totalWeightConsumed',
      key: 'totalWeightConsumed',
      render: val => (val).toFixed(2),
      sorter: (a, b) => a.totalWeightConsumed - b.totalWeightConsumed
    },
    {
      title: 'Revenue (₹)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: val => val ? `₹${val.toFixed(2)}` : '₹0.00',
      sorter: (a, b) => a.revenue - b.revenue,
      responsive: ['md']
    },
    {
      title: 'Profit (₹)',
      dataIndex: 'profit',
      key: 'profit',
      render: val => val ? `₹${val.toFixed(2)}` : '₹0.00',
      sorter: (a, b) => a.profit - b.profit,
      responsive: ['md']
    },
    {
      title: 'Profit %',
      dataIndex: 'profitPercentage',
      key: 'profitPercentage',
      render: val => val || '0.00%',
      responsive: ['lg']
    },
    {
      title: 'Wastage (kg)',
      dataIndex: 'totalReelWastage',
      key: 'totalReelWastage',
      render: val => val ? val.toFixed(2) : '0.00',
      responsive: ['md']
    }
  ];

  const reelColumns = [
    { title: 'Reel No', dataIndex: 'reelNo', key: 'reelNo' },
    { title: 'Barcode', dataIndex: 'barcodeId', key: 'barcode' },
    { title: 'Reel Set', dataIndex: 'reelSet', key: 'reelSet', responsive: ['sm'] },
    { title: 'Usage Type', dataIndex: 'usageType', key: 'usageType', responsive: ['sm'] },
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
      render: date => moment(date).format('LL'),
      sorter: (a, b) => moment(a.summaryDate).unix() - moment(b.summaryDate).unix()
    },
    {
      title: 'Orders Shipped',
      dataIndex: 'totalOrdersShipped',
      key: 'totalOrdersShipped',
      sorter: (a, b) => a.totalOrdersShipped - b.totalOrdersShipped
    },
    {
      title: 'Total Weight (kg)',
      dataIndex: 'totalWeightConsumed',
      key: 'totalWeightConsumed',
      render: val => (val).toFixed(2),
      sorter: (a, b) => a.totalWeightConsumed - b.totalWeightConsumed
    },
    {
      title: 'Revenue (₹)',
      dataIndex: 'totalRevenueOfDay',
      key: 'totalRevenueOfDay',
      render: val => val ? `₹${val.toFixed(2)}` : '₹0.00',
      sorter: (a, b) => (a.totalRevenueOfDay || 0) - (b.totalRevenueOfDay || 0)
    },
    {
      title: 'Profit (₹)',
      dataIndex: 'totalProfitOfDay',
      key: 'totalProfitOfDay',
      render: val => val ? `₹${val.toFixed(2)}` : '₹0.00',
      sorter: (a, b) => (a.totalProfitOfDay || 0) - (b.totalProfitOfDay || 0)
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
      render: val => val ? val.toFixed(2) : '0.00',
      sorter: (a, b) => (a.totalReelWastageOfDay || 0) - (b.totalReelWastageOfDay || 0)
    }
  ];

  const renderCalendarCell = (date) => {
    const summary = rangeSummaries.find(s => moment(s.summaryDate).isSame(date, 'day'));
    if (!summary) return null;
    
    return (
      <div style={{ background: '#e6f7ff', padding: '4px', borderRadius: '4px', border: '1px solid #91d5ff', fontSize: '10px' }}>
        <div><Text strong>Orders:</Text> {summary.totalOrdersShipped}</div>
        <div><Text strong>Weight:</Text> {summary.totalWeightConsumed.toFixed(1)}kg</div>
        {summary.totalRevenueOfDay && <div><Text strong>Rev:</Text> ₹{summary.totalRevenueOfDay.toFixed(1)}</div>}
      </div>
    );
  };

  const renderSummaryCards = (summary, titlePrefix = "") => (
    <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Orders Shipped`}
            value={summary.totalOrdersShipped}
            prefix={<BoxPlotOutlined style={{ color: '#1890ff' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Total Weight (kg)`}
            value={summary.totalWeightConsumed.toFixed(2)}
            prefix={<LineChartOutlined style={{ color: '#52c41a' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Total Revenue (₹)`}
            value={summary.totalRevenueOfDay ? summary.totalRevenueOfDay.toFixed(2) : '0.00'}
            prefix={<DollarCircleOutlined style={{ color: '#faad14' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Total Profit (₹)`}
            value={summary.totalProfitOfDay ? summary.totalProfitOfDay.toFixed(2) : '0.00'}
            prefix={<PoundCircleOutlined style={{ color: '#f5222d' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Profit Margin`}
            value={summary.totalProfitOfDayPercentage || '0.00%'}
            prefix={<PercentageOutlined style={{ color: '#eb2f96' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Total Wastage (kg)`}
            value={summary.totalReelWastageOfDay ? summary.totalReelWastageOfDay.toFixed(2) : '0.00'}
            prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Wastage %`}
            value={summary.totalReelWastageOfDayPercentage || '0.00%'}
            prefix={<PercentageOutlined style={{ color: '#d43808' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="summary-card">
          <Statistic
            title={`${titlePrefix} Avg Weight/Order (kg)`}
            value={
              summary.totalOrdersShipped > 0
                ? (summary.totalWeightConsumed / summary.totalOrdersShipped).toFixed(2)
                : '0.00'
            }
            prefix={<TagOutlined style={{ color: '#722ed1' }} />}
          />
        </Card>
      </Col>
    </Row>
  );


  return (
    <div className="order-summary-page-container" style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '30px', textAlign: 'center', color: '#001529' }}>📊 Order Summaries & Analytics</Title>

      <Tabs defaultActiveKey="1" size="large" centered>
        <TabPane tab="Daily Summary" key="1">
          <Card className="summary-card-lg">
            <Row gutter={[16, 16]} justify="center" align="middle" style={{ marginBottom: '30px' }}>
              <Col xs={24} sm={18} md={12} lg={10} xl={8}>
                <Space direction="horizontal" size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                  <Select
                    style={{ minWidth: '90px' }}
                    value={date.year()}
                    onChange={(year) => handleDateChange(date.clone().year(year))}
                  >
                    {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ minWidth: '120px' }}
                    value={date.month() + 1}
                    onChange={(month) => handleDateChange(date.clone().month(month - 1))}
                  >
                    {moment.months().map((month, index) => (
                      <Option key={index + 1} value={index + 1}>{month}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ minWidth: '80px' }}
                    value={date.date()}
                    onChange={(day) => handleDateChange(date.clone().date(day))}
                  >
                    {Array.from({ length: date.daysInMonth() }, (_, i) => i + 1).map(day => (
                      <Option key={day} value={day}>{day}</Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col xs={24} sm={6} md={4} lg={3}>
                <Button
                  type="primary"
                  onClick={generateSummary}
                  loading={loading}
                  block
                  size="large"
                  icon={<RiseOutlined />}
                  style={{ borderRadius: '8px' }}
                >
                  Generate Summary
                </Button>
              </Col>
            </Row>

            <Spin spinning={loading} size="large" tip="Loading Daily Summary...">
              {dailySummary ? (
                <Tabs defaultActiveKey="combined" type="card" size="middle">
                  <TabPane tab="Combined Summary" key="combined">
                    <Title level={4} style={{ textAlign: 'center', margin: '20px 0', color: '#001529' }}>Overall Daily Performance - {date.format('LL')}</Title>
                    {renderSummaryCards(dailySummary, "Overall")}
                    <Title level={4} style={{ margin: '20px 0 16px 0', color: '#001529' }}>Combined Order Details</Title>
                    <Table
                      columns={commonTableColumns}
                      dataSource={dailySummary.orderDetails}
                      rowKey={record => record.orderId}
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: 1300 }} // Enable horizontal scroll for many columns
                      expandable={{
                        expandedRowRender: record => (
                          <Table
                            columns={reelColumns}
                            dataSource={record.reelUsages}
                            rowKey="reelNo"
                            pagination={false}
                            size="small"
                            scroll={{ x: 800 }}
                          />
                        ),
                        rowExpandable: record => record.reelUsages && record.reelUsages.length > 0,
                      }}
                    />
                  </TabPane>

                  <TabPane tab="Unit A Summary" key="unitA">
                    <Title level={4} style={{ textAlign: 'center', margin: '20px 0', color: '#001529' }}>Unit A Performance - {date.format('LL')}</Title>
                    {unitASummary && unitASummary.totalOrdersShipped > 0 ? (
                      <>
                        {renderSummaryCards(unitASummary, "Unit A")}
                        <Title level={4} style={{ margin: '20px 0 16px 0', color: '#001529' }}>Unit A Order Details</Title>
                        <Table
                          columns={commonTableColumns}
                          dataSource={unitASummary.orderDetails}
                          rowKey={record => record.orderId}
                          pagination={{ pageSize: 10 }}
                          scroll={{ x: 1300 }}
                          expandable={{
                            expandedRowRender: record => (
                              <Table
                                columns={reelColumns}
                                dataSource={record.reelUsages}
                                rowKey="reelNo"
                                pagination={false}
                                size="small"
                                scroll={{ x: 800 }}
                              />
                            ),
                            rowExpandable: record => record.reelUsages && record.reelUsages.length > 0,
                          }}
                        />
                      </>
                    ) : (
                      <Empty description="No Unit A orders for this day" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </TabPane>

                  <TabPane tab="Unit B Summary" key="unitB">
                    <Title level={4} style={{ textAlign: 'center', margin: '20px 0', color: '#001529' }}>Unit B Performance - {date.format('LL')}</Title>
                    {unitBSummary && unitBSummary.totalOrdersShipped > 0 ? (
                      <>
                        {renderSummaryCards(unitBSummary, "Unit B")}
                        <Title level={4} style={{ margin: '20px 0 16px 0', color: '#001529' }}>Unit B Order Details</Title>
                        <Table
                          columns={commonTableColumns}
                          dataSource={unitBSummary.orderDetails}
                          rowKey={record => record.orderId}
                          pagination={{ pageSize: 10 }}
                          scroll={{ x: 1300 }}
                          expandable={{
                            expandedRowRender: record => (
                              <Table
                                columns={reelColumns}
                                dataSource={record.reelUsages}
                                rowKey="reelNo"
                                pagination={false}
                                size="small"
                                scroll={{ x: 800 }}
                              />
                            ),
                            rowExpandable: record => record.reelUsages && record.reelUsages.length > 0,
                          }}
                        />
                      </>
                    ) : (
                      <Empty description="No Unit B orders for this day" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </TabPane>
                </Tabs>
              ) : (
                <Empty description="No daily summary data available for the selected date. Generate one!" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Spin>
          </Card>
        </TabPane>

        <TabPane tab="Range Summary" key="2">
          <Card className="summary-card-lg">
            <Row gutter={[16, 16]} justify="center" align="middle" style={{ marginBottom: '30px' }}>
              <Col xs={24} sm={18} md={12} lg={10} xl={8}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Text strong>Start:</Text>
                    <Select
                      style={{ minWidth: '90px' }}
                      value={startDate.year()}
                      onChange={handleRangeYearSelectChange(setStartDate)}
                    >
                      {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                        <Option key={year} value={year}>{year}</Option>
                      ))}
                    </Select>
                    <Select
                      style={{ minWidth: '120px' }}
                      value={startDate.month() + 1}
                      onChange={handleRangeMonthSelectChange(setStartDate)}
                    >
                      {moment.months().map((month, index) => (
                        <Option key={index + 1} value={index + 1}>{month}</Option>
                      ))}
                    </Select>
                    <Select
                      style={{ minWidth: '80px' }}
                      value={startDate.date()}
                      onChange={handleRangeDateSelectChange(setStartDate)}
                    >
                      {Array.from({ length: startDate.daysInMonth() }, (_, i) => i + 1).map(day => (
                        <Option key={day} value={day}>{day}</Option>
                      ))}
                    </Select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Text strong>End:</Text>
                    <Select
                      style={{ minWidth: '90px' }}
                      value={endDate.year()}
                      onChange={handleRangeYearSelectChange(setEndDate)}
                    >
                      {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                        <Option key={year} value={year}>{year}</Option>
                      ))}
                    </Select>
                    <Select
                      style={{ minWidth: '120px' }}
                      value={endDate.month() + 1}
                      onChange={handleRangeMonthSelectChange(setEndDate)}
                    >
                      {moment.months().map((month, index) => (
                        <Option key={index + 1} value={index + 1}>{month}</Option>
                      ))}
                    </Select>
                    <Select
                      style={{ minWidth: '80px' }}
                      value={endDate.date()}
                      onChange={handleRangeDateSelectChange(setEndDate)}
                    >
                      {Array.from({ length: endDate.daysInMonth() }, (_, i) => i + 1).map(day => (
                        <Option key={day} value={day}>{day}</Option>
                      ))}
                    </Select>
                  </div>
                </Space>
              </Col>
            </Row>

            <Spin spinning={loading} size="large" tip="Loading Range Summary...">
              {rangeSummaries.length > 0 ? (
                <>
                  <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="summary-card">
                        <Statistic
                          title="Total Orders"
                          value={rangeSummaries.reduce((sum, s) => sum + s.totalOrdersShipped, 0)}
                          prefix={<BoxPlotOutlined style={{ color: '#1890ff' }} />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="summary-card">
                        <Statistic
                          title="Total Weight (kg)"
                          value={rangeSummaries.reduce((sum, s) => sum + s.totalWeightConsumed, 0).toFixed(2)}
                          prefix={<LineChartOutlined style={{ color: '#52c41a' }} />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="summary-card">
                        <Statistic
                          title="Total Revenue (₹)"
                          value={rangeSummaries.reduce((sum, s) => sum + (s.totalRevenueOfDay || 0), 0).toFixed(2)}
                          prefix={<DollarCircleOutlined style={{ color: '#faad14' }} />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="summary-card">
                        <Statistic
                          title="Total Profit (₹)"
                          value={rangeSummaries.reduce((sum, s) => sum + (s.totalProfitOfDay || 0), 0).toFixed(2)}
                          prefix={<PoundCircleOutlined style={{ color: '#f5222d' }} />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Title level={4} style={{ margin: '20px 0 16px 0', color: '#001529' }}>Summary by Day</Title>
                  <Table
                    columns={rangeSummaryColumns}
                    dataSource={rangeSummaries}
                    rowKey="id"
                    pagination={{ pageSize: 7 }}
                    loading={loading}
                    scroll={{ x: 1000 }}
                    expandable={{
                      expandedRowRender: record => (
                        <Table
                          columns={commonTableColumns}
                          dataSource={record.orderDetails}
                          rowKey={r => r.orderId}
                          pagination={false}
                          size="small"
                          scroll={{ x: 1300 }}
                        />
                      ),
                      rowExpandable: record => record.orderDetails && record.orderDetails.length > 0,
                    }}
                  />

                  <Title level={4} style={{ margin: '30px 0 16px 0', color: '#001529' }}>Reel Usage History</Title>
                  <Table
                    columns={historyColumns}
                    dataSource={reelHistory}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    loading={loading}
                    scroll={{ x: 800 }}
                  />
                </>
              ) : (
                <Empty description="No range summary data available for the selected period." image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Spin>
          </Card>
        </TabPane>

        <TabPane tab="Calendar View" key="3">
          <Card className="summary-card-lg">
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
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

            <Spin spinning={calendarLoading} size="large" tip="Loading Calendar Data...">
              <Calendar
                mode="month"
                validRange={[
                  moment().year(selectedYear).month(selectedMonth - 1).startOf('month'), 
                  moment().year(selectedYear).month(selectedMonth - 1).endOf('month')
                ]}
                dateCellRender={renderCalendarCell} // Use dateCellRender for a more flexible cell content
                onPanelChange={(date, mode) => {
                  if (mode === 'month') {
                    setSelectedYear(date.year());
                    setSelectedMonth(date.month() + 1);
                    fetchMonthSummary(date.year(), date.month() + 1);
                  }
                }}
                className="custom-calendar" // Custom class for potential styling
              />
            </Spin>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderSummaryPage;
