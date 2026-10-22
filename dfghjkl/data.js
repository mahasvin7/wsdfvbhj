/**
 * SOUL Radiology Report Portal - Seed Data & Synthetic Reports
 * Contains regular user accounts (not doctors) and predefined synthetic radiology reports.
 */

const STORAGE_KEYS = {
  USERS: 'soul_portal_users_v2',
  CURRENT_USER: 'soul_portal_session_v2',
  SAVED_REPORTS: 'soul_portal_saved_v2'
};

// Seed User Accounts for regular individuals/patients (Not doctors)
const DEFAULT_USERS = [
  {
    id: 'USR-8921',
    name: 'Aarav Patel',
    username: 'aarav_p',
    email: 'aarav.patel@example.com',
    dob: '1995-04-12',
    gender: 'Male',
    mobile: '+91 98765 43210',
    password: 'Password@123',
    userId: 'SOUL-UID-1042',
    avatarInitials: 'AP',
    avatarBg: '#13836B',
    joinedDate: '2025-06-10'
  },
  {
    id: 'USR-8922',
    name: 'Meera Sen',
    username: 'meera_sen',
    email: 'meera.sen@example.com',
    dob: '1998-09-23',
    gender: 'Female',
    mobile: '+91 98112 34567',
    password: 'Password@123',
    userId: 'SOUL-UID-1043',
    avatarInitials: 'MS',
    avatarBg: '#17365D',
    joinedDate: '2025-08-14'
  },
  {
    id: 'USR-8923',
    name: 'Rohan Gupta',
    username: 'rohan_g',
    email: 'rohan.gupta@example.com',
    dob: '1992-11-05',
    gender: 'Male',
    mobile: '+91 97455 67890',
    password: 'Password@123',
    userId: 'SOUL-UID-1044',
    avatarInitials: 'RG',
    avatarBg: '#F3A536',
    joinedDate: '2026-01-20'
  }
];

// Each sample keeps its report and matching predefined analysis together, keyed by a stable id.
// All content is fictional demonstration data. Optional fields (shown only when present):
//   impression, measurements [{label,value,unit}], recommendation, priorReport {date,reportText},
//   matchingAnalysis.warning {summary, evidence}, matchingAnalysis.incomplete {summary, points[{text,evidence}]},
//   matchingAnalysis.comparison {rows[{topic, prior|null, current}]}
// Every evidence / comparison string must be copied word-for-word from that sample's own report text.
const SYNTHETIC_REPORTS = [
  {
    "id": "RAD-SAMPLE-01",
    "examType": "Chest Radiograph (PA View)",
    "bodyRegion": "Thorax / Lungs",
    "sampleDate": "14 Oct 2026",
    "statusBadge": "Routine Finding",
    "statusColor": "teal",
    "reportText": "Lungs are clear bilaterally with no focal consolidation, pneumothorax, or pleural effusion. Cardiothoracic ratio is within normal limits. Visualised bony thorax intact.",
    "matchingAnalysis": {
      "findingSummary": "Clear lungs and normal heart size.",
      "structuredFindings": [
        {
          "label": "Lungs",
          "value": "Clear on both sides; no consolidation, pneumothorax or pleural effusion",
          "evidence": "Lungs are clear bilaterally with no focal consolidation, pneumothorax, or pleural effusion."
        },
        {
          "label": "Heart size",
          "value": "Cardiothoracic ratio within normal limits",
          "evidence": "Cardiothoracic ratio is within normal limits."
        },
        {
          "label": "Bones",
          "value": "Visualised bony thorax intact",
          "evidence": "Visualised bony thorax intact."
        }
      ],
      "plainLanguageExplanation": "The report describes clear lungs on both sides, a normal heart size, and no air or fluid around the lungs.",
      "clinicianReviewPrompt": "Share this report with your primary doctor to review alongside your clinical symptoms."
    },
    "impression": "No acute cardiopulmonary abnormality.",
    "earlyDetection": {
      "targetDisease": "Pneumonia, Cardiomegaly & Pleural Effusion",
      "status": "Clear / Negative Baseline",
      "statusType": "green",
      "stage": "Normal Healthy Baseline (No Early Pathology)",
      "indicators": [
        "No focal consolidation (early alveolar infiltration or pneumonia absent)",
        "Cardiothoracic ratio normal (no early cardiomegaly or ventricular enlargement)",
        "Pleural spaces clear (no early subpulmonic effusion or blunted angles)"
      ],
      "earlyIntervention": "No active disease intervention required. Continue routine preventive wellness and health checkups.",
      "preventionGuidance": "Maintain cardiovascular wellness, avoid smoking, and preserve this clear radiograph as a baseline for future comparison.",
      "doctorQuestions": [
        "Does this clear chest X-ray confirm my symptoms are not coming from my lungs?",
        "When should I consider my next routine cardiopulmonary screening?"
      ]
    }
  },
  {
    "id": "RAD-SAMPLE-02",
    "examType": "Right Knee MRI",
    "bodyRegion": "Right Knee",
    "sampleDate": "18 Sep 2026",
    "statusBadge": "Mild Finding",
    "statusColor": "teal",
    "reportText": "Mild degenerative thinning of articular cartilage over the weight-bearing surface of the medial femoral condyle. Small marginal osteophytes noted along the medial joint line. Grade 1-2 intrasubstance signal change seen in the posterior horn of the medial meniscus, without definitive articular surface extension or displaced tear. Anterior cruciate ligament (ACL), posterior cruciate ligament (PCL), and collateral ligaments are intact with normal continuous fibers. Extensor mechanism is intact. No significant joint effusion or popliteal (Baker) cyst identified.",
    "matchingAnalysis": {
      "findingSummary": "Mild wear on the inner side of the knee.",
      "structuredFindings": [
        {
          "label": "Cartilage",
          "value": "Mild thinning on the inner side of the knee",
          "evidence": "Mild degenerative thinning of articular cartilage over the weight-bearing surface of the medial femoral condyle."
        },
        {
          "label": "Bone spurs",
          "value": "Small bone spurs (osteophytes) along the inner joint line",
          "evidence": "Small marginal osteophytes noted along the medial joint line."
        },
        {
          "label": "Meniscus",
          "value": "Grade 1-2 signal change in the inner meniscus; no displaced tear",
          "evidence": "Grade 1-2 intrasubstance signal change seen in the posterior horn of the medial meniscus, without definitive articular surface extension or displaced tear."
        },
        {
          "label": "Ligaments",
          "value": "ACL, PCL and side ligaments are intact",
          "evidence": "Anterior cruciate ligament (ACL), posterior cruciate ligament (PCL), and collateral ligaments are intact with normal continuous fibers."
        },
        {
          "label": "Joint fluid",
          "value": "No significant fluid or Baker cyst",
          "evidence": "No significant joint effusion or popliteal (Baker) cyst identified."
        }
      ],
      "plainLanguageExplanation": "The scan shows mild wear and tear on the inner side of the right knee, like early joint ageing (osteoarthritis). The main knee ligaments are described as healthy, and there is no sudden tear or large amount of fluid.",
      "clinicianReviewPrompt": "Ask an orthopaedic doctor or physiotherapist about exercises for the knee."
    },
    "impression": "Mild medial compartment knee osteoarthritis with marginal osteophytosis. Mild degenerative intrasubstance fraying of the medial meniscus posterior horn without acute displaced tear.",
    "measurements": [
      {
        "label": "Meniscus signal grade",
        "value": "1-2",
        "unit": ""
      }
    ],
    "recommendation": "Conservative management with quadriceps strengthening physiotherapy and orthopedic outpatient review.",
    "earlyDetection": {
      "targetDisease": "Early Knee Osteoarthritis & Meniscal Degeneration",
      "status": "Early Disease Detected (Grade 1-2)",
      "statusType": "teal",
      "stage": "Early Compartmental Osteoarthritis (Pre-Full Tear)",
      "indicators": [
        "Mild articular cartilage thinning over medial femoral condyle weight-bearing zone",
        "Early marginal osteophytes (bone spurs) along the medial joint line",
        "Grade 1-2 intrasubstance signal change in posterior horn of medial meniscus without displaced tear"
      ],
      "earlyIntervention": "Critical early non-surgical window: Quadriceps-strengthening physical therapy, low-impact exercise, and joint load management can preserve remaining cartilage and prevent meniscus tearing.",
      "preventionGuidance": "Weight optimization, avoiding repetitive high-impact knee twisting, and structured physical therapy to avoid premature joint replacement surgery.",
      "doctorQuestions": [
        "Can physical therapy and exercise reverse or freeze the cartilage thinning?",
        "Do I need specific knee support or hyaluronic acid/PRP injections at this early stage?",
        "Are there specific exercises I should avoid to protect my meniscus?"
      ]
    }
  },
  {
    "id": "RAD-SAMPLE-03",
    "examType": "Head CT (Non-Contrast)",
    "bodyRegion": "Head / Brain",
    "sampleDate": "02 Oct 2026",
    "statusBadge": "Review Advised",
    "statusColor": "amber",
    "reportText": "Non-contrast axial CT images of the head demonstrate a focal hyperdensity within the left basal ganglia measuring approximately 12 mm x 8 mm. There is minimal surrounding parenchymal hypoattenuation consistent with early peri-focal edema. No significant midline shift is observed (midline structures are centered). Ventricular system is symmetric without hydrocephalus. No evidence of calvarial fracture or extra-axial hematoma. Skull base is intact. Acute focal hyperdensity in the left basal ganglia measuring 12 x 8 mm, concerning for acute intraparenchymal hemorrhage or hyperdense thromboembolic vessel sign.",
    "matchingAnalysis": {
      "findingSummary": "A bright spot in the left deep brain. Doctor review advised.",
      "structuredFindings": [
        {
          "label": "Bright spot",
          "value": "About 12 mm x 8 mm (hyperdensity) in the left basal ganglia",
          "evidence": "Non-contrast axial CT images of the head demonstrate a focal hyperdensity within the left basal ganglia measuring approximately 12 mm x 8 mm."
        },
        {
          "label": "Nearby swelling",
          "value": "Mild early swelling around the spot",
          "evidence": "There is minimal surrounding parenchymal hypoattenuation consistent with early peri-focal edema."
        },
        {
          "label": "Midline",
          "value": "No significant shift; brain is centred",
          "evidence": "No significant midline shift is observed (midline structures are centered)."
        },
        {
          "label": "Fluid spaces",
          "value": "Symmetric, no hydrocephalus",
          "evidence": "Ventricular system is symmetric without hydrocephalus."
        },
        {
          "label": "Skull",
          "value": "No fracture or bleed outside the brain tissue",
          "evidence": "No evidence of calvarial fracture or extra-axial hematoma."
        }
      ],
      "plainLanguageExplanation": "The scan shows a bright spot, about 1.2 cm across, deep in the left side of the brain, in an area that helps control movement. The report says this could be a fresh bleed or a blocked blood vessel. It needs prompt review by a doctor or neurologist.",
      "clinicianReviewPrompt": "Ask a doctor or neurologist to review this report promptly.",
      "warning": {
        "summary": "The radiologist says the bright spot could be a fresh bleed or a blocked blood vessel. A doctor should review it promptly.",
        "evidence": "Acute focal hyperdensity in the left basal ganglia measuring 12 x 8 mm, concerning for acute intraparenchymal hemorrhage or hyperdense thromboembolic vessel sign."
      }
    },
    "impression": "Acute focal hyperdensity in the left basal ganglia measuring 12 x 8 mm, concerning for acute intraparenchymal hemorrhage or hyperdense thromboembolic vessel sign.",
    "measurements": [
      {
        "label": "Bright spot size",
        "value": "12 x 8",
        "unit": "mm"
      },
      {
        "label": "Midline shift",
        "value": "None significant",
        "unit": ""
      }
    ],
    "recommendation": "Immediate clinical and neurological review; urgent consideration of neurovascular imaging (CT angiography) per institutional stroke protocol.",
    "earlyDetection": {
      "targetDisease": "Acute Intraparenchymal Hemorrhage / Thromboembolic Stroke",
      "status": "Early Critical Acute Event Detected",
      "statusType": "amber",
      "stage": "Early Acute Bleed (12 x 8 mm) with Minimal Edema",
      "indicators": [
        "12 x 8 mm hyperdense focus in left basal ganglia",
        "Minimal early peri-focal edema indicating recent hyperacute onset",
        "Midline centered with symmetric ventricles (detected BEFORE midline shift or brain herniation)"
      ],
      "earlyIntervention": "Urgent neurovascular evaluation: Immediate blood pressure management, coagulation profile check, and emergency CT angiography (CTA) to arrest hematoma expansion.",
      "preventionGuidance": "Immediate hospital stroke unit admission; strict long-term hypertension and vascular risk control.",
      "doctorQuestions": [
        "Is immediate neurovascular imaging (CTA) indicated to check for an active bleed source or aneurysm?",
        "What is the target blood pressure range to prevent hematoma growth?",
        "Should antiplatelet or anticoagulant medications be stopped immediately?"
      ]
    }
  },
  {
    "id": "RAD-SAMPLE-04",
    "examType": "Upper Abdomen Ultrasound",
    "bodyRegion": "Abdomen & Pelvis",
    "sampleDate": "28 Aug 2026",
    "statusBadge": "Incomplete Study",
    "statusColor": "amber",
    "reportText": "Liver demonstrates normal anatomical dimensions and homogeneous parenchymal echotexture. No focal hepatic mass. Gallbladder is partially distended with acoustic shadowing from luminal debris, but wall thickness is difficult to evaluate due to overlying bowel gas. Pancreas is completely obscured by prominent overlying gastrointestinal gas. Spleen and both kidneys are visualized and appear within normal limits for age. No demonstrable free intraperitoneal fluid or ascites.",
    "matchingAnalysis": {
      "findingSummary": "Gas blocked the view of some organs.",
      "structuredFindings": [
        {
          "label": "Liver",
          "value": "Normal size and texture; no mass",
          "evidence": "Liver demonstrates normal anatomical dimensions and homogeneous parenchymal echotexture."
        },
        {
          "label": "Gallbladder",
          "value": "Wall could only be partly checked because of gas",
          "evidence": "Gallbladder is partially distended with acoustic shadowing from luminal debris, but wall thickness is difficult to evaluate due to overlying bowel gas."
        },
        {
          "label": "Pancreas",
          "value": "Could not be seen because of intestinal gas",
          "evidence": "Pancreas is completely obscured by prominent overlying gastrointestinal gas."
        },
        {
          "label": "Spleen and kidneys",
          "value": "Seen and within normal limits",
          "evidence": "Spleen and both kidneys are visualized and appear within normal limits for age."
        },
        {
          "label": "Free fluid",
          "value": "None seen in the abdomen",
          "evidence": "No demonstrable free intraperitoneal fluid or ascites."
        }
      ],
      "plainLanguageExplanation": "Gas in the intestines blocked the ultrasound, so the pancreas could not be seen and the gallbladder wall was only partly checked. The liver, spleen and kidneys looked normal. The report does not guess about the parts it could not see.",
      "clinicianReviewPrompt": "Ask your doctor whether a repeat scan is needed.",
      "incomplete": {
        "summary": "Parts of this scan could not be seen, so the report gives only a partial picture.",
        "points": [
          {
            "text": "The gallbladder wall was hard to check because of gas.",
            "evidence": "Gallbladder is partially distended with acoustic shadowing from luminal debris, but wall thickness is difficult to evaluate due to overlying bowel gas."
          },
          {
            "text": "The pancreas could not be seen at all.",
            "evidence": "Pancreas is completely obscured by prominent overlying gastrointestinal gas."
          }
        ]
      }
    },
    "impression": "Incomplete abdominal sonographic evaluation. Suboptimal visualization of gallbladder wall and non-visualization of the pancreas secondary to excessive bowel gas artifact.",
    "recommendation": "Consider repeat examination following 6-8 hours fasting, or cross-sectional imaging (contrast-enhanced CT abdomen) if symptoms persist.",
    "earlyDetection": {
      "targetDisease": "Early Biliary Sludge / Gallstones & Occult Pancreatic Risk",
      "status": "Early Biliary Pathology Detected",
      "statusType": "amber",
      "stage": "Early Subclinical Biliary Lithiasis (Gallbladder Luminal Debris)",
      "indicators": [
        "Acoustic shadowing from luminal debris in partially distended gallbladder",
        "Pancreatic non-visualization due to gas (creates early blind spot requiring follow-up)"
      ],
      "earlyIntervention": "Early dietary counseling (low dietary saturated fat), hydration, and scheduling a repeat fasting ultrasound or contrast-enhanced abdominal CT to evaluate the obscured pancreas.",
      "preventionGuidance": "Early nutritional intervention prevents gallbladder wall inflammation (acute cholecystitis) and common bile duct blockage (choledocholithiasis).",
      "doctorQuestions": [
        "Do the gallstones or debris indicate early cholecystitis?",
        "Should I get a fasting ultrasound or CT scan to clearly see my pancreas?",
        "Would dietary changes be enough to prevent gallbladder attacks?"
      ]
    }
  },
  {
    "id": "RAD-SAMPLE-05",
    "examType": "Follow-Up Chest CT",
    "bodyRegion": "Thorax / Lungs",
    "sampleDate": "10 Oct 2026",
    "statusBadge": "Stable Finding",
    "statusColor": "teal",
    "reportText": "Previously identified 4.2 mm solid, well-circumscribed subpleural nodule in the apical segment of the right upper lobe is re-demonstrated. It measures 4.3 mm on current series, demonstrating no significant volumetric growth over the 6-month interval. No new pulmonary nodules, consolidations, or ground-glass opacities identified. Pleural spaces remain clear without effusion or thickening. Mediastinal and hilar lymph nodes remain within normal size limits.",
    "matchingAnalysis": {
      "findingSummary": "A small lung nodule has stayed the same size.",
      "structuredFindings": [
        {
          "label": "Lung nodule",
          "value": "Now 4.3 mm (was 4.2 mm); no significant growth",
          "evidence": "It measures 4.3 mm on current series, demonstrating no significant volumetric growth over the 6-month interval."
        },
        {
          "label": "New spots",
          "value": "No new nodules, infection patches or hazy areas",
          "evidence": "No new pulmonary nodules, consolidations, or ground-glass opacities identified."
        },
        {
          "label": "Pleura",
          "value": "Clear, no fluid or thickening",
          "evidence": "Pleural spaces remain clear without effusion or thickening."
        },
        {
          "label": "Lymph nodes",
          "value": "Normal size",
          "evidence": "Mediastinal and hilar lymph nodes remain within normal size limits."
        }
      ],
      "plainLanguageExplanation": "This scan was compared with one from 6 months ago. A tiny spot, about 4 mm, in the upper right lung is the same size as before. In radiology, a spot that stays the same size over time is a reassuring sign.",
      "clinicianReviewPrompt": "Ask your doctor how often follow-up is needed.",
      "comparison": {
        "rows": [
          {
            "topic": "Right upper lobe nodule",
            "prior": "Solid, well-circumscribed 4.2 mm subpleural nodule in the apical segment of the right upper lobe.",
            "current": "It measures 4.3 mm on current series, demonstrating no significant volumetric growth over the 6-month interval."
          },
          {
            "topic": "Other lung findings",
            "prior": "No other pulmonary nodules, consolidations, or ground-glass opacities identified.",
            "current": "No new pulmonary nodules, consolidations, or ground-glass opacities identified."
          }
        ]
      }
    },
    "impression": "Stable 4.3 mm right upper lobe solitary pulmonary nodule with no interval growth compared to prior scan of 10 April 2026.",
    "measurements": [
      {
        "label": "Nodule size, prior (10 Apr 2026)",
        "value": "4.2",
        "unit": "mm"
      },
      {
        "label": "Nodule size, current (10 Oct 2026)",
        "value": "4.3",
        "unit": "mm"
      }
    ],
    "recommendation": "Routine follow-up per Fleischner Society guidelines for low-risk solid nodules < 6 mm (no further routine imaging required unless new clinical symptoms develop).",
    "priorReport": {
      "date": "10 Apr 2026",
      "reportText": "Solid, well-circumscribed 4.2 mm subpleural nodule in the apical segment of the right upper lobe. No other pulmonary nodules, consolidations, or ground-glass opacities identified. Pleural spaces are clear."
    },
    "earlyDetection": {
      "targetDisease": "Solitary Pulmonary Nodule (Early Lung Malignancy Surveillance)",
      "status": "Stable Indeterminate Nodule (Low Early Risk)",
      "statusType": "teal",
      "stage": "Sub-Centimeter (4.3 mm) Stable Nodule (Fleischner Criteria)",
      "indicators": [
        "4.3 mm solid, well-circumscribed right upper lobe subpleural nodule",
        "Confirmed volumetric stability over 6 months (was 4.2 mm, no significant growth)",
        "Absence of new nodules, ground-glass opacities, or lymph node enlargement"
      ],
      "earlyIntervention": "Continued non-invasive low-dose CT surveillance. Stability over 1-2 years reliably rules out aggressive early-stage lung cancer without invasive biopsy.",
      "preventionGuidance": "Smoking cessation, avoidance of radon/occupational toxins, and adhering strictly to scheduled follow-up interval scans.",
      "doctorQuestions": [
        "Does 6-month stability mean the nodule is likely benign (non-cancerous)?",
        "When should my next follow-up low-dose CT scan be scheduled under Fleischner guidelines?",
        "Are there any symptoms like cough or shortness of breath I should monitor closely?"
      ]
    }
  }
];

// Plain-language glossary. `keys` are lower-case fragments used to spot a term inside report text.
// Hindi and Kannada lines are demo translations; have a native speaker check them before real use.
const GLOSSARY = [
  {
    "term": "Consolidation",
    "category": "Chest / Lungs",
    "meaning": "An area in the lung that has filled with liquid or inflammatory cells instead of air, commonly seen during pneumonia or infection.",
    "hi": "फेफड़ों में तरल या बलगम का जमाव (कंसोलिडेशन)",
    "kn": "ಶ್ವಾಸಕೋಶದಲ್ಲಿ ದ್ರವ ಶೇಖರಣೆ",
    "keys": [
      "consolidation"
    ]
  },
  {
    "term": "Pleural Effusion",
    "category": "Chest / Lungs",
    "meaning": "Unusual fluid collecting in the space between the lung and the inside of the chest wall.",
    "hi": "फेफड़ों की झिल्ली के बीच पानी भरना (प्लूरल इफ्यूजन)",
    "kn": "ಶ್ವಾಸಕೋಶದ ಪದರಗಳ ನಡುವೆ ನೀರು ತುಂಬುವುದು",
    "keys": [
      "pleural effusion"
    ]
  },
  {
    "term": "Cardiothoracic Ratio (CTR)",
    "category": "Heart & Chest",
    "meaning": "The ratio of the heart’s width compared to the widest part of the inner chest cage. Normal is under 0.50 (50%).",
    "hi": "हृदय और सीने की चौड़ाई का अनुपात (सीटीआर)",
    "kn": "ಎದೆಯ ಅಗಲಕ್ಕೆ ಹೋಲಿಸಿದರೆ ಹೃದಯದ ಗಾತ್ರದ ಅನುಪಾತ",
    "keys": [
      "cardiothoracic ratio"
    ]
  },
  {
    "term": "Hyperdensity",
    "category": "Brain / Neuro",
    "meaning": "A bright area on a CT scan. Dense materials like fresh blood, metal, or bone stop more X-rays and show up bright white.",
    "hi": "सीटी स्कैन पर अधिक सफेद/चमकीला दिखना (हाइपरडेंसिटी)",
    "kn": "ಸಿಟಿ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಪ್ರಕಾಶಮಾನವಾಗಿ ಕಾಣುವ ಜಾಗ",
    "keys": [
      "hyperdensity"
    ]
  },
  {
    "term": "Midline Shift",
    "category": "Brain / Neuro",
    "meaning": "When pressure or swelling pushes the brain sideways across its normal central dividing line.",
    "hi": "मस्तिष्क का केंद्र रेखा से खिसकना (मिडलाइन शिफ्ट)",
    "kn": "ಮೆದುಳಿನ ಮಧ್ಯರೇಖೆಯ ಸ್ಥಾನಪಲ್ಲಟ",
    "keys": [
      "midline shift"
    ]
  },
  {
    "term": "Osteophytes",
    "category": "Joints & Bones",
    "meaning": "Smooth bone spurs that form over many years along worn joint edges as a natural protective response to wear-and-tear.",
    "hi": "जोड़ों के किनारों पर हड्डियों का बढ़ना (ऑस्टियोफाइट्स)",
    "kn": "ಕೀಲುಗಳ ಅಂಚಿನಲ್ಲಿ ಬೆಳೆಯುವ ಮೂಳೆ ಮುಳ್ಳುಗಳು",
    "keys": [
      "osteophyte"
    ]
  },
  {
    "term": "Medial Meniscus",
    "category": "Joints & Bones",
    "meaning": "A tough, C-shaped rubbery cushion on the inside half of your knee that absorbs shocks between the thigh and shin bones.",
    "hi": "घुटने के अंदर का कुशन (मीडियल मेनिस्कस)",
    "kn": "ಮೊಣಕಾಲಿನ ಒಳಗಿನ ರಬ್ಬರ್ ತರಹದ ಮೆತ್ತೆ",
    "keys": [
      "meniscus"
    ]
  },
  {
    "term": "Acoustic Shadowing",
    "category": "Ultrasound",
    "meaning": "A dark blind-spot band created on an ultrasound when sound waves cannot pass through dense gas or bone.",
    "hi": "अल्ट्रासाउंड तरंगों का गैस या पत्थर से रुकना (ध्वनिक छाया)",
    "kn": "ಅಲ್ಟ್ರಾಸೌಂಡ್ ಅಲೆಗಳು ಅನಿಲದಿಂದ ತಡೆಯಲ್ಪಡುವುದು",
    "keys": [
      "acoustic shadowing"
    ]
  },
  {
    "term": "Solitary Pulmonary Nodule",
    "category": "Chest / Lungs",
    "meaning": "A single, round spot on the lung under 3 cm in size, often an old scar from a minor past infection.",
    "hi": "फेफड़े पर एक छोटा गोल धब्बा (नोड्यूल)",
    "kn": "ಶ್ವಾಸಕೋಶದ ಮೇಲಿನ ಸಣ್ಣ ಗಂಟು ಅಥವಾ ಕಲೆ",
    "keys": [
      "pulmonary nodule"
    ]
  },
  {
    "term": "Suboptimal Visualization",
    "category": "General Radiology",
    "meaning": "The imaging doctor could not see the body part clearly due to patient movement, gas bubbles, or technical limitations.",
    "hi": "स्पष्ट रूप से दिखाई न देना (अपूर्ण दृश्यता)",
    "kn": "ಅಂಗಾಂಗಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸದೇ ಇರುವುದು",
    "keys": [
      "suboptimal"
    ]
  },
  {
    "term": "Pneumothorax",
    "category": "Chest / Lungs",
    "meaning": "Air that has leaked into the space between the lung and the chest wall.",
    "hi": "फेफड़े के बाहर हवा का जमाव (न्यूमोथोरैक्स)",
    "kn": "ಶ್ವಾಸಕೋಶದ ಹೊರಗೆ ಗಾಳಿ ಸಂಗ್ರಹ",
    "keys": [
      "pneumothorax"
    ]
  },
  {
    "term": "Shallow Inspiration",
    "category": "Chest / Lungs",
    "meaning": "The person did not breathe in deeply during the X-ray, so the lungs look smaller and denser.",
    "hi": "एक्स-रे के समय गहरी सांस न लेना",
    "kn": "ಎಕ್ಸ್-ರೇ ಸಮಯದಲ್ಲಿ ಆಳವಾದ ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳದಿರುವುದು",
    "keys": [
      "shallow inspiration"
    ]
  },
  {
    "term": "Hyperintensity",
    "category": "Brain / Neuro",
    "meaning": "A spot that looks brighter than the tissue around it on an MRI. It has many possible causes, so a doctor needs to interpret it.",
    "hi": "एमआरआई में आसपास से अधिक चमकीला धब्बा",
    "kn": "ಎಂಆರ್‌ಐನಲ್ಲಿ ಸುತ್ತಲಿಗಿಂತ ಪ್ರಕಾಶಮಾನವಾದ ಕಲೆ",
    "keys": [
      "hyperintensit"
    ]
  },
  {
    "term": "Subcortical White Matter",
    "category": "Brain / Neuro",
    "meaning": "The deeper part of the brain made of nerve fibres that connect different brain areas.",
    "hi": "मस्तिष्क का भीतरी सफेद पदार्थ",
    "kn": "ಮೆದುಳಿನ ಒಳಗಿನ ಬಿಳಿ ಭಾಗ",
    "keys": [
      "white matter"
    ]
  },
  {
    "term": "Restricted Diffusion",
    "category": "Brain / Neuro",
    "meaning": "A special MRI pattern that doctors check for. When a report says \"without\" it, that pattern was not seen.",
    "hi": "एमआरआई का एक विशेष पैटर्न जिसे डॉक्टर जांचते हैं",
    "kn": "ಎಂಆರ್‌ಐನಲ್ಲಿ ವೈದ್ಯರು ಪರಿಶೀಲಿಸುವ ವಿಶೇಷ ಮಾದರಿ",
    "keys": [
      "restricted diffusion"
    ]
  },
  {
    "term": "Mass Effect",
    "category": "Brain / Neuro",
    "meaning": "When something presses on or pushes nearby tissue. \"Without mass effect\" means nothing is described as pressing.",
    "hi": "आसपास के ऊतकों पर दबाव पड़ना",
    "kn": "ಸುತ್ತಲಿನ ಅಂಗಾಂಶದ ಮೇಲೆ ಒತ್ತಡ",
    "keys": [
      "mass effect"
    ]
  },
  {
    "term": "Ventricles",
    "category": "Brain / Neuro",
    "meaning": "Fluid-filled spaces inside the brain.",
    "hi": "मस्तिष्क के तरल से भरे स्थान",
    "kn": "ಮೆದುಳಿನ ದ್ರವ ತುಂಬಿದ ಜಾಗಗಳು",
    "keys": [
      "ventricles"
    ]
  },
  {
    "term": "Hepatic Steatosis",
    "category": "Abdomen",
    "meaning": "Extra fat stored in the liver, often called fatty liver. Grade 1 means mild.",
    "hi": "यकृत में अतिरिक्त वसा (फैटी लिवर)",
    "kn": "ಯಕೃತ್ತಿನಲ್ಲಿ ಹೆಚ್ಚುವರಿ ಕೊಬ್ಬು",
    "keys": [
      "steatosis"
    ]
  },
  {
    "term": "Echogenicity",
    "category": "Ultrasound",
    "meaning": "How bright a tissue looks on an ultrasound picture. Fatty tissue often looks brighter.",
    "hi": "अल्ट्रासाउंड में ऊतक कितना चमकीला दिखता है",
    "kn": "ಅಲ್ಟ್ರಾಸೌಂಡ್‌ನಲ್ಲಿ ಅಂಗಾಂಶ ಎಷ್ಟು ಪ್ರಕಾಶಮಾನವಾಗಿ ಕಾಣುತ್ತದೆ",
    "keys": [
      "echogenicity"
    ]
  },
  {
    "term": "Disc Space Narrowing",
    "category": "Joints & Bones",
    "meaning": "The cushion gap between two back bones (vertebrae) has become thinner, which can happen with age or wear.",
    "hi": "रीढ़ की हड्डियों के बीच की गद्दी का पतला होना",
    "kn": "ಬೆನ್ನುಮೂಳೆಗಳ ನಡುವಿನ ಮೆತ್ತೆ ತೆಳುವಾಗುವುದು",
    "keys": [
      "disc space narrowing"
    ]
  },
  {
    "term": "Osteoarthritis",
    "category": "Joints & Bones",
    "meaning": "Gradual wear of the smooth cartilage that cushions a joint.",
    "hi": "जोड़ की चिकनी कार्टिलेज का धीरे-धीरे घिसना (ऑस्टियोआर्थराइटिस)",
    "kn": "ಕೀಲಿನ ಕಾರ್ಟಿಲೇಜ್ ಕ್ರಮೇಣ ಸವೆಯುವುದು",
    "keys": [
      "osteoarthritis"
    ]
  },
  {
    "term": "Cruciate Ligaments (ACL/PCL)",
    "category": "Joints & Bones",
    "meaning": "Strong bands inside the knee that keep the joint stable.",
    "hi": "घुटने के अंदर की मजबूत पट्टियां जो जोड़ को स्थिर रखती हैं",
    "kn": "ಮೊಣಕಾಲನ್ನು ಸ್ಥಿರವಾಗಿಡುವ ಬಲವಾದ ಪಟ್ಟಿಗಳು",
    "keys": [
      "cruciate ligament"
    ]
  },
  {
    "term": "Basal Ganglia",
    "category": "Brain / Neuro",
    "meaning": "Deep brain areas that help control movement and balance.",
    "hi": "मस्तिष्क के गहरे हिस्से जो गति और संतुलन नियंत्रित करते हैं",
    "kn": "ಚಲನೆ ಮತ್ತು ಸಮತೋಲನ ನಿಯಂತ್ರಿಸುವ ಮೆದುಳಿನ ಆಳದ ಭಾಗ",
    "keys": [
      "basal ganglia"
    ]
  },
  {
    "term": "Edema",
    "category": "General Radiology",
    "meaning": "Swelling caused by extra fluid in body tissue.",
    "hi": "ऊतक में अतिरिक्त तरल से सूजन (एडिमा)",
    "kn": "ಅಂಗಾಂಶದಲ್ಲಿ ದ್ರವ ಸೇರಿ ಬರುವ ಊತ",
    "keys": [
      "edema"
    ]
  },
  {
    "term": "Bowel Gas",
    "category": "Ultrasound",
    "meaning": "Normal gas in the intestines. It can block ultrasound waves and hide organs behind it.",
    "hi": "आंतों की गैस, जो अल्ट्रासाउंड तरंगों को रोककर अंगों को छिपा सकती है",
    "kn": "ಕರುಳಿನ ಅನಿಲ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಅಲೆಗಳನ್ನು ತಡೆದು ಅಂಗಗಳನ್ನು ಮರೆಮಾಡಬಹುದು",
    "keys": [
      "bowel gas",
      "gastrointestinal gas"
    ]
  },
  {
    "term": "Ground-Glass Opacity",
    "category": "Chest / Lungs",
    "meaning": "A hazy area on a lung scan, like frosted glass, where air spaces are partly filled.",
    "hi": "फेफड़े के स्कैन में धुंधला क्षेत्र, घिसे हुए शीशे जैसा",
    "kn": "ಶ್ವಾಸಕೋಶ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಮಂಜಿನ ಗಾಜಿನಂತೆ ಕಾಣುವ ಮಬ್ಬು ಭಾಗ",
    "keys": [
      "ground-glass"
    ]
  }
];
