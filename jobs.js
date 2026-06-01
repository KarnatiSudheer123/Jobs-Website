/* === Data + shared job utilities === */
const COMPANIES = [
  {name:'Nimbus', industry:'Cloud Infrastructure', location:'Remote', color:'#6366f1', rating:4.8, openings:12, about:'Powering the next generation of cloud-native apps.'},
  {name:'Acme', industry:'Software', location:'Berlin, DE', color:'#10b981', rating:4.6, openings:8, about:'Beautifully crafted developer tools.'},
  {name:'Lumen', industry:'Data & Analytics', location:'New York, US', color:'#f59e0b', rating:4.5, openings:15, about:'Insights that drive better decisions.'},
  {name:'Orbit', industry:'Fintech', location:'London, UK', color:'#06b6d4', rating:4.7, openings:6, about:'Modern banking, reimagined.'},
  {name:'Pixel', industry:'Design Studio', location:'Lisbon, PT', color:'#ec4899', rating:4.9, openings:4, about:'Award-winning product design.'},
  {name:'Quanta', industry:'AI Research', location:'San Francisco, US', color:'#8b5cf6', rating:4.8, openings:11, about:'Building trustworthy AI systems.'},
  {name:'Volta', industry:'Clean Energy', location:'Oslo, NO', color:'#22c55e', rating:4.4, openings:7, about:'Accelerating the renewable transition.'},
  {name:'Helio', industry:'Marketing', location:'Toronto, CA', color:'#ef4444', rating:4.3, openings:9, about:'Performance marketing for ambitious brands.'},
  {name:'Mosaic', industry:'Healthcare', location:'Amsterdam, NL', color:'#0ea5e9', rating:4.6, openings:5, about:'Care experiences that scale.'},
];
const SEED_JOBS = [
  {id:1, title:'Senior Product Designer', company:'Nimbus', location:'Remote', category:'Design', type:'Remote', experience:'Senior', min:110, max:140, color:'#6366f1', posted:'2d ago'},
  {id:2, title:'Frontend Engineer', company:'Acme', location:'Berlin, DE', category:'Engineering', type:'Full-Time', experience:'Mid', min:90, max:120, color:'#10b981', posted:'1d ago'},
  {id:3, title:'Data Analyst', company:'Lumen', location:'New York, US', category:'Data', type:'Full-Time', experience:'Entry', min:80, max:100, color:'#f59e0b', posted:'3d ago'},
  {id:4, title:'Backend Engineer (Go)', company:'Orbit', location:'London, UK', category:'Engineering', type:'Full-Time', experience:'Senior', min:120, max:160, color:'#06b6d4', posted:'5h ago'},
  {id:5, title:'Brand Designer', company:'Pixel', location:'Lisbon, PT', category:'Design', type:'Contract', experience:'Mid', min:70, max:95, color:'#ec4899', posted:'1w ago'},
  {id:6, title:'Machine Learning Engineer', company:'Quanta', location:'San Francisco, US', category:'Engineering', type:'Full-Time', experience:'Lead', min:160, max:220, color:'#8b5cf6', posted:'12h ago'},
  {id:7, title:'Growth Marketer', company:'Helio', location:'Toronto, CA', category:'Marketing', type:'Full-Time', experience:'Mid', min:75, max:100, color:'#ef4444', posted:'4d ago'},
  {id:8, title:'Customer Success Lead', company:'Mosaic', location:'Amsterdam, NL', category:'Support', type:'Full-Time', experience:'Senior', min:85, max:110, color:'#0ea5e9', posted:'2d ago'},
  {id:9, title:'Junior UX Researcher', company:'Pixel', location:'Remote', category:'Design', type:'Part-Time', experience:'Entry', min:40, max:60, color:'#ec4899', posted:'6h ago'},
  {id:10, title:'DevOps Engineer', company:'Nimbus', location:'Remote', category:'Engineering', type:'Remote', experience:'Senior', min:110, max:145, color:'#6366f1', posted:'1d ago'},
  {id:11, title:'Product Manager', company:'Acme', location:'Berlin, DE', category:'Product', type:'Full-Time', experience:'Senior', min:115, max:150, color:'#10b981', posted:'3d ago'},
  {id:12, title:'Financial Analyst', company:'Orbit', location:'London, UK', category:'Finance', type:'Full-Time', experience:'Mid', min:85, max:115, color:'#06b6d4', posted:'2w ago'},
  {id:13, title:'Sustainability Lead', company:'Volta', location:'Oslo, NO', category:'Product', type:'Full-Time', experience:'Lead', min:130, max:170, color:'#22c55e', posted:'1d ago'},
  {id:14, title:'Account Executive', company:'Helio', location:'Toronto, CA', category:'Sales', type:'Full-Time', experience:'Mid', min:70, max:120, color:'#ef4444', posted:'3d ago'},
  {id:15, title:'AI Research Intern', company:'Quanta', location:'Remote', category:'Data', type:'Part-Time', experience:'Entry', min:30, max:55, color:'#8b5cf6', posted:'5d ago'},
];
function enrich(j){
  return {
    description: `Join ${j.company} as a ${j.title}. We're a fast-moving team building products people love, and we're looking for someone passionate about ${j.category.toLowerCase()} to help us scale.`,
    responsibilities: [
      `Own the end-to-end delivery of ${j.category.toLowerCase()} initiatives`,
      'Collaborate with cross-functional partners across product, design and engineering',
      'Drive measurable improvements to our key metrics',
      'Mentor teammates and uplift the broader practice',
    ],
    skills: [
      `${j.experience}-level experience in ${j.category}`,
      'Strong communication & ownership',
      'Comfortable working autonomously',
      'Bonus: prior startup experience',
    ],
    benefits: [
      'Competitive salary + equity',
      'Flexible hours and remote-friendly policy',
      '30 days paid vacation',
      'Generous learning & development budget',
    ],
    ...j
  };
}
function getAllJobs(){
  const posted = JSON.parse(localStorage.getItem('cn_posted') || '[]');
  return [...posted, ...SEED_JOBS].map(enrich);
}
