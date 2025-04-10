'use client';

import { useState, useEffect } from 'react';
import { UnlabeledContract } from '@/types/unlabeledContracts';
import { getTopUnlabeledContracts } from '@/services/unlabeledContractsService';
import ContractCard from '@/components/vibe-attest/ContractCard';

interface UnlabeledContractsListProps {
  onSelectContract: (contract: UnlabeledContract) => void;
  sidebarVisible?: boolean; // Add this prop to detect sidebar state
}

type SortOption = 'txCount' | 'gasFeesEth';
type SortDirection = 'asc' | 'desc';
type TimeFrame = 'all' | '7d' | '30d';

const UnlabeledContractsList: React.FC<UnlabeledContractsListProps> = ({ 
  onSelectContract,
  sidebarVisible = false // Default to false if not provided
}) => {
  const [contracts, setContracts] = useState<UnlabeledContract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('txCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [uniqueContracts, setUniqueContracts] = useState<UnlabeledContract[]>([]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

  // Fetch contracts on component mount
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        const data = await getTopUnlabeledContracts();
        setContracts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch unlabeled contracts. Please try again later.');
        console.error('Error fetching contracts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Process and deduplicate contracts when the contracts array changes
  useEffect(() => {
    // Create a map to detect and handle duplicate contracts
    const addressMap = new Map<string, UnlabeledContract>();
    
    // Process each contract
    contracts.forEach(contract => {
      const key = `${contract.chain}-${contract.address}`;
      
      // If contract already exists in the map, keep the one with higher transaction count
      if (addressMap.has(key)) {
        const existing = addressMap.get(key)!;
        // Choose the one with the higher transaction count
        if (contract.txCount > existing.txCount) {
          addressMap.set(key, contract);
        }
      } else {
        // Add new contract to the map
        addressMap.set(key, contract);
      }
    });
    
    // Convert map values back to array
    const uniqueArray = Array.from(addressMap.values());
    setUniqueContracts(uniqueArray);
  }, [contracts]);

  // Get unique chains from the contracts for the filter dropdown
  const chains = ['all', ...new Set(uniqueContracts.map(contract => contract.chain))];

  // Filter contracts by selected chain and time frame
  const filteredContracts = uniqueContracts.filter(contract => {
    const chainMatch = selectedChain === 'all' || contract.chain === selectedChain;
    const timeFrameMatch = timeFrame === 'all' || 
                          (timeFrame === '7d' && contract.dayRange === 7) || 
                          (timeFrame === '30d' && contract.dayRange === 30);
    return chainMatch && timeFrameMatch;
  });

  // Sort contracts based on current sort settings
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (sortDirection === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  // Toggle sort direction and potentially change sort field
  const handleSortChange = (field: SortOption) => {
    if (sortBy === field) {
      // If same field, toggle direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // If new field, set field and default to descending (highest values first)
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Determine if we should use vertical layout for sort buttons
  // We'll use vertical layout when sidebar is visible AND on screens larger than mobile
  const useVerticalSortLayout = sidebarVisible;

  // Common style for sort buttons
  const sortButtonClasses = (isActive: boolean) => `
    ${isActive 
      ? 'bg-white text-indigo-600 ring-1 ring-indigo-600/20 shadow-sm' 
      : 'bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 hover:ring-1 hover:ring-gray-300/50'}
    transition-all duration-200 ease-in-out
    px-4 py-2 text-xs font-medium flex items-center
  `;

  return (
    <div className="rounded-xl bg-white shadow-md overflow-hidden border border-gray-100">
      {/* Header with title */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          Top Unlabeled Smart Contracts 
        </h2>
        <p className="text-sm text-gray-600">
          These contracts have high transaction volume and gas spent but haven&apos;t been labeled yet.
        </p>
      </div>
      
      {/* Filters and controls */}
      <div className="p-3 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Combined Chain and Time Frame Filters */}
          <div className="lg:col-span-5 bg-gray-50/80 backdrop-blur-sm rounded-lg p-2.5 transition-all duration-200 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <label htmlFor="chain-filter" className="text-sm font-medium text-gray-700">
                  Filters
                </label>
                <div className="flex gap-1.5">
                  {selectedChain !== 'all' && (
                    <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-xs font-medium">
                      {selectedChain.toUpperCase().replace('_', ' ')}
                    </span>
                  )}
                  {timeFrame !== 'all' && (
                    <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-xs font-medium">
                      {timeFrame === '7d' ? '7D' : '30D'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <select
                id="chain-filter"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full border border-gray-200 rounded-md text-sm h-8 px-2 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all duration-200"
              >
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain === 'all' ? 'All Chains' : chain.charAt(0).toUpperCase() + chain.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>

              <div className="w-full flex rounded-md shadow-sm bg-white/80 backdrop-blur-sm">
                <button
                  onClick={() => setTimeFrame('all')}
                  className={`flex-1 h-8 text-xs font-medium rounded-l-md transition-all duration-200 ${
                    timeFrame === 'all'
                      ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTimeFrame('7d')}
                  className={`flex-1 h-8 text-xs font-medium border-l border-r border-gray-100 transition-all duration-200 ${
                    timeFrame === '7d'
                      ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeFrame('30d')}
                  className={`flex-1 h-8 text-xs font-medium rounded-r-md transition-all duration-200 ${
                    timeFrame === '30d'
                      ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  30D
                </button>
              </div>
            </div>
          </div>
          
          {/* Sort Controls with dynamic layout */}
          <div className="lg:col-span-4 bg-gray-50/80 backdrop-blur-sm rounded-lg p-2.5 transition-all duration-200 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sort By</span>
            </div>
            
            {useVerticalSortLayout ? (
              // Vertical layout for when sidebar is open
              <div className="flex flex-col gap-2 transition-all duration-200">
                <button
                  onClick={() => handleSortChange('txCount')}
                  className={`${sortButtonClasses(sortBy === 'txCount')} justify-between rounded-md h-8`}
                >
                  <div className="flex items-center">
                    <svg className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 transition-colors duration-200 ${sortBy === 'txCount' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>Transactions</span>
                  </div>
                  {sortBy === 'txCount' && (
                    <span className="transition-transform duration-200">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                  )}
                </button>
                
                <button
                  onClick={() => handleSortChange('gasFeesEth')}
                  className={`${sortButtonClasses(sortBy === 'gasFeesEth')} justify-between rounded-md h-8`}
                >
                  <div className="flex items-center">
                    <svg className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 transition-colors duration-200 ${sortBy === 'gasFeesEth' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Gas Fees</span>
                  </div>
                  {sortBy === 'gasFeesEth' && (
                    <span className="transition-transform duration-200">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                  )}
                </button>
              </div>
            ) : (
              // Horizontal layout for when sidebar is closed
              <div className="flex rounded-md shadow-sm bg-white/80 backdrop-blur-sm transition-all duration-200">
                <button
                  onClick={() => handleSortChange('txCount')}
                  className={`flex-1 h-8 text-xs font-medium rounded-l-md flex items-center justify-center whitespace-nowrap transition-all duration-200 ${
                    sortBy === 'txCount' 
                      ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  <svg className={`w-3.5 h-3.5 mr-1 flex-shrink-0 transition-colors duration-200 ${sortBy === 'txCount' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span>Transactions</span>
                  {sortBy === 'txCount' && (
                    <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('gasFeesEth')}
                  className={`flex-1 h-8 text-xs font-medium rounded-r-md flex items-center justify-center whitespace-nowrap transition-all duration-200 ${
                    sortBy === 'gasFeesEth' 
                      ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  <svg className={`w-3.5 h-3.5 mr-1 flex-shrink-0 transition-colors duration-200 ${sortBy === 'gasFeesEth' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Gas Fees</span>
                  {sortBy === 'gasFeesEth' && (
                    <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Results Count */}
          <div className="lg:col-span-3 bg-gray-50/80 backdrop-blur-sm rounded-lg p-2.5 transition-all duration-200 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Showing</span>
            </div>
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-md px-3 h-8">
              <div className="text-lg font-bold text-indigo-600">
                {sortedContracts.length}
              </div>
              <div className="text-sm text-gray-600">
                contracts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading contracts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 m-4 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      ) : sortedContracts.length === 0 ? (
        <div className="text-center py-16 px-4">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No unlabeled contracts found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try changing your filter options or check back later as new unlabeled contracts are discovered.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sortedContracts.map((contract) => (
            <div key={`${contract.chain}-${contract.address}-${contract.timeRange}`} className="px-4 py-2">
              <ContractCard
                contract={contract}
                onSelect={() => onSelectContract(contract)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnlabeledContractsList; 