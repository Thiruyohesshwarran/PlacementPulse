import React, { useMemo, useState } from 'react';
import { Search, MapPin, ExternalLink, Briefcase, X } from 'lucide-react';

const companies = [
  {
    id: 1,
    name: 'Google',
    type: 'Product',
    location: 'Multiple',
    roles: ['SWE', 'SRE'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'Google careers', url: 'https://careers.google.com/' },
      { label: 'How Google hires', url: 'https://careers.google.com/how-we-hire/' },
      { label: 'Practice SWE problems', url: 'https://leetcode.com/problemset/' },
    ],
  },
  {
    id: 2,
    name: 'Amazon',
    type: 'Product',
    location: 'Seattle, WA',
    roles: ['SDE', 'AWS Engineer'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'Amazon jobs', url: 'https://www.amazon.jobs/' },
      { label: 'Leadership principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles' },
      { label: 'Company interview experiences', url: 'https://www.geeksforgeeks.org/company-interview-corner/' },
    ],
  },
  {
    id: 3,
    name: 'TCS',
    type: 'Service',
    location: 'India',
    roles: ['System Engineer'],
    difficulty: 'Easy-Medium',
    guideLinks: [
      { label: 'TCS careers', url: 'https://www.tcs.com/careers' },
      { label: 'TCS interview experiences', url: 'https://www.geeksforgeeks.org/tcs-interview-experience/' },
      { label: 'Aptitude practice', url: 'https://www.indiabix.com/' },
    ],
  },
  {
    id: 4,
    name: 'Stripe',
    type: 'FinTech',
    location: 'San Francisco, CA',
    roles: ['Backend Eng', 'Full Stack'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'Stripe jobs', url: 'https://stripe.com/jobs' },
      { label: 'Stripe engineering blog', url: 'https://stripe.com/blog/engineering' },
      { label: 'System design practice', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
    ],
  },
  {
    id: 5,
    name: 'Conversight',
    type: 'Startup',
    location: 'India',
    roles: ['Backend Eng', 'Full Stack'],
    difficulty: 'Easy-Medium',
    guideLinks: [
      { label: 'Startup interview prep', url: 'https://www.interviewbit.com/' },
      { label: 'Full stack roadmap', url: 'https://roadmap.sh/full-stack' },
      { label: 'Behavioral interview prep', url: 'https://www.theforage.com/blog/interview-tips' },
    ],
  },
  {
    id: 6,
    name: 'CrayonD',
    type: 'Startup',
    location: 'India',
    roles: ['UI/UX Designer', 'Full Stack'],
    difficulty: 'Easy-Medium',
    guideLinks: [
      { label: 'UX portfolio tips', url: 'https://www.nngroup.com/articles/ux-portfolio/' },
      { label: 'Frontend roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'Interview prep basics', url: 'https://www.interviewbit.com/blog/interview-preparation/' },
    ],
  },
  {
    id: 7,
    name: 'Microsoft',
    type: 'Product',
    location: 'Redmond, WA',
    roles: ['SDE', 'Program Manager'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'Microsoft careers', url: 'https://careers.microsoft.com/' },
      { label: 'Life at Microsoft', url: 'https://careers.microsoft.com/v2/global/en/life-at-microsoft' },
      { label: 'Coding interview prep', url: 'https://leetcode.com/problemset/' },
    ],
  },
  {
    id: 8,
    name: 'Meta',
    type: 'Product',
    location: 'Menlo Park, CA',
    roles: ['Software Engineer', 'Data Engineer'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'Meta careers', url: 'https://www.metacareers.com/' },
      { label: 'Meta engineering', url: 'https://engineering.fb.com/' },
      { label: 'System design prep', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
    ],
  },
  {
    id: 9,
    name: 'Apple',
    type: 'Product',
    location: 'Cupertino, CA',
    roles: ['Software Engineer', 'ML Engineer'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'Apple jobs', url: 'https://jobs.apple.com/' },
      { label: 'Apple machine learning', url: 'https://machinelearning.apple.com/' },
      { label: 'DSA practice', url: 'https://www.geeksforgeeks.org/' },
    ],
  },
  {
    id: 10,
    name: 'Netflix',
    type: 'Product',
    location: 'Los Gatos, CA',
    roles: ['Backend Engineer', 'Data Platform Engineer'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'Netflix jobs', url: 'https://jobs.netflix.com/' },
      { label: 'Netflix tech blog', url: 'https://netflixtechblog.com/' },
      { label: 'Backend roadmap', url: 'https://roadmap.sh/backend' },
    ],
  },
  {
    id: 11,
    name: 'Adobe',
    type: 'Product',
    location: 'San Jose, CA',
    roles: ['Software Engineer', 'Frontend Engineer'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'Adobe careers', url: 'https://careers.adobe.com/' },
      { label: 'Adobe blog', url: 'https://blog.adobe.com/' },
      { label: 'Frontend prep', url: 'https://roadmap.sh/frontend' },
    ],
  },
  {
    id: 12,
    name: 'Salesforce',
    type: 'SaaS',
    location: 'San Francisco, CA',
    roles: ['Software Engineer', 'Platform Engineer'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'Salesforce careers', url: 'https://careers.salesforce.com/' },
      { label: 'Engineering at Salesforce', url: 'https://engineering.salesforce.com/' },
      { label: 'Behavioral prep', url: 'https://www.theforage.com/blog/interview-tips' },
    ],
  },
  {
    id: 13,
    name: 'Uber',
    type: 'Product',
    location: 'San Francisco, CA',
    roles: ['Software Engineer', 'Mobile Engineer'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'Uber careers', url: 'https://www.uber.com/global/en/careers/' },
      { label: 'Uber engineering', url: 'https://www.uber.com/blog/engineering/' },
      { label: 'Graph practice', url: 'https://leetcode.com/tag/graph/' },
    ],
  },
  {
    id: 14,
    name: 'Atlassian',
    type: 'SaaS',
    location: 'Sydney, AU',
    roles: ['Software Engineer', 'Site Reliability Engineer'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'Atlassian careers', url: 'https://www.atlassian.com/company/careers' },
      { label: 'Atlassian engineering', url: 'https://www.atlassian.com/engineering' },
      { label: 'SRE roadmap', url: 'https://roadmap.sh/devops' },
    ],
  },
  {
    id: 15,
    name: 'Goldman Sachs',
    type: 'FinTech',
    location: 'New York, NY',
    roles: ['Analyst Engineer', 'Full Stack Engineer'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'Goldman careers', url: 'https://www.goldmansachs.com/careers/' },
      { label: 'Engineering culture', url: 'https://www.goldmansachs.com/careers/who-we-look-for/engineering/' },
      { label: 'Aptitude practice', url: 'https://www.indiabix.com/' },
    ],
  },
  {
    id: 16,
    name: 'JPMorgan Chase',
    type: 'FinTech',
    location: 'New York, NY',
    roles: ['Software Engineer', 'Data Analyst'],
    difficulty: 'Medium',
    guideLinks: [
      { label: 'JPMorgan careers', url: 'https://careers.jpmorgan.com/' },
      { label: 'Students and grads', url: 'https://careers.jpmorgan.com/us/en/students' },
      { label: 'SQL prep', url: 'https://www.hackerrank.com/domains/sql' },
    ],
  },
  {
    id: 17,
    name: 'PayPal',
    type: 'FinTech',
    location: 'San Jose, CA',
    roles: ['Software Engineer', 'Backend Engineer'],
    difficulty: 'Medium-Hard',
    guideLinks: [
      { label: 'PayPal careers', url: 'https://careers.pypl.com/' },
      { label: 'PayPal newsroom', url: 'https://newsroom.paypal-corp.com/' },
      { label: 'API design prep', url: 'https://roadmap.sh/backend' },
    ],
  },
  {
    id: 18,
    name: 'Walmart Global Tech',
    type: 'Product',
    location: 'Bentonville, AR',
    roles: ['Software Engineer', 'Data Engineer'],
    difficulty: 'Medium',
    guideLinks: [
      { label: 'Walmart tech careers', url: 'https://careers.walmart.com/technology' },
      { label: 'Walmart global tech', url: 'https://tech.walmart.com/' },
      { label: 'DSA sheet', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/' },
    ],
  },
  {
    id: 19,
    name: 'Zoho',
    type: 'Product',
    location: 'Chennai, India',
    roles: ['Software Developer', 'QA Engineer'],
    difficulty: 'Easy-Medium',
    guideLinks: [
      { label: 'Zoho careers', url: 'https://www.zoho.com/careers/' },
      { label: 'Zoho interview experiences', url: 'https://www.geeksforgeeks.org/zoho-interview-experience/' },
      { label: 'Programming basics', url: 'https://www.interviewbit.com/courses/programming/' },
    ],
  },
  {
    id: 20,
    name: 'Freshworks',
    type: 'SaaS',
    location: 'Chennai, India',
    roles: ['Product Engineer', 'Frontend Engineer'],
    difficulty: 'Easy-Medium',
    guideLinks: [
      { label: 'Freshworks careers', url: 'https://www.freshworks.com/company/careers/' },
      { label: 'Freshworks blog', url: 'https://www.freshworks.com/blog/' },
      { label: 'JavaScript prep', url: 'https://javascript.info/' },
    ],
  },
  {
    id: 21,
    name: 'NVIDIA',
    type: 'Product',
    location: 'Santa Clara, CA',
    roles: ['Software Engineer', 'GPU Systems Engineer'],
    difficulty: 'Hard',
    guideLinks: [
      { label: 'NVIDIA careers', url: 'https://www.nvidia.com/en-us/about-nvidia/careers/' },
      { label: 'NVIDIA developer', url: 'https://developer.nvidia.com/' },
      { label: 'C++ prep', url: 'https://www.learncpp.com/' },
    ],
  },
  {
    id: 22,
    name: 'Oracle',
    type: 'Product',
    location: 'Austin, TX',
    roles: ['Software Developer', 'Cloud Engineer'],
    difficulty: 'Medium',
    guideLinks: [
      { label: 'Oracle careers', url: 'https://www.oracle.com/careers/' },
      { label: 'Oracle cloud docs', url: 'https://docs.oracle.com/en-us/iaas/Content/home.htm' },
      { label: 'Cloud prep roadmap', url: 'https://roadmap.sh/devops' },
    ],
  },
];

const CompanyPrep = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

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
          <div key={company.id} className="card p-6 hover:shadow-md transition-shadow group">
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
                <button
                  type="button"
                  onClick={() => setSelectedCompany(company)}
                  className="text-primary-600 font-medium flex items-center hover:text-primary-700"
                >
                  View Guide <ExternalLink className="w-4 h-4 ml-1" />
                </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="fixed -top-6 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCompany.name} Guide</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Basic preparation links to get started.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
                aria-label="Close guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recommended focus</p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
                  <li>Role-specific interview rounds</li>
                  <li>Core DSA and system design practice</li>
                  <li>Company values, culture, and behavioral questions</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Quick links</p>
                <div className="space-y-2">
                  {selectedCompany.guideLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-4 w-4 text-primary-600" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPrep;
