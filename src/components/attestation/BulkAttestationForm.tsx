// components/attestation/BulkAttestationForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import Notification from './Notification';
import BulkConfirmationModal from './BulkConfirmationModal';
import BulkFieldSelector from './BulkFieldSelector';
import { Trash2, Plus, Upload, Download, Save, X } from 'lucide-react';

// Import shared constants and utilities
import { CHAIN_OPTIONS } from '../../constants/chains';
import { SCHEMA_UID } from '../../constants/eas';
import { VALID_CATEGORY_IDS } from '../../constants/categories';
import { validateAddress, validateChain, validateCategory, validateBoolean } from '../../utils/validation';
import { prepareTags, prepareEncodedData, switchToBaseNetwork, initializeEAS } from '../../utils/attestationUtils';
import { NotificationType, ConfirmationData } from '../../types/attestation';
import { formFields } from '../../constants/formFields';

// Types definitions
interface RowData {
  [key: string]: string;
  chain_id: string;
  address: string;
  contract_name: string;
  owner_project: string;
  usage_category: string;
  is_contract: string;
}

interface AttestationResult {
  address: string;
  success: boolean;
  uid: string;
}

interface ColumnDefinition {
  id: string;
  name: string;
  required: boolean;
  validator?: (value: string) => string | null;
  needsCustomValidation?: boolean;
  type?: string;
}

// Define initial empty row
const EMPTY_ROW: RowData = {
  chain_id: '', 
  address: '',
  contract_name: '',
  owner_project: '',
  usage_category: '',
  is_contract: '',
};

// Dummy row for template
const DUMMY_ROW: RowData = {
  chain_id: 'eip155:1',
  address: '0x1234567890123456789012345678901234567890',
  contract_name: 'Example Contract',
  owner_project: 'growthepie',
  usage_category: 'other',
  is_contract: 'true',
};

// Base columns definition
const BASE_COLUMNS: ColumnDefinition[] = [
  { 
    id: 'chain_id', 
    name: 'Chain', 
    required: true,
    validator: (value: string) => validateChain(value, CHAIN_OPTIONS)
  },
  { 
    id: 'address', 
    name: 'Address', 
    required: true,
    validator: (value: string) => validateAddress(value)
  },
  { id: 'contract_name', name: 'Contract Name', required: false },
  { 
    id: 'owner_project', 
    name: 'Owner Project', 
    required: false,
    needsCustomValidation: true
  },
  { 
    id: 'usage_category', 
    name: 'Usage Category', 
    required: false,
    validator: (value: string) => validateCategory(value)
  },
  { 
    id: 'is_contract', 
    name: 'Is Contract', 
    required: false,
    validator: (value: string) => validateBoolean(value)
  },
];

const BulkAttestationForm: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([{ ...EMPTY_ROW }]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData[] | null>(null);
  const [validProjects, setValidProjects] = useState<string[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [activeColumns, setActiveColumns] = useState<ColumnDefinition[]>(BASE_COLUMNS);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Fetch valid projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch('https://api.growthepie.xyz/v1/labels/projects.json');
        const data = await response.json();
        
        // Extract project IDs from the response
        if (data && data.data && data.data.data) {
          // The first item in each array is the project ID
          const projectIds = data.data.data.map((item: any[]) => item[0]);
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
  const deleteRow = (index: number) => {
    if (rows.length === 1) {
      // Keep at least one row, just clear it
      setRows([{ ...EMPTY_ROW }]);
    } else {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  // Update a specific field in a row
  const updateRow = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
    
    // Clear any errors for this field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }

    // Run validation for the updated field
    const column = activeColumns.find(col => col.id === field);
    if (column) {
      const newErrors = { ...errors };
      
      // Check if required field is empty
      if (column.required && !value) {
        newErrors[`${index}-${field}`] = `${column.name} is required`;
      }
      // Run validator if value exists
      else if (value && column.validator) {
        const validationError = column.validator(value);
        if (validationError) {
          newErrors[`${index}-${field}`] = validationError;
        }
      }
      // Special validation for owner_project
      else if (field === 'owner_project' && value && validProjects.length > 0) {
        if (!validProjects.includes(value)) {
          newErrors[`${index}-${field}`] = `Unknown project: "${value}"`;
        }
      }

      setErrors(newErrors);
    }
  };

  // Validate all rows before submission
  const validateRows = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    rows.forEach((row, index) => {
      // Skip empty rows
      if (Object.values(row).every(value => !value) && rows.length > 1) {
        return;
      }

      // Check each column
      activeColumns.forEach(column => {
        const value = row[column.id];

        // Check required fields
        if (column.required && !value) {
          newErrors[`${index}-${column.id}`] = `${column.name} is required`;
          isValid = false;
          return;
        }

        // Skip validation if field is empty and not required
        if (!value && !column.required) {
          return;
        }

        // Run field-specific validation
        if (column.validator) {
          const validationError = column.validator(value);
          if (validationError) {
            newErrors[`${index}-${column.id}`] = validationError;
            isValid = false;
          }
        }

        // Special validation for owner_project
        if (column.id === 'owner_project' && value && validProjects.length > 0) {
          if (!validProjects.includes(value)) {
            newErrors[`${index}-${column.id}`] = `Unknown project: "${value}"`;
            isValid = false;
          }
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success'): void => {
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
      const tagsObject = prepareTags(row);
      
      return {
        chain_id: row.chain_id,
        address: row.address,
        tagsObject
      };
    });
  };

  // Check if a row is the dummy example row
  const isDummyRow = (row: RowData): boolean => {
    // Check if the address matches the dummy row
    // We specifically check the address since it's a required field
    return row.address === DUMMY_ROW.address;
  };

  // Handle submission request
  const handleSubmissionRequest = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    if (!validateRows()) {
      return;
    }

    // Filter out empty rows and dummy rows
    const validRows = rows.filter((row: RowData) => 
      row.address.trim() !== '' && !isDummyRow(row)
    );

    if (validRows.length === 0) {
      showNotification("Please add at least one valid address", "error");
      return;
    }

    // Check if we exceed the maximum allowed number of attestations
    if (validRows.length > 50) {
      showNotification(`You can only submit up to 50 attestations at once. You currently have ${validRows.length} valid rows.`, "error");
      return;
    }

    if (!window.ethereum) {
      showNotification("Please connect your wallet first", "error");
      return;
    }

    // Prepare confirmation data and open modal
    const modalData: ConfirmationData[] = prepareConfirmationData();
    setConfirmationData(modalData);
    setIsModalOpen(true);
  };

  // Handle actual submission after confirmation
  const handleBulkSubmit = async () => {
    // Close modal
    setIsModalOpen(false);
    setIsSubmitting(true);
    
    try {
      // Check if ethereum is available
      if (!window.ethereum) {
        showNotification("Please connect your wallet first", "error");
        setIsSubmitting(false);
        return;
      }

      // Switch to Base network
      await switchToBaseNetwork(window.ethereum);

      // Initialize EAS
      const { eas } = await initializeEAS(window.ethereum);

      // Use multiAttest to submit all attestations in a single transaction
      // Prepare attestation data for multiAttest
      interface AttestationData {
        recipient: string;
        expirationTime: bigint;
        revocable: boolean;
        data: string;
      }
      
      const attestationsData: AttestationData[] = [];
      
      // Filter valid rows again to be safe and exclude dummy rows
      const validRows = rows.filter(row => 
        row.address.trim() !== '' && !isDummyRow(row)
      );
      
      for (const row of validRows) {
        // Create tags_json object
        const tagsObject = prepareTags(row);
        
        console.log("Tags object:", tagsObject);
        
        const encodedData = prepareEncodedData(row.chain_id, tagsObject);
        
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
      const results: AttestationResult[] = attestationUIDs.map((uid: string, index: number) => ({
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

    } catch (error: any) {
      console.error('Error submitting attestations:', error);
      showNotification(error.message || "Failed to submit attestations", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle CSV import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 2) {
        showNotification('CSV file must contain at least a header row and one data row', 'error');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      
      // Validate required fields are present
      const requiredFields = activeColumns.filter(col => col.required).map(col => col.id.toLowerCase());
      const missingRequired = requiredFields.filter(field => 
        !headers.some(header => header === field || header === activeColumns.find(col => col.id === field)?.name.toLowerCase())
      );

      if (missingRequired.length > 0) {
        showNotification(`Missing required fields: ${missingRequired.join(', ')}`, 'error');
        return;
      }

      try {
        // Map CSV headers to our fields
        const fieldMap: { [key: number]: string } = {};
        headers.forEach((header, index) => {
          const field = activeColumns.find(col => 
            col.id.toLowerCase() === header || 
            col.name.toLowerCase() === header
          );
          if (field) {
            fieldMap[index] = field.id;
          }
        });

        // Parse data rows
        const newRows: RowData[] = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim());
          const row: RowData = { ...EMPTY_ROW };
          
          Object.entries(fieldMap).forEach(([index, fieldId]) => {
            row[fieldId] = values[parseInt(index)] || '';
          });

          return row;
        });

        setRows(newRows);
        showNotification('CSV file imported successfully', 'success');
      } catch (error) {
        console.error('Error parsing CSV:', error);
        showNotification('Error parsing CSV file', 'error');
      }
    };

    reader.readAsText(file);
  };

  // Handle CSV export
  const handleExportCSV = () => {
    // Filter out empty rows
    const rowsToExport = rows.filter(row => Object.values(row).some(value => value));
    
    if (rowsToExport.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }

    try {
      // Create CSV header and data rows
      const csvContent = [
        activeColumns.map(col => col.name).join(','),
        ...rowsToExport.map(row => 
          activeColumns.map(col => {
            const value = row[col.id] || '';
            // Escape commas and quotes in values
            return value.includes(',') || value.includes('"') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bulk_attestation.csv';
      link.click();
      
      showNotification('CSV file exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showNotification('Error exporting CSV file', 'error');
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    try {
      // Create template CSV with headers and dummy row
      const csvContent = [
        activeColumns.map(col => col.name).join(','),
        activeColumns.map(col => {
          const value = DUMMY_ROW[col.id] || '';
          return value.includes(',') || value.includes('"') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bulk_attestation_template.csv';
      link.click();
      
      showNotification('Template downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading template:', error);
      showNotification('Error downloading template', 'error');
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Check if a column is removable
  const isColumnRemovable = (columnId: string) => {
    const nonRemovableFields = ['chain_id', 'address'];
    return !nonRemovableFields.includes(columnId);
  };

  // Add a new field to the table
  const handleAddField = (fieldId: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (!field) return;

    // Add the field to columns
    const newColumn: ColumnDefinition = {
      id: field.id,
      name: field.label,
      required: field.required || false,
      validator: field.validator,
      type: field.type
    };
    setActiveColumns(prev => [...prev, newColumn]);

    // Update all rows to include the new field
    setRows(rows.map(row => ({
      ...row,
      [field.id]: '',
    })));
  };

  // Remove a field from the table
  const handleRemoveField = (fieldId: string) => {
    if (!isColumnRemovable(fieldId)) return;

    // Remove the column
    setActiveColumns(prev => prev.filter(col => col.id !== fieldId));

    // Remove the field from all rows
    setRows(rows.map(row => {
      const newRow = { ...row };
      delete newRow[fieldId];
      return newRow;
    }));

    // Clear any errors for this field
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.endsWith(`-${fieldId}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  // Render a table cell based on the column type
  const renderTableCell = (column: ColumnDefinition, row: RowData, rowIndex: number) => {
    const value = row[column.id] || '';
    const error = errors[`${rowIndex}-${column.id}`];
    const baseInputClasses = `block w-full px-3 py-2 text-sm border-0 placeholder-gray-400 focus:ring-0 ${
      error ? 'text-red-900' : 'text-gray-900'
    }`;

    // Find the field definition
    const field = formFields.find(f => f.id === column.id);
    
    // Special handling for boolean fields (radio or is_* fields)
    if (field?.type === 'radio' || column.id.startsWith('is_')) {
      return (
        <td key={column.id} className="relative">
          <select
            value={value}
            onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Special handling for date fields
    if (field?.type === 'date') {
      return (
        <td key={column.id} className="relative">
          <input
            type="date"
            value={value}
            onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
            className={baseInputClasses}
          />
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Special handling for number fields
    if (field?.type === 'number') {
      return (
        <td key={column.id} className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
            className={baseInputClasses}
            step={column.id === 'erc20_decimals' ? '1' : 'any'}
          />
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Special handling for multiselect fields
    if (field?.type === 'multiselect' && field.options) {
      return (
        <td key={column.id} className="relative">
          <select
            value={value}
            onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select...</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Special handling for chain_id
    if (column.id === 'chain_id') {
      return (
        <td key={column.id} className="relative">
          <select
            value={CHAIN_OPTIONS.some(option => option.value === value) ? value : ''}
            onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
            className={baseInputClasses}
          >
            <option value="" disabled>Select a chain</option>
            {CHAIN_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Special handling for owner_project
    if (column.id === 'owner_project') {
      return (
        <td key={column.id} className="relative">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
              className={baseInputClasses}
              list="valid-projects"
            />
            {isLoadingProjects ? (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent" />
              </div>
            ) : (
              value && validProjects.includes(value) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">✓</div>
              )
            )}
          </div>
          <datalist id="valid-projects">
            {validProjects.map(project => (
              <option key={project} value={project} />
            ))}
          </datalist>
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Special handling for usage_category
    if (column.id === 'usage_category') {
      return (
        <td key={column.id} className="relative">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
              className={baseInputClasses}
              list="valid-categories"
            />
            {value && VALID_CATEGORY_IDS.includes(value) && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">✓</div>
            )}
          </div>
          <datalist id="valid-categories">
            {VALID_CATEGORY_IDS.map(categoryId => (
              <option key={categoryId} value={categoryId} />
            ))}
          </datalist>
          {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
        </td>
      );
    }

    // Default input field for other columns
    return (
      <td key={column.id} className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => updateRow(rowIndex, column.id, e.target.value)}
          className={baseInputClasses}
          placeholder={`Enter ${column.name.toLowerCase()}`}
        />
        {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
      </td>
    );
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type as "error" | "success"}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Bulk Attestation</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Template
              </button>
              <button
                type="button"
                onClick={triggerFileInput}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <Upload className="h-4 w-4 mr-1.5" />
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
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export CSV
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Enter multiple addresses and their associated tags for bulk attestation. All attestations will be submitted in a single transaction, saving gas and time.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Note: Using the multiAttest feature requires only one signature for all attestations, making the process more efficient. Maximum of 50 attestations allowed per batch.
            </p>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Row
            </button>
            <BulkFieldSelector
              currentFields={activeColumns.map(col => col.id)}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
            />
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {activeColumns.map((column) => (
                    <th
                      key={column.id}
                      className="bg-gray-50 px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span>{column.name}</span>
                          {column.required && (
                            <span className="text-red-500" title="Required field">*</span>
                          )}
                        </div>
                        {isColumnRemovable(column.id) && (
                          <button
                            type="button"
                            onClick={() => handleRemoveField(column.id)}
                            className="invisible group-hover:visible ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                            title={`Remove ${column.name} field`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-10 bg-gray-50 px-3 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                    {activeColumns.map((column) => renderTableCell(column, row, rowIndex))}
                    <td className="w-10 p-0">
                      <button
                        type="button"
                        onClick={() => deleteRow(rowIndex)}
                        className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmissionRequest}
              disabled={isSubmitting || rows.length === 0}
              className="flex justify-center items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Bulk Attestations
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <BulkConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBulkSubmit}
        data={confirmationData || []}
        chainOptions={CHAIN_OPTIONS}
      />
    </div>
  );
};

export default BulkAttestationForm;