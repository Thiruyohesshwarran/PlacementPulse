import React, { useMemo, useState } from 'react';
import { Search, MapPin, ExternalLink, Briefcase } from 'lucide-react';

const companies = [
  { id: 1, name: 'Google', type: 'Product', location: 'Multiple', roles: ['SWE', 'SRE'], difficulty: 'Hard' },
  { id: 2, name: 'Amazon', type: 'Product', location: 'Seattle, WA', roles: ['SDE', 'AWS Engineer'], difficulty: 'Medium-Hard' },
  { id: 3, name: 'TCS', type: 'Service', location: 'India', roles: ['System Engineer'], difficulty: 'Easy-Medium' },
  { id: 4, name: 'Stripe', type: 'FinTech', location: 'San Francisco, CA', roles: ['Backend Eng', 'Full Stack'], difficulty: 'Hard' },
  { id: 5, name: 'Conversight', type: 'Startup', location: 'India', roles: ['Backend Eng', 'Full Stack'], difficulty: 'Easy-Medium' },
  { id: 6, name: 'CrayonD', type: 'Startup', location: 'India', roles: ['UI/UX Designer', 'Full Stack'], difficulty: 'Easy-Medium' },
];

const CompanyPrep = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const filteredCompanies = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const typeTerm = typeFilter.trim().toLowerCase();
    const diffTerm = difficultyFilter.trim().toLowerCase();

    return companies.filter((company) => {
      if (typeTerm && company.type.toLowerCase() !== typeTerm) return false;

      if (diffTerm) {
        const companyDiff = company.difficulty.toLowerCase();
        const diffMatches =
          companyDiff === diffTerm ||
          companyDiff.split(/[\s-]+/).includes(diffTerm);
        if (!diffMatches) return false;
      }

      if (!searchTerm) return true;

      const haystack = [
        company.name,
        company.type,
        company.location,
        company.roles.join(' '),
        company.difficulty,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchTerm);
    });
  }, [search, typeFilter, difficultyFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Company Preparation</h1>
          <p className="text-slate-500 mt-1">Targeted roadmaps and interview experiences.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search companies..."
            className="input-field pl-9 h-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex space-x-3 hide-scrollbar overflow-x-auto">
          <select
            className="input-field h-10 py-0 min-w-[150px]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Company Type</option>
            <option value="Product">Product Based</option>
            <option value="Service">Service Based</option>
            <option value="Startup">Startup</option>
          </select>
          <select
            className="input-field h-10 py-0 min-w-[110px]"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
             <option value="">Difficulty</option>
             <option value="Easy">Easy</option>
             <option value="Medium">Medium</option>
             <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="card p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {company.name[0]}
               </div>
               <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">
                 {company.type}
               </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{company.name}</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 mr-2" /> {company.location}
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Briefcase className="w-4 h-4 mr-2" /> {company.roles.join(', ')}
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Diff: <span className="text-slate-900 dark:text-white">{company.difficulty}</span></span>
                <button className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                  View Guide <ExternalLink className="w-4 h-4 ml-1" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPrep;
