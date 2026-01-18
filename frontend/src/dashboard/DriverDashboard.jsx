import React, { useState, useEffect, useRef } from 'react';
import { Ambulance, MapPin, Phone, Navigation, Clock, Building2, Bell, Power, CheckCircle, XCircle, Share2, Radio } from 'lucide-react';

// Mock ambulance data from database
const MOCK_AMBULANCE = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Nepal Ambulance Service',
  phone: '+977-9841234567',
  address: 'Thamel, Kathmandu, Nepal',
  location: {
    latitude: 27.7172,
    longitude: 85.3240
  },
  website: 'https://nepalambulance.com',
  placeId: 'ChIJUVz...',
  category: 'Ambulance Service',
  status: 'OFFLINE',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2026-01-17T08:45:00Z'
};

// Mock accident requests (would come from API/WebSocket)
const MOCK_REQUESTS = [
  {
    id: 'REQ001',
    location: {
      latitude: 27.6942,
      longitude: 85.2866,
      address: 'Ringroad, Kalanki, Kathmandu'
    },
    victimContact: '+977-9851234567',
    requestTime: new Date(Date.now() - 5 * 60 * 1000),
    description: 'Two-vehicle collision, multiple injuries reported'
  },
  {
    id: 'REQ002',
    location: {
      latitude: 27.7000,
      longitude: 85.3200,
      address: 'Maitighar, Kathmandu'
    },
    victimContact: '+977-9849876543',
    requestTime: new Date(Date.now() - 12 * 60 * 1000),
    description: 'Motorcycle accident, single rider injured'
  },
  {
    id: 'REQ003',
    location: {
      latitude: 27.7350,
      longitude: 85.3000,
      address: 'Balaju Bypass, Kathmandu'
    },
    victimContact: '+977-9812345678',
    requestTime: new Date(Date.now() - 18 * 60 * 1000),
    description: 'Minor collision, medical check needed'
  }
];

// Utility: Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

// Utility: Format time ago
const formatTimeAgo = (date) => {
  const minutes = Math.floor((Date.now() - date) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} hr ago`;
};

// Component: Header
const Header = ({ ambulance, onStatusToggle, notifications }) => {
  const isOnline = ambulance.status === 'ONLINE';
  
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-500 p-3 rounded-lg">
            <Ambulance className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ambulance.name}</h1>
            <p className="text-sm text-gray-500">Driver Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <button
              onClick={onStatusToggle}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isOnline ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isOnline ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <Bell className={`w-6 h-6 ${isOnline ? 'text-gray-700' : 'text-gray-400'}`} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Profile Card
const AmbulanceProfileCard = ({ ambulance }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 rounded-lg">
          <Ambulance className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Ambulance Details</h3>
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-1">
            {ambulance.category}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-600">{ambulance.address}</p>
            <p className="text-xs text-gray-400 mt-1">
              {ambulance.location.latitude.toFixed(4)}, {ambulance.location.longitude.toFixed(4)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <a href={`tel:${ambulance.phone}`} className="text-sm text-blue-600 hover:underline">
            {ambulance.phone}
          </a>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(ambulance.updatedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => window.location.href = `tel:${ambulance.phone}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Base
        </button>
        <button
          onClick={() => {
            const url = `https://www.google.com/maps?q=${ambulance.location.latitude},${ambulance.location.longitude}`;
            navigator.clipboard.writeText(url);
            alert('Location link copied!');
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Location
        </button>
      </div>
    </div>
  );
};

// Component: Request Card
const RequestCard = ({ request, ambulanceLocation, onAccept, onReject }) => {
  const distance = calculateDistance(
    ambulanceLocation.latitude,
    ambulanceLocation.longitude,
    request.location.latitude,
    request.location.longitude
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Map Preview */}
      <div className="h-40 bg-gray-200 relative">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${request.location.latitude},${request.location.longitude}&zoom=14`}
          className="w-full h-full"
          loading="lazy"
          style={{ border: 0, pointerEvents: 'none' }}
        />
      </div>
      
      {/* Request Details */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1">{request.location.address}</h3>
          <p className="text-xs text-gray-600">{request.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-700">{distance} km away</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{formatTimeAgo(request.requestTime)}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(request)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// Component: Empty State
const EmptyState = ({ isOnline }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className={`inline-flex p-4 rounded-full mb-4 ${isOnline ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {isOnline ? (
          <Radio className="w-12 h-12 text-blue-600" />
        ) : (
          <Power className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isOnline ? 'Waiting for Requests...' : 'You are Offline'}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {isOnline 
          ? 'Your ambulance is online and ready. New accident requests will appear here.'
          : 'Set your status to ONLINE to start receiving accident requests.'}
      </p>
    </div>
  );
};

// Component: Active Case View
const ActiveCaseView = ({ request, ambulanceLocation, onComplete }) => {
  const mapRef = useRef(null);
  const [eta, setEta] = useState('Calculating...');
  const [routeDistance, setRouteDistance] = useState('--');
  
  useEffect(() => {
    if (mapRef.current && window.google) {
      initMap();
    }
  }, []);
  
  const initMap = () => {
    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: ambulanceLocation,
      zoom: 13
    });
    
    // Ambulance marker
    new google.maps.Marker({
      position: ambulanceLocation,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      },
      title: 'Your Ambulance'
    });
    
    // Accident marker
    new google.maps.Marker({
      position: request.location,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: '#ef4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      },
      title: 'Accident Location',
      animation: google.maps.Animation.BOUNCE
    });
    
    // Calculate route
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 5
      }
    });
    
    directionsService.route(
      {
        origin: ambulanceLocation,
        destination: request.location,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          setEta(route.duration.text);
          setRouteDistance(route.distance.text);
        }
      }
    );
  };
  
  const startNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ambulanceLocation.latitude},${ambulanceLocation.longitude}&destination=${request.location.latitude},${request.location.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Map */}
      <div ref={mapRef} className="h-96 bg-gray-200" />
      
      {/* Navigation Panel */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Active Emergency</h2>
            <p className="text-sm text-gray-600">{request.location.address}</p>
          </div>
          <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
            En Route
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Estimated Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{eta}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Distance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{routeDistance}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={startNavigation}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-5 h-5" />
            Start Navigation
          </button>
          <button
            onClick={() => window.location.href = `tel:${request.victimContact}`}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call Victim
          </button>
          <button
            onClick={() => alert('Calling nearest hospital...')}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Building2 className="w-5 h-5" />
            Call Hospital
          </button>
          <button
            onClick={onComplete}
            className="bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Complete Case
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Your live location is being shared with the control center and victim.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function AmbulanceDashboard() {
  const [ambulance, setAmbulance] = useState(MOCK_AMBULANCE);
  const [requests, setRequests] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [notifications, setNotifications] = useState(0);
  
  // Simulate fetching data on mount
  useEffect(() => {
    // In production: fetch('/api/ambulance/${ambulanceId}')
    setAmbulance(MOCK_AMBULANCE);
  }, []);
  
  // Simulate real-time requests when online
  useEffect(() => {
    if (ambulance.status === 'ONLINE' && !activeCase) {
      // Simulate incoming requests
      setRequests(MOCK_REQUESTS);
      setNotifications(MOCK_REQUESTS.length);
      
      // In production: WebSocket connection
      // const ws = new WebSocket('ws://your-api.com/ambulance-requests');
      // ws.onmessage = (event) => {
      //   const newRequest = JSON.parse(event.data);
      //   setRequests(prev => [newRequest, ...prev]);
      //   setNotifications(prev => prev + 1);
      // };
    } else {
      setRequests([]);
      setNotifications(0);
    }
  }, [ambulance.status, activeCase]);
  
  const handleStatusToggle = async () => {
    const newStatus = ambulance.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    
    // Optimistic update
    setAmbulance(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
    
    // In production: API call
    // try {
    //   await fetch(`/api/ambulance/${ambulance._id}/status`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ status: newStatus })
    //   });
    // } catch (error) {
    //   // Revert on error
    //   setAmbulance(prev => ({ ...prev, status: ambulance.status }));
    // }
  };
  
  const handleAcceptRequest = async (request) => {
    setActiveCase(request);
    setRequests(prev => prev.filter(r => r.id !== request.id));
    setNotifications(0);
    
    // In production: Lock request
    // await fetch(`/api/accident-requests/${request.id}/accept`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ambulanceId: ambulance._id })
    // });
  };
  
  const handleRejectRequest = async (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setNotifications(prev => Math.max(0, prev - 1));
    
    // In production: Notify backend
    // await fetch(`/api/accident-requests/${requestId}/reject`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ambulanceId: ambulance._id })
    // });
  };
  
  const handleCompleteCase = () => {
    setActiveCase(null);
    alert('Case completed successfully! You are now available for new requests.');
    
    // In production: Update request status
    // await fetch(`/api/accident-requests/${activeCase.id}/complete`, {
    //   method: 'POST'
    // });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        ambulance={ambulance} 
        onStatusToggle={handleStatusToggle}
        notifications={notifications}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <AmbulanceProfileCard ambulance={ambulance} />
          </div>
          
          {/* Main Area */}
          <div className="lg:col-span-3">
            {activeCase ? (
              <ActiveCaseView 
                request={activeCase}
                ambulanceLocation={ambulance.location}
                onComplete={handleCompleteCase}
              />
            ) : requests.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Incoming Requests ({requests.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      ambulanceLocation={ambulance.location}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState isOnline={ambulance.status === 'ONLINE'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}