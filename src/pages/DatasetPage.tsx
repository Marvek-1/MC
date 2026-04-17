import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Database, 
  Search, 
  ChevronLeft, 
  Table as TableIcon, 
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

type TableType = string;

interface TableMeta {
  id: TableType;
  name: string;
  icon: any;
  sqlName: string;
  columns: { key: string; label: string; type: 'string' | 'number' | 'date' | 'status' | 'hash'; align?: 'left' | 'right' }[];
}

const POE_TABLES: TableMeta[] = [
  {
    id: 'operational_logs',
    name: 'Operational Logs',
    icon: Activity,
    sqlName: 'poe_operational_logs',
    columns: [
      { key: 'engineId', label: 'Engine_ID', type: 'string' },
      { key: 'timestamp', label: 'Timestamp_UTC', type: 'date' },
      { key: 'pressure', label: 'Pressure (PSI)', type: 'number', align: 'right' },
      { key: 'temperature', label: 'Temp (°C)', type: 'number', align: 'right' },
      { key: 'rpm', label: 'RPM', type: 'number', align: 'right' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'signalHash', label: 'Signal_Hash', type: 'hash' }
    ]
  },
  {
    id: 'engine_metadata',
    name: 'Engine Metadata',
    icon: Database,
    sqlName: 'poe_engine_metadata',
    columns: [
      { key: 'engineId', label: 'Engine_ID', type: 'string' },
      { key: 'modelSeries', label: 'Model_Series', type: 'string' },
      { key: 'commissionDate', label: 'Commission_Date', type: 'date' },
      { key: 'firmwareVersion', label: 'FW_Version', type: 'string' },
      { key: 'locationTag', label: 'Location', type: 'string' }
    ]
  },
  {
    id: 'maintenance_records',
    name: 'Maintenance',
    icon: Wrench,
    sqlName: 'poe_maintenance_records',
    columns: [
      { key: 'recordId', label: 'Record_ID', type: 'string' },
      { key: 'engineId', label: 'Engine_ID', type: 'string' },
      { key: 'serviceDate', label: 'Service_Date', type: 'date' },
      { key: 'technicianId', label: 'Tech_ID', type: 'string' },
      { key: 'actionTaken', label: 'Action', type: 'string' }
    ]
  },
  {
    id: 'failure_events',
    name: 'Failure Events',
    icon: AlertCircle,
    sqlName: 'poe_failure_events',
    columns: [
      { key: 'eventId', label: 'Event_ID', type: 'string' },
      { key: 'engineId', label: 'Engine_ID', type: 'string' },
      { key: 'timestamp', label: 'Timestamp_UTC', type: 'date' },
      { key: 'failureType', label: 'Failure_Type', type: 'string' },
      { key: 'severity', label: 'Severity', type: 'number', align: 'right' },
      { key: 'rootCause', label: 'Root_Cause', type: 'string' }
    ]
  }
];

const KAGGLE_TABLES: TableMeta[] = [
  {
    id: 'train_csv',
    name: 'train.csv',
    icon: FileText,
    sqlName: 'kaggle_ieee_fraud_train',
    columns: [
      { key: 'TransactionID', label: 'TransactionID', type: 'number', align: 'left' },
      { key: 'isFraud', label: 'isFraud', type: 'number', align: 'right' },
      { key: 'TransactionDT', label: 'TransactionDT', type: 'number', align: 'right' },
      { key: 'TransactionAmt', label: 'TransactionAmt', type: 'number', align: 'right' },
      { key: 'ProductCD', label: 'ProductCD', type: 'string' },
      { key: 'card1', label: 'card1', type: 'number', align: 'right' },
      { key: 'P_emaildomain', label: 'P_emaildomain', type: 'string' }
    ]
  },
  {
    id: 'test_csv',
    name: 'test.csv',
    icon: FileText,
    sqlName: 'kaggle_ieee_fraud_test',
    columns: [
      { key: 'TransactionID', label: 'TransactionID', type: 'number', align: 'left' },
      { key: 'TransactionDT', label: 'TransactionDT', type: 'number', align: 'right' },
      { key: 'TransactionAmt', label: 'TransactionAmt', type: 'number', align: 'right' },
      { key: 'ProductCD', label: 'ProductCD', type: 'string' },
      { key: 'card1', label: 'card1', type: 'number', align: 'right' },
      { key: 'P_emaildomain', label: 'P_emaildomain', type: 'string' }
    ]
  },
  {
    id: 'sample_submission_csv',
    name: 'sample_submission.csv',
    icon: FileText,
    sqlName: 'kaggle_ieee_fraud_submission',
    columns: [
      { key: 'TransactionID', label: 'TransactionID', type: 'number', align: 'left' },
      { key: 'isFraud', label: 'isFraud', type: 'number', align: 'right' }
    ]
  }
];

export function DatasetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const isKaggle = id?.startsWith('KAG');
  const activeTables = isKaggle ? KAGGLE_TABLES : POE_TABLES;

  const [activeTable, setActiveTable] = useState<TableType>(activeTables[0].id);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const currentTable = activeTables.find(t => t.id === activeTable)!;

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'poe_simulations', id || 'default', activeTable),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      // Generate realistic mock data based on table type
      const mockData = isKaggle ? generateKaggleMockData(activeTable) : generateMockData(activeTable);
      setRecords(mockData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, activeTable, isKaggle]);

  function generateMockData(type: TableType): any[] {
    return Array.from({ length: 15 }, (_, i) => {
      switch(type) {
        case 'operational_logs':
          return {
            id: `op_${i}`,
            engineId: `POE-ARC-${101 + i}`,
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            pressure: 45 + Math.random() * 10,
            temperature: 180 + Math.random() * 40,
            rpm: 3200 + Math.floor(Math.random() * 800),
            status: i % 7 === 0 ? 'warning' : i % 15 === 0 ? 'critical' : 'stable',
            signalHash: Math.random().toString(36).substring(2, 10).toUpperCase()
          };
        case 'engine_metadata':
          return {
            id: `meta_${i}`,
            engineId: `POE-ARC-${101 + i}`,
            modelSeries: 'V-Series Phantom',
            commissionDate: '2023-05-12',
            firmwareVersion: `v2.4.${i}`,
            locationTag: `B-102-${String.fromCharCode(65 + (i % 5))}`
          };
        case 'maintenance_records':
          return {
            id: `maint_${i}`,
            recordId: `SRV-${9000 + i}`,
            engineId: `POE-ARC-${101 + (i % 5)}`,
            serviceDate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
            technicianId: `TECH-0${100 + i}`,
            actionTaken: i % 3 === 0 ? 'Periodic Calibration' : 'Sensor Replacement'
          };
        case 'failure_events':
          return {
            id: `fail_${i}`,
            eventId: `ERR-${500 + i}`,
            engineId: `POE-ARC-${101 + (i % 3)}`,
            timestamp: new Date(Date.now() - i * 86400000 * 2).toISOString(),
            failureType: i % 2 === 0 ? 'Thermal Runaway' : 'Signal Clipping',
            severity: (i % 5) + 1,
            rootCause: 'Ambient Overheat'
          };
      }
    });
  }

  function generateKaggleMockData(type: TableType): any[] {
    return Array.from({ length: 15 }, (_, i) => {
      const txId = 2987000 + i;
      switch(type) {
        case 'train_csv':
          return {
            id: `row_${i}`,
            TransactionID: txId,
            isFraud: i % 12 === 0 ? 1 : 0,
            TransactionDT: 86400 + (i * 3500),
            TransactionAmt: (25 + Math.random() * 150).toFixed(2),
            ProductCD: i % 4 === 0 ? 'H' : 'W',
            card1: 10000 + Math.floor(Math.random() * 5000),
            P_emaildomain: i % 3 === 0 ? 'gmail.com' : 'yahoo.com'
          };
        case 'test_csv':
          return {
            id: `row_${i}`,
            TransactionID: 3663549 + i,
            TransactionDT: 15811131 + (i * 3500),
            TransactionAmt: (25 + Math.random() * 150).toFixed(2),
            ProductCD: i % 4 === 0 ? 'H' : 'W',
            card1: 10000 + Math.floor(Math.random() * 5000),
            P_emaildomain: i % 3 === 0 ? 'gmail.com' : 'yahoo.com'
          };
        case 'sample_submission_csv':
          return {
            id: `row_${i}`,
            TransactionID: 3663549 + i,
            isFraud: 0.5
          };
        default: return {};
      }
    });
  }

  const filteredRecords = records.filter(r => 
    Object.values(r).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Table Sidebar */}
      <div className="w-64 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/50 rounded-lg">
          <Database size={14} />
          {isKaggle ? 'Dataset Files' : 'Scheme Tables'}
        </div>
        {activeTables.map((table) => (
          <button
            key={table.id}
            onClick={() => setActiveTable(table.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              activeTable === table.id 
                ? (isKaggle ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20")
                : "text-zinc-500 hover:bg-zinc-900 border border-transparent"
            )}
          >
            <table.icon size={18} />
            {table.name}
          </button>
        ))}
      </div>

      {/* Database View */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-emerald-400" />
                Dataset: {currentTable.sqlName}
              </h1>
              <p className="text-xs text-zinc-500 font-mono">
                SELECT * FROM {currentTable.sqlName} WHERE project_id = '{id}'
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search SQL Buffer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 w-64 uppercase font-mono"
              />
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 z-10">
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  {currentTable.columns.map((col) => (
                    <th 
                      key={col.key} 
                      className={cn(
                        "p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider",
                        col.align === 'right' && "text-right"
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={currentTable.columns.length} className="p-12 text-center text-zinc-600 italic">
                        Initializing SQL Stream...
                      </td>
                    </motion.tr>
                  ) : filteredRecords.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={currentTable.columns.length} className="p-12 text-center text-zinc-600 italic">
                        Empty set return. Try adjusting your query parameters.
                      </td>
                    </motion.tr>
                  ) : (
                    filteredRecords.map((record, idx) => (
                      <motion.tr 
                        key={record.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group"
                      >
                        {currentTable.columns.map((col) => (
                          <td 
                            key={col.key} 
                            className={cn(
                              "p-4",
                              col.align === 'right' && "text-right"
                            )}
                          >
                            {renderCell(record, col)}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 p-4 border-t border-zinc-800 bg-zinc-950/50">
            <div className="flex gap-4">
              <span>Rows: {filteredRecords.length}</span>
              <span>Memory Allocation: 12.4 MB</span>
              <span>Region: asia-south1</span>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className={isKaggle ? "text-blue-500" : "text-emerald-500"}>Live Connection</span>
                <div className={cn("w-2 h-2 rounded-full animate-pulse", isKaggle ? "bg-blue-500" : "bg-emerald-500")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderCell(record: any, col: TableMeta['columns'][0]) {
    const val = record[col.key];

    switch(col.type) {
      case 'date':
        return (
          <div className="flex items-center gap-2 text-zinc-500 text-xs truncate">
            <Clock size={12} />
            {new Date(val).toLocaleString()}
          </div>
        );
      case 'status':
        return (
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
            val === 'stable' ? "bg-emerald-500/10 text-emerald-400" :
            val === 'warning' ? "bg-amber-500/10 text-amber-400" :
            "bg-red-500/10 text-red-400"
          )}>
            {val}
          </div>
        );
      case 'number':
        return <span className="text-sm font-mono text-blue-400">{val}</span>;
      case 'hash':
        return <span className="text-[10px] font-mono text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">{val}</span>;
      default:
        return (
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-zinc-700" />
            <span className="text-sm font-mono text-zinc-300 truncate">{val}</span>
          </div>
        );
    }
  }
}
