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
            console.log(response.data);
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
        }, 30000); 

        return () => clearInterval(interval); 
    }, [date, navigate]);

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
            return new Intl.DateTimeFormat('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).format(new Date(time));
        } catch (e) {
            console.error("Invalid time format:", time, e);
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

    const presentCount = filteredData.filter(d => d.status === 'PRESENT').length;
    const absentCount = filteredData.filter(d => d.status === 'ABSENT').length;
    const totalCount = filteredData.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-10 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight md:text-5xl text-center sm:text-left">
                    Attendance List
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    >
                        <span className="mr-2 text-xl">↻</span> Refresh
                    </button>
                    {lastUpdated && (
                        <span className="text-sm text-gray-600 italic">
                            Last updated: {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 flex flex-col md:flex-row flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <label className="text-lg font-semibold text-gray-700">Select Date:</label>
                    <DatePicker
                        selected={date}
                        onChange={(newDate) => setDate(newDate)}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm w-full sm:w-auto"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-grow md:justify-end w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name or barcode ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm flex-grow"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm bg-white flex-shrink-0 w-full sm:w-auto"
                    >
                        <option value="all">All Statuses</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-auto"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {loading && <div className="p-8 text-center text-lg font-medium text-gray-700 bg-blue-50 rounded-lg shadow-md max-w-lg mx-auto my-8">Loading attendance data...</div>}
            {error && !hasAccessError && <div className="p-8 text-center text-lg font-medium text-red-600 bg-red-50 border border-red-300 rounded-lg shadow-md max-w-lg mx-auto my-8">Error: {error}</div>}

            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-blue-200 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold shadow-md">
                    Total: <span className="font-bold">{totalCount}</span>
                </div>
                <div className="bg-green-200 text-green-800 px-6 py-3 rounded-full text-lg font-semibold shadow-md">
                    Present: <span className="font-bold">{presentCount}</span>
                </div>
                <div className="bg-red-200 text-red-800 px-6 py-3 rounded-full text-lg font-semibold shadow-md">
                    Absent: <span className="font-bold">{absentCount}</span>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Barcode ID</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check-In Time</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check-Out Time</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Day Salary</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Worked Hours</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredData.length > 0 ? (
                            filteredData.map((record) => (
                                <tr 
                                    key={record.id || record.barcodeId} 
                                    className={`hover:bg-gray-50 transition-colors duration-150 
                                                ${record.status.toLowerCase() === 'absent' ? 'bg-red-50' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.barcodeId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatTime(record.checkInTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatTime(record.checkOutTime)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold 
                                                    ${record.status.toLowerCase() === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                                        {record.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹ {(record.daySalary || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {((record.overtimeHours || 0) + (record.regularHours || 0)).toFixed(2)} hrs
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500 text-base">
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
