 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import DatePicker from 'react-datepicker';


const UseAttendanceData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAttendance = async (date) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`http://localhost:8080/admin/attendance`, {
                params: { date: date.toISOString().split('T')[0] },
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            if (err.response?.status === 401) {
                if (err.response?.status === 401) {
                
                    console.error("Authentication failed - please login again");
                    localStorage.removeItem("adminToken");
                                   
                    } else {
                    console.error("Error fetching attendance:", err);
                    }  
            }
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchAttendance };
};

// Usage in component
const AttendanceList = () => {
    const [date, setDate] = useState(new Date());
    const { data, loading, error, fetchAttendance } = UseAttendanceData();

    useEffect(() => {
        fetchAttendance(date);
    }, [date]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="attendance-container">
            <h2 className="attendance-heading">Attendance List</h2>

            <div className="date-picker-container">
                <label className="date-label">Select Date:</label>
                <DatePicker
                    selected={date}
                    onChange={(d) => setDate(d)}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker-input"
                />
            </div>

            <table className="attendance-table">
                <thead>
                    <tr className="attendance-table-header">
                        <th className="table-header-cell">Name</th>
                        <th className="table-header-cell">Barcode ID</th>
                        <th className="table-header-cell">Date</th>
                        <th className="table-header-cell">Check-In</th>
                        <th className="table-header-cell">Check-Out</th>
                        <th className="table-header-cell">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td className="table-cell" colSpan="6">
                                No attendance records for this date.
                            </td>
                        </tr>
                    ) : (
                        records.map((entry, i) => (
                            <tr key={i} className="attendance-row">
                                <td className="table-cell">{entry.employee?.name || '-'}</td>
                                <td className="table-cell">{entry.barcodeId || '-'}</td>
                                <td className="table-cell">{entry.date || '-'}</td>
                                <td className="table-cell">
                                    {entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </td>
                                <td className="table-cell">
                                    {entry.checkOutTime ? new Date(entry.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </td>
                                <td className={`table-cell status-${entry.status?.toLowerCase()}`}>
                                    {entry.status || 'Absent'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UseAttendanceData;