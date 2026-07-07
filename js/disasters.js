// Okinawa Natural Disaster Configurations and Guides
export const disasters = [
  {
    type: "typhoon",
    name: "Typhoon (Taifu)",
    nameJa: "台風",
    description: "Tropical cyclones common in Okinawa, particularly between July and October. They bring extremely strong winds, torrential rain, and storm surges.",
    descriptionJa: "沖縄で7月から10月にかけて頻繁に発生する熱帯低気圧。非常に強い風、豪雨、高潮をもたらします。",
    severityMetrics: [
      { level: "Low", range: "Category 1 (Wind < 125 km/h)", action: "Secure loose outdoor items. Stay informed." },
      { level: "Moderate", range: "Category 2-3 (Wind 125-177 km/h)", action: "Stay indoors. Prepare emergency kits. Board up windows if necessary." },
      { level: "High", range: "Category 4 (Wind 178-250 km/h)", action: "Evacuate if in flood-prone/coastal areas. Shelter in a concrete building." },
      { level: "Critical", range: "Category 5 (Wind > 250 km/h)", action: "Immediate evacuation to designated reinforced shelters. Keep away from windows." }
    ],
    lifeImpact: "High danger of flying debris, glass breakage, coastal flooding, power outages, and landslides in mountainous areas.",
    lifeImpactJa: "飛散物による怪我、ガラスの破損、沿岸部の浸水、停電、山間部での土砂崩れなどの危険性があります。",
    evacuationGuidelines: [
      "Secure all loose outdoor objects (goya trellises, potted plants, bicycles).",
      "Stay indoors in a reinforced concrete structure (most Okinawa houses are built with concrete for this reason).",
      "Prepare a 3-day supply of water and food (power/water outages are highly common).",
      "Move away from windows during peak winds.",
      "Check coastal surge warnings."
    ]
  },
  {
    type: "tsunami",
    name: "Tsunami (Tsunami)",
    nameJa: "津波",
    description: "Giant ocean waves caused by undersea earthquakes. Okinawa's coastal areas and surrounding low-lying islands are highly vulnerable.",
    descriptionJa: "海底地震によって引き起こされる巨大な波。沖縄の沿岸部や周囲の低地に位置する島々は非常に脆弱です。",
    severityMetrics: [
      { level: "Low", range: "Advisory (Height < 1m)", action: "Get out of the water and leave coastal areas immediately." },
      { level: "Moderate", range: "Warning (Height 1m - 3m)", action: "Evacuate immediately to high ground or a tsunami evacuation building." },
      { level: "High", range: "Major Warning (Height 3m - 10m)", action: "Immediate evacuation to safe inland areas or heights of 3 stories or higher." },
      { level: "Critical", range: "Major Warning (Height > 10m)", action: "Flee immediately to the highest possible ground or reinforced concrete structures." }
    ],
    lifeImpact: "Extreme risk of drowning, crushing by debris, and swift coastal inundation. Tsunami waves can arrive within minutes of an earthquake.",
    lifeImpactJa: "溺死、漂流物による衝突、急速な浸水の極めて高いリスク。地震発生から数分で津波が到達することがあります。",
    evacuationGuidelines: [
      "If you feel a strong earthquake or hear a tsunami warning, move inland and uphill immediately.",
      "Do NOT wait for official announcements if you are near the coast and feel shaking.",
      "Climb to at least the 3rd floor of a concrete building if high ground is unavailable.",
      "Do NOT use cars for evacuation unless absolutely necessary, to avoid massive gridlock.",
      "Stay away from the coast until the warning is officially lifted (tsunami waves arrive in multiple cycles)."
    ]
  },
  {
    type: "earthquake",
    name: "Earthquake (Jishin)",
    nameJa: "地震",
    description: "Sudden shaking of the ground. While Okinawa is historically less seismic than mainland Japan, it is surrounded by active trenches and can experience major quakes.",
    descriptionJa: "地表の急激な揺れ。沖縄は本土に比べ地震が少ないとされていますが、周囲には活動的な海溝があり、巨大地震が発生する可能性があります。",
    severityMetrics: [
      { level: "Low", range: "Shindo 1-3 (Weak shaking)", action: "Stay calm. Check for falling items." },
      { level: "Moderate", range: "Shindo 4-5 (Moderate shaking)", action: "Protect your head under a table. Extinguish open flames." },
      { level: "High", range: "Shindo 6 (Strong shaking)", action: "Move away from shelves and glass. Expect power outages." },
      { level: "Critical", range: "Shindo 7 (Violent shaking)", action: "Drop, cover, and hold on. Watch out for collapsing walls and landslides. Watch for immediate tsunami warnings." }
    ],
    lifeImpact: "Risk of falling furniture, collapsing older structures, fire outbreaks, landslides, and subsequent tsunami waves.",
    lifeImpactJa: "家具の転倒、古い建物の倒壊、火災の発生、土砂崩れ、およびその後の津波の危険性があります。",
    evacuationGuidelines: [
      "DROP, COVER, and HOLD ON. Protect your head and neck.",
      "Extinguish gas stoves and heaters as soon as shaking permits, to prevent fires.",
      "Open doors to secure an exit route (frames can warp during shaking).",
      "Stay away from brick walls, vending machines, and cliffs.",
      "Be prepared for immediate evacuation if a tsunami warning is issued."
    ]
  },
  {
    type: "flood",
    name: "Flash Flood / Heavy Rain (Gou)",
    nameJa: "大雨・洪水",
    description: "Rapid flooding of low-lying areas, rivers, and streets during sudden downpours (squalls or typhoon outer bands) in Okinawa.",
    descriptionJa: "突発的な豪雨（スコールや台風の外側の雨雲）による低地、河川、道路の急速な冠水。",
    severityMetrics: [
      { level: "Low", range: "Rainfall < 20mm/hr", action: "Watch out for road puddles and slippery streets." },
      { level: "Moderate", range: "Rainfall 20-50mm/hr", action: "Avoid underpasses. Move valuables to higher floors." },
      { level: "High", range: "Rainfall 50-80mm/hr", action: "Evacuate low-lying areas. Avoid driving unless critical." },
      { level: "Critical", range: "Rainfall > 80mm/hr", action: "Immediate vertical evacuation (higher floors) if unable to reach a shelter safely." }
    ],
    lifeImpact: "Drowning risks, vehicle entrapment in flooded underpasses, swept-away risks near rivers, and sewage backflows.",
    lifeImpactJa: "溺水の危険、アンダーパスでの車両水没、増水した河川付近での流出、下水の逆流などのリスクがあります。",
    evacuationGuidelines: [
      "Avoid underpasses (sunken roads) and rivers at all costs.",
      "If water rises rapidly on streets, do not walk through moving water even if it is shallow.",
      "If evacuating outdoors is too dangerous, move to the second floor or higher of a sturdy concrete building (vertical evacuation).",
      "Keep emergency lights ready as electrical vaults may flood."
    ]
  }
];
