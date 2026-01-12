export const PACKAGES = [
    {
        id: 'wedding-photography',
        title: 'Wedding Photography',
        description: 'Capture every moment of your special day with our professional photography services.',
        image: '/Studio Pictures/054A6395.jpg',
        imagePosition: 'top center',
        tiers: [
            {
                id: 'silver',
                name: 'Silver Package',
                price: 1500,
                features: [
                    '6 Hours Coverage',
                    '1 Photographer',
                    '300+ Edited High-Res Images',
                    'Online Gallery'
                ]
            },
            {
                id: 'gold',
                name: 'Gold Package',
                price: 2200,
                features: [
                    '8 Hours Coverage',
                    '2 Photographers',
                    '500+ Edited High-Res Images',
                    'Online Gallery',
                    'Engagement Session'
                ]
            },
            {
                id: 'platinum',
                name: 'Platinum Package',
                price: 3000,
                features: [
                    'Full Day Coverage (up to 12 hours)',
                    '2 Photographers',
                    '800+ Edited High-Res Images',
                    'Online Gallery',
                    'Engagement Session',
                    'Premium Photo Album'
                ]
            }
        ],
        addons: [
            { id: 'extra-hour', name: 'Extra Hour', price: 200 },
            { id: 'album', name: 'Additional Album', price: 400 },
            { id: 'prints', name: 'Print Box', price: 150 }
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
