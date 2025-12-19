
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
  Binary,
  Terminal
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Data Ingested', value: '8.4 TB', icon: Database, color: 'text-primary' },
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
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">EDA Dashboard</h1>
          <p className="text-muted-foreground mt-1">Exploratory Data Analysis Cluster Status</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 border border-primary/20 bg-primary/5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </div>
          <span className="text-primary text-sm font-bold tracking-wide">CLUSTER ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 group shadow-lg border border-white/5 bg-opacity-40">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-background/50 border border-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* EDA Pipeline Architecture */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-white/5">
            <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Analysis Pipeline</h2>
            </div>
            <div className="p-10 relative overflow-hidden">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-center space-y-3 z-10 group">
                  <div className="w-24 h-24 bg-card border-2 border-primary rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform duration-500">
                    <Table className="w-10 h-10 text-primary" />
                  </div>
                  <div className="bg-card/80 px-3 py-1 rounded-full border border-white/10 inline-block backdrop-blur-sm">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Ingestion</p>
                  </div>
                </div>

                <div className="h-0.5 w-full md:w-24 bg-gradient-to-r from-primary via-blue-500 to-blue-500 relative overflow-hidden hidden md:block opacity-50">
                  <div className="absolute top-0 left-0 h-full w-full bg-white/50 animate-[shimmer_2s_infinite] -translate-x-full"></div>
                </div>

                <div className="text-center space-y-3 z-10 group">
                  <div className="w-24 h-24 bg-card border-2 border-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform duration-500">
                    <Binary className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="bg-card/80 px-3 py-1 rounded-full border border-white/10 inline-block backdrop-blur-sm">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Profiling</p>
                  </div>
                </div>

                <div className="h-0.5 w-full md:w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-500 relative overflow-hidden hidden md:block opacity-50"></div>

                <div className="text-center space-y-3 z-10 group">
                  <div className="w-24 h-24 bg-card border-2 border-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-500">
                    <LineChart className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="bg-card/80 px-3 py-1 rounded-full border border-white/10 inline-block backdrop-blur-sm">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Visual AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Table */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-white/5">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <Table className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-foreground">Active Datasets</h2>
              </div>
              <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/10">IMPORT NEW</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20">
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Dataset Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Size/Rows</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentDatasets.map((ds, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-primary">{ds.name}</td>
                      <td className="px-6 py-4 text-xs text-foreground/80">{ds.rows}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded border ${ds.status === 'Cleaned'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                          {ds.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${ds.health}%` }}></div>
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
          <div className="glass-panel rounded-2xl p-6 shadow-xl h-full flex flex-col border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Terminal className="w-32 h-32" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-6 z-10 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Processing Stream
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] z-10">
              <div className="text-primary flex gap-2 items-start">
                <span className="opacity-50">[INFO]</span>
                <span>Ingestion worker #4 started</span>
              </div>
              <div className="text-blue-400 flex gap-2 items-start">
                <span className="opacity-50">[EDA]</span>
                <span>Calculating Pearson correlation for 'sales_q4'</span>
              </div>
              <div className="text-muted-foreground flex gap-2 items-start">
                <span className="opacity-50">[LOG]</span>
                <span>Removed 1,402 null values from 'customer_churn'</span>
              </div>
              <div className="text-amber-500 flex gap-2 items-start">
                <span className="opacity-50">[WARN]</span>
                <span>High skewness detected in 'lead_conversion' column</span>
              </div>
              <div className="text-purple-400 flex gap-2 items-start">
                <span className="opacity-50">[VIZ]</span>
                <span>Heatmap generated successfully for 'inventory'</span>
              </div>
              <div className="text-muted-foreground flex gap-2 items-start">
                <span className="opacity-50">[LOG]</span>
                <span>Schema inference completed for 3 new JSON files</span>
              </div>
              <div className="text-primary flex gap-2 items-start">
                <span className="opacity-50">[INFO]</span>
                <span>Data integrity check passed (Score: 94/100)</span>
              </div>
              <div className="text-primary animate-pulse">
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
