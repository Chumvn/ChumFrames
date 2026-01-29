// ===== Background Definitions =====

const BACKGROUNDS = {
    gradient: [
        {
            id: 'gradient1',
            name: 'Purple Pink',
            css: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        },
        {
            id: 'gradient2',
            name: 'Blue Cyan',
            css: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
        },
        {
            id: 'gradient3',
            name: 'Orange Red',
            css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            id: 'gradient4',
            name: 'Green Teal',
            css: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        },
        {
            id: 'gradient5',
            name: 'Dark Purple',
            css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        },
        {
            id: 'gradient6',
            name: 'Sunset',
            css: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)'
        },
        {
            id: 'gradient7',
            name: 'Ocean',
            css: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)'
        },
        {
            id: 'gradient8',
            name: 'Neon',
            css: 'linear-gradient(135deg, #f5af19 0%, #f12711 50%, #c471ed 100%)'
        }
    ],
    studio: [
        {
            id: 'studio1',
            name: 'Pure White',
            css: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)'
        },
        {
            id: 'studio2',
            name: 'Light Gray',
            css: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)'
        },
        {
            id: 'studio3',
            name: 'Dark Studio',
            css: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)'
        },
        {
            id: 'studio4',
            name: 'Pure Black',
            css: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)'
        },
        {
            id: 'studio5',
            name: 'Warm Beige',
            css: 'linear-gradient(180deg, #f5f0e8 0%, #e8ddd0 100%)'
        },
        {
            id: 'studio6',
            name: 'Cool Blue',
            css: 'linear-gradient(180deg, #e8f4fc 0%, #d0e8f5 100%)'
        }
    ],
    abstract: [
        {
            id: 'abstract1',
            name: 'Mesh Purple',
            css: 'radial-gradient(at 40% 20%, #6366f1 0px, transparent 50%), radial-gradient(at 80% 0%, #ec4899 0px, transparent 50%), radial-gradient(at 0% 50%, #8b5cf6 0px, transparent 50%), radial-gradient(at 80% 50%, #14b8a6 0px, transparent 50%), radial-gradient(at 0% 100%, #f97316 0px, transparent 50%), radial-gradient(at 80% 100%, #6366f1 0px, transparent 50%), #0f0f23'
        },
        {
            id: 'abstract2',
            name: 'Mesh Blue',
            css: 'radial-gradient(at 20% 30%, #0ea5e9 0px, transparent 50%), radial-gradient(at 80% 20%, #06b6d4 0px, transparent 50%), radial-gradient(at 40% 80%, #3b82f6 0px, transparent 50%), radial-gradient(at 90% 70%, #8b5cf6 0px, transparent 50%), #0a0a1a'
        },
        {
            id: 'abstract3',
            name: 'Mesh Warm',
            css: 'radial-gradient(at 10% 20%, #f97316 0px, transparent 50%), radial-gradient(at 90% 30%, #ef4444 0px, transparent 50%), radial-gradient(at 30% 70%, #f59e0b 0px, transparent 50%), radial-gradient(at 70% 90%, #ec4899 0px, transparent 50%), #1a0a0a'
        },
        {
            id: 'abstract4',
            name: 'Aurora',
            css: 'linear-gradient(180deg, #0c0c1d 0%, #1a1a3e 50%, #0f2027 100%), radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 60%)'
        }
    ],
    texture: [
        {
            id: 'texture1',
            name: 'Noise Dark',
            css: '#1a1a1a'
        },
        {
            id: 'texture2',
            name: 'Noise Light',
            css: '#e5e5e5'
        },
        {
            id: 'texture3',
            name: 'Grid Dark',
            css: 'linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px), #1a1a1a',
            size: '20px 20px'
        },
        {
            id: 'texture4',
            name: 'Dots',
            css: 'radial-gradient(circle, #3a3a3a 1px, transparent 1px), #1a1a1a',
            size: '20px 20px'
        }
    ]
};

// Get backgrounds by category
function getBackgroundsByCategory(category) {
    return BACKGROUNDS[category] || [];
}

// Get all backgrounds
function getAllBackgrounds() {
    return Object.values(BACKGROUNDS).flat();
}
