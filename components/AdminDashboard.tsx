
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MOCK_HEATMAP_DATA, MOCK_NEEDS_DATA } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto">
      <header className="bg-white p-4 shadow-sm border-b sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">{t.admin.title}</h1>
        <p className="text-xs text-gray-500">{t.admin.subtitle}</p>
      </header>

      <div className="p-4 space-y-6">
        
        {/* Heatmap Card (Task D) */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
            <span>{t.admin.heatmapTitle}</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">{t.admin.heatmapTag}</span>
          </h3>
          <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://picsum.photos/600/400?grayscale')] bg-cover opacity-50"></div>
            
            {/* Heatmap Overlay Simulation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-orange-400 rounded-full blur-2xl opacity-50"></div>
            
            <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded text-xs shadow">
               <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> {t.admin.legendStrong}</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-400 rounded-full"></div> {t.admin.legendWeak}</div>
            </div>
          </div>
          
          <div className="mt-4 h-48">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie 
                   data={MOCK_HEATMAP_DATA} 
                   dataKey="value" 
                   nameKey="name" 
                   cx="50%" 
                   cy="50%" 
                   outerRadius={60} 
                   label 
                 >
                   {MOCK_HEATMAP_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Needs Ranking Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{t.admin.needsTitle}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={MOCK_NEEDS_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keywords Cloud Mock */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">{t.admin.keywordsTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {['自然生态', '现代简约', '透水铺装', '儿童友好', '无障碍', '雨水花园', '夜跑路线', '老旧小区改造'].map((tag, i) => (
              <span 
                key={tag} 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  i % 3 === 0 ? 'bg-green-100 text-green-700' : 
                  i % 3 === 1 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
