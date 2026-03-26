import { User, SocialPlatform } from './types';

export const SIMULATED_USERS: User[] = [
  {
    id: 1,
    name: 'Alex "Nitro" Vance',
    username: '@nitro_drops',
    platform: SocialPlatform.Telegram,
    profilePicUrl: 'https://picsum.photos/seed/user1/100/100',
    posts: [
      { id: 101, text: 'Weekend forecast: cloudy with a chance of pure snow. DM for details. ❄️🏔️', timestamp: '2h ago' },
      { id: 102, text: 'Got that new batch of 420 greens. Super loud pack just landed.', imageUrl: 'https://picsum.photos/seed/drug1/400/300', timestamp: '5h ago' },
    ],
  },
   {
    id: 7,
    name: 'Midnight Chemist',
    username: '@midnight_chemist',
    platform: SocialPlatform.Instagram,
    profilePicUrl: 'https://picsum.photos/seed/user7/100/100',
    posts: [
        { id: 701, text: 'Getting the kit ready for a wild weekend. Big experiments ahead.', imageUrl: 'https://picsum.photos/seed/drug_scene/400/300', timestamp: '10m ago' },
    ],
  },
  {
    id: 8,
    name: 'Recovery Advocate',
    username: '@clean_life_journey',
    platform: SocialPlatform.Instagram,
    profilePicUrl: 'https://picsum.photos/seed/user8/100/100',
    posts: [
        { id: 801, text: 'This picture is a reminder of a dark past. So grateful for my recovery journey and being drug free. Say no to drugs!', imageUrl: 'https://picsum.photos/seed/drug_scene_2/400/300', timestamp: '1h ago' },
    ],
  },
   {
    id: 5,
    name: 'CryptoKingpin',
    username: '@cryptokingpin',
    platform: SocialPlatform.Telegram,
    profilePicUrl: 'https://picsum.photos/seed/user5/100/100',
    posts: [
      { id: 501, text: 'Check out our new animated mascot showing off the latest product quality. Big fun guaranteed. DM for the full menu. Monero only.', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', videoMimeType: 'video/mp4', timestamp: '15m ago' },
    ],
  },
  {
    id: 2,
    name: 'Jenny Blooms',
    username: '@jennyblooms',
    platform: SocialPlatform.Instagram,
    profilePicUrl: 'https://picsum.photos/seed/user2/100/100',
    posts: [
      { id: 201, text: 'Loving this beautiful day! #sunny #happy', imageUrl: 'https://picsum.photos/seed/nature1/400/300', timestamp: '1d ago' },
      { id: 202, text: 'Just baked some delicious cookies! 🍪 Who wants one?', timestamp: '2d ago' },
    ],
  },
  {
    id: 3,
    name: 'Secret Stash',
    username: '+1-555-0102',
    platform: SocialPlatform.WhatsApp,
    profilePicUrl: 'https://picsum.photos/seed/user3/100/100',
    posts: [
      { id: 301, text: 'The party powder is in stock. White horse for the weekend race. 🐴', timestamp: 'Just now' },
      { id: 302, text: 'Pills that make you roll into the weekend. Blue dolphins are swimming. 💊🐬', imageUrl: 'https://picsum.photos/seed/pills/400/300', timestamp: '1h ago'},
    ],
  },
  {
    id: 4,
    name: 'Gamer Guy 42',
    username: '@gamer_guy_42',
    platform: SocialPlatform.Instagram,
    profilePicUrl: 'https://picsum.photos/seed/user4/100/100',
    posts: [
      { id: 401, text: 'Just chilling, hitting some high scores. Need to re-up on my stash of snacks for the grind.', timestamp: '3h ago' },
      { id: 402, text: 'Anyone want to party up tonight? It\'s gonna be lit.', timestamp: '8h ago'},
    ],
  },
  {
    id: 6,
    name: 'Zen Gardener',
    username: '@zen_gardener_88',
    platform: SocialPlatform.Instagram,
    profilePicUrl: 'https://picsum.photos/seed/user6/100/100',
    posts: [
      { id: 601, text: 'Exploring some potent new herbal blends today. Feeling very relaxed and elevated. 🌿✨ #natural #wellness', timestamp: '6h ago' },
      { id: 602, text: 'Just got a delivery of some special \'gummies\' to help with creativity. The colours are amazing. 🌈', imageUrl: 'https://picsum.photos/seed/gummies/400/300', timestamp: '1d ago' },
    ],
  },
];
