import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockUserVariables } from '@/data/mockUserVariables';
import Fuse from 'fuse.js';

export interface UserVariable {
    id: string;
    title: string;
    dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'datetime' | 'file' | 'image';
    value: string;
    userId: string;
    created: number;
    updated: number;
}

export const dataTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'True/False' },
    { value: 'date', label: 'Date' },
    { value: 'datetime', label: 'Date and Time' },
    { value: 'array', label: 'List' },
    { value: 'object', label: 'Data' },
    { value: 'file', label: 'File' },
    { value: 'image', label: 'Image' }
] as const;

export type DataType = typeof dataTypeOptions[number]['value'];

interface ReusableDataContextType {
    variables: UserVariable[];
    sortBy: 'title' | 'created' | 'updated';
    setSortBy: (field: 'title' | 'created' | 'updated') => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (direction: 'asc' | 'desc') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedDataTypes: string[];
    setSelectedDataTypes: (types: string[]) => void;
    dataTypeOptions: typeof dataTypeOptions;
    getDataTypeLabel: (type: string) => string;
    addVariable: (variable: Omit<UserVariable, 'id' | 'created' | 'updated'>) => void;
    deleteVariable: (id: string) => void;
    updateVariable: (id: string, updates: Partial<UserVariable>) => void;
}

// Fuse.js options for searching
const fuseOptions = {
    keys: [
        { name: 'title', weight: 2 },
        { name: 'value', weight: 1 }
    ],
    threshold: 0.3,
    ignoreLocation: true
};

const ReusableDataContext = createContext<ReusableDataContextType | undefined>(undefined);

export function ReusableDataProvider({ children }: { children: ReactNode }) {
    const [allVariables, setAllVariables] = useState<UserVariable[]>(mockUserVariables);
    const [sortBy, setSortBy] = useState<'title' | 'created' | 'updated'>('updated');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);

    // Helper function to get data type label
    const getDataTypeLabel = (type: string): string => {
        const option = dataTypeOptions.find(opt => opt.value === type);
        return option ? option.label : type;
    };

    // Get filtered variables based on search query and data type filters
    const filteredVariables = useMemo(() => {
        let filtered = [...allVariables];

        // Apply search
        if (searchQuery) {
            const fuse = new Fuse(filtered, {
                keys: ['title', 'value'],
                threshold: 0.4,
            });
            filtered = fuse.search(searchQuery).map(result => result.item);
        }

        // Apply type filter
        if (selectedDataTypes.length > 0 && selectedDataTypes[0] !== 'all') {
            filtered = filtered.filter(variable => selectedDataTypes.includes(variable.dataType));
        }

        return filtered;
    }, [allVariables, searchQuery, selectedDataTypes]);

    // Sort variables based on current sortBy and sortDirection
    const variables = useMemo(() => {
        return [...filteredVariables].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'updated':
                    comparison = a.updated - b.updated;
                    break;
                case 'created':
                    comparison = a.created - b.created;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                default:
                    comparison = 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredVariables, sortBy, sortDirection]);

    // Add new variable
    const addVariable = (variable: Omit<UserVariable, 'id' | 'created' | 'updated'>) => {
        setAllVariables(prev => [
            ...prev,
            {
                ...variable,
                id: `var_${Date.now()}`,
                created: Date.now(),
                updated: Date.now()
            }
        ]);
    };

    // Delete variable
    const deleteVariable = (id: string) => {
        setAllVariables(prev => prev.filter(v => v.id !== id));
    };

    // Update variable
    const updateVariable = (id: string, updates: Partial<UserVariable>) => {
        setAllVariables(prev => prev.map(variable => {
            if (variable.id === id) {
                return {
                    ...variable,
                    ...updates,
                    updated: Date.now()
                };
            }
            return variable;
        }));
    };

    // Filter variables by date range
    const filterByDateRange = (variables: UserVariable[], startDate?: Date, endDate?: Date) => {
        if (!startDate || !endDate) return variables;
        return variables.filter(variable => {
            const createdTime = variable.created;
            return createdTime >= startDate.getTime() && createdTime <= endDate.getTime();
        });
    };

    return (
        <ReusableDataContext.Provider 
            value={{ 
                variables,
                sortBy,
                setSortBy,
                sortDirection,
                setSortDirection,
                searchQuery,
                setSearchQuery,
                selectedDataTypes,
                setSelectedDataTypes,
                dataTypeOptions,
                getDataTypeLabel,
                addVariable,
                deleteVariable,
                updateVariable
            }}
        >
            {children}
        </ReusableDataContext.Provider>
    );
}

export function useReusableData() {
    const context = useContext(ReusableDataContext);
    if (context === undefined) {
        throw new Error('useReusableData must be used within a ReusableDataProvider');
    }
    return context;
} 