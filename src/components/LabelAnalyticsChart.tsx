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

// Interface for attestation distribution
interface AttestationGroup {
  isOffchain: boolean;
  _count: {
    _all: number;
  };
}

interface AttestationDistributionData {
  groupByAttestation: AttestationGroup[];
}

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
const generateTagsQuery = (tagDefinitions: TagDefinition[]) => {
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
  const tagQueries = validTags.map(tag => `
    ${tag.tag_id.replace(/[^a-zA-Z0-9_]/g, '_')}: aggregateAttestation(
      where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\\\"${tag.tag_id}"},
        revoked: {equals: false}
      }
    ) {
      _count {
        _all
      }
    }
  `).join('');

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

// Query for total attestations
const TOTAL_ATTESTATIONS = gql`
  query TotalAttestations {
    aggregateAttestation(
      where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        revoked: {equals: false}
      }
    ) {
      _count {
        _all
      }
    }
  }
`;

// Query for attestation distribution (onchain vs offchain)
const ATTESTATION_DISTRIBUTION = gql`
  query GroupByAttestation($by: [AttestationScalarFieldEnum!]!, $where: AttestationWhereInput, $orderBy: [AttestationOrderByWithAggregationInput!]) {
    groupByAttestation(by: $by, where: $where, orderBy: $orderBy) {
      isOffchain
      _count {
        _all
      }
    }
  }
`;

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
  const [TAGS_COUNT, setTagsCount] = useState<any>(null);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  
  // Fetch tag definitions on component mount
  useEffect(() => {
    const loadTagDefinitions = async () => {
      setIsLoadingTags(true);
      const tags = await fetchTagDefinitions();
      console.log('Loaded tag definitions:', tags); // Debug log
      setTagDefinitions(tags);
      
      if (tags.length > 0) {
        const tagsQuery = generateTagsQuery(tags);
        console.log('Generated query:', tagsQuery); // Debug log
        setTagsCount(tagsQuery);
      }
      setIsLoadingTags(false);
    };
    
    loadTagDefinitions();
  }, []);

  // Show loading while fetching tag definitions
  if (isLoadingTags || !TAGS_COUNT) {
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
      TAGS_COUNT={TAGS_COUNT}
    />
  );
};

// Separate component that handles the GraphQL queries
interface LabelAnalyticsContentProps {
  tagDefinitions: TagDefinition[];
  TAGS_COUNT: any;
}

const LabelAnalyticsContent: React.FC<LabelAnalyticsContentProps> = ({
  tagDefinitions,
  TAGS_COUNT
}) => {
  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(TAGS_COUNT);
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
      },
      orderBy: [
        {
          _count: {
            attester: "desc"
          }
        }
      ]
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

  // Process label data dynamically based on tag definitions
  const processedLabelData: LabelData[] = React.useMemo(() => {
    if (!tagsData || tagDefinitions.length === 0) return [];
    
    // Create mapping from tag definitions, using cleaned tag IDs for GraphQL field names
    const tagMapping = tagDefinitions
      .filter(tag => tag.tag_id && !tag.tag_id.startsWith('_'))
      .reduce((acc, tag) => {
        const cleanedTagId = tag.tag_id.replace(/[^a-zA-Z0-9_]/g, '_');
        if (tagsData[cleanedTagId]) {
          acc[cleanedTagId] = tag.name;
        }
        return acc;
      }, {} as Record<string, string>);

    return Object.entries(tagMapping)
      .map(([key, label], index) => ({
        name: label,
        count: tagsData[key]?._count?._all || 0,
        color: labelColors[index % labelColors.length]
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [tagsData, tagDefinitions]);

  // Process chain data dynamically
  const processedChainData: ChainData[] = React.useMemo(() => {
    if (!chainsData) return [];

    return CHAINS
      .map((chain, index) => ({
        name: chain.shortName,
        count: chainsData[chain.id]?._count?._all || 0,
        color: chainColors[index % chainColors.length]
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [chainsData, chainColors]);

  if (tagsLoading || chainsLoading || totalAttestationsLoading) return <LoadingAnimation />;
  
  // Show debug information for errors
  if (tagsError || chainsError || totalAttestationsError) {
    console.error('GraphQL Errors:', {
      tagsError: tagsError?.message,
      chainsError: chainsError?.message, 
      totalAttestationsError: totalAttestationsError?.message
    });
    
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
        <div className="text-red-500 text-center">
          <p className="font-semibold mb-2">Error loading label analytics</p>
          {tagsError && <p className="text-sm mb-1">Tags Error: {tagsError.message}</p>}
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

  // Calculate totals with fallbacks
  const totalAttestations = totalAttestationsData?.aggregateAttestation?._count?._all || 0;
  const totalTagIds = processedLabelData.reduce((sum, item) => sum + item.count, 0);

  // Process attestation distribution data with fallbacks
  const onchainCount = attestationDistributionData?.groupByAttestation.find(group => !group.isOffchain)?._count?._all || 0;
  const offchainCount = attestationDistributionData?.groupByAttestation.find(group => group.isOffchain)?._count?._all || 0;
  const distributionData = [
    { name: 'Onchain', value: onchainCount, color: '#3B82F6' },
    { name: 'Offchain', value: offchainCount, color: '#EC4899' }
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
          <div className="flex flex-col items-center justify-center h-full min-h-[100px]">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Attestations Count</h3>
            {totalAttestationsError ? (
              <p className="text-red-500 text-sm">Error loading</p>
            ) : (
              <>
                <p className="text-4xl font-bold text-blue-600">{totalAttestations.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Number of attestations in the OLI Label Pool</p>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
          <div className="flex flex-col items-center justify-center h-full min-h-[100px]">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Tag_ID Count</h3>
            {tagsError ? (
              <p className="text-red-500 text-sm">Error loading</p>
            ) : (
              <>
                <p className="text-4xl font-bold text-green-600">{totalTagIds.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Number of Tag_IDs assigned to addresses</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Attestation Type</h3>
            {attestationDistributionLoading ? (
              <div className="flex justify-center items-center h-48">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : attestationDistributionError ? (
              <div className="flex justify-center items-center h-48">
                <span className="text-red-500 text-sm">Error loading distribution</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center space-x-6">
                  <ResponsiveContainer width={80} height={80}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={35}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => value.toLocaleString()}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {distributionData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}: {item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Label Types Card */}
      {!tagsError && (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tag_IDs Breakdown ({processedLabelData.reduce((sum, item) => sum + item.count, 0).toLocaleString()})
            </h2>
            <p className="text-gray-600">
                Number of Tag_IDs assigned to addresses per chain.
            </p>
          </div>

          <div>
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
          </div>
        </div>
      )}

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
    </div>
  );
};

export default LabelAnalyticsChart; 