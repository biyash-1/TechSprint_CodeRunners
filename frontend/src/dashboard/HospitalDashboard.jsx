import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Activity, Users, Ambulance, AlertCircle, MapPin, Phone, Clock, CheckCircle, XCircle, Building2, Stethoscope, Heart, UserPlus, TrendingUp, Calendar, Filter, Search, Download } from 'lucide-react';

// Mock accident reports for hospital dashboard
const MOCK_ACCIDENT_REPORTS = [
  {
    id: 'REQ001',
    location: {
      address: 'Ringroad, Kalanki, Kathmandu',
      coordinates: { lat: 27.6942, lng: 85.2866 }
    },
    victim: {
      name: 'Rajesh Thapa',
      age: 32,
      gender: 'Male',
      contact: '+977-9851234567',
      bloodType: 'O+'
    },
    incident: {
      type: 'Two-vehicle collision',
      severity: 'High',
      description: 'Head-on collision between car and motorcycle',
      injuries: ['Head trauma', 'Broken leg', 'Internal bleeding'],
      time: new Date(Date.now() - 25 * 60 * 1000)
    },
    ambulance: {
      name: 'Nepal Ambulance Service',
      eta: '12 minutes',
      status: 'En Route'
    },
    status: 'pending',
    assignedDoctor: null,
    ward: null
  },
  {
    id: 'REQ002',
    location: {
      address: 'Maitighar, Kathmandu',
      coordinates: { lat: 27.7000, lng: 85.3200 }
    },
    victim: {
      name: 'Sunita Rai',
      age: 45,
      gender: 'Female',
      contact: '+977-9849876543',
      bloodType: 'A-'
    },
    incident: {
      type: 'Motorcycle accident',
      severity: 'Medium',
      description: 'Single rider fell from bike',
      injuries: ['Fractured arm', 'Lacerations'],
      time: new Date(Date.now() - 42 * 60 * 1000)
    },
    ambulance: {
      name: 'Medi-Rescue Ambulance',
      eta: '8 minutes',
      status: 'En Route'
    },
    status: 'pending',
    assignedDoctor: null,
    ward: null
  },
  {
    id: 'REQ003',
    location: {
      address: 'Balaju Bypass, Kathmandu',
      coordinates: { lat: 27.7350, lng: 85.3000 }
    },
    victim: {
      name: 'Bikram Shah',
      age: 28,
      gender: 'Male',
      contact: '+977-9812345678',
      bloodType: 'B+'
    },
    incident: {
      type: 'Minor collision',
      severity: 'Low',
      description: 'Car rear-ended another vehicle',
      injuries: ['Whiplash', 'Minor bruises'],
      time: new Date(Date.now() - 58 * 60 * 1000)
    },
    ambulance: {
      name: 'City Emergency Services',
      eta: '15 minutes',
      status: 'En Route'
    },
    status: 'pending',
    assignedDoctor: null,
    ward: null
  },
  {
    id: 'REQ004',
    location: {
      address: 'Boudha, Kathmandu',
      coordinates: { lat: 27.7172, lng: 85.3624 }
    },
    victim: {
      name: 'Anita Gurung',
      age: 62,
      gender: 'Female',
      contact: '+977-9865432198',
      bloodType: 'AB+'
    },
    incident: {
      type: 'Pedestrian accident',
      severity: 'Critical',
      description: 'Pedestrian hit by speeding vehicle',
      injuries: ['Multiple fractures', 'Head injury', 'Chest trauma'],
      time: new Date(Date.now() - 15 * 60 * 1000)
    },
    ambulance: {
      name: 'Nepal Ambulance Service',
      eta: '5 minutes',
      status: 'Arriving'
    },
    status: 'accepted',
    assignedDoctor: 'Dr. Santosh Poudel',
    ward: 'Emergency ICU',
    acceptedAt: new Date(Date.now() - 10 * 60 * 1000)
  }
];

// Mock statistics
const HOSPITAL_STATS = {
  totalBeds: 150,
  availableBeds: 42,
  occupiedBeds: 108,
  emergencyCasesToday: 8,
  activeDoctors: 28,
  averageResponseTime: '14 min',
  monthlyAdmissions: 356
};

// Utility: Format time ago
const formatTimeAgo = (date) => {
  const minutes = Math.floor((Date.now() - date) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} hr ago`;
};

// Component: Report Card
const ReportCard = ({ report, onAccept, onReject, onViewDetails }) => {
  const severityColors = {
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Report Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Case #{report.id}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColors[report.incident.severity]}`}>
            {report.incident.severity} Priority
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{report.location.address}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{formatTimeAgo(report.incident.time)}</span>
        </div>
      </div>

      {/* Report Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Victim Information</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-900">{report.victim.name}, {report.victim.age} {report.victim.gender}</p>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-600">Blood Type: {report.victim.bloodType}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Incident Details</h4>
            <p className="text-sm text-gray-900">{report.incident.type}</p>
            <p className="text-xs text-gray-600">{report.incident.description}</p>
          </div>
        </div>

        {/* Injuries */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Reported Injuries</h4>
          <div className="flex flex-wrap gap-2">
            {report.incident.injuries.map((injury, index) => (
              <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                {injury}
              </span>
            ))}
          </div>
        </div>

        {/* Ambulance Info */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">{report.ambulance.name}</p>
                <p className="text-xs text-blue-700">ETA: {report.ambulance.eta} • {report.ambulance.status}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = `tel:${report.victim.contact}`}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Phone className="w-4 h-4" />
              Contact
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {report.status === 'pending' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(report)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Accept & Prepare
            </button>
            <button
              onClick={() => onReject(report.id)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Assigned to: {report.assignedDoctor}</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {report.ward}
              </span>
            </div>
            <button
              onClick={() => onViewDetails(report)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              View Patient Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Component: Statistics Card
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`flex h-12 w-12 items-center justify-center rounded-md ${color} text-white`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
              {change && (
                <dd className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [reports, setReports] = useState(MOCK_ACCIDENT_REPORTS);
  const [stats, setStats] = useState(HOSPITAL_STATS);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, critical
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAcceptReport = (report) => {
    const updatedReport = {
      ...report,
      status: 'accepted',
      assignedDoctor: 'Dr. ' + (user?.fullName?.split(' ')[0] || 'Hospital Staff'),
      ward: 'Emergency Ward ' + (Math.floor(Math.random() * 5) + 1),
      acceptedAt: new Date()
    };

    setReports(prev => prev.map(r => r.id === report.id ? updatedReport : r));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      emergencyCasesToday: prev.emergencyCasesToday + 1,
      availableBeds: Math.max(0, prev.availableBeds - 1),
      occupiedBeds: prev.occupiedBeds + 1
    }));

    alert(`Case #${report.id} accepted! Preparing emergency ward for ${report.victim.name}`);
  };

  const handleRejectReport = (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    alert(`Case #${reportId} rejected and forwarded to next available hospital`);
  };

  const handleViewDetails = (report) => {
    alert(`Opening detailed patient record for ${report.victim.name}\nMedical History | Treatment Plan | Lab Results`);
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || 
                         filter === 'pending' && report.status === 'pending' ||
                         filter === 'accepted' && report.status === 'accepted' ||
                         filter === 'critical' && report.incident.severity === 'Critical';
    
    const matchesSearch = searchTerm === '' ||
                         report.victim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.incident.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const criticalCases = reports.filter(r => r.incident.severity === 'Critical').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Hospital Dashboard</h1>
                <p className="text-sm text-gray-600">Metro City General Hospital</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.fullName || user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Emergency Cases"
            value={pendingReports}
            icon={AlertCircle}
            color="bg-red-500"
            change={12}
          />
          <StatCard
            title="Bed Availability"
            value={`${stats.availableBeds}/${stats.totalBeds}`}
            icon={Activity}
            color="bg-green-500"
            change={-8}
          />
          <StatCard
            title="Active Doctors"
            value={stats.activeDoctors}
            icon={Stethoscope}
            color="bg-blue-500"
            change={5}
          />
          <StatCard
            title="Critical Cases"
            value={criticalCases}
            icon={Heart}
            color="bg-purple-500"
            change={23}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Emergency Reports</h2>
            <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
              {filteredReports.length} cases
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Cases</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="critical">Critical Priority</option>
              </select>
            </div>
            <button
              onClick={() => alert('Exporting reports...')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reports List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onAccept={handleAcceptReport}
                      onReject={handleRejectReport}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms' : 'All caught up! No new emergency reports.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Hospital Info & Quick Actions */}
          <div className="space-y-6">
            {/* Hospital Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Emergency Beds</span>
                    <span className="font-semibold">{Math.floor(stats.availableBeds * 0.3)}/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(Math.floor(stats.availableBeds * 0.3) / 15) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">ICU Capacity</span>
                    <span className="font-semibold">8/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Operation Theaters</span>
                    <span className="font-semibold">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => alert('Adding new patient...')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <UserPlus className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">New Patient</span>
                </button>
                <button
                  onClick={() => alert('Requesting ambulance...')}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <Ambulance className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Call Ambulance</span>
                </button>
                <button
                  onClick={() => alert('Viewing schedule...')}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Schedule</span>
                </button>
                <button
                  onClick={() => alert('Viewing analytics...')}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Case #REQ004 accepted</p>
                    <p className="text-xs text-gray-500">12 minutes ago • Dr. Santosh Poudel</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Blood bank updated</p>
                    <p className="text-xs text-gray-500">45 minutes ago • O+ stock added</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Metro City General Hospital • 24/7 Emergency Hotline: +977-1-4221111 • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HospitalDashboard;