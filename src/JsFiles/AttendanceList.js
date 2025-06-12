import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AccessDeniedMessage from './AccessDeneidMessage'; 

const AttendanceList = () => {
    const [date, setDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [hasAccessError, setHasAccessError] = useState(false);
    const navigate = useNavigate();

    const fetchAttendanceData = async (selectedDate) => {
        setLoading(true);
        setError(null);
        setHasAccessError(false);

        try {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            const token = localStorage.getItem('adminToken');

            const response = await axios.get(
                `https://arunaenterprises.azurewebsites.net/admin/attendance-list?date=${formattedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAttendanceData(response.data);
            setFilteredData(response.data);
            setLastUpdated(new Date());
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
            setError(errorMessage);

            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            } else if (err.response?.status === 403) {
                setHasAccessError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData(date);
        const interval = setInterval(() => {
            fetchAttendanceData(date);
        }, 30000); // Refreshes every 30 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [date]);

    useEffect(() => {
        const filtered = attendanceData.filter(record => {
            const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 record.barcodeId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' ||
                                  record.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
        setFilteredData(filtered);
    }, [searchTerm, statusFilter, attendanceData]);

    const formatTime = (time) => {
        if (!time) return '-'; 
        try {
            const dateObj = new Date(time);

            if (isNaN(dateObj.getTime())) {
                console.error("Invalid time format detected by Date object:", time);
                return 'Invalid Time';
            }

            const istFormatter = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata', 
                hour: '2-digit',         
                minute: '2-digit',       
                hour12: false           
            });
            return istFormatter.format(dateObj);
        } catch (e) {
            console.error("Error formatting time:", time, e);
            return 'Invalid Time';
        }
    };

    const handleRefresh = () => {
        fetchAttendanceData(date);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    if (hasAccessError) {
        return <AccessDeniedMessage />;
    }

    return (
        <div className="attendance-container">
            <div className="header-section">
                <h2>Attendance List</h2>
                <div className="header-controls">
                    <button onClick={handleRefresh} className="refresh-btn">
                        ↻ Refresh
                    </button>
                    {lastUpdated && (
                        <span className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                    )}
                </div>
            </div>

            <div className="filter-section">
                <div className="date-filter">
                    <label>Select Date: </label>
                    <DatePicker
                        selected={date}
                        onChange={(newDate) => setDate(newDate)}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        className="date-picker"
                    />
                </div>

                <div className="search-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Search by name or barcode ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="form-group">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="all">All Statuses</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>
                    </div>

                    <button type="button" onClick={handleResetFilters} className="reset-btn">
                        Reset Filters
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && !hasAccessError && <div className="error">Error: {error}</div>}

            <div className="summary-stats">
                <span>Total: {filteredData.length}</span>
                <span>Present: {filteredData.filter(d => d.status === 'PRESENT').length}</span>
                <span>Absent: {filteredData.filter(d => d.status === 'ABSENT').length}</span>
            </div>

            <div className="table-responsive">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Barcode ID</th>
                            <th>Date</th>
                            <th>Check-In Time</th>
                            <th>Check-Out Time</th>
                            <th>Status</th>
                            <th>Day Salary</th>
                            <th>Worked Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((record, index) => (
                                <tr key={index} className={record.status.toLowerCase()}>
                                    <td>{record.name}</td>
                                    <td>{record.barcodeId}</td>
                                    <td>{record.date}</td>
                                    <td>{formatTime(record.checkInTime)}</td>
                                    <td>{formatTime(record.checkOutTime)}</td>
                                    <td className={`status ${record.status.toLowerCase()}`}>
                                        {record.status}
                                    </td>
                                    <td>₹ {record.daySalary.toFixed(2)}</td>
                                    <td>{record.overtimeHours.toFixed(2)} hrs</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">
                                    {loading ? 'Loading...' : 'No matching records found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceList;
