import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Clock, 
  MapPin, 
  Type, 
  Search,
  Check,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const mockFields = [
  { name: 'id', type: 'uuid', isKey: true, isSensitive: false, tag: 'ID' },
  { name: 'email', type: 'string', isKey: false, isSensitive: true, tag: 'EMAIL' },
  { name: 'full_name', type: 'string', isKey: false, isSensitive: true, tag: 'NAME' },
  { name: 'created_at', type: 'timestamp', isKey: false, isSensitive: false, tag: 'DATETIME' },
  { name: 'last_login_ip', type: 'string', isKey: false, isSensitive: true, tag: 'IP_ADDRESS' },
  { name: 'lat', type: 'float', isKey: false, isSensitive: false, tag: 'COORDINATE' },
  { name: 'lng', type: 'float', isKey: false, isSensitive: false, tag: 'COORDINATE' },
  { name: 'country_code', type: 'string', isKey: false, isSensitive: false, tag: 'COUNTRY' },
  { name: 'confidence_score', type: 'float', isKey: false, isSensitive: false, tag: 'CONFIDENCE' },
];

export function SchemaStudio() {
  const [fields, setFields] = useState(mockFields);

  const toggleSensitive = (index: number) => {
    const newFields = [...fields];
    newFields[index].isSensitive = !newFields[index].isSensitive;
    setFields(newFields);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Schema Studio</h2>
          <p className="text-zinc-500">Review inferred types and mark sensitive fields for privacy-safe generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-400">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Auto-Classification: Active</span>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
            Save Schema
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Field Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">MoStar Tag</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Key</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Sensitive</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {fields.map((field, idx) => (
              <tr key={field.name} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-zinc-200">{field.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Type className="w-3 h-3 text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-mono">{field.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase",
                    field.tag === 'COORDINATE' ? "bg-blue-500/10 text-blue-400" :
                    field.tag === 'DATETIME' ? "bg-purple-500/10 text-purple-400" :
                    "bg-zinc-800 text-zinc-400"
                  )}>
                    {field.tag}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {field.isKey && <Key className="w-4 h-4 text-amber-500 mx-auto" />}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => toggleSensitive(idx)}
                    className={cn(
                      "p-1.5 rounded-md transition-colors mx-auto",
                      field.isSensitive ? "bg-red-500/10 text-red-400" : "text-zinc-700 hover:text-zinc-500"
                    )}
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-semibold">Privacy Risk</h3>
          </div>
          <p className="text-sm text-zinc-500">
            4 fields marked as sensitive. Privacy-safe generation will use differential privacy or synthetic replacements.
          </p>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[45%]" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Spatial Awareness</h3>
          </div>
          <p className="text-sm text-zinc-500">
            Detected geospatial coordinates. Generator will maintain spatial clustering and corridor logic.
          </p>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-blue-500 rounded-full" />
            <div className="h-1 flex-1 bg-blue-500 rounded-full" />
            <div className="h-1 flex-1 bg-zinc-800 rounded-full" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-semibold">Temporal Logic</h3>
          </div>
          <p className="text-sm text-zinc-500">
            Time-series patterns detected. Generator will preserve sequential event flow and seasonality.
          </p>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-purple-500 rounded-full" />
            <div className="h-1 flex-1 bg-purple-500 rounded-full" />
            <div className="h-1 flex-1 bg-purple-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
