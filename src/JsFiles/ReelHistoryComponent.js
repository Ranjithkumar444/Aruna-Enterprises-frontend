import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Space, message } from 'antd';
import { PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ReelHistoryComponent = () => {
  const { barcodeId: urlBarcode } = useParams();
  const navigate = useNavigate();
  const [barcodeId, setBarcodeId] = useState(urlBarcode || '');
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [printData, setPrintData] = useState([]);

  useEffect(() => {
    if (urlBarcode) {
      fetchHistory(urlBarcode);
    }
  }, [urlBarcode]);

  const fetchHistory = async (barcode) => {
    if (!barcode.trim()) {
      message.warning('Please enter a barcode ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/reel/orderReelUsage/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setHistoryData(response.data);
      setPrintData(response.data.usages.map(usage => ({
        client: usage.client,
        productType: usage.productType,
        quantity: usage.quantity,
        size: usage.size,
        unit: usage.unit,
        howManyBox: usage.howManyBox,
        weightConsumed: usage.weightConsumed,
        usageType: usage.usageType,
        courgationIn: usage.courgationIn,
        courgationOut: usage.courgationOut
      })));
    } catch (error) {
      message.error('Error fetching history: ' + error.message);
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (barcodeId.trim()) {
      navigate(`/admin/dashboard/admin/inventory/reel-history/${encodeURIComponent(barcodeId)}`);
    }
  };

  const printStickers = () => {
    const printWindow = window.open('', '_blank');
    
    const printContent = printData.map((item, index) => `
      <div style="
        width: 2.8in; 
        height: 4.8in; 
        border: 1px solid #000; 
        padding: 5px; 
        margin: 5px; 
        font-family: Arial; 
        font-size: 8px;
        page-break-after: always;
      ">
        <h3 style="text-align: center; margin: 2px 0; font-size: 10px;">Reel Usage History</h3>
        <p><strong>Barcode:</strong> ${barcodeId}</p>
        <p><strong>Entry ${index + 1} of ${printData.length}</strong></p>
        <hr style="margin: 3px 0;"/>
        <p><strong>Client:</strong> ${item.client}</p>
        <p><strong>Product Type:</strong> ${item.productType}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Size:</strong> ${item.size}</p>
        <p><strong>Unit:</strong> ${item.unit}</p>
        <p><strong>Boxes Made:</strong> ${item.howManyBox}</p>
        <p><strong>Weight Consumed:</strong> ${item.weightConsumed?.toFixed(2) || '0.00'}</p>
        <p><strong>Usage Type:</strong> ${item.usageType}</p>
        <hr style="margin: 3px 0;"/>
        <p style="text-align: center; font-size: 7px;">Printed on: ${new Date().toLocaleString()}</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Reel Usage Stickers</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: 2.8in 4.8in; margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Product Type',
      dataIndex: 'productType',
      key: 'productType',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Boxes Made',
      dataIndex: 'howManyBox',
      key: 'howManyBox',
    },
    {
      title: 'Weight Consumed',
      dataIndex: 'weightConsumed',
      key: 'weightConsumed',
      render: (text) => text?.toFixed(2) || '0.00',
    },
    {
      title: 'Usage Type',
      dataIndex: 'usageType',
      key: 'usageType',
    },
    {
      title: 'Date In',
      dataIndex: 'courgationIn',
      key: 'courgationIn',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: 'Date Out',
      dataIndex: 'courgationOut',
      key: 'courgationOut',
      render: (text) => text ? new Date(text).toLocaleString() : 'Active',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space size="middle" style={{ marginBottom: '20px' }}>
        <Input
          placeholder="Enter Reel Barcode ID"
          value={barcodeId}
          onChange={(e) => setBarcodeId(e.target.value)}
          style={{ width: '300px' }}
          onPressEnter={handleSearch}
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          onClick={handleSearch}
          loading={loading}
        >
          Search
        </Button>
        {historyData && (
          <Button 
            type="default" 
            icon={<PrinterOutlined />} 
            onClick={printStickers}
            disabled={printData.length === 0}
          >
            Print Stickers
          </Button>
        )}
      </Space>

      {historyData && (
        <div>
          <h2>Reel Usage History: {historyData.barcodeId}</h2>
          <Table 
            columns={columns} 
            dataSource={historyData.usages} 
            rowKey={(record) => record.courgationIn} 
            pagination={{ pageSize: 10 }}
            bordered
            size="small"
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ReelHistoryComponent;