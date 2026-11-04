import {
    Activity,
    DraftingCompass,
    Layers,
    LineChart,
    Workflow,
    Users,
    Car,
    Tractor,
    Bot,
    Wind,
    Plane,
    HeartPulse,
} from 'lucide-react';

// Site content shared by the home page teasers and the full pages. Service
// text lives in services.js instead, because tools/prerender.js imports it in
// Node (this file imports icon components, so it can't be).

export const ABOUT_IMAGE = 'https://images.hostinger.com/67362f6f-7741-4dad-bb9d-36896c181121.png';

export const SERVICE_ICONS = {
    'cae-simulation': Activity,
    'cad-engineering': DraftingCompass,
    'pre-post-processing': Layers,
    'engineering-consulting': LineChart,
    'digital-engineering-automation': Workflow,
    'resource-augmentation': Users,
};

export const CAPABILITY_GROUPS = [
    {
        status: 'Core',
        statusClass: 'bg-electric text-white',
        note: 'Delivered today as a primary practice area.',
        items: ['Structural Analysis', 'Crash & Safety', 'Seats & Restraints', 'Pedestrian Safety'],
    },
    {
        status: 'Available',
        statusClass: 'border border-electric/60 text-electric',
        note: 'Available as part of current engagements.',
        items: ['Durability', 'Optimisation', 'CAE Automation', 'CAD'],
    },
    {
        status: 'Planned',
        statusClass: 'border border-white/25 text-white/60',
        note: 'Roadmap capabilities — not currently delivered.',
        items: ['NVH', 'Thermal', 'CFD'],
    },
];

export const TOOLS = [
    'ANSA',
    'META',
    'HyperMesh',
    'LS-DYNA',
    'Pam-Crash',
    'Abaqus',
    'OptiStruct',
    'CATIA',
    'Siemens NX',
    'SolidWorks',
    'Creo',
    'Python',
    'MATLAB',
];

export const INDUSTRIES = [
    { icon: Car, name: 'Automotive', detail: 'Body, chassis, closures, seating and restraint systems.' },
    { icon: Tractor, name: 'Heavy Machinery', detail: 'Structures, brackets and load-bearing assemblies.' },
    { icon: Bot, name: 'Automation & Robotics', detail: 'Frames, end-effectors and motion system structures.' },
    { icon: Wind, name: 'Renewable Energy', detail: 'Structural assessment of energy system components.' },
    { icon: Plane, name: 'Aerospace & Defence', detail: 'Lightweight structures and safety-critical analysis.' },
    { icon: HeartPulse, name: 'Medical / Biomechanical', detail: 'Device structures and biomechanical simulation.' },
];

export const PROCESS_STEPS = [
    { name: 'Understand', detail: 'Requirements, constraints, regulations and success criteria are captured up front.' },
    { name: 'Plan', detail: 'Scope, methods, tools and deliverables are defined with clear review points.' },
    { name: 'Execute', detail: 'Models are built, analysed and iterated by specialist CAE and CAD engineers.' },
    { name: 'Validate', detail: 'Results are checked against requirements and discussed with your team.' },
    { name: 'Deliver', detail: 'Documented models, reports and design proposals are handed over on schedule.' },
];

export const WHY_ITEMS = [
    { title: 'Engineering Expertise', detail: 'Hands-on CAE, CAD and product-development support grounded in engineering judgement.' },
    { title: 'Flexible Delivery', detail: 'Project-based engagements, dedicated resources and extended engineering-team support.' },
    { title: 'Global Collaboration', detail: 'Clear technical communication for customer teams working across Europe and India.' },
    { title: 'Simulation-Driven Development', detail: 'Analysis, design decisions and validation connected through a disciplined workflow.' },
    { title: 'Quality & Confidentiality', detail: 'Documented methods, review points and NDA-based handling of customer information.' },
];

export const DELIVERY_MODELS = [
    { name: 'Dedicated Engineering Team', detail: 'A focused CAE team supporting the customer engineering organisation over an agreed scope.' },
    { name: 'Project-Based Engineering', detail: 'Defined requirements, milestones and deliverables for a specific technical programme.' },
    { name: 'Extended Engineering Team', detail: 'Specialist engineers operate as an extension of an existing product-development team.' },
    { name: 'Europe–India Delivery', detail: 'Customer coordination and technical communication aligned with India-based engineering execution.' },
];

export const DELIVERY_SPLIT = [
    ['Europe', 'Customer interface · Requirements · Coordination'],
    ['CAxperts', 'Methods · Reviews · Technical communication'],
    ['India', 'CAE execution · Modelling · Automation · Reporting'],
];

export const QUALITY_ITEMS = [
    {
        status: 'In place',
        statusClass: 'bg-electric text-white',
        items: [
            { name: 'NDA & IP Protection', detail: 'Confidentiality agreements and IP safeguards on every engagement.' },
            { name: 'GDPR-aligned Data Handling', detail: 'Personal data handled in line with GDPR principles.' },
        ],
    },
    {
        status: 'In progress',
        statusClass: 'border border-electric/60 text-electric',
        items: [
            { name: 'Information Security', detail: 'Information security management practices are being formalised.' },
        ],
    },
    {
        status: 'Planned',
        statusClass: 'border border-white/25 text-white/60',
        items: [
            { name: 'ISO 9001', detail: 'Quality management system — planned, not yet certified.' },
            { name: 'TISAX AL2', detail: 'Automotive information security assessment — planned.' },
            { name: 'ISO 27001', detail: 'Information security certification — planned.' },
        ],
    },
];
