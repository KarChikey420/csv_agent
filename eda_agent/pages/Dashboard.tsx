
import React from 'react';
import { 
  Database, 
  LineChart, 
  Search, 
  Layers, 
  Activity, 
  Zap, 
  FileSpreadsheet,
  Table,
  ArrowUpRight,
  ShieldCheck,
  Binary
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Data Ingested', value: '8.4 TB', icon: Database, color: 'text-emerald-400' },
    { label: 'Insights Generated', value: '2,492', icon: Search, color: 'text-blue-400' },
    { label: 'Analysis Uptime', value: '99.9%', icon: Activity, color: 'text-indigo-400' },
    { label: 'Automated Reports', value: '184', icon: FileSpreadsheet, color: 'text-purple-400' },
  ];

  const recentDatasets = [
    { name: 'sales_q4_2023.csv', rows: '1.2M', status: 'Cleaned', health: 98 },
    { name: 'customer_churn.json', rows: '450k', status: 'In Analysis', health: 85 },
    { name: 'inventory_realtime.db', rows: 'Live', status: 'Streaming', health: 100 },
    { name: 'marketing_leads.parquet', rows: '3.1M', status: 'Profiling', health: 92 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EDA Dashboard</h1>
          <p className="text-gray-400 mt-1">Exploratory Data Analysis Cluster Status</p>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 flex items-center gap-2 text-sm font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            CLUSTER ONLINE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 group shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gray-800 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* EDA Pipeline Architecture */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Analysis Pipeline</h2>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                <div className="text-center space-y-2 z-10 group">
                  <div className="w-20 h-20 bg-gray-800 border-2 border-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Table className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Ingestion Engine</p>
                </div>
                
                <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-500 to-blue-500 hidden md:block"></div>

                <div className="text-center space-y-2 z-10 group">
                  <div className="w-20 h-20 bg-gray-800 border-2 border-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Binary className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Profiling Layer</p>
                </div>

                <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 hidden md:block"></div>

                <div className="text-center space-y-2 z-10 group">
                  <div className="w-20 h-20 bg-gray-800 border-2 border-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                    <LineChart className="w-10 h-10 text-purple-400" />
                  </div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Visual Intelligence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Table */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
             <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Table className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Active Datasets</h2>
                </div>
                <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300">IMPORT NEW</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-950/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Dataset Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Size/Rows</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Health Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recentDatasets.map((ds, i) => (
                      <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-emerald-400">{ds.name}</td>
                        <td className="px-6 py-4 text-xs text-gray-300">{ds.rows}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                            ds.status === 'Cleaned' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {ds.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-800 h-1.5 rounded-full">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${ds.health}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Data Processing Logs */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-lg font-bold text-white mb-6">Processing Stream</h2>
            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px]">
              <div className="text-emerald-500 flex gap-2">
                <span>[INFO]</span>
                <span>Ingestion worker #4 started</span>
              </div>
              <div className="text-blue-400 flex gap-2">
                <span>[EDA]</span>
                <span>Calculating Pearson correlation for 'sales_q4'</span>
              </div>
              <div className="text-gray-500 flex gap-2">
                <span>[LOG]</span>
                <span>Removed 1,402 null values from 'customer_churn'</span>
              </div>
              <div className="text-amber-500 flex gap-2">
                <span>[WARN]</span>
                <span>High skewness detected in 'lead_conversion' column</span>
              </div>
              <div className="text-purple-400 flex gap-2">
                <span>[VIZ]</span>
                <span>Heatmap generated successfully for 'inventory'</span>
              </div>
              <div className="text-gray-500 flex gap-2">
                <span>[LOG]</span>
                <span>Schema inference completed for 3 new JSON files</span>
              </div>
              <div className="text-emerald-500 flex gap-2">
                <span>[INFO]</span>
                <span>Data integrity check passed (Score: 94/100)</span>
              </div>
              <div className="text-emerald-500 animate-pulse">
                <span>_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
