// One entry per service page (/services/<slug>). Plain data with no JSX, so
// tools/prerender.js can import it at build time to write each page's link-
// preview tags and sitemap entry. Slugs match the enquiry form's
// "Service Required" values.
//
// Keep claims in line with the home page's Capabilities section: NVH,
// thermal and CFD are planned, not delivered, so they don't appear here.
export const SERVICES = [
    {
        slug: 'cae-simulation',
        title: 'CAE & Simulation',
        summary:
            'Structural, crash and safety simulation across the product development cycle — from concept studies to validation support.',
        metaDescription:
            'CAE and simulation services from CAxperts Engineering, Pune: crash and occupant safety, pedestrian protection, structural and durability analysis with LS-DYNA, Pam-Crash, Abaqus and OptiStruct.',
        intro: [
            'Simulation lets engineering teams test ideas before parts exist. We build, run and evaluate finite element models that show how a structure behaves under crash, impact and service loads, so design decisions are backed by evidence early in the programme.',
            'Our core practice is crash and safety simulation for automotive programmes, supported by structural and durability analysis for automotive and industrial components.',
        ],
        offerings: [
            'Full-vehicle and sub-system crash simulation',
            'Occupant safety, seats and restraint systems',
            'Pedestrian protection loadcases',
            'Structural stiffness and strength analysis',
            'Durability assessment and design optimisation',
            'Model debugging, correlation support and countermeasure studies',
        ],
        applications: [
            'Body-in-white and closures',
            'Seating and restraint systems',
            'Chassis, brackets and mounting structures',
            'Heavy-machinery frames and welded assemblies',
        ],
        tools: ['LS-DYNA', 'Pam-Crash', 'Abaqus', 'OptiStruct', 'ANSA', 'META', 'HyperMesh'],
        deliverables: [
            'Solver-ready models and input decks',
            'Results post-processing and target comparison',
            'Technical reports with design recommendations',
            'Review meetings with your engineering team',
        ],
    },
    {
        slug: 'cad-engineering',
        title: 'CAD & Engineering',
        summary:
            '3D modelling, detailed design and engineering drawings built for downstream simulation and manufacturing.',
        metaDescription:
            'CAD and design engineering services from CAxperts Engineering, Pune: 3D modelling, detailed design, drawings and simulation-ready geometry in CATIA, Siemens NX, SolidWorks and Creo.',
        intro: [
            'Good simulation starts with good geometry. We create and update 3D models and drawings that are clean, consistent and ready for both meshing and manufacturing.',
            'Because our CAD engineers work alongside our CAE team, design changes proposed by simulation can be turned into updated geometry quickly.',
        ],
        offerings: [
            '3D part and assembly modelling',
            'Detailed design and design updates',
            '2D engineering drawings',
            'Geometry clean-up and defeaturing for simulation',
            'Design iterations based on CAE results',
            'CAD data translation between platforms',
        ],
        applications: [
            'Automotive structural and interior parts',
            'Brackets, frames and welded assemblies',
            'Machine and equipment components',
        ],
        tools: ['CATIA', 'Siemens NX', 'SolidWorks', 'Creo'],
        deliverables: [
            'Native or neutral-format CAD models',
            'Engineering drawings',
            'Simulation-ready geometry',
            'Change documentation',
        ],
    },
    {
        slug: 'pre-post-processing',
        title: 'Pre/Post Processing',
        summary:
            'High-quality meshing, model assembly and results post-processing with ANSA, META and HyperMesh workflows.',
        metaDescription:
            'CAE pre and post processing services from CAxperts Engineering, Pune: meshing, model assembly, connections, loadcase setup and results post-processing with ANSA, META and HyperMesh.',
        intro: [
            'Meshing and model assembly take a large share of every simulation project. We take on this work so your analysts can focus on results and decisions.',
            'Models are built to your mesh criteria and modelling guidelines, checked before delivery, and documented so they can be reused across loadcases and iterations.',
        ],
        offerings: [
            'Shell and solid meshing to customer quality criteria',
            'Model assembly, connections, welds and adhesives',
            'Material and property assignment',
            'Loadcase and boundary condition setup',
            'Model quality checks before delivery',
            'Results post-processing, plots, animations and report preparation',
        ],
        applications: [
            'Crash and safety models',
            'Structural and durability models',
            'Model updates for design iterations',
        ],
        tools: ['ANSA', 'META', 'HyperMesh'],
        deliverables: [
            'Meshed and assembled models',
            'Quality check reports',
            'Post-processed results, plots and animations',
            'Report-ready result summaries',
        ],
    },
    {
        slug: 'engineering-consulting',
        title: 'Engineering Consulting',
        summary:
            'Simulation strategy, method development and independent design reviews for automotive and industrial programmes.',
        metaDescription:
            'Engineering consulting from CAxperts Engineering, Pune: simulation strategy, CAE method development, model reviews and independent design reviews for automotive and industrial programmes.',
        intro: [
            'Sometimes the question is not how to run a simulation, but which simulation to run and how far to trust it. We help teams plan their simulation work and review the methods and models behind key decisions.',
            'Our consulting draws on the same engineering practice we use in delivery: documented methods, clear review points and honest communication about uncertainty.',
        ],
        offerings: [
            'Simulation strategy and loadcase planning',
            'CAE method development and standardisation',
            'Independent model and results reviews',
            'Design reviews from a simulation perspective',
            'Modelling guidelines and checklists',
        ],
        applications: [
            'New programmes setting up a simulation plan',
            'Teams standardising methods across projects',
            'Second opinions on critical results',
        ],
        tools: ['LS-DYNA', 'Pam-Crash', 'Abaqus', 'OptiStruct', 'ANSA', 'META'],
        deliverables: [
            'Simulation plans and method documents',
            'Review findings and recommendations',
            'Modelling guidelines and checklists',
        ],
    },
    {
        slug: 'digital-engineering-automation',
        title: 'Digital Engineering & Automation',
        summary:
            'Python and MATLAB based automation of repetitive CAE tasks — model checks, deck preparation and reporting.',
        metaDescription:
            'CAE automation services from CAxperts Engineering, Pune: Python and MATLAB scripting for model checks, input deck preparation, post-processing and standardised reporting.',
        intro: [
            'Many CAE workflows repeat the same steps for every model and iteration. We automate those steps with scripts that fit into your existing tool chain, so engineers spend less time on routine work and results are more consistent.',
            'Automation is delivered as maintainable, documented scripts that your team can run and extend.',
        ],
        offerings: [
            'Automated model quality checks',
            'Input deck preparation and loadcase generation',
            'Batch post-processing and result extraction',
            'Standardised report generation',
            'Scripting within ANSA, META and HyperMesh environments',
        ],
        applications: [
            'Repetitive crash and safety loadcases',
            'Design-iteration loops',
            'Standard reports for programme reviews',
        ],
        tools: ['Python', 'MATLAB', 'ANSA', 'META', 'HyperMesh'],
        deliverables: [
            'Documented, maintainable scripts',
            'Usage instructions and handover',
            'Integration into your existing workflow',
        ],
    },
    {
        slug: 'resource-augmentation',
        title: 'Resource Augmentation',
        summary:
            'Skilled CAE and CAD engineers embedded with customer teams to extend in-house engineering capacity.',
        metaDescription:
            'CAE and CAD resource augmentation from CAxperts Engineering, Pune: dedicated engineers who work as an extension of your team, offshore from India with clear communication and review points.',
        intro: [
            'When workload peaks or a programme needs specialist skills, our engineers can join your team for an agreed period. They work to your methods, tools and review rhythm, and communicate directly with your engineers.',
            'Engagements can be offshore from Pune, with regular coordination calls and clear reporting, and can scale up or down as your programme changes.',
        ],
        offerings: [
            'Dedicated CAE engineers for crash, safety and structural work',
            'CAD engineers for design and geometry support',
            'Pre/post processing support',
            'Flexible team size over the programme',
        ],
        applications: [
            'Programme peaks and deadline pressure',
            'Long-term capacity extension',
            'Specialist skills not available in-house',
        ],
        tools: ['LS-DYNA', 'Pam-Crash', 'Abaqus', 'ANSA', 'META', 'HyperMesh', 'CATIA', 'Siemens NX'],
        deliverables: [
            'Engineers working within your processes',
            'Regular progress reporting',
            'Agreed review and communication rhythm',
        ],
    },
];

export function getService(slug) {
    return SERVICES.find((service) => service.slug === slug);
}
