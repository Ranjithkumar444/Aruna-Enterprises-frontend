import React, { useState, useEffect, useMemo } from 'react';
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
  useTheme,
  Tabs, 
  Tab,
  Button,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { 
  TrendingUp, TrendingDown, LocalShipping, MonetizationOn, AttachMoney, 
  Recycling, GroupWork, Equalizer, LineAxisOutlined 
} from '@mui/icons-material';

// Custom light theme for a clean, modern aesthetic
const lightAestheticTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#42a5f5', // Blue
    },
    secondary: {
      main: '#66bb6a', // Green
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#e0e0e0',
    error: {
      main: '#ef5350',
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#29b6f6',
    },
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#212121',
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#ffffff',
          backgroundColor: '#42a5f5',
          '&:hover': {
            backgroundColor: '#1e88e5',
          },
        },
      },
    },
  },
});

const AccessDeniedMessage = () => (
  <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You do not have permission to view this content. Please ensure you are logged in with appropriate credentials.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => window.location.href = '/login'}>
          Go to Login
        </Button>
      </Box>
    </Paper>
  </Container>
);

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

const generateUniqueColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const OrderSummaryDashboard = () => {
  const theme = useTheme(lightAestheticTheme);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [summaryData, setSummaryData] = useState(null);
  const [unitASummary, setUnitASummary] = useState(null);
  const [unitBSummary, setUnitBSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('daily');
  const [startDate, setStartDate] = useState(format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [rangeData, setRangeData] = useState([]);
  const [hasAccessError, setHasAccessError] = useState(false);
  const [dailyTabIndex, setDailyTabIndex] = useState(0);

  const adminToken = localStorage.getItem('adminToken');

  const chartColors = useMemo(() => ([
    theme.palette.primary.main, 
    theme.palette.secondary.main, 
    theme.palette.success.main, 
    theme.palette.warning.main, 
    theme.palette.error.main, 
    theme.palette.info.main, 
    '#5c6bc0', '#26a69a', '#ffb74d', '#78909c', '#e57373'
  ]), [theme]);

  const calculateSubSummary = (orders) => {
    const totalWeight = orders.reduce((sum, order) => sum + (order.totalWeightConsumed || 0), 0);
    const totalRevenue = orders.reduce((sum, order) => sum + (order.revenue || 0), 0);
    const totalProfit = orders.reduce((sum, order) => sum + (order.profit || 0), 0);
    const totalWastage = orders.reduce((sum, order) => sum + (order.totalReelWastage || 0), 0);
    const totalOrders = orders.length;

    const profitPercentageNum = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;
    const wastagePercentageNum = totalWeight > 0 ? ((totalWastage / totalWeight) * 100) : 0;

    return {
      totalOrdersShipped: totalOrders,
      totalWeightConsumed: totalWeight,
      totalRevenueOfDay: totalRevenue,
      totalProfitOfDay: totalProfit,
      totalProfitOfDayPercentage: profitPercentageNum.toFixed(2) + '%',
      totalReelWastageOfDay: totalWastage,
      totalReelWastageOfDayPercentage: wastagePercentageNum.toFixed(2) + '%',
      orderDetails: orders,
    };
  };

  const fetchDailySummary = async (selectedDateString) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/api/order-summaries/daily/${selectedDateString}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      const data = response.data;
      setSummaryData(data);

      const unitAOrders = data.orderDetails.filter(order => order.unit === 'A');
      const unitBOrders = data.orderDetails.filter(order => order.unit === 'B');
      
      setUnitASummary(calculateSubSummary(unitAOrders));
      setUnitBSummary(calculateSubSummary(unitBOrders));

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch daily summary data.');
      setSummaryData(null);
      setUnitASummary(null);
      setUnitBSummary(null);
      setHasAccessError(err.response?.status === 401 || err.response?.status === 403);
    } finally {
      setLoading(false);
    }
  };

  const fetchRangeSummary = async (startString, endString) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/api/order-summaries/range?start=${startString}&end=${endString}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      setRangeData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch range summary data.');
      setRangeData([]);
      setHasAccessError(err.response?.status === 401 || err.response?.status === 403);
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

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: { family: theme.typography.fontFamily, size: 12 }
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
              if (label.includes('₹')) { 
                label += '₹' + context.parsed.y.toLocaleString();
              } else if (label.includes('%') || context.dataset.label.includes('Efficiency')) {
                label += context.parsed.y.toFixed(2) + '%';
              } else if (label.includes('kg')) {
                 label += context.parsed.y.toFixed(2) + ' kg';
              } else {
                label += context.parsed.y.toLocaleString();
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: theme.palette.divider },
        ticks: { color: theme.palette.text.secondary }
      },
      y: {
        grid: { color: theme.palette.divider },
        ticks: { color: theme.palette.text.secondary }
      }
    }
  };

  const prepareClientDistributionData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const clientMap = {};
    dataToUse.orderDetails.forEach(order => {
      if (clientMap[order.client]) {
        clientMap[order.client] += order.quantity;
      } else {
        clientMap[order.client] = order.quantity;
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
          backgroundColor: labels.map(label => generateUniqueColor(label)),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareProductTypeData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const productMap = {};
    dataToUse.orderDetails.forEach(order => {
      if (productMap[order.productType]) {
        productMap[order.productType] += order.quantity;
      } else {
        productMap[order.productType] = order.quantity;
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
          backgroundColor: labels.map(label => generateUniqueColor(label)),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareFinancialData = (dataToUse) => {
    if (!dataToUse) return { labels: [], datasets: [] };

    return {
      labels: ['Total Revenue', 'Total Profit', 'Total Wastage Cost'],
      datasets: [
        {
          label: 'Amount (₹)',
          data: [
            dataToUse.totalRevenueOfDay,
            dataToUse.totalProfitOfDay,
            dataToUse.totalReelWastageOfDay * (dataToUse.totalWeightConsumed > 0 ? (dataToUse.totalRevenueOfDay / dataToUse.totalWeightConsumed) : 0) 
          ],
          backgroundColor: [
            theme.palette.success.main, 
            theme.palette.primary.main, 
            theme.palette.error.main, 
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareWastageData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const wastageData = dataToUse.orderDetails
      .filter(order => order.totalReelWastage > 0)
      .map(order => ({
        orderId: order.orderId,
        wastage: order.totalReelWastage,
        percentage: parseFloat(order.totalReelWastagePercentage) || 0,
        client: order.client
      }));

    return {
      labels: wastageData.map(item => `${item.client} (Order ${item.orderId})`),
      datasets: [
        {
          label: 'Wastage (kg)',
          data: wastageData.map(item => item.wastage),
          backgroundColor: theme.palette.error.main, 
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
        {
          label: 'Wastage Percentage',
          data: wastageData.map(item => item.percentage),
          backgroundColor: theme.palette.warning.main, 
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y1',
        }
      ],
    };
  };

  const prepareTimeSeriesData = () => {
    if (rangeData.length === 0) return { labels: [], datasets: [] };

    return {
      labels: rangeData.map(item => format(parseISO(item.summaryDate), 'MMM dd')),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: rangeData.map(item => item.totalRevenueOfDay),
          borderColor: theme.palette.success.main,
          backgroundColor: theme.palette.success.light + '20',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Profit (₹)',
          data: rangeData.map(item => item.totalProfitOfDay),
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light + '20',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Wastage (kg)',
          data: rangeData.map(item => item.totalReelWastageOfDay),
          borderColor: theme.palette.error.main,
          backgroundColor: theme.palette.error.light + '20',
          tension: 0.3,
          fill: true,
          yAxisID: 'y1' 
        }
      ],
    };
  };

  const prepareProductivityData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const productivity = dataToUse.orderDetails.map(order => ({
      orderId: order.orderId,
      client: order.client,
      efficiency: 100 - (parseFloat(order.totalReelWastagePercentage) || 0)
    }));

    return {
      labels: productivity.map(item => `${item.client} (Order ${item.orderId})`),
      datasets: [
        {
          label: 'Production Efficiency (%)',
          data: productivity.map(item => item.efficiency),
          backgroundColor: productivity.map(item => 
            item.efficiency > 95 ? theme.palette.success.main : 
            item.efficiency > 90 ? theme.palette.warning.main : 
            theme.palette.error.main
          ),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        }
      ],
    };
  };

  const prepareReelUsageTypeData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const usageTypeMap = {};
    dataToUse.orderDetails.forEach(order => {
      order.reelUsages.forEach(reel => {
        const type = reel.usageType || 'Other';
        usageTypeMap[type] = (usageTypeMap[type] || 0) + (reel.weightConsumed || 0);
      });
    });

    const labels = Object.keys(usageTypeMap);
    const data = Object.values(usageTypeMap);

    return {
      labels,
      datasets: [
        {
          label: 'Weight Consumed (kg)',
          data,
          backgroundColor: labels.map(label => generateUniqueColor(label)),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareGsmDistributionData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const gsmMap = {};
    dataToUse.orderDetails.forEach(order => {
      order.reelUsages.forEach(reel => {
        const gsm = reel.gsm || 'N/A';
        gsmMap[gsm] = (gsmMap[gsm] || 0) + (reel.weightConsumed || 0);
      });
    });

    const labels = Object.keys(gsmMap).sort((a,b) => a.localeCompare(b));
    const data = labels.map(label => gsmMap[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Weight Consumed (kg)',
          data,
          backgroundColor: labels.map(label => generateUniqueColor(label)),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareDeckleDistributionData = (dataToUse) => {
    if (!dataToUse || !dataToUse.orderDetails || dataToUse.orderDetails.length === 0) return { labels: [], datasets: [] };

    const deckleMap = {};
    dataToUse.orderDetails.forEach(order => {
      order.reelUsages.forEach(reel => {
        const deckle = reel.deckle || 'N/A';
        deckleMap[deckle] = (deckleMap[deckle] || 0) + (reel.weightConsumed || 0);
      });
    });

    const labels = Object.keys(deckleMap).sort((a,b) => a.localeCompare(b));
    const data = labels.map(label => deckleMap[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Weight Consumed (kg)',
          data,
          backgroundColor: labels.map(label => generateUniqueColor(label)),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    };
  };

  const wastageOptions = {
    ...defaultChartOptions,
    scales: {
      x: defaultChartOptions.scales.x,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Wastage (kg)',
          color: theme.palette.text.secondary
        },
        grid: { color: theme.palette.divider },
        ticks: { color: theme.palette.text.secondary }
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
        grid: { drawOnChartArea: false },
        min: 0,
        max: 100,
        ticks: { color: theme.palette.text.secondary }
      },
    },
  };

  const timeSeriesOptions = {
    ...defaultChartOptions,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: defaultChartOptions.scales.x,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.secondary,
          callback: function(value) { return '₹' + value.toLocaleString(); }
        },
        title: {
            display: true,
            text: 'Amount (₹)',
            color: theme.palette.text.secondary
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: {
            color: theme.palette.text.secondary,
            callback: function(value) { return value.toFixed(0) + ' kg'; }
        },
        title: {
            display: true,
            text: 'Wastage (kg)',
            color: theme.palette.text.secondary
        }
      }
    }
  };

  const StatCard = ({ icon, title, value, percentage, trend, sx = {} }) => {
    const trendColor = trend === 'up' ? theme.palette.success.main : trend === 'down' ? theme.palette.error.main : theme.palette.text.secondary;
    
    return (
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden', ...sx }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          bgcolor: trendColor,
          opacity: 0.1,
          borderRadius: '50%',
          transform: 'translate(40px, -40px)',
        }} />
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Avatar sx={{ bgcolor: trendColor + '20', color: trendColor }}>
              {icon}
            </Avatar>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            {typeof value === 'number' ? 
              (title.includes('Revenue') || title.includes('Profit') ? 
                value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) :
                value.toFixed(2) + (title.includes('Weight') ? ' kg' : '')
              ) : 
              value}
          </Typography>
          {percentage && (
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              {trend === 'up' && <TrendingUp sx={{ color: trendColor }} />}
              {trend === 'down' && <TrendingDown sx={{ color: trendColor }} />}
              <Typography variant="body2" sx={{ color: trendColor, fontWeight: 600 }}>
                {percentage}
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderOrderDetailsTable = (orders) => (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mt: 3, overflowX: 'auto' }}>
      <Table stickyHeader aria-label="order details table">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Product Type</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Type of Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell align="right">Total Weight (kg)</TableCell>
            <TableCell align="right">Revenue</TableCell>
            <TableCell align="right">Profit</TableCell>
            <TableCell align="right">Wastage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.orderId}
              sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover }, '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{order.orderId}</TableCell>
              <TableCell>
                <Chip 
                  label={order.client} 
                  size="small" 
                  sx={{ 
                    bgcolor: generateUniqueColor(order.client) + '20',
                    color: generateUniqueColor(order.client),
                    fontWeight: 600
                  }} 
                />
              </TableCell>
              <TableCell>{order.productType || 'N/A'}</TableCell>
              <TableCell>{order.productName || 'N/A'}</TableCell>
              <TableCell>{order.typeOfProduct || 'N/A'}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                <Chip label={order.size || 'N/A'} size="small" variant="outlined" sx={{ borderColor: theme.palette.divider }} />
              </TableCell>
              <TableCell><Chip label={order.unit || 'N/A'} size="small" variant="outlined" color="primary"/></TableCell>
              <TableCell align="right">{order.totalWeightConsumed?.toFixed(2) || '0.00'}</TableCell>
              <TableCell align="right">₹{order.revenue?.toLocaleString() || '0'}</TableCell>
              <TableCell align="right">
                <Box sx={{ 
                  color: (parseFloat(order.profitPercentage) || 0) > 20 ? theme.palette.success.main : 
                         (parseFloat(order.profitPercentage) || 0) > 10 ? theme.palette.warning.main : 
                         theme.palette.error.main
                }}>
                  ₹{order.profit?.toLocaleString() || '0'} 
                  <Typography variant="caption" display="block" sx={{ fontWeight: 600 }}>
                    ({order.profitPercentage || '0.00%'})
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ 
                  color: (parseFloat(order.totalReelWastagePercentage) || 0) > 5 ? theme.palette.error.main : 
                         (parseFloat(order.totalReelWastagePercentage) || 0) > 2 ? theme.palette.warning.main : 
                         theme.palette.success.main
                }}>
                  {order.totalReelWastage?.toFixed(2) || '0.00'} kg
                  <Typography variant="caption" display="block" sx={{ fontWeight: 600 }}>
                    ({order.totalReelWastagePercentage || '0.00%'})
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderSummaryContent = (dataToRender, unitPrefix = "") => {
    if (!dataToRender || dataToRender.totalOrdersShipped === 0) {
        return (
            <Box sx={{ py: 5, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No {unitPrefix} data available for {format(parseISO(date), 'MMMM d, yyyy')}.
                </Typography>
                <Typography variant="body2" color="text.disabled" mt={1}>
                    Try selecting a different date or generating the summary.
                </Typography>
            </Box>
        );
    }
    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StatCard 
                        icon={<LocalShipping />}
                        title="Orders Shipped" 
                        value={dataToRender.totalOrdersShipped}
                        trend="up"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StatCard 
                        icon={<MonetizationOn />}
                        title="Total Revenue" 
                        value={dataToRender.totalRevenueOfDay}
                        percentage={dataToRender.totalRevenueOfDayPercentage}
                        trend="up"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StatCard 
                        icon={<AttachMoney />}
                        title="Total Profit" 
                        value={dataToRender.totalProfitOfDay}
                        percentage={dataToRender.totalProfitOfDayPercentage}
                        trend="up"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StatCard 
                        icon={<TrendingDown />}
                        title="Total Wastage (kg)" 
                        value={dataToRender.totalReelWastageOfDay}
                        percentage={dataToRender.totalReelWastageOfDayPercentage}
                        trend="down"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            Client Distribution (Quantity)
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            <Doughnut data={prepareClientDistributionData(dataToRender)} options={defaultChartOptions} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            Product Type Distribution
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            <Pie data={prepareProductTypeData(dataToRender)} options={defaultChartOptions} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            Financial Overview
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            <Bar data={prepareFinancialData(dataToRender)} options={defaultChartOptions} />
                        </Box>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            Reel Usage by Type (Weight)
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            <Doughnut data={prepareReelUsageTypeData(dataToRender)} options={defaultChartOptions} />
                        </Box>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            GSM Distribution (Weight)
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            <Bar data={prepareGsmDistributionData(dataToRender)} options={defaultChartOptions} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            Deckle Distribution (Weight)
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            <Bar data={prepareDeckleDistributionData(dataToRender)} options={defaultChartOptions} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Wastage Analysis
                </Typography>
                <Box sx={{ height: 400 }}>
                    <Bar data={prepareWastageData(dataToRender)} options={wastageOptions} />
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Production Efficiency
                </Typography>
                <Box sx={{ height: 400 }}>
                    <Bar data={prepareProductivityData(dataToRender)} options={defaultChartOptions} />
                </Box>
            </Paper>
            
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                Detailed {unitPrefix} Order List
            </Typography>
            {renderOrderDetailsTable(dataToRender.orderDetails)}
        </Box>
    );
  };

  if (hasAccessError) {
    return <AccessDeniedMessage />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pt: 2 }}>
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Manufacturing Operations Dashboard
        </Typography>
        <Chip 
          label={timeRange === 'daily' ? format(parseISO(date), 'MMMM d, yyyy') : `${format(parseISO(startDate), 'MMM d')} - ${format(parseISO(endDate), 'MMM d, yyyy')}`} 
          color="primary" 
          variant="outlined"
          sx={{ px: 2, py: 1, fontSize: '0.875rem', fontWeight: 600 }}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
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
              <TextField
                fullWidth
                label="Select Date"
                type="date" 
                value={date}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  inputProps={{
                    min: startDate
                  }}
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

      {error && !hasAccessError && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.error.light + '20', border: `1px solid ${theme.palette.error.main}` }}>
          <Typography color="error" align="center" variant="body1" sx={{ fontWeight: 600 }}>
            Error: {error}
          </Typography>
        </Paper>
      )}

      {timeRange === 'daily' && summaryData && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, mb: 3 }}>
                Daily Operations Snapshot: {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
            </Typography>
            <Tabs 
                value={dailyTabIndex} 
                onChange={(event, newValue) => setDailyTabIndex(newValue)} 
                aria-label="daily summary tabs"
                variant="scrollable" 
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Combined Summary" />
                <Tab label="Unit A Summary" />
                <Tab label="Unit B Summary" />
            </Tabs>

            {dailyTabIndex === 0 && renderSummaryContent(summaryData, "Overall")}
            {dailyTabIndex === 1 && renderSummaryContent(unitASummary, "Unit A")}
            {dailyTabIndex === 2 && renderSummaryContent(unitBSummary, "Unit B")}
        </Paper>
      )}

      {timeRange === 'range' && rangeData.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, mb: 3 }}>
                Historical Performance: {format(parseISO(startDate), 'MMM d, yyyy')} to {format(parseISO(endDate), 'MMM d, yyyy')}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<LocalShipping />}
                        title="Total Orders" 
                        value={rangeData.reduce((sum, s) => sum + s.totalOrdersShipped, 0)}
                        sx={{ bgcolor: theme.palette.info.light + '20' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<MonetizationOn />}
                        title="Total Revenue" 
                        value={rangeData.reduce((sum, s) => sum + (s.totalRevenueOfDay || 0), 0)}
                        sx={{ bgcolor: theme.palette.success.light + '20' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<AttachMoney />}
                        title="Total Profit" 
                        value={rangeData.reduce((sum, s) => sum + (s.totalProfitOfDay || 0), 0)}
                        sx={{ bgcolor: theme.palette.primary.light + '20' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<TrendingDown />}
                        title="Total Wastage (kg)" 
                        value={rangeData.reduce((sum, s) => sum + (s.totalReelWastageOfDay || 0), 0)}
                        sx={{ bgcolor: theme.palette.error.light + '20' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<LineAxisOutlined />}
                        title="Total Weight Consumed (kg)" 
                        value={rangeData.reduce((sum, s) => sum + (s.totalWeightConsumed || 0), 0)}
                        sx={{ bgcolor: theme.palette.secondary.light + '20' }}
                    />
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Performance Trends Over Time
                </Typography>
                <Box sx={{ height: 500 }}>
                    <Line data={prepareTimeSeriesData()} options={timeSeriesOptions} />
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Daily Breakdown (within range)
                </Typography>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Orders</TableCell>
                                <TableCell align="right">Weight (kg)</TableCell>
                                <TableCell align="right">Revenue</TableCell>
                                <TableCell align="right">Profit</TableCell>
                                <TableCell align="right">Profit %</TableCell>
                                <TableCell align="right">Wastage (kg)</TableCell>
                                <TableCell align="right">Wastage %</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rangeData.map((summary) => (
                                <TableRow 
                                    key={summary.summaryDate}
                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover }, '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{format(parseISO(summary.summaryDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell align="right">{summary.totalOrdersShipped}</TableCell>
                                    <TableCell align="right">{summary.totalWeightConsumed?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell align="right">₹{summary.totalRevenueOfDay?.toLocaleString() || '0'}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ 
                                            color: (parseFloat(summary.totalProfitOfDayPercentage) || 0) > 15 ? theme.palette.success.main : 
                                                   (parseFloat(summary.totalProfitOfDayPercentage) || 0) > 10 ? theme.palette.warning.main : theme.palette.error.main
                                        }}>
                                            ₹{summary.totalProfitOfDay?.toLocaleString() || '0'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ 
                                            color: (parseFloat(summary.totalProfitOfDayPercentage) || 0) > 15 ? theme.palette.success.main : 
                                                   (parseFloat(summary.totalProfitOfDayPercentage) || 0) > 10 ? theme.palette.warning.main : theme.palette.error.main
                                        }}>
                                            {summary.totalProfitOfDayPercentage || '0.00%'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ 
                                            color: (parseFloat(summary.totalReelWastageOfDayPercentage) || 0) > 5 ? theme.palette.error.main : 
                                                   (parseFloat(summary.totalReelWastageOfDayPercentage) || 0) > 3 ? theme.palette.warning.main : theme.palette.success.main
                                        }}>
                                            {summary.totalReelWastageOfDay?.toFixed(2) || '0.00'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ 
                                            color: (parseFloat(summary.totalReelWastageOfDayPercentage) || 0) > 5 ? theme.palette.error.main : 
                                                   (parseFloat(summary.totalReelWastageOfDayPercentage) || 0) > 3 ? theme.palette.warning.main : theme.palette.success.main
                                        }}>
                                            {summary.totalReelWastageOfDayPercentage || '0.00%'}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Paper>
      )}

      {((timeRange === 'daily' && !summaryData && !loading && !error) || 
        (timeRange === 'range' && rangeData.length === 0 && !loading && !error)) && (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2, boxShadow: 3, mt: 5 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select dates and a time range to view operational insights.
          </Typography>
          <Typography variant="body1" color="text.disabled">
            Your data visualizations and reports will appear here.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

// Main component with a ThemeProvider
const App = () => {
  return (
    <ThemeProvider theme={lightAestheticTheme}>
      <OrderSummaryDashboard />
    </ThemeProvider>
  );
};

export default App;