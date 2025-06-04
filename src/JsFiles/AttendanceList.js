import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const AttendanceList = () => {
    const [date, setDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    const fetchAttendanceData = async (selectedDate) => {
        setLoading(true);
        setError(null);
        
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
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
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData(date);
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
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    return (
        <div className="attendance-container">
            <h2>Attendance List</h2>
            
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

                <form onSubmit={handleSearch} className="search-form">
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
                </form>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">Error: {error}</div>}

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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
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
