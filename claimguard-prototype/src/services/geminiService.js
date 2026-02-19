const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// New API keys often need experimental endpoint
const ENDPOINTS = [
  { name: 'gemini-exp-1206', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1206:generateContent' },
  { name: 'gemini-2.0-flash-exp', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent' },
  { name: 'gemini-1.5-flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' },
  { name: 'gemini-1.5-pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent' }
];

async function tryEndpoint(endpoint, base64PDF, prompt) {
  const url = `${endpoint.url}?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: "application/pdf", data: base64PDF } },
          { text: prompt }
        ]
      }],
      generationConfig: { 
        temperature: 0.1,
        maxOutputTokens: 8192
      }
    })
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `HTTP ${response.status}`);
  }
  
  return data;
}

export async function analyzePolicyPDF(pdfFile, userData) {
  try {
    const base64PDF = await fileToBase64(pdfFile);

    const prompt = `Analyze this health insurance policy for:
Name: ${userData.name}, Age: ${userData.age}, Conditions: ${userData.conditions.join(', ') || 'None'}

Return ONLY this JSON (no markdown):
{"scenarios":[{"id":1,"name":"Heart Attack","status":"covered","payout":"₹X","reason":"why","clause":"section","outOfPocket":"₹0"},{"id":2,"name":"Knee Surgery","status":"rejected","payout":"₹0","reason":"48-month waiting period","clause":"4.7.2","outOfPocket":"₹4.2L"},{"id":3,"name":"Cancer Treatment","status":"partial","payout":"₹3L","reason":"sub-limit","clause":"5.1.3","outOfPocket":"₹2L"},{"id":4,"name":"Diabetes Management","status":"rejected","payout":"₹0","reason":"pre-existing exclusion","clause":"2.4.1","outOfPocket":"₹80K"},{"id":5,"name":"Appendicitis Surgery","status":"covered","payout":"₹1.8L","reason":"emergency covered","clause":"3.1.2","outOfPocket":"₹0"},{"id":6,"name":"Cataract Surgery","status":"partial","payout":"₹24K","reason":"eye sub-limit","clause":"5.2.1","outOfPocket":"₹40K"},{"id":7,"name":"Dengue Treatment","status":"covered","payout":"₹60K","reason":"vector diseases covered","clause":"3.3.1","outOfPocket":"₹0"},{"id":8,"name":"Hip Replacement","status":"rejected","payout":"₹0","reason":"waiting period","clause":"4.7.2","outOfPocket":"₹5.5L"},{"id":9,"name":"Pneumonia","status":"covered","payout":"₹1.2L","reason":"respiratory covered","clause":"3.3.2","outOfPocket":"₹0"},{"id":10,"name":"Robotic Surgery","status":"rejected","payout":"₹0","reason":"not covered","clause":"6.2.3","outOfPocket":"₹8L"},{"id":11,"name":"Bypass Surgery","status":"covered","payout":"₹5L","reason":"cardiac covered","clause":"3.2.2","outOfPocket":"₹0"},{"id":12,"name":"Kidney Stone","status":"covered","payout":"₹1.5L","reason":"urological covered","clause":"3.4.1","outOfPocket":"₹0"},{"id":13,"name":"Thyroid Surgery","status":"partial","payout":"₹50K","reason":"ENT sub-limit","clause":"5.3.1","outOfPocket":"₹30K"},{"id":14,"name":"Hernia Repair","status":"covered","payout":"₹80K","reason":"surgery covered","clause":"3.1.3","outOfPocket":"₹0"},{"id":15,"name":"Spinal Surgery","status":"rejected","payout":"₹0","reason":"waiting period","clause":"4.7.2","outOfPocket":"₹6.5L"},{"id":16,"name":"Chemotherapy","status":"partial","payout":"₹3L","reason":"cancer sub-limit","clause":"5.1.4","outOfPocket":"₹4L"},{"id":17,"name":"Dialysis","status":"covered","payout":"₹2.5L","reason":"renal covered","clause":"3.5.1","outOfPocket":"₹0"},{"id":18,"name":"Maternity","status":"rejected","payout":"₹0","reason":"not included","clause":"6.1.1","outOfPocket":"₹1.5L"},{"id":19,"name":"Accident Emergency","status":"covered","payout":"₹5L","reason":"accidents covered","clause":"3.6.1","outOfPocket":"₹0"},{"id":20,"name":"ICU Admission","status":"partial","payout":"₹1.5L","reason":"room rent cap","clause":"5.4.1","outOfPocket":"₹60K"}],"policySummary":{"coverageAmount":"₹5L","waitingPeriods":["48 months for joint replacement"],"exclusions":["Pre-existing diseases","Maternity","Robotic surgery"],"sublimits":["₹3L cancer","₹50K ENT","Room rent 1%"]}}

Base status on the actual policy document. Adjust amounts based on what you find.`;

    let data = null;
    let workingEndpoint = null;

    // Try each endpoint
    for (const endpoint of ENDPOINTS) {
      try {
        console.log(`🔍 Trying: ${endpoint.name}`);
        data = await tryEndpoint(endpoint, base64PDF, prompt);
        workingEndpoint = endpoint.name;
        console.log(`✅ SUCCESS with ${endpoint.name}`);
        break;
      } catch (err) {
        console.warn(`❌ ${endpoint.name} failed: ${err.message}`);
      }
    }

    if (!data) {
      throw new Error('All endpoints failed. Your API key may not have model access yet.');
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const covered = parsed.scenarios.filter(s => s.status === 'covered').length;

    return {
      vulnerabilityScore: covered,
      totalScenarios: 20,
      scenarios: parsed.scenarios,
      policySummary: parsed.policySummary,
      recommendations: generateRecommendations(parsed.scenarios),
      isRealAnalysis: true,
      modelUsed: workingEndpoint
    };

  } catch (error) {
    console.error('❌ Final error:', error);
    throw error;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error("PDF read failed"));
    reader.readAsDataURL(file);
  });
}

function generateRecommendations(scenarios) {
  const recs = [];
  const bad = scenarios.filter(s => s.status !== 'covered');
  
  if (bad.some(s => s.name.toLowerCase().includes('cancer') || s.name.toLowerCase().includes('chemo'))) {
    recs.push({ title: 'Add Cancer Coverage', cost: '₹8,000/year', benefit: '₹10L cancer coverage', urgency: 'high' });
  }
  if (bad.some(s => ['knee','hip','spinal'].some(k => s.name.toLowerCase().includes(k)))) {
    recs.push({ title: 'Joint Replacement Rider', cost: '₹6,500/year', benefit: 'Covers joint surgeries', urgency: 'high' });
  }
  if (bad.some(s => s.name.toLowerCase().includes('icu'))) {
    recs.push({ title: 'Remove Room Rent Cap', cost: '₹4,200/year', benefit: 'No ICU co-payment', urgency: 'medium' });
  }
  if (recs.length === 0) {
    recs.push({ title: 'Good Coverage', cost: '₹0', benefit: 'Policy is comprehensive', urgency: 'low' });
  }
  return recs;
}

export function getMockAnalysis() {
  return {
    vulnerabilityScore: 12, totalScenarios: 20, isRealAnalysis: false,
    scenarios: [
      {id:1,name:'Heart Attack',status:'covered',payout:'₹4.5L',reason:'Cardiac care covered',clause:'3.2.1',outOfPocket:'₹0'},
      {id:2,name:'Knee Surgery',status:'rejected',payout:'₹0',reason:'48-month waiting period not met',clause:'4.7.2(b)',outOfPocket:'₹4.2L'},
      {id:3,name:'Cancer Treatment',status:'partial',payout:'₹3L',reason:'Sub-limit applies',clause:'5.1.3',outOfPocket:'₹5L'},
      {id:4,name:'Diabetes Management',status:'rejected',payout:'₹0',reason:'Pre-existing exclusion',clause:'2.4.1',outOfPocket:'₹80K'},
      {id:5,name:'Appendicitis',status:'covered',payout:'₹1.8L',reason:'Emergency covered',clause:'3.1.2',outOfPocket:'₹0'},
      {id:6,name:'Cataract Surgery',status:'partial',payout:'₹24K',reason:'Eye sub-limit',clause:'5.2.1',outOfPocket:'₹40K'},
      {id:7,name:'Dengue',status:'covered',payout:'₹60K',reason:'Vector diseases covered',clause:'3.3.1',outOfPocket:'₹0'},
      {id:8,name:'Hip Replacement',status:'rejected',payout:'₹0',reason:'Waiting period',clause:'4.7.2(a)',outOfPocket:'₹5.5L'},
      {id:9,name:'Pneumonia',status:'covered',payout:'₹1.2L',reason:'Respiratory covered',clause:'3.3.2',outOfPocket:'₹0'},
      {id:10,name:'Robotic Surgery',status:'rejected',payout:'₹0',reason:'Not covered',clause:'6.2.3',outOfPocket:'₹8L'},
      {id:11,name:'Bypass Surgery',status:'covered',payout:'₹5L',reason:'Cardiac covered',clause:'3.2.2',outOfPocket:'₹0'},
      {id:12,name:'Kidney Stone',status:'covered',payout:'₹1.5L',reason:'Urological covered',clause:'3.4.1',outOfPocket:'₹0'},
      {id:13,name:'Thyroid Surgery',status:'partial',payout:'₹50K',reason:'ENT sub-limit',clause:'5.3.1',outOfPocket:'₹30K'},
      {id:14,name:'Hernia',status:'covered',payout:'₹80K',reason:'Surgery covered',clause:'3.1.3',outOfPocket:'₹0'},
      {id:15,name:'Spinal Surgery',status:'rejected',payout:'₹0',reason:'Waiting period',clause:'4.7.2(c)',outOfPocket:'₹6.5L'},
      {id:16,name:'Chemotherapy',status:'partial',payout:'₹3L',reason:'Cancer sub-limit',clause:'5.1.4',outOfPocket:'₹4L'},
      {id:17,name:'Dialysis',status:'covered',payout:'₹2.5L',reason:'Renal covered',clause:'3.5.1',outOfPocket:'₹0'},
      {id:18,name:'Maternity',status:'rejected',payout:'₹0',reason:'Not included',clause:'6.1.1',outOfPocket:'₹1.5L'},
      {id:19,name:'Accident',status:'covered',payout:'₹5L',reason:'Accidents covered',clause:'3.6.1',outOfPocket:'₹0'},
      {id:20,name:'ICU',status:'partial',payout:'₹1.5L',reason:'Room rent cap',clause:'5.4.1',outOfPocket:'₹60K'}
    ],
    recommendations: [
      {title:'Cancer Top-Up',cost:'₹8,000/year',benefit:'₹10L coverage',urgency:'high'},
      {title:'Joint Rider',cost:'₹6,500/year',benefit:'Knee/hip/spine',urgency:'high'},
      {title:'Remove Rent Cap',cost:'₹4,200/year',benefit:'No ICU co-pay',urgency:'medium'}
    ]
  };
}
