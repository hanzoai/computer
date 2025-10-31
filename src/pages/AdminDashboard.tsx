import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ServerStackIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  FunnelIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  EyeIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import {
  supabase,
  checkAdminRole,
  getAllRFQs,
  getAllClusterRequests,
  getAllQuotes,
  updateRFQStatus,
  updateClusterRequestStatus,
  createQuote,
  generateQuoteNumber,
  type RFQ,
  type ClusterRequest,
  type Quote
} from '../lib/supabase';

interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
    {count !== undefined && (
      <span className={`px-2 py-0.5 text-xs rounded-full ${
        active ? 'bg-white/20' : 'bg-gray-700'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    reviewing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    quoted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    sent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    viewed: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const icons = {
    pending: <ClockIcon className="w-3 h-3" />,
    reviewing: <EyeIcon className="w-3 h-3" />,
    quoted: <DocumentTextIcon className="w-3 h-3" />,
    accepted: <CheckCircleIcon className="w-3 h-3" />,
    rejected: <XMarkIcon className="w-3 h-3" />,
    sent: <PaperAirplaneIcon className="w-3 h-3" />,
    viewed: <EyeIcon className="w-3 h-3" />,
    expired: <ExclamationCircleIcon className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${colors[status as keyof typeof colors] || colors.pending}`}>
      {icons[status as keyof typeof icons]}
      {status}
    </span>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'rfqs' | 'clusters' | 'quotes' | 'builder'>('stats');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [clusterRequests, setClusterRequests] = useState<ClusterRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Filter states
  const [rfqFilter, setRfqFilter] = useState<string>('all');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [quoteFilter, setQuoteFilter] = useState<string>('all');

  // Quote builder states
  const [selectedRFQ, setSelectedRFQ] = useState<string>('');
  const [selectedClusterRequest, setSelectedClusterRequest] = useState<string>('');
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [quoteTax, setQuoteTax] = useState(0);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteValidDays, setQuoteValidDays] = useState(30);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');

  // Modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedItemForQuote, setSelectedItemForQuote] = useState<RFQ | ClusterRequest | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, rfqFilter, clusterFilter, quoteFilter]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/signin');
        return;
      }

      const adminStatus = await checkAdminRole(user.id);
      if (!adminStatus) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [rfqData, clusterData, quoteData] = await Promise.all([
        getAllRFQs(rfqFilter === 'all' ? undefined : rfqFilter),
        getAllClusterRequests(clusterFilter === 'all' ? undefined : clusterFilter),
        getAllQuotes(quoteFilter === 'all' ? undefined : quoteFilter),
      ]);

      setRFQs(rfqData || []);
      setClusterRequests(clusterData || []);
      setQuotes(quoteData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleStatusUpdate = async (type: 'rfq' | 'cluster', id: string, newStatus: string) => {
    try {
      if (type === 'rfq') {
        await updateRFQStatus(id, newStatus as RFQ['status']);
      } else {
        await updateClusterRequestStatus(id, newStatus as ClusterRequest['status']);
      }
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeQuoteItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const updateQuoteItem = (index: number, field: keyof QuoteLineItem, value: string | number) => {
    const updatedItems = [...quoteItems];
    const item = updatedItems[index];

    if (field === 'quantity' || field === 'unitPrice') {
      item[field] = Number(value) || 0;
      item.total = item.quantity * item.unitPrice;
    } else if (field === 'description') {
      item.description = value as string;
    }

    setQuoteItems(updatedItems);
  };

  const calculateQuoteTotal = () => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * quoteTax) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleCreateQuote = async () => {
    try {
      const { subtotal, taxAmount, total } = calculateQuoteTotal();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + quoteValidDays);

      const quoteData = {
        rfq_id: selectedRFQ || null,
        cluster_request_id: selectedClusterRequest || null,
        quote_number: generateQuoteNumber(),
        items: quoteItems.filter(item => item.description),
        subtotal,
        tax: taxAmount,
        total,
        payment_terms: paymentTerms,
        valid_until: validUntil.toISOString(),
        notes: quoteNotes || null,
      };

      await createQuote(quoteData);

      // Update the status of the RFQ or Cluster Request
      if (selectedRFQ) {
        await updateRFQStatus(selectedRFQ, 'quoted');
      }
      if (selectedClusterRequest) {
        await updateClusterRequestStatus(selectedClusterRequest, 'quoted');
      }

      // Reset form
      setSelectedRFQ('');
      setSelectedClusterRequest('');
      setQuoteItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
      setQuoteTax(0);
      setQuoteNotes('');
      setShowQuoteModal(false);

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const getStatistics = () => {
    const stats = {
      totalRFQs: rfqs.length,
      pendingRFQs: rfqs.filter(r => r.status === 'pending').length,
      quotedRFQs: rfqs.filter(r => r.status === 'quoted').length,
      totalClusters: clusterRequests.length,
      pendingClusters: clusterRequests.filter(c => c.status === 'pending').length,
      quotedClusters: clusterRequests.filter(c => c.status === 'quoted').length,
      totalQuotes: quotes.length,
      sentQuotes: quotes.filter(q => q.status === 'sent').length,
      acceptedQuotes: quotes.filter(q => q.status === 'accepted').length,
      totalRevenue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0),
      conversionRate: quotes.length > 0 ? (quotes.filter(q => q.status === 'accepted').length / quotes.length * 100).toFixed(1) : '0',
    };
    return stats;
  };

  const stats = getStatistics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage RFQs, Cluster Requests, and Quotes</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<ChartBarIcon className="w-5 h-5" />}
            label="Statistics"
          />
          <TabButton
            active={activeTab === 'rfqs'}
            onClick={() => setActiveTab('rfqs')}
            icon={<DocumentTextIcon className="w-5 h-5" />}
            label="RFQs"
            count={rfqs.length}
          />
          <TabButton
            active={activeTab === 'clusters'}
            onClick={() => setActiveTab('clusters')}
            icon={<ServerStackIcon className="w-5 h-5" />}
            label="Cluster Requests"
            count={clusterRequests.length}
          />
          <TabButton
            active={activeTab === 'quotes'}
            onClick={() => setActiveTab('quotes')}
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            label="Quotes"
            count={quotes.length}
          />
          <TabButton
            active={activeTab === 'builder'}
            onClick={() => setActiveTab('builder')}
            icon={<PlusCircleIcon className="w-5 h-5" />}
            label="Quote Builder"
          />
        </div>

        {/* Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-lg p-6 border border-yellow-500/20">
                <h3 className="text-yellow-400 text-sm font-medium mb-2">Total RFQs</h3>
                <p className="text-3xl font-bold text-white">{stats.totalRFQs}</p>
                <p className="text-yellow-400/60 text-sm mt-2">{stats.pendingRFQs} pending</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-blue-400 text-sm font-medium mb-2">Cluster Requests</h3>
                <p className="text-3xl font-bold text-white">{stats.totalClusters}</p>
                <p className="text-blue-400/60 text-sm mt-2">{stats.pendingClusters} pending</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-purple-400 text-sm font-medium mb-2">Total Quotes</h3>
                <p className="text-3xl font-bold text-white">{stats.totalQuotes}</p>
                <p className="text-purple-400/60 text-sm mt-2">{stats.acceptedQuotes} accepted</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-green-400 text-sm font-medium mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
                <p className="text-green-400/60 text-sm mt-2">Quote to order</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-lg p-6 border border-indigo-500/20 md:col-span-2">
                <h3 className="text-indigo-400 text-sm font-medium mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-indigo-400/60 text-sm mt-2">From accepted quotes</p>
              </div>

              <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-lg p-6 border border-gray-500/20">
                <h3 className="text-gray-400 text-sm font-medium mb-2">RFQ Quotes</h3>
                <p className="text-3xl font-bold text-white">{stats.quotedRFQs}</p>
                <p className="text-gray-400/60 text-sm mt-2">Quotes sent</p>
              </div>

              <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-lg p-6 border border-gray-500/20">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Cluster Quotes</h3>
                <p className="text-3xl font-bold text-white">{stats.quotedClusters}</p>
                <p className="text-gray-400/60 text-sm mt-2">Quotes sent</p>
              </div>
            </div>
          )}

          {/* RFQs Tab */}
          {activeTab === 'rfqs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">RFQ Management</h2>
                <select
                  value={rfqFilter}
                  onChange={(e) => setRfqFilter(e.target.value)}
                  className="bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">GPU Type</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfqs.map((rfq) => (
                      <tr key={rfq.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 px-4 text-white">{rfq.company}</td>
                        <td className="py-3 px-4 text-gray-300">{rfq.email}</td>
                        <td className="py-3 px-4 text-gray-300">{rfq.gpu_type}</td>
                        <td className="py-3 px-4 text-gray-300">{rfq.quantity}</td>
                        <td className="py-3 px-4 text-gray-300">{rfq.duration_months || 'N/A'} months</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={rfq.status} />
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(rfq.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <select
                              value={rfq.status}
                              onChange={(e) => handleStatusUpdate('rfq', rfq.id, e.target.value)}
                              className="bg-gray-700/50 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="quoted">Quoted</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => {
                                setSelectedRFQ(rfq.id);
                                setActiveTab('builder');
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Create Quote
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cluster Requests Tab */}
          {activeTab === 'clusters' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Cluster Request Management</h2>
                <select
                  value={clusterFilter}
                  onChange={(e) => setClusterFilter(e.target.value)}
                  className="bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Requirements</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">GPU Count</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterRequests.map((cluster) => (
                      <tr key={cluster.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 px-4 text-white">{cluster.first_name} {cluster.last_name}</td>
                        <td className="py-3 px-4 text-gray-300">{cluster.company}</td>
                        <td className="py-3 px-4 text-gray-300">{cluster.email}</td>
                        <td className="py-3 px-4 text-gray-300 max-w-xs truncate" title={cluster.cluster_requirements}>
                          {cluster.cluster_requirements}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{cluster.number_of_gpus}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={cluster.status} />
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(cluster.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <select
                              value={cluster.status}
                              onChange={(e) => handleStatusUpdate('cluster', cluster.id, e.target.value)}
                              className="bg-gray-700/50 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="quoted">Quoted</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => {
                                setSelectedClusterRequest(cluster.id);
                                setActiveTab('builder');
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Create Quote
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quotes Tab */}
          {activeTab === 'quotes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Quote Management</h2>
                <select
                  value={quoteFilter}
                  onChange={(e) => setQuoteFilter(e.target.value)}
                  className="bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="expired">Expired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Quote #</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Total</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Valid Until</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 px-4 text-white font-mono">{quote.quote_number}</td>
                        <td className="py-3 px-4 text-gray-300">
                          {quote.rfq_id ? 'RFQ' : quote.cluster_request_id ? 'Cluster' : 'Manual'}
                        </td>
                        <td className="py-3 px-4 text-gray-300">${quote.total.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={quote.status} />
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quote Builder Tab */}
          {activeTab === 'builder' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-semibold text-white mb-6">Create New Quote</h2>

              <div className="space-y-6">
                {/* Select RFQ or Cluster Request */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Select RFQ</label>
                    <select
                      value={selectedRFQ}
                      onChange={(e) => {
                        setSelectedRFQ(e.target.value);
                        setSelectedClusterRequest('');
                      }}
                      className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">None</option>
                      {rfqs.filter(r => r.status !== 'quoted').map(rfq => (
                        <option key={rfq.id} value={rfq.id}>
                          {rfq.company} - {rfq.gpu_type} x{rfq.quantity}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Select Cluster Request</label>
                    <select
                      value={selectedClusterRequest}
                      onChange={(e) => {
                        setSelectedClusterRequest(e.target.value);
                        setSelectedRFQ('');
                      }}
                      className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">None</option>
                      {clusterRequests.filter(c => c.status !== 'quoted').map(cluster => (
                        <option key={cluster.id} value={cluster.id}>
                          {cluster.company} - {cluster.number_of_gpus} GPUs
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-400">Line Items</label>
                    <button
                      onClick={addQuoteItem}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
                    >
                      <PlusCircleIcon className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {quoteItems.map((item, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                          <div className="md:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateQuoteItem(index, 'description', e.target.value)}
                              placeholder="e.g., NVIDIA A100 80GB GPU"
                              className="w-full bg-gray-800/50 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuoteItem(index, 'quantity', e.target.value)}
                              min="1"
                              className="w-full bg-gray-800/50 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Unit Price</label>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateQuoteItem(index, 'unitPrice', e.target.value)}
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="w-full bg-gray-800/50 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">Total</label>
                              <div className="text-white font-semibold">
                                ${item.total.toFixed(2)}
                              </div>
                            </div>
                            {quoteItems.length > 1 && (
                              <button
                                onClick={() => removeQuoteItem(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Quote Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={quoteTax}
                      onChange={(e) => setQuoteTax(Number(e.target.value))}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Valid For (Days)</label>
                    <input
                      type="number"
                      value={quoteValidDays}
                      onChange={(e) => setQuoteValidDays(Number(e.target.value))}
                      min="1"
                      className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="50% Upfront, 50% Net 30">50% Upfront, 50% Net 30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Notes (Optional)</label>
                  <textarea
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Additional notes or terms..."
                  />
                </div>

                {/* Quote Summary */}
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30">
                  <h3 className="text-xl font-semibold text-white mb-4">Quote Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${calculateQuoteTotal().subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax ({quoteTax}%):</span>
                      <span>${calculateQuoteTotal().taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between text-xl font-semibold text-white">
                        <span>Total:</span>
                        <span>${calculateQuoteTotal().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCreateQuote}
                    disabled={!selectedRFQ && !selectedClusterRequest}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      !selectedRFQ && !selectedClusterRequest
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                    }`}
                  >
                    <DocumentPlusIcon className="w-5 h-5" />
                    Create Quote
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRFQ('');
                      setSelectedClusterRequest('');
                      setQuoteItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
                      setQuoteTax(0);
                      setQuoteNotes('');
                      setQuoteValidDays(30);
                      setPaymentTerms('Net 30');
                    }}
                    className="px-6 py-3 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;