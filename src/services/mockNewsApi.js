const MOCK_STORY_LIBRARY = {
  All: [
    {
      id: 'tech-ai-spotlight',
      category: 'Tech/AI',
      city: 'San Francisco',
      headline: 'Generative AI leaders unveil safety consortium roadmap',
      lat: 37.7749,
      lng: -122.4194,
      color: '#F97316',
      description:
        'Global AI firms commit to shared guardrails, staged benchmarks, and transparent auditing milestones to calm regulators.',
    },
    {
      id: 'markets-shift',
      category: 'Markets',
      city: 'London',
      headline: 'Pound strengthens as markets price slower rate cuts',
      lat: 51.5072,
      lng: -0.1276,
      color: '#F97316',
      description:
        'Traders respond to tempered inflation guidance, pushing sterling higher while fixed-income desks adjust hedges.',
    },
    {
      id: 'science-reef-monitor',
      category: 'Science',
      city: 'Cairns',
      headline: 'Marine biologists deploy nanosensors across reef clusters',
      lat: -16.9186,
      lng: 145.7781,
      color: '#F97316',
      description:
        'Researchers lattice low-impact sensors through coral nurseries to capture water quality and bleaching signals in real time.',
    },
    {
      id: 'politics-asia-dialogue',
      category: 'Politics',
      city: 'Singapore',
      headline: 'Digital trade pact expands to include cybersecurity baselines',
      lat: 1.3521,
      lng: 103.8198,
      color: '#F97316',
      description:
        'Regional ministers align on zero-trust data corridors, incident disclosure windows, and cross-border threat simulations.',
    },
    {
      id: 'sports-analytics',
      category: 'Sports',
      city: 'Madrid',
      headline: 'Championship clubs integrate live biometrics during training',
      lat: 40.4168,
      lng: -3.7038,
      color: '#F97316',
      description:
        'La Liga contenders outfit practice kits with adaptive trackers to fine-tune workloads and recovery protocols.',
    },
    {
      id: 'markets-energy',
      category: 'Markets',
      city: 'Houston',
      headline: 'Energy CEOs commit to cross-border carbon capture corridor',
      lat: 29.7604,
      lng: -95.3698,
      color: '#F97316',
      description:
        'Pipeline operators and utilities pledge joint storage hubs and incentives to accelerate carbon handling projects.',
    },
    {
      id: 'science-orbit',
      category: 'Science',
      city: 'Bengaluru',
      headline: 'Satellite labs validate reusable propulsion materials',
      lat: 12.9716,
      lng: 77.5946,
      color: '#F97316',
      description:
        'Independent teams stress-test ceramic composites that promise longer orbital missions with lower refuel costs.',
    },
    {
      id: 'politics-eu-budget',
      category: 'Politics',
      city: 'Brussels',
      headline: 'EU leaders fast-track resilience funding for digital infrastructure',
      lat: 50.8503,
      lng: 4.3517,
      color: '#F97316',
      description:
        'Finance ministers unlock a resilience tranche for fiber redundancy, sovereign clouds, and anti-disruption drills.',
    },
    {
      id: 'sports-asia-cup',
      category: 'Sports',
      city: 'Doha',
      headline: 'Continental Cup introduces AI-assisted officiating pilot',
      lat: 25.2854,
      lng: 51.531,
      color: '#F97316',
      description:
        'Tournament officials enlist predictive replay engines to flag offsides and refine referee consistency in real time.',
    },
    {
      id: 'tech-cloud-hubs',
      category: 'Tech/AI',
      city: 'Tokyo',
      headline: 'Quantum-ready cloud regions announce interoperable standards',
      lat: 35.6762,
      lng: 139.6503,
      color: '#F97316',
      description:
        'Asia-Pacific data centers coordinate shared runtime specs so quantum workloads can port between multi-tenant clusters.',
    },
  ],
  Sports: [
    {
      id: 'sports-data-athletes',
      category: 'Sports',
      city: 'Los Angeles',
      headline: 'Player unions approve biometric transparency charter',
      lat: 34.0522,
      lng: -118.2437,
      color: '#F97316',
      description:
        'Union leaders secure opt-in dashboards and strict retention policies before teams expand wearable analytics.',
    },
    {
      id: 'sports-global-camps',
      category: 'Sports',
      city: 'Cape Town',
      headline: 'International academies expand climate-adaptive facilities',
      lat: -33.9249,
      lng: 18.4241,
      color: '#F97316',
      description:
        'Youth programs install modular shading and hydration tech to keep tournaments viable under rising temperatures.',
    },
    {
      id: 'sports-ai-ref',
      category: 'Sports',
      city: 'Munich',
      headline: 'Bundesliga pilots augmented reality replay for officials',
      lat: 48.1351,
      lng: 11.582,
      color: '#F97316',
      description:
        'Officials test visor overlays that visualize player trajectories and expected-contact zones within seconds.',
    },
  ],
  Politics: [
    {
      id: 'politics-climate-accord',
      category: 'Politics',
      city: 'Ottawa',
      headline: 'North American bloc targets unified climate reporting rulebook',
      lat: 45.4215,
      lng: -75.6972,
      color: '#F97316',
      description:
        'Environment ministers align disclosure templates, promising a continent-wide emissions ledger by 2026.',
    },
    {
      id: 'politics-digital-id',
      category: 'Politics',
      city: 'Tallinn',
      headline: 'Baltic states coordinate digital ID portability initiative',
      lat: 59.437,
      lng: 24.7536,
      color: '#F97316',
      description:
        'Estonia, Latvia, and Lithuania prototype single sign-on credentials for healthcare, travel, and tax services.',
    },
    {
      id: 'politics-africa-summit',
      category: 'Politics',
      city: 'Addis Ababa',
      headline: 'African Union charts blueprint for shared satellite monitoring',
      lat: 8.9806,
      lng: 38.7578,
      color: '#F97316',
      description:
        'Member states pool procurement power to build a multi-agency earth observation backbone for food security.',
    },
  ],
  'Tech/AI': [
    {
      id: 'tech-ai-labs',
      category: 'Tech/AI',
      city: 'Seoul',
      headline: 'AI labs release open governance toolkit for multimodal models',
      lat: 37.5665,
      lng: 126.978,
      color: '#F97316',
      description:
        'Consortium members open-source evaluation scripts and policy templates to guide frontier model deployments.',
    },
    {
      id: 'tech-cloudgreen',
      category: 'Tech/AI',
      city: 'Dublin',
      headline: 'Hyperscale data centers sign circular energy agreements',
      lat: 53.3498,
      lng: -6.2603,
      color: '#F97316',
      description:
        'Operators negotiate heat-recapture loops with local councils to shrink power draws and supply urban grids.',
    },
    {
      id: 'tech-robotics',
      category: 'Tech/AI',
      city: 'Tel Aviv',
      headline: 'Robotics consortium showcases collaborative drone logistics',
      lat: 32.0853,
      lng: 34.7818,
      color: '#F97316',
      description:
        'Startups choreograph autonomous drones that hand off payloads midair to extend range and precision.',
    },
  ],
  Markets: [
    {
      id: 'markets-asia',
      category: 'Markets',
      city: 'Hong Kong',
      headline: 'Asia exchanges roll out cross-border green bond shelf',
      lat: 22.3193,
      lng: 114.1694,
      color: '#F97316',
      description:
        'Regulators synchronize disclosure rules to let issuers list sustainability bonds on multiple venues instantly.',
    },
    {
      id: 'markets-latam',
      category: 'Markets',
      city: 'São Paulo',
      headline: 'LatAm fintechs receive surge in institutional backing',
      lat: -23.5558,
      lng: -46.6396,
      color: '#F97316',
      description:
        'Pension funds expand alternative allocations, backing payment rails that target underbanked merchants.',
    },
    {
      id: 'markets-europe',
      category: 'Markets',
      city: 'Frankfurt',
      headline: 'Eurozone banks expand tokenized asset pilot programs',
      lat: 50.1109,
      lng: 8.6821,
      color: '#F97316',
      description:
        'Large lenders extend distributed-ledger trials to cover collateral management and repo settlement.',
    },
  ],
  Science: [
    {
      id: 'science-space',
      category: 'Science',
      city: 'Houston',
      headline: 'Mission control validates reusable life support prototypes',
      lat: 29.7604,
      lng: -95.3698,
      color: '#F97316',
      description:
        'NASA crews test looped water processing and CO2 scrubbers meant to support longer Lunar Gateway rotations.',
    },
    {
      id: 'science-labs',
      category: 'Science',
      city: 'Zurich',
      headline: 'Researchers map quantum battery charge stability thresholds',
      lat: 47.3769,
      lng: 8.5417,
      color: '#F97316',
      description:
        'Swiss labs publish phase diagrams showing how solid-state cells maintain high-density energy cycles.',
    },
    {
      id: 'science-climate',
      category: 'Science',
      city: 'Reykjavík',
      headline: 'Glaciologists capture high-fidelity melt forecasts via drones',
      lat: 64.1466,
      lng: -21.9426,
      color: '#F97316',
      description:
        'Aerial surveys feed machine-learning models that predict meltwater flows and inform local adaptation plans.',
    },
  ],
};

const LATENCY_MS = 320;

export function fetchCategoryHeadlines(category) {
  const selectedCategory = MOCK_STORY_LIBRARY[category] ? category : 'All';
  const stories = MOCK_STORY_LIBRARY[selectedCategory];

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        category: selectedCategory,
        stories,
      });
    }, LATENCY_MS);
  });
}

export function fetchQuickHeadlines(category, limit = 10) {
  const selectedCategory = MOCK_STORY_LIBRARY[category] ? category : 'All';
  const stories = MOCK_STORY_LIBRARY[selectedCategory] ?? [];

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        category: selectedCategory,
        stories: stories.slice(0, limit),
      });
    }, LATENCY_MS / 2);
  });
}

export function getPrimaryStory(stories) {
  return stories?.[0] ?? null;
}

export const __TEST_DATA__ = MOCK_STORY_LIBRARY;
