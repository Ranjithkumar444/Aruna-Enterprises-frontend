import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TextField,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Stack,
  Avatar,
  useTheme
} from '@mui/material';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Equalizer, LocalShipping, MonetizationOn, AttachMoney, PieChart } from '@mui/icons-material';
import AccessDeniedMessage from './AccessDeneidMessage';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const OrderSummaryDashboard = () => {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [rangeData, setRangeData] = useState([]);
  const [hasAccessError, setHasAccessError] = useState(false); 

  const adminToken = localStorage.getItem('adminToken');

  const fetchDailySummary = async (selectedDate) => {
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/api/order-summaries/daily/${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      setSummaryData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setSummaryData(null);
      if (err.response?.status === 401) {
        setHasAccessError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRangeSummary = async (start, end) => {
    try {
      setLoading(true);
      const formattedStart = format(start, 'yyyy-MM-dd');
      const formattedEnd = format(end, 'yyyy-MM-dd');
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/api/order-summaries/range?start=${formattedStart}&end=${formattedEnd}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      setRangeData(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setRangeData([]);
      if (err.response?.status === 401) {
        setHasAccessError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      setHasAccessError(true);
      return; 
    }

    if (timeRange === 'daily') {
      fetchDailySummary(date);
    } else {
      fetchRangeSummary(startDate, endDate);
    }
  }, [date, timeRange, startDate, endDate, adminToken]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  // Color palette
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    grey: '#9e9e9e',
    dark: '#212121'
  };

  // Prepare data for charts with null checks
  const prepareClientDistributionData = () => {
    if (!summaryData?.orderDetails?.length) return { labels: [], datasets: [] };

    const clientMap = {};
    summaryData.orderDetails.forEach(order => {
      if (order.client) {
        clientMap[order.client] = (clientMap[order.client] || 0) + (order.quantity || 0);
      }
    });

    const labels = Object.keys(clientMap);
    const data = Object.values(clientMap);

    return {
      labels,
      datasets: [
        {
          label: 'Quantity by Client',
          data,
          backgroundColor: [
            colors.primary,
            colors.secondary,
            colors.success,
            colors.warning,
            colors.info,
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareProductTypeData = () => {
    if (!summaryData?.orderDetails?.length) return { labels: [], datasets: [] };

    const productMap = {};
    summaryData.orderDetails.forEach(order => {
      if (order.productType) {
        productMap[order.productType] = (productMap[order.productType] || 0) + (order.quantity || 0);
      }
    });

    const labels = Object.keys(productMap);
    const data = Object.values(productMap);

    return {
      labels,
      datasets: [
        {
          label: 'Quantity by Product Type',
          data,
          backgroundColor: [
            colors.primary,
            colors.secondary,
            colors.success,
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareFinancialData = () => {
    if (!summaryData) return { labels: [], datasets: [] };

    return {
      labels: ['Revenue', 'Profit', 'Wastage Cost'],
      datasets: [
        {
          label: 'Amount (₹)',
          data: [
            summaryData.totalRevenueOfDay || 0,
            summaryData.totalProfitOfDay || 0,
            (summaryData.totalReelWastageOfDay || 0) * 50 // Assuming ₹50/kg wastage cost
          ],
          backgroundColor: [
            colors.success,
            colors.primary,
            colors.error,
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareWastageData = () => {
    if (!summaryData?.orderDetails?.length) return { labels: [], datasets: [] };

    const wastageData = summaryData.orderDetails
      .filter(order => (order.totalReelWastage || 0) > 0)
      .map(order => ({
        orderId: order.orderId || '',
        wastage: order.totalReelWastage || 0,
        percentage: parseFloat(order.totalReelWastagePercentage) || 0,
        client: order.client || ''
      }));

    if (wastageData.length === 0) return { labels: [], datasets: [] };

    return {
      labels: wastageData.map(item => `${item.client} (Order ${item.orderId})`),
      datasets: [
        {
          label: 'Wastage (kg)',
          data: wastageData.map(item => item.wastage),
          backgroundColor: colors.error,
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
        {
          label: 'Wastage Percentage',
          data: wastageData.map(item => item.percentage),
          backgroundColor: colors.warning,
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y1',
        }
      ],
    };
  };

  const prepareTimeSeriesData = () => {
    if (!rangeData?.length) return { labels: [], datasets: [] };

    return {
      labels: rangeData.map(item => format(new Date(item.summaryDate), 'MMM dd')),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: rangeData.map(item => item.totalRevenueOfDay || 0),
          borderColor: colors.success,
          backgroundColor: `${colors.success}20`,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Profit (₹)',
          data: rangeData.map(item => item.totalProfitOfDay || 0),
          borderColor: colors.primary,
          backgroundColor: `${colors.primary}20`,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Wastage (kg)',
          data: rangeData.map(item => item.totalReelWastageOfDay || 0),
          borderColor: colors.error,
          backgroundColor: `${colors.error}20`,
          tension: 0.3,
          fill: true
        }
      ],
    };
  };

  const prepareProductivityData = () => {
    if (!summaryData?.orderDetails?.length) return { labels: [], datasets: [] };

    const productivity = summaryData.orderDetails
      .filter(order => order.orderId) // Only orders with ID
      .map(order => ({
        orderId: order.orderId,
        client: order.client || 'Unknown',
        efficiency: 100 - (parseFloat(order.totalReelWastagePercentage) || 0)
      }));

    return {
      labels: productivity.map(item => `${item.client} (Order ${item.orderId})`),
      datasets: [
        {
          label: 'Production Efficiency (%)',
          data: productivity.map(item => item.efficiency),
          backgroundColor: productivity.map(item => 
            item.efficiency > 95 ? colors.success : 
            item.efficiency > 90 ? colors.warning : colors.error
          ),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (['Revenue', 'Profit', 'Wastage Cost'].includes(context.label)) {
                label += '₹' + context.parsed.y.toLocaleString();
              } else if (context.label.includes('Percentage') || context.label.includes('Efficiency')) {
                label += context.parsed.y.toFixed(2) + '%';
              } else {
                label += context.parsed.y.toFixed(2) + ' kg';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      },
      y: {
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      }
    }
  };

  const wastageOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Wastage (kg)',
          color: theme.palette.text.secondary
        },
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Percentage (%)',
          color: theme.palette.text.secondary
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: 100,
        ticks: {
          color: theme.palette.text.secondary
        }
      },
    },
  };

  const timeSeriesOptions = {
    ...chartOptions,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      ...chartOptions.scales,
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  const StatCard = ({ icon, title, value, percentage, trend }) => {
    const trendColor = trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.grey;
    return (
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          bgcolor: trendColor + '10',
          borderRadius: '50%',
          transform: 'translate(40px, -40px)'
        }} />
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Avatar sx={{ bgcolor: trendColor + '20', color: trendColor }}>
              {icon}
            </Avatar>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {typeof value === 'number' ? 
              value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) : 
              value}
          </Typography>
          {percentage && (
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <TrendingUp sx={{ 
                color: trendColor, 
                transform: trend === 'down' ? 'rotate(180deg)' : 'none' 
              }} />
              <Typography variant="body2" color={trendColor}>
                {percentage}
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  };

  if (hasAccessError) {
    return <AccessDeniedMessage />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Order Summary Dashboard
        </Typography>
        <Chip 
          label={format(date, 'MMMM yyyy')} 
          color="primary" 
          variant="outlined"
          sx={{ px: 2, py: 1, fontSize: '0.875rem' }}
        />
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="daily">Daily Summary</MenuItem>
                <MenuItem value="range">Date Range Analysis</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {timeRange === 'daily' ? (
            <Grid item xs={12} md={4}>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                customInput={
                  <TextField
                    fullWidth
                    label="Select Date"
                    variant="outlined"
                  />
                }
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={3}>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMMM d, yyyy"
                  customInput={
                    <TextField
                      fullWidth
                      label="Start Date"
                      variant="outlined"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="MMMM d, yyyy"
                  customInput={
                    <TextField
                      fullWidth
                      label="End Date"
                      variant="outlined"
                    />
                  }
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: colors.error + '10' }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Paper>
      )}

      {timeRange === 'daily' && summaryData && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <StatCard 
                icon={<LocalShipping />}
                title="Orders Shipped" 
                value={summaryData.totalOrdersShipped || 0}
                trend="up"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                icon={<MonetizationOn />}
                title="Total Revenue" 
                value={summaryData.totalRevenueOfDay || 0}
                percentage={summaryData.totalRevenueOfDayPercentage || '0%'}
                trend="up"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                icon={<AttachMoney />}
                title="Total Profit" 
                value={summaryData.totalProfitOfDay || 0}
                percentage={summaryData.totalProfitOfDayPercentage || '0%'}
                trend="up"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                icon={<TrendingDown />}
                title="Total Wastage" 
                value={(summaryData.totalReelWastageOfDay || 0).toFixed(2) + ' kg'}
                percentage={summaryData.totalReelWastageOfDayPercentage || '0%'}
                trend="down"
              />
            </Grid>
          </Grid>

          {/* Charts Row 1 */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Client Distribution (Quantity)
                </Typography>
                <Box sx={{ height: 400 }}>
                  {summaryData?.orderDetails?.length ? (
                    <Doughnut data={prepareClientDistributionData()} options={chartOptions} />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography>No client data available</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Product Type Distribution
                </Typography>
                <Box sx={{ height: 400 }}>
                  {summaryData?.orderDetails?.length ? (
                    <Pie data={prepareProductTypeData()} options={chartOptions} />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography>No product data available</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Row 2 */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Financial Overview
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar data={prepareFinancialData()} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Production Efficiency
                </Typography>
                <Box sx={{ height: 400 }}>
                  {summaryData?.orderDetails?.length ? (
                    <Bar data={prepareProductivityData()} options={chartOptions} />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography>No efficiency data available</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Wastage Analysis */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Wastage Analysis
            </Typography>
            <Box sx={{ height: 400 }}>
              {summaryData?.orderDetails?.filter(order => (order.totalReelWastage || 0) > 0).length ? (
                <Bar data={prepareWastageData()} options={wastageOptions} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography>No wastage data available</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Order Details Table */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Order Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Product Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Profit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Wastage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summaryData.orderDetails?.map((order) => (
                    <TableRow 
                      key={order.orderId}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.client || 'Unknown'} 
                          size="small" 
                          sx={{ 
                            bgcolor: order.client === 'Kamtech' ? colors.primary + '20' : 
                                    order.client === 'RBA' ? colors.secondary + '20' : 
                                    colors.success + '20',
                            color: order.client === 'Kamtech' ? colors.primary : 
                                  order.client === 'RBA' ? colors.secondary : 
                                  colors.success
                          }} 
                        />
                      </TableCell>
                      <TableCell>{order.productType || '-'}</TableCell>
                      <TableCell>{order.quantity || 0}</TableCell>
                      <TableCell>
                        <Chip label={order.size || '-'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{(order.totalWeightConsumed || 0).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {order.revenue ? `₹${order.revenue.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          color: parseFloat(order.profitPercentage) > 15 ? colors.success : 
                                parseFloat(order.profitPercentage) > 10 ? colors.warning : colors.error
                        }}>
                          {order.profit ? `₹${order.profit.toLocaleString()}` : '-'}
                          {order.profitPercentage && (
                            <Typography variant="caption" display="block">
                              ({order.profitPercentage})
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          color: parseFloat(order.totalReelWastagePercentage) > 5 ? colors.error : 
                                parseFloat(order.totalReelWastagePercentage) > 3 ? colors.warning : colors.success
                        }}>
                          {(order.totalReelWastage || 0).toFixed(2)} kg
                          {order.totalReelWastagePercentage && (
                            <Typography variant="caption" display="block">
                              ({order.totalReelWastagePercentage})
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {timeRange === 'range' && rangeData.length > 0 && (
        <>
          {/* Time Series Chart */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Performance Over Time
            </Typography>
            <Box sx={{ height: 500 }}>
              <Line data={prepareTimeSeriesData()} options={timeSeriesOptions} />
            </Box>
          </Paper>

          {/* Summary Table */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Daily Summaries
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Orders</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Profit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Profit %</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Wastage (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Wastage %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rangeData.map((summary) => (
                    <TableRow 
                      key={summary.summaryDate}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{summary.summaryDate}</TableCell>
                      <TableCell align="right">{summary.totalOrdersShipped || 0}</TableCell>
                      <TableCell align="right">{(summary.totalWeightConsumed || 0).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {summary.totalRevenueOfDay ? `₹${summary.totalRevenueOfDay.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          color: parseFloat(summary.totalProfitOfDayPercentage) > 15 ? colors.success : 
                                parseFloat(summary.totalProfitOfDayPercentage) > 10 ? colors.warning : colors.error
                        }}>
                          {summary.totalProfitOfDay ? `₹${summary.totalProfitOfDay.toLocaleString()}` : '-'}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          color: parseFloat(summary.totalProfitOfDayPercentage) > 15 ? colors.success : 
                                parseFloat(summary.totalProfitOfDayPercentage) > 10 ? colors.warning : colors.error
                        }}>
                          {summary.totalProfitOfDayPercentage || '-'}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          color: parseFloat(summary.totalReelWastageOfDayPercentage) > 5 ? colors.error : 
                                parseFloat(summary.totalReelWastageOfDayPercentage) > 3 ? colors.warning : colors.success
                        }}>
                          {(summary.totalReelWastageOfDay || 0).toFixed(2)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          color: parseFloat(summary.totalReelWastageOfDayPercentage) > 5 ? colors.error : 
                                parseFloat(summary.totalReelWastageOfDayPercentage) > 3 ? colors.warning : colors.success
                        }}>
                          {summary.totalReelWastageOfDayPercentage || '-'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {timeRange === 'range' && rangeData.length === 0 && !loading && (
        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1">
            No data available for the selected date range
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default OrderSummaryDashboard;
