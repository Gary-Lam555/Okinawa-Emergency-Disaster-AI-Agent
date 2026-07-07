import { shelters } from './shelters.js';
import { disasters } from './disasters.js';

export class AIAgent {
  constructor(language = 'en') {
    this.language = language;
  }

  setLanguage(lang) {
    this.language = lang;
  }

  // Processes user queries and generates context-aware responses
  getResponse(query) {
    const cleanQuery = query.toLowerCase().trim();
    
    // Check for specific categories
    const hasTsunami = cleanQuery.includes('tsunami') || cleanQuery.includes('津波');
    const hasTyphoon = cleanQuery.includes('typhoon') || cleanQuery.includes('台風') || cleanQuery.includes('taifu');
    const hasEarthquake = cleanQuery.includes('earthquake') || cleanQuery.includes('地震') || cleanQuery.includes('jishin');
    const hasFlood = cleanQuery.includes('flood') || cleanQuery.includes('洪水') || cleanQuery.includes('rain') || cleanQuery.includes('大雨');
    
    const hasShelter = cleanQuery.includes('shelter') || cleanQuery.includes('evacuate') || cleanQuery.includes('避難') || cleanQuery.includes('逃げ') || cleanQuery.includes('where');
    const hasSeverity = cleanQuery.includes('severity') || cleanQuery.includes('serious') || cleanQuery.includes('level') || cleanQuery.includes('強さ') || cleanQuery.includes('危険度');
    const hasLifeThreat = cleanQuery.includes('life') || cleanQuery.includes('affecting') || cleanQuery.includes('die') || cleanQuery.includes('danger') || cleanQuery.includes('命') || cleanQuery.includes('危険');
    
    // Check for locations in Okinawa
    let detectedLocation = null;
    const locations = [
      { name: 'naha', ja: '那覇' },
      { name: 'nago', ja: '名護' },
      { name: 'okinawa', ja: '沖縄市' },
      { name: 'uruma', ja: 'うるま' },
      { name: 'ishigaki', ja: '石垣' },
      { name: 'miyakojima', ja: '宮古島' }
    ];
    
    for (const loc of locations) {
      if (cleanQuery.includes(loc.name) || cleanQuery.includes(loc.ja)) {
        detectedLocation = loc.name;
        break;
      }
    }

    // 1. Tsunami Evacuation & Shelter Specifics
    if (hasTsunami) {
      if (hasShelter || detectedLocation) {
        return this.getTsunamiShelterResponse(detectedLocation);
      }
      if (hasLifeThreat) {
        return this.getTsunamiLifeThreatResponse();
      }
      if (hasSeverity) {
        return this.getTsunamiSeverityResponse();
      }
      return this.getGeneralTsunamiResponse();
    }

    // 2. Typhoon Guidance
    if (hasTyphoon) {
      if (hasShelter) {
        return this.getTyphoonShelterResponse(detectedLocation);
      }
      if (hasLifeThreat) {
        return this.getTyphoonLifeThreatResponse();
      }
      if (hasSeverity) {
        return this.getTyphoonSeverityResponse();
      }
      return this.getGeneralTyphoonResponse();
    }

    // 3. Earthquake Actions
    if (hasEarthquake) {
      if (hasLifeThreat) {
        return this.getEarthquakeLifeThreatResponse();
      }
      if (hasSeverity) {
        return this.getEarthquakeSeverityResponse();
      }
      return this.getGeneralEarthquakeResponse();
    }

    // 4. Flash Flood
    if (hasFlood) {
      return this.getFloodResponse();
    }

    // 5. Shelter Query (without specific disaster type)
    if (hasShelter) {
      return this.getGeneralShelterResponse(detectedLocation);
    }

    // 6. Severity & Life Threat (General)
    if (hasSeverity || hasLifeThreat) {
      return this.getGeneralThreatResponse();
    }

    // Default Fallback Response
    return this.getDefaultResponse();
  }

  // RESPONSE BUILDERS - TSUNAMI
  getTsunamiShelterResponse(location) {
    const isEn = this.language === 'en';
    const locName = location ? location.charAt(0).toUpperCase() + location.slice(1) : '';
    
    // Filter shelters that are tsunami safe, and optionally match location
    let matchingShelters = shelters.filter(s => s.tsunamiSafe);
    if (location) {
      matchingShelters = matchingShelters.filter(s => s.municipality.toLowerCase() === location.toLowerCase());
    }

    let html = isEn 
      ? `<p><strong>🚨 TSUNAMI EVACUATION CHANNELS - SHELTERS</strong></p>
         <p>In a tsunami scenario, you must evacuate to <strong>high ground</strong> or <strong>designated tsunami-safe structures</strong> (3rd floor or higher of concrete buildings). Do NOT stay on the coast.</p>`
      : `<p><strong>🚨 津波避難経路・避難所情報</strong></p>
         <p>津波が発生した場合、直ちに<strong>高台</strong>または<strong>指定された津波避難ビル</strong>（RC造3階建て以上）へ避難してください。沿岸部には絶対にとどまらないでください。</p>`;

    if (matchingShelters.length > 0) {
      html += `<p>${isEn ? 'Recommended tsunami-safe shelters:' : '推奨される津波対応避難所:'}</p><ul>`;
      matchingShelters.slice(0, 3).forEach(s => {
        html += `<li><strong>${isEn ? s.name : s.nameJa}</strong> (${isEn ? s.municipality : s.municipalityJa})<br/>
                 📍 ${isEn ? s.address : s.addressJa}<br/>
                 🌐 Status: <span style="color: ${s.status === 'Open' ? 'var(--accent-green)' : 'var(--accent-red)'}; font-weight: bold;">${s.status}</span> | Capacity: ${s.capacity}</li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p>${isEn ? 'No direct shelters found for your location. Please move uphill immediately.' : 'お近くの指定避難所が見つかりません。直ちに内陸の高台へ移動してください。'}</p>`;
    }

    html += `<p>${isEn ? '💡 <em>Action: Head inland and avoid driving to prevent traffic lockups.</em>' : '💡 <em>避難行動：渋滞を防ぐため、徒歩で内陸へ避難してください。</em>'}</p>`;
    return html;
  }

  getTsunamiLifeThreatResponse() {
    const isEn = this.language === 'en';
    return isEn 
      ? `<p><strong>⚠️ LIFE RISK ASSESSMENT: TSUNAMI</strong></p>
         <p><strong>Yes, a tsunami poses an extreme threat to life.</strong> The primary risk is drowning, crushing by debris carried by strong currents, and sudden shoreline engulfment.</p>
         <p><strong>Fatal Factors:</strong></p>
         <ul>
           <li>Waves can travel faster than a person can run (up to 800 km/h in open ocean, hitting the shore at 30-50 km/h).</li>
           <li>Just 50cm of flowing tsunami water can easily sweep away an adult.</li>
           <li>Debris (cars, wood, metal) acts as a battering ram.</li>
         </ul>
         <p>🚨 <strong>Survival Action:</strong> Drop everything. Do not wait for warning sirens if you felt a strong earthquake at the coast. Run inland and climb to a high elevation.</p>`
      : `<p><strong>⚠️ 生命への危険性評価：津波</strong></p>
         <p><strong>はい、津波は極めて高い生命の危険をもたらします。</strong> 主な危険は溺死、強い水流による漂流物との衝突、および急速な浸水です。</p>
         <p><strong>致命的な要因:</strong></p>
         <ul>
           <li>津波は人が走るよりも速く到達します（陸上でも時速30〜50km）。</li>
           <li>わずか50cmの水流でも、大人は簡単に押し流されます。</li>
           <li>流された車や瓦礫が凶器となります。</li>
         </ul>
         <p>🚨 <strong>生存のための行動:</strong> 持ち物をすべて捨て、沿岸部にいる場合は地震の揺れを感じたらすぐに高台へ逃げてください。</p>`;
  }

  getTsunamiSeverityResponse() {
    const isEn = this.language === 'en';
    const tsu = disasters.find(d => d.type === 'tsunami');
    let html = `<p><strong>📉 TSUNAMI SEVERITY SCALES</strong></p>`;
    
    tsu.severityMetrics.forEach(m => {
      const color = m.level === 'Critical' ? 'var(--accent-red)' : (m.level === 'High' ? 'var(--accent-amber)' : 'var(--accent-blue)');
      html += `<p><span style="color: ${color}; font-weight: 800;">[${m.level}]</span> <strong>${m.range}</strong><br/>
               👉 ${m.action}</p>`;
    });
    return html;
  }

  getGeneralTsunamiResponse() {
    const isEn = this.language === 'en';
    return isEn 
      ? `<p><strong>🌊 Okinawa Tsunami Guidelines</strong></p>
         <p>Okinawa is surrounded by deep ocean trenches. Undersea earthquakes can generate tsunamis that strike the coast within 10-15 minutes.</p>
         <p><strong>Key Evacuation Rule:</strong> "Upreach, Inland" (より高く、より遠くへ). Go to a height of at least 20-30 meters or the 3rd floor of a concrete building.</p>
         <p>Ask me: <em>"Where are Naha shelters?"</em> or <em>"How serious is a tsunami?"</em> for targeted info.</p>`
      : `<p><strong>🌊 沖縄・津波避難ガイドライン</strong></p>
         <p>沖縄は深い海溝に囲まれています。海溝型地震が発生した場合、わずか10〜15分で津波が沿岸に到達する恐れがあります。</p>
         <p><strong>避難の鉄則:</strong> 「より高く、より遠くへ」。標高20〜30メートル以上の高台、またはRC造3階建て以上の建物へ移動してください。</p>
         <p>詳細な情報は <em>「那覇の避難所はどこ？」</em> や <em>「津波の危険度は？」</em> と質問してください。</p>`;
  }

  // RESPONSE BUILDERS - TYPHOON
  getTyphoonShelterResponse(location) {
    const isEn = this.language === 'en';
    let matchingShelters = shelters.filter(s => s.status === 'Open');
    if (location) {
      matchingShelters = matchingShelters.filter(s => s.municipality.toLowerCase() === location.toLowerCase());
    }

    let html = isEn
      ? `<p><strong>🌀 TYPHOON SHELTER DIRECTORY</strong></p>
         <p>Okinawa houses are mostly built of reinforced concrete to withstand typhoons. In most cases, <strong>sheltering in place</strong> inside a concrete building is safer than travelling outdoors in strong winds.</p>
         <p>However, if your building is weak, near a cliff, or in a low-lying zone prone to flood, head to these active shelters:</p>`
      : `<p><strong>🌀 台風避難所案内</strong></p>
         <p>沖縄の住宅の多くは鉄筋コンクリート（RC）造で、台風に耐えられる設計です。多くの場合、強風時の外出は避け、<strong>頑丈なコンクリート建物内での屋内退避</strong>が最も安全です。</p>
         <p>ただし、木造住宅にお住まいの方や、崖の近く、浸水想定区域におられる方は、以下の開設中避難所へ移動してください：</p>`;

    if (matchingShelters.length > 0) {
      html += `<ul>`;
      matchingShelters.slice(0, 3).forEach(s => {
        html += `<li><strong>${isEn ? s.name : s.nameJa}</strong> (${isEn ? s.municipality : s.municipalityJa})<br/>
                 📍 ${isEn ? s.address : s.addressJa}<br/>
                 💡 Open status: <strong>${s.status}</strong></li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p>${isEn ? 'No dedicated typhoon shelters open. Please shelter in a sturdy concrete building away from windows.' : '開設中の避難所が見つかりません。頑丈なコンクリート造の建物内で、窓から離れて過ごしてください。'}</p>`;
    }
    return html;
  }

  getTyphoonLifeThreatResponse() {
    const isEn = this.language === 'en';
    return isEn 
      ? `<p><strong>⚠️ LIFE RISK ASSESSMENT: TYPHOON</strong></p>
         <p>Typhoons in Okinawa can be severe (Category 4-5 equivalency). They present moderate-to-high risk to life depending on your behavior.</p>
         <p><strong>Primary Hazards to Life:</strong></p>
         <ul>
           <li><strong>Flying Objects:</strong> Roof tiles, tree branches, signboards, or agricultural sheets travelling at over 150 km/h can be lethal.</li>
           <li><strong>Glass Breakage:</strong> High wind pressure or flying debris shattering windows, leading to severe cuts or structural breaches.</li>
           <li><strong>Landslides:</strong> Extreme rain saturates Okinawan clay-rich soils, causing hillsides to collapse.</li>
         </ul>
         <p>💡 <strong>Survival Tip:</strong> Stay inside. Do NOT go outside to check on your farm, boat, or roof during the eye of the storm (winds will resume suddenly from the opposite direction!).</p>`
      : `<p><strong>⚠️ 生命への危険性評価：台風</strong></p>
         <p>沖縄の台風は非常に強力（カテゴリー4〜5相当）になることがあり、行動を誤ると命に関わります。</p>
         <p><strong>主な生命への脅威:</strong></p>
         <ul>
           <li><strong>飛散物:</strong> 時速150km以上で飛んでくる瓦、木の枝、看板などは致命的です。</li>
           <li><strong>ガラス破損:</strong> 気圧の急変動や飛散物により窓ガラスが割れ、大怪我をしたり強風が室内に吹き込みます。</li>
           <li><strong>土砂崩れ:</strong> 長時間の豪雨により地盤が緩み、崖崩れが発生しやすくなります。</li>
         </ul>
         <p>💡 <strong>生存のためのヒント:</strong> 台風の目（一時的な静穏）に入っても外出しないでください。風向きが急に逆転して猛烈な風が戻ってきます。</p>`;
  }

  getTyphoonSeverityResponse() {
    const typ = disasters.find(d => d.type === 'typhoon');
    let html = `<p><strong>📉 TYPHOON SEVERITY LEVELS</strong></p>`;
    typ.severityMetrics.forEach(m => {
      const color = m.level === 'Critical' ? 'var(--accent-red)' : (m.level === 'High' ? 'var(--accent-amber)' : 'var(--accent-blue)');
      html += `<p><span style="color: ${color}; font-weight: 800;">[${m.level}]</span> <strong>${m.range}</strong><br/>
               👉 ${m.action}</p>`;
    });
    return html;
  }

  getGeneralTyphoonResponse() {
    const isEn = this.language === 'en';
    return isEn
      ? `<p><strong>🌀 Okinawa Typhoon Preparation</strong></p>
         <p>Okinawa experiences multiple typhoons yearly. Because of this, Okinawan infrastructure is highly prepared (concrete buildings, underground power lines in newer areas).</p>
         <p>Prepare early: Buy food/water for 3 days, charge all battery banks, and secure loose balconies.</p>`
      : `<p><strong>🌀 沖縄・台風対策ガイド</strong></p>
         <p>沖縄は毎年複数の台風に見舞われます。そのため、建物は強固に設計されていますが、長時間の停電や断水が頻繁に起こります。</p>
         <p>事前準備：3日分の食料と水の確保、モバイルバッテリーの充電、ベランダや屋外の物品固定を確実に行ってください。</p>`;
  }

  // RESPONSE BUILDERS - EARTHQUAKE
  getEarthquakeLifeThreatResponse() {
    const isEn = this.language === 'en';
    return isEn
      ? `<p><strong>⚠️ LIFE RISK ASSESSMENT: EARTHQUAKE</strong></p>
         <p><strong>Moderate to Critical threat.</strong> While modern structures in Okinawa are earthquake-resistant, risk comes from falling objects indoors, older block walls collapsing outdoors, and secondary landslides.</p>
         <p><strong>Crucial Threat:</strong> Major earthquakes in the Ryukyu Trench can trigger devastating tsunamis. For earthquakes, the tsunami is often the deadliest threat.</p>`
      : `<p><strong>⚠️ 生命への危険性評価：地震</strong></p>
         <p><strong>中〜高レベルの脅威。</strong> 沖縄の近代的な建物は耐震性に優れていますが、屋内の落下物、屋外の古いブロック塀の倒壊、山崩れなどに注意が必要です。</p>
         <p><strong>最も深刻な脅威:</strong> 琉球海溝付近での地震は巨大津波を引き起こすため、地震そのもの以上にその後の津波が命を脅かします。</p>`;
  }

  getEarthquakeSeverityResponse() {
    const eq = disasters.find(d => d.type === 'earthquake');
    let html = `<p><strong>📉 JAPANESE SHINDO (SEISMIC INTENSITY) SCALE</strong></p>`;
    eq.severityMetrics.forEach(m => {
      const color = m.level === 'Critical' ? 'var(--accent-red)' : (m.level === 'High' ? 'var(--accent-amber)' : 'var(--accent-blue)');
      html += `<p><span style="color: ${color}; font-weight: 800;">[${m.level}]</span> <strong>${m.range}</strong><br/>
               👉 ${m.action}</p>`;
    });
    return html;
  }

  getGeneralEarthquakeResponse() {
    const isEn = this.language === 'en';
    return isEn
      ? `<p><strong>地震 Earthquake Action Guide</strong></p>
         <p>If you experience shaking: <strong>Drop, Cover, and Hold On</strong> under a sturdy desk. Once shaking stops, secure your exit and watch out for landslide and tsunami alerts.</p>`
      : `<p><strong>地震発生時の避難ガイド</strong></p>
         <p>揺れを感じたら：頑丈な机の下などに隠れて<strong>頭部を守り（ドロップ、カバー、ホールドオン）</strong>、揺れが収まるまで待ってください。収まったら出口を確保し、避難警報（特に津波）を確認します。</p>`;
  }

  // GENERAL FALLBACKS
  getFloodResponse() {
    const isEn = this.language === 'en';
    return isEn
      ? `<p><strong>🌧️ Heavy Rain & Flash Flooding Guidance</strong></p>
         <p>Okinawa squalls can dump massive amounts of water in under an hour, flooding underpasses and low streets in Naha and coastal roads.</p>
         <p><strong>Key Safe Steps:</strong></p>
         <ul>
           <li>Do NOT attempt to drive through flooded underpasses or dip roads.</li>
           <li>If stuck in a low area, go to the 2nd floor or higher of a concrete building (vertical evacuation).</li>
           <li>Keep away from drainage ditches, swollen creeks, and cliffs.</li>
         </ul>`
      : `<p><strong>🌧️ 豪雨・道路冠水時の避難ガイド</strong></p>
         <p>沖縄の局地的な集中豪雨は、短時間で道路やアンダーパスを冠水させます。</p>
         <p><strong>避難行動:</strong></p>
         <ul>
           <li>水深の浅い道路でも、流れが速い場合は歩行や運転を避けてください。</li>
           <li>避難所への移動が危険な場合は、近くの頑丈な建物の2階以上へ垂直避難してください。</li>
           <li>側溝や増水した河川、崖の近くには絶対に近づかないでください。</li>
         </ul>`;
  }

  getGeneralShelterResponse(location) {
    const isEn = this.language === 'en';
    let matchingShelters = location 
      ? shelters.filter(s => s.municipality.toLowerCase() === location.toLowerCase())
      : shelters;

    let html = isEn
      ? `<p><strong>📍 OKINAWA SHELTER MAP LOCATOR</strong></p>
         <p>Official shelters are set up in schools, city halls, and civic centers. Here are open locations:</p>`
      : `<p><strong>📍 沖縄県・指定緊急避難場所一覧</strong></p>
         <p>避難所は学校、市役所、市民会館等に設置されます。現在の状況は以下の通りです：</p>`;

    html += `<ul>`;
    matchingShelters.slice(0, 4).forEach(s => {
      html += `<li><strong>${isEn ? s.name : s.nameJa}</strong> (${isEn ? s.municipality : s.municipalityJa})<br/>
               📍 ${isEn ? s.address : s.addressJa}<br/>
               📞 Tel: ${s.contact} | Status: <span style="color:${s.status === 'Open' ? 'var(--accent-green)' : 'var(--accent-red)'}; font-weight:700;">${s.status}</span></li>`;
    });
    html += `</ul>`;
    return html;
  }

  getGeneralThreatResponse() {
    const isEn = this.language === 'en';
    return isEn
      ? `<p><strong>⚠️ Threat Assessment & Life Hazard Evaluation</strong></p>
         <p>Natural disasters in Okinawa (Typhoon, Tsunami, Earthquake, Landslide) present different threat vectors:</p>
         <ol>
           <li><strong>Tsunami:</strong> Critical life hazard. High ground evacuation is mandatory. Minutes matter.</li>
           <li><strong>Typhoon:</strong> High structural hazard. Stay indoors inside concrete structures. Store supplies.</li>
           <li><strong>Earthquake:</strong> Structural damage and falling objects. Tsunami trigger risk.</li>
         </ol>`
      : `<p><strong>⚠️ 危険度および生命へのリスク評価</strong></p>
         <p>沖縄で発生する自然災害は、それぞれ異なる対策が必要です：</p>
         <ol>
           <li><strong>津波:</strong> 極めて危険。数分が生死を分けます。直ちに高台へ避難してください。</li>
           <li><strong>台風:</strong> 建物への損害リスク。頑丈なコンクリート建物内に留まり、備蓄物資を確認してください。</li>
           <li><strong>地震:</strong> 建物の損害や落下物の危険。直後の津波警報に警戒してください。</li>
         </ol>`;
  }

  getDefaultResponse() {
    const isEn = this.language === 'en';
    return isEn
      ? `<p>👋 Hello, I am the <strong>Okinawa Disaster Emergency AI Agent</strong>.</p>
         <p>I can help you with critical survival information, shelter status, and evacuation procedures in Okinawa.</p>
         <p>You can ask me questions like:</p>
         <ul>
           <li><em>"Is there a tsunami warning? Where do I go in Naha?"</em></li>
           <li><em>"Will a typhoon affect my life? What should I do?"</em></li>
           <li><em>"What are the evacuation shelters in Nago?"</em></li>
           <li><em>"How serious is a Shindo 6 earthquake?"</em></li>
         </ul>`
      : `<p>👋 こんにちは。こちらは<strong>沖縄県災害緊急対策AIエージェント</strong>です。</p>
         <p>沖縄での自然災害発生時に、生命を守る避難情報、避難所の開設状況、避難経路などの相談に答えます。</p>
         <p>以下のような質問を投げかけてください：</p>
         <ul>
           <li><em>「那覇市で津波が起きたらどこへ避難すればいい？」</em></li>
           <li><em>「台風は命に関わりますか？どう対策すればいい？」</em></li>
           <li><em>「名護市の避難所情報を教えて」</em></li>
           <li><em>「震度6の地震の危険度はどのくらい？」</em></li>
         </ul>`;
  }
}
