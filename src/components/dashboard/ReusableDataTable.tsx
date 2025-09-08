import { useState } from 'react';
import { format } from 'date-fns';
import { MoreVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useReusableData, DataType } from '@/contexts/ReusableDataContext';

interface EditingVariable {
    id?: string;
    title: string;
    dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'datetime' | 'file' | 'image';
    value: string;
    userId: string;
}

export default function ReusableDataTable() {
    const {
        variables,
        addVariable,
        deleteVariable,
        updateVariable,
        dataTypeOptions,
        getDataTypeLabel
    } = useReusableData();
    const [editingVariable, setEditingVariable] = useState<EditingVariable | null>(null);
    const [newVariable, setNewVariable] = useState<EditingVariable | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleEdit = (variable: EditingVariable) => {
        if (isAddingNew) return; // Prevent editing while adding new variable
        setEditingVariable(variable);
    };

    const handleDelete = (id: string) => {
        deleteVariable(id);
    };

    const handleSave = () => {
        if (editingVariable?.id) {
            // Update existing
            updateVariable(editingVariable.id, editingVariable);
            setEditingVariable(null);
        } else if (newVariable) {
            // Add new
            addVariable(newVariable);
            setNewVariable(null);
            setIsAddingNew(false);
        }
    };

    const handleCancel = () => {
        setEditingVariable(null);
        setNewVariable(null);
        setIsAddingNew(false);
    };

    const startNewVariable = () => {
        if (editingVariable) return; // Prevent adding new while editing
        setIsAddingNew(true);
        setNewVariable({
            title: '',
            dataType: 'string',
            value: '',
            userId: 'current-user' // This should be replaced with actual user ID from auth context
        });
    };

    const renderEditValue = (variable: EditingVariable, isNew: boolean = false) => {
        const updateValue = (newValue: string) => {
            if (isNew) {
                setNewVariable({
                    ...newVariable!,
                    value: newValue
                });
            } else {
                setEditingVariable({
                    ...editingVariable!,
                    value: newValue
                });
            }
        };

        switch (variable.dataType) {
            case 'boolean':
                return (
                    <Switch
                        checked={variable.value === 'true'}
                        onCheckedChange={(checked) => updateValue(String(checked))}
                        aria-label={`Toggle ${variable.title}`}
                    />
                );
            case 'date':
            case 'datetime':
                return (
                    <DatePicker
                        value={variable.value}
                        onChange={(date) => updateValue(date ? date.toISOString() : '')}
                        placeholder={`Select ${variable.dataType}`}
                    />
                );
            default:
                return (
                    <Textarea
                        placeholder="Enter your text here..."
                        className="min-h-[1.5rem] resize-y"
                        value={variable.value}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateValue(e.target.value)}
                    />
                );
        }
    };

    const renderValue = (variable: EditingVariable) => {
        try {
            switch (variable.dataType) {
                case 'date':
                    return variable.value ? format(new Date(variable.value), 'PP') : '';
                case 'datetime':
                    return variable.value ? format(new Date(variable.value), 'PPp') : '';
                case 'object':
                case 'array':
                    return JSON.stringify(JSON.parse(variable.value), null, 2);
                default:
                    return variable.value;
            }
        } catch {
            return variable.value;
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {variables.map((variable) => (
                        <TableRow key={variable.id}>
                            {editingVariable?.id === variable.id ? (
                                // Editing mode
                                <>
                                    <TableCell>
                                        <Input
                                            value={editingVariable.title}
                                            onChange={(e) => setEditingVariable({
                                                ...editingVariable,
                                                title: e.target.value
                                            })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={editingVariable.dataType}
                                            onValueChange={(value: DataType) => {
                                                if (value !== 'all') {
                                                    setEditingVariable({
                                                        ...editingVariable,
                                                        dataType: value as EditingVariable['dataType']
                                                    })
                                                }
                                            }}
                                        >
                                            <SelectTrigger aria-label="Data type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dataTypeOptions.filter(opt => opt.value !== 'all').map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {renderEditValue(editingVariable)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleSave}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleCancel}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </>
                            ) : (
                                // View mode
                                <>
                                    <TableCell>{variable.title}</TableCell>
                                    <TableCell>{getDataTypeLabel(variable.dataType)}</TableCell>
                                    <TableCell className="font-mono text-sm max-w-[1px] w-full">
                                        <div className="whitespace-pre-wrap break-words max-h-[4.5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                            { renderValue(variable) }
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isAddingNew}
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem 
                                                    onClick={() => handleEdit(variable)}
                                                    disabled={isAddingNew}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(variable.id)}
                                                    className="text-red-600"
                                                    disabled={isAddingNew}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                    {/* Add new row */}
                    {isAddingNew && newVariable && (
                        <TableRow>
                            <TableCell>
                                <Input
                                    placeholder="Variable name"
                                    value={newVariable.title}
                                    onChange={(e) => setNewVariable({
                                        ...newVariable,
                                        title: e.target.value
                                    })}
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={newVariable.dataType}
                                    onValueChange={(value: DataType) => {
                                        if (value !== 'all') {
                                            setNewVariable({
                                                ...newVariable,
                                                dataType: value as EditingVariable['dataType']
                                            })
                                        }
                                    }}
                                >
                                    <SelectTrigger aria-label="Data type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataTypeOptions.filter(opt => opt.value !== 'all').map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                {renderEditValue(newVariable, true)}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleSave}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCancel}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {!isAddingNew && (
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        onClick={startNewVariable}
                        disabled={!!editingVariable}
                    >
                        Add Variable
                    </Button>
                </div>
            )}
        </div>
    );
} 