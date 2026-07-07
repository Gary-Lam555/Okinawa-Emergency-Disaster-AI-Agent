import { shelters } from './shelters.js';

export class DisasterReporter {
  constructor(language = 'en') {
    this.language = language;
    this.reports = this.getInitialReports();
  }

  setLanguage(lang) {
    this.language = lang;
  }

  // Set default mockup reports for dashboard initialization
  getInitialReports() {
    return [
      {
        id: "rep-001",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: "typhoon",
        municipality: "Naha",
        severity: 3, // High
        description: "Very strong wind gusts shattering windows in downtown Kumoji. Power lines down.",
        affectedPeople: 10,
        assessment: {
          level: "High",
          score: 75,
          lifeThreat: "High risk from glass shards and flying debris. Indoor sheltering mandatory.",
          lifeThreatJa: "飛散するガラス破片や飛来物による大怪我のリスクが高いです。屋内退避が必須です。"
        }
      },
      {
        id: "rep-002",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        type: "flood",
        municipality: "Uruma",
        severity: 2, // Moderate
        description: "Road flooded near Enobi intersection. Water height around 30cm, cars stalling.",
        affectedPeople: 0,
        assessment: {
          level: "Moderate",
          score: 45,
          lifeThreat: "Road blockage, vehicle stalling risk. Do not walk or drive through the flooded roads.",
          lifeThreatJa: "道路冠水、車両水没のリスク。冠水路の歩行・運転は避けてください。"
        }
      }
    ];
  }

  // Analyzes a new disaster report submitted by a user and returns safety assessment
  assessReport(reportData) {
    const { type, municipality, severity, description, peopleTrapped } = reportData;
    const isEn = this.language === 'en';
    
    // 1. Calculate numerical score based on inputs
    let baseScore = severity * 25; // 25, 50, 75, 100
    if (peopleTrapped) {
      baseScore += 15;
    }
    if (type === 'tsunami') {
      baseScore += 10; // Tsunami is inherently dangerous
    }
    
    // Clamp score
    const finalScore = Math.min(100, Math.max(0, baseScore));
    
    // Determine level
    let level = "Low";
    if (finalScore >= 85) level = "Critical";
    else if (finalScore >= 60) level = "High";
    else if (finalScore >= 35) level = "Moderate";

    // 2. Assess Life Threat
    let lifeThreat = "";
    let lifeThreatJa = "";
    let evacuationSteps = [];
    let evacuationStepsJa = [];

    switch (type) {
      case 'tsunami':
        lifeThreat = "CRITICAL LIFE THREAT. Tsunami waves cause immediate drowning and sweep away structures.";
        lifeThreatJa = "命に直接関わる極めて危険な状態。津波の波は急速な溺水と建物の流出を引き起こします。";
        evacuationSteps = [
          "Flee inland and uphill immediately. Do not wait.",
          "Ascend to the 3rd floor or higher of a concrete structure if you cannot move inland.",
          "Abandon cars; proceed on foot to prevent massive gridlocks."
        ];
        evacuationStepsJa = [
          "直ちに内陸や高台へ逃げてください。猶予はありません。",
          "高台への移動が困難な場合は、RC造3階以上のビルに登ってください。",
          "車は乗り捨てて徒歩で移動し、道路の渋滞を防いでください。"
        ];
        break;
      case 'typhoon':
        if (severity >= 3) {
          lifeThreat = "HIGH LIFE THREAT. Severe hazard from high-velocity flying debris, falling concrete poles, and glass breakage.";
          lifeThreatJa = "命に関わる危険。強風による飛散物、電柱の倒壊、窓ガラスの損壊リスクが非常に高いです。";
          evacuationSteps = [
            "Shelter indoors in a concrete structure. Keep away from windows.",
            "Make sure you have drinking water stored (taps will stop if pumps lose power).",
            "Do not step outside until the wind warning is officially lifted."
          ];
          evacuationStepsJa = [
            "頑丈なコンクリート建物内に退避し、窓から離れてください。",
            "断水に備え、飲料水を確保し浴槽に水を張ってください。",
            "暴風警報が解除されるまで、絶対に外出しないでください。"
          ];
        } else {
          lifeThreat = "MODERATE LIFE THREAT. Secure loose items and shelter in place.";
          lifeThreatJa = "中レベルの危険。屋外の緩んだ物品を固定し、屋内で待機してください。";
          evacuationSteps = [
            "Secure all balcony and yard items.",
            "Stay indoors and monitor local Okinawa weather updates."
          ];
          evacuationStepsJa = [
            "ベランダや庭の物を固定するか、室内に取り込んでください。",
            "屋外の不要不急の外出を避け、気象情報を確認してください。"
          ];
        }
        break;
      case 'earthquake':
        if (severity >= 3) {
          lifeThreat = "HIGH TO CRITICAL LIFE THREAT. Severe risk from falling items, block wall collapse, and landslide. Possible tsunami hazard.";
          lifeThreatJa = "命に関わる深刻な危険。家具の転倒、ブロック塀の倒壊、土砂崩れ、およびその後の津波リスク。";
          evacuationSteps = [
            "Drop, cover, and hold on to protect your head.",
            "Extinguish open flames immediately when shaking subsides.",
            "Listen for immediate tsunami warnings. If issued, move to high ground."
          ];
          evacuationStepsJa = [
            "頭部を守るために机の下に入り、揺れが収まるまで待ってください。",
            "揺れが収まったら、火元を直ちに消してください。",
            "大津波・津波警報に備え、発令された場合は即座に高台へ逃げてください。"
          ];
        } else {
          lifeThreat = "LOW TO MODERATE LIFE THREAT. Falling items inside homes may cause minor injury.";
          lifeThreatJa = "軽度〜中度の危険。屋内の棚からの落下物などによる怪我に注意してください。";
          evacuationSteps = [
            "Stay alert for aftershocks.",
            "Turn off any gas stoves."
          ];
          evacuationStepsJa = [
            "余震に注意してください。",
            "ガス器具や火元を確認して消してください。"
          ];
        }
        break;
      case 'flood':
        lifeThreat = "MODERATE TO HIGH LIFE THREAT. Risk of vehicle entrapment in submerged underpasses or swept away by rapid street currents.";
        lifeThreatJa = "中〜高レベルの危険。冠水道路での車両立ち往生や、激しい水流による歩行者の流出リスク。";
        evacuationSteps = [
          "Do not drive or walk through flooded roadways.",
          "If water surrounds your home, perform vertical evacuation (move to upper floors).",
          "Stay clear of active drainage canals."
        ];
        evacuationStepsJa = [
          "冠水した道路での歩行や車の運転は絶対に避けてください。",
          "周囲の浸水が激しい場合は、建物の2階以上に避難（垂直避難）してください。",
          "排水溝や増水した河川には絶対に近づかないでください。"
        ];
        break;
      default:
        lifeThreat = "MODERATE LIFE THREAT. Standby for official guidance.";
        lifeThreatJa = "中レベルの危険。公式発表と指示を待ってください。";
        evacuationSteps = [
          "Stay updated via emergency radio or web.",
          "Follow instructions from local fire department."
        ];
        evacuationStepsJa = [
          "緊急ラジオやウェブサイトで最新情報を確認してください。",
          "地域の消防や役所の指示に従ってください。"
        ];
    }

    // 3. Recommended Shelters in the Municipality
    let recommendedShelters = shelters.filter(s => 
      s.municipality.toLowerCase() === municipality.toLowerCase() && s.status === 'Open'
    );
    // If no open shelters in the municipality, get any open shelters
    if (recommendedShelters.length === 0) {
      recommendedShelters = shelters.filter(s => s.status === 'Open').slice(0, 2);
    }
    // If disaster is tsunami, filter only tsunami safe ones
    if (type === 'tsunami') {
      recommendedShelters = recommendedShelters.filter(s => s.tsunamiSafe);
    }

    const assessment = {
      level,
      score: finalScore,
      lifeThreat: isEn ? lifeThreat : lifeThreatJa,
      evacuationSteps: isEn ? evacuationSteps : evacuationStepsJa,
      recommendedShelters: recommendedShelters.map(s => ({
        id: s.id,
        name: isEn ? s.name : s.nameJa,
        address: isEn ? s.address : s.addressJa,
        status: s.status,
        contact: s.contact
      }))
    };

    const newReport = {
      id: "rep-" + Date.now(),
      timestamp: new Date().toISOString(),
      type,
      municipality,
      severity,
      description,
      affectedPeople: peopleTrapped ? 5 : 0, // Mock number if people trapped
      assessment
    };

    // Store report in memory list
    this.reports.unshift(newReport);

    return newReport;
  }

  // Returns all reports
  getReports() {
    return this.reports;
  }
}
