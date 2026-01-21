export const PACKAGES = [
    {
        id: 'wedding-photography',
        title: 'Wedding Photography',
        description: 'Capture every moment of your special day with our professional photography services.',
        image: '/Studio Pictures/054A6395.jpg',
        imagePosition: 'top center',
        paymentInfo: {
            deposit: '15% Deposit to secure a date, not refundable',
            balance: 'Balance to be paid in full on or before the event'
        },
        contactInfo: {
            phone: '+353899882998',
            email: 'smiledefinitionpro@gmail.com',
            socials: '@smiledefinitionimage, @smileimage, @smile360defintion'
        },
        tiers: [
            {
                id: 'silver-white',
                name: 'Silver - White Wedding',
                price: 900,
                features: [
                    'White Wedding Coverage'
                ]
            },
            {
                id: 'gold-white-photobook',
                name: 'Gold - White Wedding + Photobook',
                price: 1500,
                features: [
                    'White Wedding Coverage',
                    'Photobook'
                ]
            },
            {
                id: 'platinum-white-pre-photo',
                name: 'Platinum - White Wedding + Pre-Wedding + Photobook',
                price: 1800,
                features: [
                    'White Wedding Coverage',
                    'Pre-Wedding Session',
                    'Photobook'
                ]
            },
            {
                id: 'trad-white',
                name: 'Traditional & White Wedding',
                price: 1850,
                features: [
                    'Two Days Event',
                    'Traditional Wedding Coverage',
                    'White Wedding Coverage'
                ]
            },
            {
                id: 'trad-white-pre',
                name: 'Traditional & White Wedding + Pre-Wedding',
                price: 2200,
                features: [
                    'Two Days Event',
                    'Traditional Wedding Coverage',
                    'White Wedding Coverage',
                    'Pre-Wedding Session'
                ]
            },
            {
                id: 'trad-white-pre-photo',
                name: 'Trad & White + Pre-Wedding + Photobook',
                price: 2450,
                features: [
                    'Two Days Event',
                    'Traditional Wedding Coverage',
                    'White Wedding Coverage',
                    'Pre-Wedding Session',
                    'Photobook'
                ]
            },
            {
                id: 'trad-white-photo',
                name: 'Traditional & White Wedding + Photobook',
                price: 2800,
                features: [
                    'Two Days Event',
                    'Traditional Wedding Coverage',
                    'White Wedding Coverage',
                    'Photobook'
                ]
            }
        ],
        addons: [
            { id: 'pre-wedding', name: 'Pre-Wedding Picture', price: 300 },
            { id: 'photobook', name: 'Photobook', price: 330 },
            { id: 'live-zoom', name: 'Live Zoom', price: 300 },
            { id: '360-photobooth', name: '360 Photobooth', price: 500 }
        ]
    },
    {
        id: 'wedding-video',
        title: 'Service Package for Wedding Video',
        description: 'Cinematic storytelling of your wedding day.',
        image: '/Studio Pictures/054A8105.jpg',
        imagePosition: 'top center',
        tiers: [
            {
                id: 'silver',
                name: 'Silver Package',
                price: 1800,
                features: [
                    '6 Hours Coverage',
                    '1 Videographer',
                    '3-5 Minute Highlight Reel',
                    'Digital Download'
                ]
            },
            {
                id: 'gold',
                name: 'Gold Package',
                price: 2600,
                features: [
                    '8 Hours Coverage',
                    '2 Videographers',
                    '5-7 Minute Highlight Film',
                    'Full Ceremony Edit',
                    'Digital Download'
                ]
            },
            {
                id: 'platinum',
                name: 'Platinum Package',
                price: 3500,
                features: [
                    'Full Day Coverage',
                    '2 Videographers',
                    '8-10 Minute Feature Film',
                    'Full Ceremony & Speeches Edit',
                    'Drone Footage (weather permitting)',
                    'Digital Download & USB'
                ]
            }
        ],
        addons: [
            { id: 'drone', name: 'Drone Coverage', price: 300 },
            { id: 'raw-footage', name: 'Raw Footage', price: 500 },
            { id: 'teaser', name: '1 Minute Teaser (1 week delivery)', price: 250 }
        ]
    },
    {
        id: 'wedding-photo-video',
        title: 'Wedding Video and Picture',
        description: 'The ultimate combo package for complete coverage of your wedding.',
        image: '/Studio Pictures/054A9265.jpg',
        imagePosition: 'top center',
        tiers: [
            {
                id: 'silver',
                name: 'Silver Package',
                price: 3000,
                features: [
                    '6 Hours Coverage',
                    '1 Photographer & 1 Videographer',
                    '300+ Photos',
                    '3-5 Minute Highlight Reel'
                ]
            },
            {
                id: 'gold',
                name: 'Gold Package',
                price: 4500,
                features: [
                    '8 Hours Coverage',
                    '2 Photographers & 2 Videographers',
                    '500+ Photos',
                    '5-7 Minute Highlight Film',
                    'Engagement Session'
                ]
            },
            {
                id: 'platinum',
                name: 'Platinum Package',
                price: 6000,
                features: [
                    'Full Day Coverage',
                    '2 Photographers & 2 Videographers',
                    '800+ Photos',
                    '8-10 Minute Feature Film',
                    'Full Ceremony & Speeches',
                    'Premium Album',
                    'Drone Footage'
                ]
            }
        ],
        addons: [
            { id: 'parent-album', name: 'Parent Album (Set of 2)', price: 600 },
            { id: 'canvas', name: 'Large Canvas Print', price: 200 },
            { id: 'rush-edit', name: 'Rush Editing (2 weeks)', price: 800 }
        ]
    }
];
