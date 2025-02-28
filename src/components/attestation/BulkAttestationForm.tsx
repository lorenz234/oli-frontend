import React, { useState, useRef, useEffect } from 'react';
import { EAS, SchemaEncoder, NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import Notification from './Notification';
import BulkConfirmationModal from './BulkConfirmationModal';
import { CATEGORIES } from '../../constants/categories';
import { Trash2, Plus, Upload, Download, Save } from 'lucide-react';

// Get all valid category IDs
const VALID_CATEGORY_IDS = CATEGORIES.flatMap(mainCategory => 
  mainCategory.categories.map(category => category.category_id)
);

// Create a mapping of category IDs to their display info
const CATEGORY_MAP = {};
CATEGORIES.forEach(mainCategory => {
  mainCategory.categories.forEach(category => {
    CATEGORY_MAP[category.category_id] = {
      name: category.name,
      description: category.description,
      mainCategory: mainCategory.main_category_name
    };
  });
});

// Constants from your existing application
const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";
const SCHEMA_UID = "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68";

// Default chain options
const CHAIN_OPTIONS = [
  { value: 'eip155:1', label: 'Ethereum' },
  { value: 'eip155:8453', label: 'Base' },
  { value: 'eip155:10', label: 'OP Mainnet' },
  { value: 'eip155:42161', label: 'Arbitrum One' },
];

// Column definition for our table
const COLUMNS = [
  { 
    id: 'chain_id', 
    name: 'Chain', 
    required: true,
    validator: (value) => {
      return CHAIN_OPTIONS.some(option => option.value === value) ? null : 'Invalid chain value';
    }
  },
  { 
    id: 'address', 
    name: 'Address', 
    required: true,
    validator: (value) => {
      try {
        ethers.getAddress(value);
        return null;
      } catch (error) {
        console.error('Error:', error);
        return 'Invalid Ethereum address';
      }
    }
  },
  { id: 'contract_name', name: 'Contract Name', required: false },
  { 
    id: 'owner_project', 
    name: 'Owner Project', 
    required: false,
    // This validator will be used dynamically in the component since validProjects is loaded asynchronously
    needsCustomValidation: true
  },
  { 
    id: 'usage_category', 
    name: 'Usage Category', 
    required: false,
    validator: (value) => {
      return !value || VALID_CATEGORY_IDS.includes(value) ? null : 'Invalid category';
    }
  },
  { 
    id: 'is_contract', 
    name: 'Is Contract', 
    required: false,
    validator: (value) => {
      return value === '' || value === 'true' || value === 'false' ? null : 'Must be true or false';
    }
  },
];

// Define initial empty row
const EMPTY_ROW = {
  chain_id: '', 
  address: '',
  contract_name: '',
  owner_project: '',
  usage_category: '',
  is_contract: '',
};

const BulkAttestationForm = () => {
  const [rows, setRows] = useState([{ ...EMPTY_ROW }]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [validProjects, setValidProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const fileInputRef = useRef(null);
  
  // Fetch valid projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch('https://api.growthepie.xyz/v1/labels/projects.json');
        const data = await response.json();
        
        // Extract project IDs from the response (assuming the format is the same as in OwnerProjectSelect)
        if (data && data.data && data.data.data) {
          // The first item in each array is the project ID
          const projectIds = data.data.data.map(item => item[0]);
          setValidProjects(projectIds);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        showNotification('Failed to load project validation data', 'warning');
      } finally {
        setIsLoadingProjects(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Add a new empty row
  const addRow = () => {
    setRows([...rows, { ...EMPTY_ROW }]);
  };

  // Delete a row by index
  const deleteRow = (index) => {
    if (rows.length === 1) {
      // Keep at least one row, just clear it
      setRows([{ ...EMPTY_ROW }]);
    } else {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  // Update a specific field in a row
  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
    
    // Clear any errors for this field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  // Validate all rows before submission
  const validateRows = () => {
    const newErrors = {};
    let isValid = true;

    rows.forEach((row, index) => {
      // Skip empty rows
      if (!row.address && rows.length > 1) {
        return;
      }
      
      // Check required fields and run custom validators
      COLUMNS.forEach(column => {
        // Check if required field is empty
        if (column.required && !row[column.id]) {
          newErrors[`${index}-${column.id}`] = `${column.name} is required`;
          isValid = false;
        }
        
        // Run custom validator if field has a value
        if (column.validator && row[column.id]) {
          const validationError = column.validator(row[column.id]);
          if (validationError) {
            newErrors[`${index}-${column.id}`] = validationError;
            isValid = false;
          }
        }
        
        // Special validation for owner_project
        if (column.id === 'owner_project' && row[column.id] && validProjects.length > 0) {
          if (!validProjects.includes(row[column.id])) {
            newErrors[`${index}-${column.id}`] = `Unknown project: "${row[column.id]}"`;
            isValid = false;
          }
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Prepare confirmation data for modal
  const prepareConfirmationData = () => {
    // Filter out empty rows for confirmation
    const validRows = rows.filter(row => row.address.trim() !== '');
    
    if (validRows.length === 0) return [];
    
    // Create an array of data for each row
    return validRows.map(row => {
      // Extract tags for this row
      const tagsObject = {};
      Object.entries(row)
        .filter(([key, value]) => key !== 'chain_id' && key !== 'address' && value)
        .forEach(([key, value]) => {
          tagsObject[key] = value;
        });
      
      return {
        chain_id: row.chain_id,
        address: row.address,
        tagsObject
      };
    });
  };

  // Handle submission request
  const handleSubmissionRequest = (e) => {
    e.preventDefault();
    
    if (!validateRows()) {
      return;
    }

    // Filter out empty rows
    const validRows = rows.filter(row => row.address.trim() !== '');
    if (validRows.length === 0) {
      showNotification("Please add at least one valid address", "error");
      return;
    }
    
    // Check if we exceed the maximum allowed number of attestations
    if (validRows.length > 30) {
      showNotification(`You can only submit up to 30 attestations at once. You currently have ${validRows.length} valid rows.`, "error");
      return;
    }

    if (!window.ethereum) {
      showNotification("Please connect your wallet first", "error");
      return;
    }

    // Prepare confirmation data and open modal
    const modalData = prepareConfirmationData();
    setConfirmationData(modalData);
    setIsModalOpen(true);
  };

  // Handle actual submission after confirmation
  const handleBulkSubmit = async () => {
    // Close modal
    setIsModalOpen(false);
    setIsSubmitting(true);
    
    try {
      // Switch to Base network first
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 0x2105 is hex for 8453 (Base)
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          });
        } else {
          throw switchError;
        }
      }

      // Initialize provider and signer for Base
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Initialize EAS SDK
      const eas = new EAS(EAS_CONTRACT_ADDRESS, provider);
      eas.connect(signer);

      // Use multiAttest to submit all attestations in a single transaction
      const schemaEncoder = new SchemaEncoder('string chain_id,string tags_json');
      
      // Prepare attestation data for multiAttest
      const attestationsData = [];
      
      // Filter valid rows again to be safe
      const validRows = rows.filter(row => row.address.trim() !== '');
      
      for (const row of validRows) {
        
        // Create tags_json object
        const tagsObject = {};
        Object.entries(row)
          .filter(([key, value]) => key !== 'chain_id' && key !== 'address' && value)
          .forEach(([key, value]) => {
            tagsObject[key] = value;
          });
        
        console.log("Tags object:", tagsObject);
        
        const encodedData = schemaEncoder.encodeData([
          { name: 'chain_id', value: row.chain_id, type: 'string' },
          { name: 'tags_json', value: JSON.stringify(tagsObject), type: 'string' }
        ]);
        
        console.log("Encoded data:", encodedData);

        // Add to attestations array
        attestationsData.push({
          recipient: row.address,
          expirationTime: NO_EXPIRATION, 
          revocable: true,
          data: encodedData,
        });
      }

      console.log("Attestations data:", attestationsData);
      
      // Submit all attestations in a single transaction
      const tx = await eas.multiAttest([
        {
          schema: SCHEMA_UID,
          data: attestationsData,
        }
      ]);

      console.log("Transaction:", tx);

      // Wait for transaction confirmation
      const attestationUIDs = await tx.wait();
      console.log("Transaction receipt:", tx.receipt);
      
      // Create results array for user feedback
      const results = attestationUIDs.map((uid, index) => ({
        address: attestationsData[index].recipient,
        success: true,
        uid: uid
      }));

      // Show results summary
      const successCount = results.filter(r => r.success).length;
      showNotification(`${successCount} of ${results.length} attestations created successfully!`);
      
      // Reset form if all were successful
      if (successCount === results.length) {
        setRows([{ ...EMPTY_ROW }]);
      }

    } catch (error) {
      console.error('Error submitting attestations:', error);
      showNotification(error.message || "Failed to submit attestations", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle CSV import
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Map CSV headers to our expected fields
        const fieldMap = {};
        headers.forEach((header, index) => {
          const field = COLUMNS.find(col => 
            col.id.toLowerCase() === header || 
            col.name.toLowerCase() === header
          );
          if (field) {
            fieldMap[index] = field.id;
          }
        });
        
        // Parse rows
        const newRows = [];
        const validationIssues = [];
        const rowValidation = {}; // Track which rows have validation issues for highlighting
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          const row = { ...EMPTY_ROW };
          const rowIndex = newRows.length; // Store the index for error tracking
          rowValidation[rowIndex] = {};
          
          values.forEach((value, index) => {
            if (fieldMap[index]) {
              const field = fieldMap[index];
              
              // Validate chain_id against supported values
              if (field === 'chain_id') {
                // Only set valid chain IDs
                const isValidChain = CHAIN_OPTIONS.some(option => option.value === value);
                if (isValidChain) {
                  row[field] = value;
                } else {
                  // Keep the invalid value but mark it for validation
                  row[field] = value; // Keep the invalid value to show the user
                  rowValidation[rowIndex][field] = `Invalid chain: "${value}" - please select a valid chain`;
                  validationIssues.push(`Row ${i}: Invalid chain_id "${value}" - must be a supported chain`);
                }
              } 
              // Validate owner_project
              else if (field === 'owner_project' && value && validProjects.length > 0) {
                row[field] = value;
                if (!validProjects.includes(value)) {
                  rowValidation[rowIndex][field] = `Unknown project: "${value}"`;
                  validationIssues.push(`Row ${i}: Invalid project "${value}" - must be a known project`);
                }
              }
              // Validate is_contract value
              else if (field === 'is_contract') {
                if (value === 'TRUE' || value === 'FALSE' || value === 'true' || value === 'false' || value === '') {
                  row[field] = value.toLowerCase();
                } else {
                  row[field] = '';
                  rowValidation[rowIndex][field] = `Invalid value: "${value}" - must be true or false`;
                  validationIssues.push(`Row ${i}: Invalid is_contract value "${value}" removed`);
                }
              }
              // Validate usage_category
              else if (field === 'usage_category' && value) {
                if (VALID_CATEGORY_IDS.includes(value)) {
                  row[field] = value;
                } else {
                  // Keep the value but mark it for validation
                  row[field] = value;
                  rowValidation[rowIndex][field] = `Invalid category: "${value}"`;
                  validationIssues.push(`Row ${i}: Invalid usage_category "${value}" - must be a valid category ID`);
                }
              }
              else {
                row[field] = value;
              }
            }
          });
          
          newRows.push(row);
        }
        
        if (newRows.length > 0) {
          setRows(newRows);
          
          // Set validation errors to highlight invalid fields
          const newErrors = {};
          Object.entries(rowValidation).forEach(([rowIndex, fields]) => {
            Object.entries(fields).forEach(([field, errorMessage]) => {
              newErrors[`${rowIndex}-${field}`] = errorMessage;
            });
          });
          setErrors(newErrors);
          
          if (validationIssues.length > 0) {
            // Show notification with validation issues
            showNotification(
              `Imported ${newRows.length} rows with ${validationIssues.length} validation issues. Please fix highlighted fields.`, 
              "warning"
            );
            console.warn("CSV Import validation issues:", validationIssues);
          } else {
            showNotification(`Imported ${newRows.length} rows from CSV`, "success");
          }
        } else {
          showNotification("No valid data rows found in the CSV", "error");
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        showNotification("Failed to parse CSV file", "error");
      }
      
      // Reset the file input so the same file can be imported again
      fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Handle CSV export
  const handleExportCSV = () => {
    // Create CSV header
    const csvContent = [
      COLUMNS.map(col => col.name).join(','),
      ...rows.map(row => 
        COLUMNS.map(col => row[col.id] || '').join(',')
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_attestation_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    // Create template CSV with just headers and one empty row
    const csvContent = [
      COLUMNS.map(col => col.name).join(','),
      //COLUMNS.map(col => '').join(',')
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_attestation_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bulk Attestation</h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Template
            </button>
            <button
              type="button"
              onClick={triggerFileInput}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import CSV
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Enter multiple addresses and their associated tags for bulk attestation. All attestations will be submitted in a single transaction, saving gas and time.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Note: Using the multiAttest feature requires only one signature for all attestations, making the process more efficient. Maximum of 30 attestations allowed per batch.
          </p>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map(column => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.name} {column.required && <span className="text-red-500">*</span>}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Chain ID */}
                  <td className="px-3 py-2">
                    <select
                      value={CHAIN_OPTIONS.some(option => option.value === row.chain_id) ? row.chain_id : ''}
                      onChange={(e) => updateRow(rowIndex, 'chain_id', e.target.value)}
                      className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors[`${rowIndex}-chain_id`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="" disabled>Select a chain</option>
                      {CHAIN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      {/* Show invalid option if present */}
                      {!CHAIN_OPTIONS.some(option => option.value === row.chain_id) && row.chain_id && (
                        <option value={row.chain_id} disabled className="text-red-500">
                          ⚠️ Invalid: {row.chain_id}
                        </option>
                      )}
                    </select>
                    {errors[`${rowIndex}-chain_id`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`${rowIndex}-chain_id`]}</p>
                    )}
                  </td>
                  
                  {/* Address */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.address}
                      onChange={(e) => updateRow(rowIndex, 'address', e.target.value)}
                      placeholder="0x..."
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors[`${rowIndex}-address`] ? 'border-red-300' : ''
                      }`}
                    />
                    {errors[`${rowIndex}-address`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`${rowIndex}-address`]}</p>
                    )}
                  </td>
                  
                  {/* Contract Name */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.contract_name}
                      onChange={(e) => updateRow(rowIndex, 'contract_name', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                  
                  {/* Owner Project */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.owner_project}
                      onChange={(e) => updateRow(rowIndex, 'owner_project', e.target.value)}
                      className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors[`${rowIndex}-owner_project`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      list="valid-projects"
                    />
                    {isLoadingProjects && (
                      <p className="mt-1 text-xs text-gray-500">Loading projects...</p>
                    )}
                    {errors[`${rowIndex}-owner_project`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`${rowIndex}-owner_project`]}</p>
                    )}
                    {!errors[`${rowIndex}-owner_project`] && row.owner_project && validProjects.includes(row.owner_project) && (
                      <p className="mt-1 text-xs text-green-600">✓ Valid project</p>
                    )}
                    
                    {/* Datalist for project suggestions */}
                    <datalist id="valid-projects">
                      {validProjects.map(project => (
                        <option key={project} value={project} />
                      ))}
                    </datalist>
                  </td>
                  
                  {/* Usage Category */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.usage_category}
                      onChange={(e) => updateRow(rowIndex, 'usage_category', e.target.value)}
                      className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors[`${rowIndex}-usage_category`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      list="valid-categories"
                    />
                    {errors[`${rowIndex}-usage_category`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`${rowIndex}-usage_category`]}</p>
                    )}
                    {!errors[`${rowIndex}-usage_category`] && row.usage_category && VALID_CATEGORY_IDS.includes(row.usage_category) && (
                      <p className="mt-1 text-xs text-green-600">
                        ✓ {CATEGORY_MAP[row.usage_category]?.name} ({CATEGORY_MAP[row.usage_category]?.mainCategory})
                      </p>
                    )}
                    
                    {/* Datalist for category suggestions */}
                    <datalist id="valid-categories">
                      {VALID_CATEGORY_IDS.map(categoryId => (
                        <option key={categoryId} value={categoryId} />
                      ))}
                    </datalist>
                  </td>
                  
                  {/* Is Contract */}
                  <td className="px-3 py-2">
                    <select
                      value={row.is_contract}
                      onChange={(e) => updateRow(rowIndex, 'is_contract', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => deleteRow(rowIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </button>
          
          <button
            type="button"
            onClick={handleSubmissionRequest}
            disabled={isSubmitting || rows.length === 0}
            className="w-1/3 flex justify-center px-5 py-2.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 text-sm font-semibold disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Create Bulk Attestations
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Use the BulkConfirmationModal component */}
      <BulkConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBulkSubmit}
        data={confirmationData}
        chainOptions={CHAIN_OPTIONS}
      />
    </div>
  );
};

export default BulkAttestationForm;