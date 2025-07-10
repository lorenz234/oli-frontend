'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingAnimation from '@/components/LoadingAnimation';
import { gql } from '@apollo/client';
import { CHAINS } from '@/constants/chains';
import yaml from 'js-yaml';

// Interface for tag definitions from YAML
interface TagDefinition {
  tag_id: string;
  name: string;
  description: string;
  type: string;
  creator: string;
  value_set?: any;
}

// Interface for blockspace coverage data
interface BlockspaceCoverageData {
  chainName: string;
  labeledPercentage: number;
  totalTransactions: number;
  color: string;
}

// Fetch blockspace coverage data from growthepie API
const fetchBlockspaceCoverage = async (): Promise<BlockspaceCoverageData[]> => {
  try {
    const response = await fetch('https://api.growthepie.xyz/v1/blockspace/overview.json');
    const data = await response.json();
    
    const timeframe = 'max';
    const results: BlockspaceCoverageData[] = [];
    
    // Get all available chains from the API response
    const availableChains = Object.keys(data.data?.chains || {});
    
    availableChains.forEach((chainKey, index) => {
      // Skip the 'all_l2s' aggregate
      if (chainKey === 'all_l2s') return;
      
      const chainData = data.data.chains[chainKey];
      const unlabeledTx = chainData.overview?.[timeframe]?.unlabeled?.data?.[2];
      const totalTx = chainData.totals?.[timeframe]?.data?.[2];
      
      if (unlabeledTx !== undefined && totalTx !== undefined && totalTx > 0) {
        const labeledPercentage = 100 * (1 - unlabeledTx / totalTx);
        
        // Get chain display name (capitalize first letter and handle special cases)
        let displayName = chainKey.charAt(0).toUpperCase() + chainKey.slice(1);
        if (chainKey === 'zksync_era') displayName = 'zkSync Era';
        if (chainKey === 'polygon_zkevm') displayName = 'Polygon zkEVM';
        if (chainKey === 'arbitrum_nova') displayName = 'Arbitrum Nova';
        if (chainKey === 'arbitrum_one') displayName = 'Arbitrum One';
        if (chainKey === 'op_bnb') displayName = 'opBNB';
        
        results.push({
          chainName: displayName,
          labeledPercentage,
          totalTransactions: totalTx,
          color: '' // Remove color since we won't use individual colors
        });
      }
    });
    
    return results.sort((a, b) => b.labeledPercentage - a.labeledPercentage);
  } catch (error) {
    console.error('Error fetching blockspace coverage:', error);
    return [];
  }
};

// Fetch and parse tag definitions from OLI repository
const fetchTagDefinitions = async (): Promise<TagDefinition[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/openlabelsinitiative/OLI/refs/heads/main/1_data_model/tags/tag_definitions.yml');
    const yamlText = await response.text();
    
    // Parse YAML using js-yaml
    const parsedYaml = yaml.load(yamlText) as { tags: TagDefinition[] };
    
    // Extract tags from the nested structure
    return parsedYaml?.tags || [];
  } catch (error) {
    console.error('Error fetching tag definitions:', error);
    return [];
  }
};

// Generate dynamic GraphQL query based on tag definitions
const generateTagsQuery = (tagDefinitions: TagDefinition[], selectedChain?: string) => {
  // Filter out internal tags (starting with _) and tags that might cause issues
  const validTags = tagDefinitions.filter(tag => 
    tag.tag_id && 
    !tag.tag_id.startsWith('_') && 
    typeof tag.tag_id === 'string' &&
    tag.tag_id.length > 0
  );

  if (validTags.length === 0) {
    return null;
  }

  // Include all valid tags from the YAML file
  const tagQueries = validTags.map(tag => {
    const cleanedTagId = tag.tag_id.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Build where clause based on whether a chain is selected
    const whereClause = selectedChain 
      ? `where: {
          AND: [
            {
              decodedDataJson: {contains: "\\\"${tag.tag_id}"}
            },
            {
              decodedDataJson: {contains: "\\\"value\\\":\\\"${selectedChain}\\\""}
            }
          ],
          schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
          revoked: {equals: false}
        }`
      : `where: {
          schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
          decodedDataJson: {contains: "\\\"${tag.tag_id}"},
          revoked: {equals: false}
        }`;

    return `
      ${cleanedTagId}: aggregateAttestation(
        ${whereClause}
      ) {
        _count {
          _all
        }
      }
    `;
  }).join('');

  return gql`
    query tag_id_count {
      ${tagQueries}
    }
  `;
};

// Generate dynamic GraphQL query based on chains
const generateChainDistributionQuery = () => {
  const chainQueries = CHAINS.map(chain => `
    ${chain.id}: aggregateAttestation(
      where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\\\"value\\\":\\\"${chain.caip2}\\\""},
        revoked: {equals: false}
      }
    ) {
      _count {
        _all
      }
    }
  `).join('');

  return gql`
    query tags_per_chain {
      ${chainQueries}
    }
  `;
};

const ATTESTATION_CHAIN_DISTRIBUTION = generateChainDistributionQuery();

// Query for attestation distribution (onchain vs offchain)
const ATTESTATION_DISTRIBUTION = gql`
  query GroupByAttestation($by: [AttestationScalarFieldEnum!]!, $where: AttestationWhereInput) {
    groupByAttestation(by: $by, where: $where) {
      isOffchain
      _count {
        _all
      }
    }
  }
`;

// Query for total attestations
const TOTAL_ATTESTATIONS = gql`
  query TotalAttestations {
    aggregateAttestation(
      where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"}
        revoked: {equals: false}
      }
    ) {
      _count {
        _all
      }
    }
  }
`;

interface AttestationGroup {
  isOffchain: boolean;
  _count: {
    _all: number;
  };
}

interface AttestationDistributionData {
  groupByAttestation: AttestationGroup[];
}

interface LabelData {
  name: string;
  count: number;
  color: string;
}

interface ChainData {
  name: string;
  count: number;
  color: string;
}

const LabelAnalyticsChart: React.FC = () => {
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([]);
  const [TAGS_COUNT_ALL, setTagsCountAll] = useState<any>(null);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  
  // Fetch tag definitions on component mount
  useEffect(() => {
    const loadTagDefinitions = async () => {
      setIsLoadingTags(true);
      const tags = await fetchTagDefinitions();
      console.log('Loaded tag definitions:', tags); // Debug log
      setTagDefinitions(tags);
      
      if (tags.length > 0) {
        // Create query for all chains (for the metric)
        const allChainsQuery = generateTagsQuery(tags, undefined);
        setTagsCountAll(allChainsQuery);
      }
      setIsLoadingTags(false);
    };
    
    loadTagDefinitions();
  }, []); // Remove selectedChain dependency

  // Show loading while fetching tag definitions
  if (isLoadingTags || !TAGS_COUNT_ALL) {
    return <LoadingAnimation />;
  }

  // Show error if no tag definitions found
  if (tagDefinitions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
        <div className="text-red-500 text-center">
          <p className="font-semibold mb-2">Error loading label analytics</p>
          <p className="text-sm">No tag definitions found</p>
        </div>
      </div>
    );
  }

  // Render the main component with queries
  return (
    <LabelAnalyticsContent 
      tagDefinitions={tagDefinitions}
      TAGS_COUNT_ALL={TAGS_COUNT_ALL}
    />
  );
};

// Separate component that handles the GraphQL queries
interface LabelAnalyticsContentProps {
  tagDefinitions: TagDefinition[];
  TAGS_COUNT_ALL: any;
}

const LabelAnalyticsContent: React.FC<LabelAnalyticsContentProps> = ({
  tagDefinitions,
  TAGS_COUNT_ALL
}) => {
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [TAGS_COUNT_FILTERED, setTagsCountFiltered] = useState<any>(null);
  const [blockspaceCoverageData, setBlockspaceCoverageData] = useState<BlockspaceCoverageData[]>([]);
  const [blockspaceCoverageLoading, setBlockspaceCoverageLoading] = useState(true);
  const [blockspaceCoverageError, setBlockspaceCoverageError] = useState<string | null>(null);

  // Generate filtered query when chain selection changes
  useEffect(() => {
    if (tagDefinitions.length > 0) {
      const chainFilter = selectedChain === 'all' ? undefined : selectedChain;
      const filteredQuery = generateTagsQuery(tagDefinitions, chainFilter);
      setTagsCountFiltered(filteredQuery);
    }
  }, [selectedChain, tagDefinitions]);

  // Fetch blockspace coverage data
  useEffect(() => {
    const loadBlockspaceCoverage = async () => {
      setBlockspaceCoverageLoading(true);
      setBlockspaceCoverageError(null);
      try {
        const data = await fetchBlockspaceCoverage();
        setBlockspaceCoverageData(data);
      } catch (error) {
        setBlockspaceCoverageError('Failed to load blockspace coverage data');
        console.error('Blockspace coverage error:', error);
      } finally {
        setBlockspaceCoverageLoading(false);
      }
    };

    loadBlockspaceCoverage();
  }, []);

  const { data: tagsDataFiltered, loading: tagsFilteredLoading, error: tagsFilteredError } = useQuery(TAGS_COUNT_FILTERED || TAGS_COUNT_ALL);
  const { data: tagsDataAll, loading: tagsLoadingAll, error: tagsErrorAll } = useQuery(TAGS_COUNT_ALL);
  const { data: chainsData, loading: chainsLoading, error: chainsError } = useQuery(ATTESTATION_CHAIN_DISTRIBUTION);
  const { data: totalAttestationsData, loading: totalAttestationsLoading, error: totalAttestationsError } = useQuery(TOTAL_ATTESTATIONS);

  const { data: attestationDistributionData, loading: attestationDistributionLoading, error: attestationDistributionError } = useQuery<AttestationDistributionData>(ATTESTATION_DISTRIBUTION, {
    variables: {
      by: ["isOffchain"],
      where: {
        schemaId: {
          equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"
        },
        revoked: {
          equals: false
        }
      }
    }
  });

  const labelColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];
  
  // Generate colors dynamically based on the number of chains
  const generateChainColors = () => {
    const baseColors = ['#1E40AF', '#7C3AED', '#059669', '#D97706', '#DC2626', '#4F46E5', '#C026D3', '#0D9488', '#B91C1C', '#7C2D12', '#365314', '#1E3A8A'];
    // If we have more chains than base colors, generate additional colors
    if (CHAINS.length > baseColors.length) {
      const additionalColors = [];
      for (let i = baseColors.length; i < CHAINS.length; i++) {
        // Generate a color based on index
        const hue = (i * 137.508) % 360; // Golden angle approximation for good color distribution
        additionalColors.push(`hsl(${hue}, 70%, 45%)`);
      }
      return [...baseColors, ...additionalColors];
    }
    return baseColors;
  };

  const chainColors = generateChainColors();

  // Calculate total attestations - needed for "Other" calculation
  const totalAttestations = totalAttestationsData?.aggregateAttestation?._count?._all || 0;

  // Process label data for the chart (filtered by selected chain)
  const processedLabelData: LabelData[] = React.useMemo(() => {
    if (!tagsDataFiltered || tagDefinitions.length === 0) return [];
    
    // Create mapping from tag definitions, using cleaned tag IDs for GraphQL field names
    const tagMapping = tagDefinitions
      .filter(tag => tag.tag_id && !tag.tag_id.startsWith('_'))
      .reduce((acc, tag) => {
        const cleanedTagId = tag.tag_id.replace(/[^a-zA-Z0-9_]/g, '_');
        if (tagsDataFiltered[cleanedTagId]) {
          acc[cleanedTagId] = tag.name;
        }
        return acc;
      }, {} as Record<string, string>);

    return Object.entries(tagMapping)
      .map(([key, label], index) => ({
        name: label,
        count: tagsDataFiltered[key]?._count?._all || 0,
        color: labelColors[index % labelColors.length]
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [tagsDataFiltered, tagDefinitions]);

  // Process label data for the metric (all chains)
  const processedLabelDataAll: LabelData[] = React.useMemo(() => {
    if (!tagsDataAll || tagDefinitions.length === 0) return [];
    
    // Create mapping from tag definitions, using cleaned tag IDs for GraphQL field names
    const tagMapping = tagDefinitions
      .filter(tag => tag.tag_id && !tag.tag_id.startsWith('_'))
      .reduce((acc, tag) => {
        const cleanedTagId = tag.tag_id.replace(/[^a-zA-Z0-9_]/g, '_');
        if (tagsDataAll[cleanedTagId]) {
          acc[cleanedTagId] = tag.name;
        }
        return acc;
      }, {} as Record<string, string>);

    return Object.entries(tagMapping)
      .map(([key, label], index) => ({
        name: label,
        count: tagsDataAll[key]?._count?._all || 0,
        color: labelColors[index % labelColors.length]
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [tagsDataAll, tagDefinitions]);

  // Calculate total tag IDs after processedLabelDataAll is defined
  const totalTagIds = processedLabelDataAll.reduce((sum, item) => sum + item.count, 0);

  // Process attestation distribution data for pie chart
  const processedAttestationDistribution = React.useMemo(() => {
    if (!attestationDistributionData?.groupByAttestation) return [];
    
    return attestationDistributionData.groupByAttestation.map((item) => ({
      name: item.isOffchain ? 'Offchain' : 'Onchain',
      count: item._count._all,
      color: item.isOffchain ? '#8B5CF6' : '#3B82F6'
    }));
  }, [attestationDistributionData]);

  // Process chain data dynamically
  const processedChainData: ChainData[] = React.useMemo(() => {
    if (!chainsData) return [];

    const chainData = CHAINS
      .map((chain, index) => ({
        name: chain.shortName,
        count: chainsData[chain.id]?._count?._all || 0,
        color: chainColors[index % chainColors.length]
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    // Calculate "Other" attestations (total - sum of blockchain specific)
    const totalChainAttestations = chainData.reduce((sum, item) => sum + item.count, 0);
    const otherAttestations = totalAttestations - totalChainAttestations;

    // Add "Other" category if there are unaccounted attestations
    if (otherAttestations > 0) {
      chainData.push({
        name: 'Other',
        count: otherAttestations,
        color: '#9CA3AF' // Gray color for "Other"
      });
    }

    return chainData;
  }, [chainsData, chainColors, totalAttestations]);

  if (tagsLoadingAll || chainsLoading) return <LoadingAnimation />;
  
  // Show debug information for errors - but don't block the entire component
  if (tagsFilteredError || tagsErrorAll || chainsError || totalAttestationsError) {
    console.error('GraphQL Errors:', {
      tagsFilteredError: tagsFilteredError?.message,
      tagsErrorAll: tagsErrorAll?.message,
      chainsError: chainsError?.message, 
      totalAttestationsError: totalAttestationsError?.message
    });
  }

  // If all critical queries fail, show error
  if (tagsErrorAll && chainsError) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
        <div className="text-red-500 text-center">
          <p className="font-semibold mb-2">Error loading label analytics</p>
          {tagsFilteredError && <p className="text-sm mb-1">Tags Error: {tagsFilteredError.message}</p>}
          {tagsErrorAll && <p className="text-sm mb-1">Tags All Error: {tagsErrorAll.message}</p>}
          {chainsError && <p className="text-sm mb-1">Chains Error: {chainsError.message}</p>}
          {totalAttestationsError && <p className="text-sm mb-1">Total Attestations Error: {totalAttestationsError.message}</p>}
          <p className="text-sm mt-2 text-gray-600">Check browser console for more details</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Count: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-4">
          <div className="flex flex-col items-center justify-center h-full min-h-[60px]">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Attestations Count</h3>
            {totalAttestationsLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 mb-2">
                  <LoadingAnimation />
                </div>
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : totalAttestationsError ? (
              <div className="text-center">
                <p className="text-red-500 text-sm">Error loading</p>
                <p className="text-xs text-gray-400 mt-1">Check network connection</p>
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold text-blue-600">{totalAttestations.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Number of attestations in the OLI Label Pool</p>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-4">
          <div className="flex flex-col items-center justify-center h-full min-h-[60px]">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Tag_ID Count</h3>
            {tagsErrorAll ? (
              <p className="text-red-500 text-sm">Error loading</p>
            ) : (
              <>
                <p className="text-4xl font-bold text-green-600">{totalTagIds.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Number of Tag_IDs assigned to addresses</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Attestation Type</h3>
            {attestationDistributionLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 mb-1">
                  <LoadingAnimation />
                </div>
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : attestationDistributionError ? (
              <div className="text-center">
                <p className="text-red-500 text-sm">Error loading</p>
                <p className="text-xs text-gray-400 mt-1">Check network connection</p>
              </div>
            ) : processedAttestationDistribution.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500 text-sm">No distribution data available</p>
              </div>
            ) : (
              <div className="flex justify-center items-center mt-1">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedAttestationDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={40}
                        dataKey="count"
                      >
                        {processedAttestationDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium text-gray-900">{data.name}</p>
                                <p className="text-blue-600">
                                  Count: <span className="font-semibold">{data.count.toLocaleString()}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-3 space-y-1">
                  {processedAttestationDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({item.count.toLocaleString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Label Types Card */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedChain === 'all' ? (
                <>
                  Tag_IDs Breakdown ({processedLabelData.reduce((sum, item) => sum + item.count, 0).toLocaleString()})
                </>
              ) : (
                <>
                  Tag_IDs Breakdown - {CHAINS.find(chain => chain.caip2 === selectedChain)?.shortName} ({processedLabelData.reduce((sum, item) => sum + item.count, 0).toLocaleString()})
                </>
              )}
            </h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {selectedChain === 'all' 
                  ? "Number of Tag_IDs assigned to addresses across all chains."
                  : `Number of Tag_IDs assigned to addresses on ${CHAINS.find(chain => chain.caip2 === selectedChain)?.shortName}.`
                }
              </p>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Filter by Blockchain:
                </label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="all">All Chains</option>
                  {CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.caip2}>
                      {chain.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            {tagsFilteredLoading ? (
              <div className="flex justify-center items-center h-96">
                <LoadingAnimation />
              </div>
            ) : tagsFilteredError ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <span className="text-red-500">Error loading chart data</span>
                  <p className="text-sm text-gray-500 mt-1">Please try again</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={processedLabelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      {/* Blockchain Networks Card */}
      {!chainsError && (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Attestation Distribution ({processedChainData.reduce((sum, item) => sum + item.count, 0).toLocaleString()})
            </h2>
            <p className="text-gray-600">
              Number of attestations for each blockchain networks.
            </p>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={processedChainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Blockspace Coverage Card */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Coverage
          </h2>
          <p className="text-gray-600">
            Percentage of all transactions per chain where the destination address has an assigned usage_category tag.
          </p>
        </div>

        <div>
          {blockspaceCoverageLoading ? (
            <div className="flex justify-center items-center h-96">
              <LoadingAnimation />
            </div>
          ) : blockspaceCoverageError ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <span className="text-red-500">Error loading blockspace coverage</span>
                <p className="text-sm text-gray-500 mt-1">{blockspaceCoverageError}</p>
              </div>
            </div>
          ) : blockspaceCoverageData.length === 0 ? (
            <div className="flex justify-center items-center h-96">
              <span className="text-gray-500">No blockspace coverage data available</span>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Summary Stats */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Coverage Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {(blockspaceCoverageData.reduce((sum, chain) => sum + chain.labeledPercentage, 0) / blockspaceCoverageData.length).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Average Coverage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.max(...blockspaceCoverageData.map(c => c.labeledPercentage)).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Best Coverage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {blockspaceCoverageData.reduce((sum, chain) => sum + (chain.totalTransactions * chain.labeledPercentage / 100), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Transactions Labeled</p>
                  </div>
                </div>
              </div>

              {blockspaceCoverageData.map((chain, index) => (
                <div key={chain.chainName} className="group hover:bg-gray-50 rounded-lg p-2.5 transition-colors">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{chain.chainName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {chain.labeledPercentage.toFixed(1)}%
                      </span>
                      <p className="text-xs text-gray-500">
                        {chain.totalTransactions.toLocaleString()} total txs
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(chain.labeledPercentage, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {(chain.totalTransactions * chain.labeledPercentage / 100).toLocaleString()} labeled transactions
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabelAnalyticsChart;