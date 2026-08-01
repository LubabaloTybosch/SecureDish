import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY environment variable is not set. Chat will operate in offline/mock mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Dashboard API Route
app.get("/api/dashboard", (req, res) => {
  res.json({
    supplyData: [
      { month: "Jan", grains: 78, vegetables: 85, dairy: 72, proteins: 68 },
      { month: "Feb", grains: 80, vegetables: 82, dairy: 74, proteins: 70 },
      { month: "Mar", grains: 76, vegetables: 88, dairy: 71, proteins: 65 },
      { month: "Apr", grains: 82, vegetables: 90, dairy: 76, proteins: 72 },
      { month: "May", grains: 85, vegetables: 92, dairy: 78, proteins: 74 },
      { month: "Jun", grains: 83, vegetables: 89, dairy: 80, proteins: 76 },
      { month: "Jul", grains: 79, vegetables: 86, dairy: 77, proteins: 71 },
      { month: "Aug", grains: 81, vegetables: 91, dairy: 79, proteins: 73 },
      { month: "Sep", grains: 84, vegetables: 93, dairy: 81, proteins: 75 },
      { month: "Oct", grains: 87, vegetables: 95, dairy: 83, proteins: 78 },
      { month: "Nov", grains: 86, vegetables: 94, dairy: 82, proteins: 77 },
      { month: "Dec", grains: 89, vegetables: 96, dairy: 85, proteins: 80 }
    ],
    riskAlerts: [
      {
        id: "1",
        title: "Drought Warning — East Africa",
        severity: "high",
        region: "East Africa",
        message: "Prolonged drought conditions expected to reduce cereal yields by 15-20% in the coming quarter.",
        status: "active",
        createdAt: "2026-07-18"
      },
      {
        id: "2",
        title: "Supply Chain Disruption — Southeast Asia",
        severity: "medium",
        region: "Southeast Asia",
        message: "Port congestion causing 10-day delays in rice shipments from major exporters.",
        status: "active",
        createdAt: "2026-07-17"
      },
      {
        id: "3",
        title: "Fertilizer Shortage — South America",
        severity: "high",
        region: "South America",
        message: "Reduced fertilizer availability may impact soybean production forecasts for next season.",
        status: "active",
        createdAt: "2026-07-16"
      },
      {
        id: "4",
        title: "Record Harvest — Western Europe",
        severity: "low",
        region: "Western Europe",
        message: "Wheat production exceeds projections by 8%, strengthening regional food security outlook.",
        status: "active",
        createdAt: "2026-07-15"
      },
      {
        id: "5",
        title: "Pest Infestation Risk — Central Asia",
        severity: "medium",
        region: "Central Asia",
        message: "Locust monitoring indicates elevated risk in steppe regions. Preventive measures recommended.",
        status: "active",
        createdAt: "2026-07-14"
      }
    ],
    quickStats: {
      totalSupplyIndex: 82,
      activeRisks: 3,
      regionsMonitored: 47,
      coursesCompleted: 12,
      courseProgress: [
        { id: "c1", title: "Sustainable Agriculture Basics", progress: 75, total: 8, completed: 6 },
        { id: "c2", title: "Supply Chain Resilience", progress: 40, total: 10, completed: 4 },
        { id: "c3", title: "Climate Adaptation Strategies", progress: 100, total: 6, completed: 6 }
      ]
    },
    regionData: [
      { region: "North America", supply: 91, trend: "up" },
      { region: "Europe", supply: 87, trend: "up" },
      { region: "East Africa", supply: 52, trend: "down" },
      { region: "South Asia", supply: 68, trend: "stable" },
      { region: "South America", supply: 74, trend: "down" },
      { region: "Southeast Asia", supply: 71, trend: "stable" }
    ]
  });
});

// 2. Courses API Route
app.get("/api/courses", (req, res) => {
  res.json({
    courses: [
      // Accredited Certificate Courses
      {
        id: "cert-hoof-health",
        title: "Sheep and Goat Hoof Health and Trimming Certificate",
        description: "Official QCTO-aligned certificate program covering small-stock hoof anatomy, lameness prevention, welfare responsibilities, and routine trimming practices.",
        category: "Livestock",
        duration: "3h 45m",
        lessonsCount: 8,
        thumbnail: "livestock",
        tier: "free",
        lessons: [
          {
            id: "hoof-m1",
            title: "Module 1: Introduction to Hoof Health",
            duration: "30m",
            order: 0,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 1: Introduction to Hoof Health

## Module Overview

Hoof health is one of the most important factors affecting the productivity, welfare, and profitability of sheep and goat enterprises. Healthy hooves allow animals to move freely in search of feed, water, shelter, and breeding opportunities. Poor hoof health can result in lameness, reduced feed intake, weight loss, lower reproduction rates, decreased milk production, and increased treatment costs.

This module introduces learners to the importance of hoof care in sheep and goat production systems. Learners will examine the economic impact of hoof disorders, understand their responsibilities regarding animal welfare, and become familiar with basic hoof health management practices used in South African farming operations.

---

## Learning Outcomes

By the end of this module, learners will be able to:

* Explain the importance of hoof health in sheep and goat production.
* Describe the impact of hoof disorders on animal welfare.
* Identify factors that contribute to healthy hoof development.
* Explain the economic consequences of lameness.
* Understand the role of preventative hoof care programmes.

---

# 1.1 Understanding Hoof Health

The hoof is the hard outer structure that protects the sensitive tissues of the foot. It supports the animal's body weight and allows movement across different terrains.

In healthy sheep and goats, hooves should:

* Be evenly shaped
* Have a smooth outer wall
* Show no cracks or deformities
* Allow the animal to walk comfortably
* Grow at a normal rate

When hooves become overgrown, infected, injured, or misshapen, the animal may experience pain and difficulty walking.

### Signs of Healthy Hooves

* Normal walking pattern
* Balanced hoof shape
* No foul odour
* No swelling
* No visible wounds
* Proper weight distribution

### Signs of Poor Hoof Health

* Limping
* Reluctance to move
* Swelling around the hoof
* Overgrown hoof walls
* Cracks and splits
* Heat in the hoof
* Discharge or infection

---

# 1.2 Importance of Hoof Health in Production

Healthy animals perform better.

Poor hoof health can affect:

## Growth Performance

Animals experiencing pain often spend less time grazing. Reduced feed intake results in slower growth and lower market weights.

## Reproduction

Lame animals may struggle to reach breeding areas and show reduced reproductive performance.

## Milk Production

Dairy goats suffering from hoof pain often produce less milk because they eat less and experience stress.

## Animal Welfare

Pain caused by hoof disorders negatively affects animal welfare and may lead to chronic suffering if not treated promptly.

---

# 1.3 Economic Impact of Lameness

Lameness is one of the most costly health problems in small-stock production.

### Direct Costs

* Veterinary treatment
* Medication
* Labour costs
* Hoof trimming expenses
* Additional management costs

### Indirect Costs

* Reduced weight gain
* Lower fertility
* Reduced milk production
* Increased culling
* Lower market value

### Example

A flock of 100 sheep with a 10% lameness rate may experience:

* Reduced grazing efficiency
* Increased treatment costs
* Lower lambing percentages
* Reduced profitability

Early intervention significantly reduces losses.

---

# 1.4 Causes of Hoof Problems

Many hoof problems develop due to management failures.

Common causes include:

## Environmental Factors

* Wet conditions
* Muddy pens
* Poor drainage
* Contaminated grazing areas

## Nutritional Factors

* Mineral deficiencies
* Poor-quality feed
* Sudden dietary changes

## Genetic Factors

Some animals are genetically predisposed to poor hoof quality.

## Management Factors

* Infrequent hoof inspections
* Poor biosecurity
* Delayed treatment
* Overcrowding

---

# 1.5 Animal Welfare and Legal Responsibilities

South African livestock producers have a responsibility to ensure the welfare of their animals.

Key welfare principles include:

### Freedom from Pain

Animals should be protected from avoidable pain and suffering.

### Freedom from Disease

Producers must implement disease prevention programmes.

### Access to Food and Water

Animals must have access to adequate nutrition and clean water.

### Appropriate Housing

Facilities should minimise injury risks and promote good hoof health.

Failure to manage hoof health appropriately may result in poor welfare outcomes and reduced productivity.

---

# 1.6 Preventative Hoof Care

Prevention is more effective and less costly than treatment.

A preventative hoof care programme includes:

### Regular Hoof Inspections

Animals should be inspected routinely for signs of overgrowth, injury, or infection.

### Scheduled Trimming

Routine trimming helps maintain proper hoof shape.

### Footbaths

Footbaths assist in reducing disease-causing organisms.

### Good Nutrition

Balanced diets support healthy hoof growth.

### Biosecurity Measures

New animals should be inspected before joining the flock or herd.

---

# Workplace Application

As a farm worker or livestock manager, you should:

1. Observe animals daily.
2. Identify signs of lameness early.
3. Report hoof problems immediately.
4. Follow farm biosecurity procedures.
5. Participate in routine hoof inspections.
6. Maintain treatment records.

---

# Practical Activity 1

### Hoof Health Observation Exercise

Visit a sheep or goat flock and observe at least 10 animals.

Record:

* Walking behaviour
* Signs of lameness
* Hoof condition
* Environmental conditions
* Possible risk factors

Prepare a short report summarising your findings.

---

# Knowledge Check

1. Why is hoof health important in sheep and goat production?
2. List five signs of poor hoof health.
3. Name three economic consequences of lameness.
4. Identify four causes of hoof disorders.
5. Explain why preventative hoof care is important.

---

# Module Summary

Healthy hooves are essential for productive and profitable sheep and goat farming. Hoof disorders can negatively affect growth, reproduction, milk production, and animal welfare. Effective hoof health management relies on early detection, preventative care, good nutrition, sound biosecurity practices, and routine inspections. Understanding these principles provides the foundation for learning hoof anatomy, disease identification, and trimming techniques in the modules that follow.

**Next Module:** *Hoof Anatomy and Physiology* (Module 2).`
          },
          {
            id: "hoof-m2",
            title: "Module 2: Hoof Anatomy and Physiology",
            duration: "35m",
            order: 1,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 2: Hoof Anatomy and Physiology

## Module Overview

A sound understanding of hoof anatomy and physiology is fundamental to effective hoof health management. Before a learner can safely trim hooves or identify abnormalities, they must understand how the hoof is constructed, how it functions, and how it grows. Incorrect trimming caused by poor anatomical knowledge can result in pain, excessive bleeding, infection, permanent lameness, or reduced animal productivity.

This module introduces the external and internal anatomy of sheep and goat hooves, explains hoof growth and wear, and examines the relationship between hoof structure, movement, weight distribution, and animal health. Learners will also compare sheep and goat hooves and recognise how environmental conditions, nutrition, genetics, and management practices influence hoof development.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Identify the external and internal structures of sheep and goat hooves.
* Explain the functions of each hoof structure.
* Describe the hoof growth process and factors influencing hoof development.
* Differentiate between normal and abnormal hoof conformation.
* Compare hoof characteristics of sheep and goats.
* Explain how nutrition and environmental conditions affect hoof quality.
* Apply anatomical knowledge when preparing for hoof trimming.

---

# 2.1 Introduction to Hoof Anatomy

The hoof is a specialised protective structure that surrounds and supports the end of each digit (toe). Sheep and goats are **cloven-hoofed animals**, meaning each foot consists of two separate claws that share the animal's body weight.

Each claw grows continuously throughout the animal's life and requires natural wear or periodic trimming to maintain its correct shape.

The hoof performs several essential functions:

* Supports body weight
* Protects bones, joints and soft tissues
* Provides traction on different surfaces
* Absorbs shock during movement
* Assists with balance and stability
* Enables efficient walking and grazing

Healthy hooves are essential for animal welfare and production.

---

# 2.2 External Hoof Anatomy

The external hoof consists of several distinct parts.

## Hoof Wall

The hoof wall is the hard outer layer that surrounds each claw.

Functions:

* Protects internal structures
* Bears most of the animal's weight
* Prevents injury
* Provides durability during movement

Healthy hoof walls should be:

* Smooth
* Hard
* Free from cracks
* Evenly shaped

---

## Sole

The sole forms the bottom surface of the hoof.

Functions include:

* Protecting internal tissues
* Supporting body weight
* Assisting with shock absorption

The sole should remain slightly concave and should never be excessively trimmed.

---

## Heel

The heel is located at the rear of each claw.

Functions:

* Absorbs impact
* Supports movement
* Assists with weight distribution

Collapsed or damaged heels often lead to poor mobility.

---

## Coronary Band

The coronary band is located where the skin meets the hoof wall.

It is responsible for producing new hoof horn.

Damage to the coronary band can permanently affect hoof growth.

---

## Interdigital Space

The interdigital space is the gap between the two claws.

This area is particularly susceptible to:

* Foot rot
* Scald
* Foreign objects
* Mud accumulation

Regular inspection is essential.

---

# 2.3 Internal Hoof Anatomy

Although internal structures cannot be seen during routine inspection, understanding them is essential for safe trimming.

## Coffin Bone (Distal Phalanx)

The coffin bone provides structural support inside the hoof.

Its position determines the correct hoof shape.

Improper trimming may expose or damage tissues surrounding this bone.

---

## Sensitive Laminae

The sensitive laminae attach the hoof wall to internal tissues.

Functions:

* Anchor the hoof wall
* Supply nutrients
* Support hoof growth

Damage causes pain and inflammation.

---

## Digital Cushion

The digital cushion is a soft tissue structure beneath the bones.

Functions:

* Absorbs shock
* Cushions movement
* Protects joints

---

## Blood Supply

Numerous blood vessels nourish hoof tissues.

Healthy circulation supports:

* Continuous hoof growth
* Tissue repair
* Disease resistance

Poor circulation may slow healing.

---

## Nerves

The hoof contains many sensory nerves.

Incorrect trimming into live tissue causes severe pain.

This is why only excess hoof horn should be removed.

---

# 2.4 Hoof Growth

The hoof grows continuously throughout the animal's life.

Average hoof growth depends on:

* Breed
* Nutrition
* Age
* Exercise
* Environment
* Health status

Growth occurs from the coronary band downward.

New horn gradually replaces older hoof tissue.

Under natural grazing conditions, hoof growth and wear are usually balanced.

In intensive farming systems, trimming is often required.

---

# 2.5 Factors Affecting Hoof Growth

## Nutrition

Good nutrition promotes strong hoof horn.

Important nutrients include:

* Protein
* Calcium
* Phosphorus
* Zinc
* Copper
* Biotin
* Manganese
* Vitamin A
* Vitamin D

Deficiencies may result in:

* Soft hooves
* Cracks
* Slow growth
* Weak horn

---

## Environment

Environmental conditions greatly influence hoof quality.

Wet conditions:

* Soften the hoof
* Increase disease risk
* Encourage bacterial growth

Dry, rocky terrain:

* Promotes natural hoof wear
* May increase cracking if excessively dry

Muddy pens increase infection risk.

Clean, well-drained housing supports hoof health.

---

## Exercise

Animals walking long distances usually develop stronger hooves.

Exercise improves:

* Blood circulation
* Natural hoof wear
* Muscle strength

Confined animals often require more frequent trimming.

---

## Genetics

Some breeds naturally develop:

* Stronger hoof horn
* Better hoof shape
* Greater disease resistance

Selective breeding can improve flock hoof health over time.

---

# 2.6 Sheep versus Goat Hooves

Although similar, sheep and goat hooves have important differences.

### Sheep

* More rounded claws
* Faster overgrowth on soft pasture
* More susceptible to foot rot
* Typically heavier body weight

### Goats

* Narrower claws
* Harder hoof horn
* Excellent climbing ability
* Better suited to rocky terrain

Because goats browse more and climb frequently, they often wear their hooves naturally.

However, goats kept in confined systems still require routine trimming.

---

# 2.7 Normal Hoof Conformation

Healthy hooves should have:

* Equal claw size
* Balanced weight distribution
* Straight hoof walls
* Appropriate heel height
* Slightly concave sole
* Clean interdigital space
* Smooth hoof surface

Proper conformation allows even weight bearing and efficient movement.

---

# 2.8 Abnormal Hoof Conformation

Common abnormalities include:

* Overgrown toes
* Curled hoof walls
* Long heels
* Uneven claws
* Cracked hoof walls
* Flat soles
* Deformed claws
* Scissor claws

These conditions may alter gait, increase injury risk, and predispose animals to disease.

---

# 2.9 Relationship Between Anatomy and Hoof Trimming

Understanding hoof anatomy enables safe trimming.

Correct trimming aims to:

* Restore normal hoof shape
* Balance both claws
* Remove only excess horn
* Preserve the sole
* Avoid cutting sensitive tissue
* Improve weight distribution

Poor trimming can cause:

* Bleeding
* Infection
* Pain
* Lameness
* Permanent hoof damage

---

# Workplace Application

Farm personnel should:

* Inspect hoof shape during routine health checks.
* Identify anatomical landmarks before trimming.
* Avoid removing healthy sole tissue.
* Observe gait for signs of abnormal weight distribution.
* Report structural abnormalities to supervisors or veterinarians.
* Maintain records of recurring hoof defects for breeding and management decisions.

---

# Practical Activity 2

### Hoof Anatomy Identification

Working in pairs:

1. Examine the front and rear feet of three sheep and three goats.
2. Identify the hoof wall, sole, heel, coronary band, and interdigital space.
3. Compare hoof shape between species.
4. Record observations on hoof condition and conformation.
5. Present findings to the facilitator.

---

# Practical Activity 3

### Hoof Growth Observation

Using photographs or live animals:

* Identify normal hoof growth.
* Identify excessive growth.
* Discuss possible causes.
* Recommend whether trimming is required.

Complete an inspection checklist for each animal.

---

# Knowledge Check

1. What is the primary function of the hoof wall?
2. Explain the role of the coronary band in hoof growth.
3. Why should the sole not be excessively trimmed?
4. List five nutrients important for healthy hoof development.
5. Describe three differences between sheep and goat hooves.
6. Explain how wet environmental conditions affect hoof health.
7. Identify four signs of abnormal hoof conformation.
8. Why is anatomical knowledge essential before performing hoof trimming?

---

# Module Summary

A thorough understanding of hoof anatomy and physiology is the foundation of safe and effective hoof care. The hoof is a complex structure that protects sensitive tissues, supports movement, and enables animals to graze efficiently. Continuous hoof growth requires a balance between natural wear and routine maintenance. Nutrition, genetics, environment, and management all influence hoof quality. Recognising normal anatomy and conformation allows learners to identify abnormalities early and prepare for safe hoof trimming. This knowledge forms the basis for diagnosing hoof disorders, which is the focus of **Module 3: Common Hoof Diseases and Disorders**.

**Next Module:** *Common Hoof Diseases and Disorders* (Module 3).`
          },
          {
            id: "hoof-m3",
            title: "Module 3: Common Hoof Diseases and Disorders",
            duration: "35m",
            order: 2,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 3: Common Hoof Diseases and Disorders

## Module Overview

Hoof diseases and disorders are among the most significant health challenges affecting sheep and goat production worldwide. They reduce animal welfare, lower productivity, increase veterinary and labour costs, and can result in substantial economic losses if left untreated. Early detection and appropriate intervention are essential to minimise the spread of infectious diseases and prevent permanent hoof damage.

This module equips learners with the knowledge and practical skills to recognise, assess, and manage common hoof diseases and disorders affecting sheep and goats in South Africa. Learners will study the causes, clinical signs, risk factors, treatment options, and preventative measures associated with infectious and non-infectious hoof conditions. The module also reinforces the importance of biosecurity, accurate diagnosis, record keeping, and timely reporting within flock and herd health management programmes.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Identify common hoof diseases and disorders affecting sheep and goats.
* Distinguish between infectious and non-infectious hoof conditions.
* Recognise the clinical signs associated with common hoof diseases.
* Explain the causes and risk factors contributing to hoof disorders.
* Recommend appropriate treatment and management options.
* Apply preventative strategies to reduce the occurrence of hoof diseases.
* Maintain accurate treatment and disease monitoring records.

---

# 3.1 Introduction to Hoof Diseases

A hoof disease is any condition that affects the normal structure or function of the hoof and results in pain, lameness, or reduced mobility. Hoof disorders may develop gradually or occur suddenly following injury or infection.

The most common causes include:

* Bacterial infections
* Poor hygiene
* Wet environmental conditions
* Overgrown hooves
* Trauma and injury
* Nutritional deficiencies
* Poor hoof trimming practices
* Genetic predisposition

Routine inspection enables early detection before diseases become severe.

---

# 3.2 Infectious Hoof Diseases

## Foot Rot

### Description

Foot rot is one of the most serious infectious hoof diseases affecting sheep and, less commonly, goats. It is caused by bacteria that invade damaged hoof tissue, particularly under wet and muddy conditions.

### Causes

* Wet pasture
* Muddy pens
* Damaged hoof horn
* Introduction of infected animals
* Poor biosecurity

### Clinical Signs

* Severe lameness
* Foul-smelling discharge
* Separation of the hoof wall
* Swelling between the claws
* Reduced grazing
* Weight loss

### Treatment

* Isolate affected animals.
* Trim loose or damaged hoof tissue carefully.
* Clean and disinfect the affected hoof.
* Use approved veterinary treatments as prescribed.
* Provide dry, clean housing.

### Prevention

* Maintain dry grazing areas where possible.
* Regular hoof inspections.
* Quarantine newly introduced animals.
* Routine footbaths where appropriate.
* Good flock biosecurity.

---

## Scald (Interdigital Dermatitis)

### Description

Scald is a bacterial infection affecting the skin between the claws. It often occurs before foot rot and is common during prolonged wet weather.

### Clinical Signs

* Red, inflamed skin
* Moist lesions
* Mild to moderate lameness
* Reluctance to walk

### Risk Factors

* Wet pasture
* Poor drainage
* Overstocking
* Dirty handling facilities

### Management

* Improve drainage.
* Move animals to dry areas.
* Clean affected feet.
* Follow veterinary advice regarding treatment.

Early treatment usually results in rapid recovery.

---

# 3.3 Non-Infectious Hoof Disorders

## Overgrown Hooves

### Description

Overgrown hooves occur when hoof growth exceeds natural wear.

### Causes

* Soft pasture
* Lack of exercise
* Delayed trimming
* Confinement

### Clinical Signs

* Curled hoof walls
* Uneven weight bearing
* Difficulty walking
* Dirt accumulation

### Management

Routine hoof trimming restores normal hoof shape.

---

## Hoof Cracks

Cracks may occur vertically or horizontally.

### Causes

* Dry conditions
* Trauma
* Nutritional deficiencies
* Poor trimming

### Signs

* Visible splits
* Pain during walking
* Bleeding (severe cases)

Small cracks should be monitored, while deeper cracks require veterinary attention.

---

## Hoof Abscess

### Description

An abscess is a localised bacterial infection beneath the hoof horn.

### Causes

* Penetrating injuries
* Stones
* Sharp objects
* Hoof damage

### Clinical Signs

* Sudden severe lameness
* Heat within the hoof
* Swelling
* Pain on pressure

### Treatment

Veterinary treatment is recommended to drain the abscess safely, clean the wound, and administer appropriate medication if necessary.

---

## Laminitis

### Description

Laminitis is inflammation of the sensitive tissues attaching the hoof wall to the underlying structures.

### Causes

* Nutritional imbalance
* Sudden dietary changes
* Metabolic disorders
* Excessive grain feeding

### Clinical Signs

* Pain
* Reluctance to stand
* Warm hooves
* Abnormal posture

### Prevention

* Introduce dietary changes gradually.
* Provide balanced nutrition.
* Avoid overfeeding concentrates.
* Monitor animals closely during dietary transitions.

---

# 3.4 Hoof Injuries

Hoof injuries can result from:

* Sharp stones
* Wire
* Nails
* Broken fencing
* Rough handling facilities

### Types of Injury

* Sole punctures
* Torn hoof wall
* Bruising
* Coronary band injuries
* Heel injuries

### Management

* Clean the wound.
* Remove foreign material where safe to do so.
* Apply appropriate disinfectant.
* Consult a veterinarian for severe injuries.
* Monitor healing and prevent secondary infection.

---

# 3.5 Risk Factors for Hoof Disease

Several management factors increase disease risk.

## Environmental Factors

* Wet conditions
* Mud
* Poor drainage
* Dirty housing
* High stocking density

## Nutritional Factors

* Zinc deficiency
* Copper deficiency
* Poor-quality forage
* Inadequate mineral supplementation

## Management Factors

* Poor trimming practices
* Delayed treatment
* Lack of foot inspections
* Inadequate record keeping
* Poor quarantine procedures

---

# 3.6 Disease Diagnosis

Correct diagnosis involves a systematic approach.

### Step 1: Observe the Animal

Look for:

* Limping
* Weight shifting
* Reluctance to move
* Kneeling while grazing

### Step 2: Restrain Safely

Use appropriate restraint techniques to minimise stress and ensure safety.

### Step 3: Examine the Hoof

Inspect:

* Hoof wall
* Sole
* Heel
* Coronary band
* Interdigital space

Check for:

* Swelling
* Heat
* Odour
* Cracks
* Discharge
* Foreign objects

### Step 4: Record Findings

Document:

* Animal identification
* Date
* Affected hoof
* Clinical signs
* Suspected diagnosis
* Treatment provided
* Follow-up actions

---

# 3.7 Treatment Principles

Effective treatment depends on:

* Early diagnosis
* Correct hoof trimming
* Appropriate veterinary advice
* Clean working conditions
* Isolation of infectious animals
* Good nutrition
* Monitoring recovery

Never administer restricted veterinary medicines without appropriate authorisation and always follow withdrawal periods where applicable.

---

# 3.8 Preventative Hoof Health Programme

A preventative programme should include:

* Routine hoof inspections
* Scheduled trimming
* Good nutrition
* Clean housing
* Effective drainage
* Regular footbaths when required
* Biosecurity measures
* Vaccination where recommended by a veterinarian
* Staff training
* Accurate record keeping

Preventative management is more effective and less costly than treating advanced disease.

---

# Workplace Application

Farm workers should:

* Inspect animals daily for signs of lameness.
* Report suspected hoof disease immediately.
* Follow farm biosecurity procedures.
* Clean and disinfect equipment between animals.
* Isolate animals with suspected infectious hoof diseases.
* Record all treatments accurately.
* Participate in routine flock health monitoring programmes.

---

# Practical Activity 1

## Hoof Disease Identification

Working in groups:

1. Examine photographs or live animals displaying various hoof conditions.
2. Identify the disease or disorder.
3. Describe the clinical signs observed.
4. Recommend an appropriate management response.
5. Present your findings to the class.

---

# Practical Activity 2

## Disease Investigation Case Study

Using a simulated farm scenario:

* Investigate a sudden increase in lameness.
* Identify possible causes.
* Assess environmental risk factors.
* Develop a disease control plan.
* Recommend biosecurity improvements.

Prepare a written report outlining your findings and recommendations.

---

# Practical Activity 3

## Hoof Examination Exercise

Under facilitator supervision:

* Safely restrain a sheep or goat.
* Conduct a complete hoof inspection.
* Identify any abnormalities.
* Complete a hoof health record sheet.
* Recommend appropriate follow-up actions.

---

# Knowledge Check

1. What is the difference between an infectious hoof disease and a non-infectious hoof disorder?
2. List five clinical signs of foot rot.
3. Explain how scald differs from foot rot.
4. What are four causes of overgrown hooves?
5. Identify three environmental factors that increase hoof disease risk.
6. Why is early diagnosis important?
7. Outline the steps involved in conducting a hoof examination.
8. List five components of an effective preventative hoof health programme.

---

# Module Summary

Common hoof diseases and disorders can have serious consequences for sheep and goat health, welfare, and farm profitability. Understanding the causes, clinical signs, and management of conditions such as foot rot, scald, hoof abscesses, laminitis, overgrown hooves, and traumatic injuries enables timely intervention and reduces the risk of long-term damage. Accurate diagnosis, effective treatment, sound biosecurity, and preventative management form the foundation of successful hoof health programmes. Learners who can recognise these conditions and respond appropriately contribute to healthier flocks, improved productivity, and compliance with South African livestock management standards.

**Next Module:** **Module 4 – Animal Handling and Welfare**.`
          },
          {
            id: "hoof-m4",
            title: "Module 4: Animal Handling and Welfare",
            duration: "30m",
            order: 3,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 4: Animal Handling and Welfare

## Module Overview

Safe animal handling is a fundamental skill in livestock production and an essential prerequisite for hoof inspection and trimming. Sheep and goats that are handled calmly and correctly experience less stress, reducing the risk of injury to both the animal and the handler. Poor handling practices can result in bruising, fractures, abortions in pregnant animals, reduced productivity, and compromised animal welfare.

This module provides learners with the knowledge and practical skills to safely handle, restrain, move, and examine sheep and goats while complying with South African animal welfare legislation, occupational health and safety (OHS) requirements, and farm biosecurity protocols. Learners will also understand animal behaviour, the Five Freedoms of Animal Welfare, and low-stress livestock handling techniques that support humane and efficient farm management.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the principles of animal welfare and ethical livestock management.
* Interpret sheep and goat behaviour to facilitate safe handling.
* Demonstrate safe handling and restraint techniques for sheep and goats.
* Apply occupational health and safety procedures during hoof trimming activities.
* Select and use appropriate handling equipment.
* Reduce stress and minimise injury during handling and restraint.
* Apply biosecurity procedures before, during, and after handling livestock.

---

# 4.1 Principles of Animal Welfare

Animal welfare refers to the physical and mental well-being of animals under human care. Good welfare ensures animals are healthy, comfortable, well-nourished, safe, and able to express normal behaviours.

In South Africa, livestock producers have a legal and ethical responsibility to care for animals humanely and prevent unnecessary pain and suffering.

Good animal welfare contributes to:

* Improved productivity
* Better reproductive performance
* Reduced disease incidence
* Improved meat and milk quality
* Reduced handling stress
* Lower mortality rates
* Greater public confidence in livestock production

---

# 4.2 The Five Freedoms of Animal Welfare

The internationally recognised Five Freedoms provide a framework for assessing animal welfare.

### Freedom from Hunger and Thirst

Animals must have continuous access to clean drinking water and a nutritionally balanced diet appropriate to their age, physiological status, and production stage.

### Freedom from Discomfort

Animals should be provided with suitable shelter, dry bedding where appropriate, shade, and protection from adverse weather conditions.

### Freedom from Pain, Injury and Disease

Regular health monitoring, preventative healthcare, prompt diagnosis, and timely treatment minimise suffering and improve productivity.

### Freedom to Express Normal Behaviour

Animals should have sufficient space, suitable housing, and opportunities to interact naturally with other animals.

### Freedom from Fear and Distress

Handling methods should minimise fear, stress, and unnecessary excitement.

---

# 4.3 Understanding Sheep and Goat Behaviour

Understanding natural behaviour enables handlers to move animals safely and efficiently.

## Sheep Behaviour

Sheep are prey animals and generally:

* Prefer to remain in groups (flocking instinct)
* Become stressed when isolated
* Follow familiar pathways
* Move away from perceived danger
* Are sensitive to loud noises and sudden movement

Because sheep have a strong flocking instinct, moving small groups is often easier than moving individual animals.

---

## Goat Behaviour

Goats differ from sheep in several ways.

They are generally:

* More curious
* More independent
* Better climbers
* More agile
* More willing to investigate unfamiliar objects
* Less likely to follow a flock automatically

Goats often require firmer but calm guidance during handling.

---

# 4.4 Flight Zone and Point of Balance

Successful livestock handling relies on understanding the animal's flight zone and point of balance.

## Flight Zone

The flight zone is the animal's personal space.

When a handler enters this area:

* The animal moves away.
* Stress levels increase.
* Sudden movements may cause panic.

Handlers should work at the edge of the flight zone to encourage calm movement.

---

## Point of Balance

The point of balance is usually located near the animal's shoulder.

When the handler stands:

* Behind the shoulder, the animal moves forward.
* In front of the shoulder, the animal usually moves backwards or stops.

Understanding this principle allows handlers to guide animals without excessive force.

---

# 4.5 Low-Stress Livestock Handling

Low-stress handling improves both welfare and productivity.

Good practices include:

* Moving slowly and quietly
* Avoiding shouting
* Avoiding sudden movements
* Using calm body language
* Allowing animals time to respond
* Keeping handling sessions short
* Avoiding overcrowding
* Working with the animals' natural behaviour

Poor handling increases stress hormones, reduces immune function, and may negatively affect growth and reproduction.

---

# 4.6 Safe Animal Restraint

Hoof trimming requires effective restraint to protect both the animal and the operator.

### Manual Restraint

Suitable for:

* Small goats
* Lambs
* Kids

The handler should support the animal while maintaining control of the head and body.

---

### Sitting Position (Sheep)

Adult sheep can often be restrained by carefully placing them in a sitting position on their rump.

Advantages include:

* Good access to all four feet
* Reduced struggling
* Lower injury risk
* Improved trimming efficiency

This technique must only be performed by trained personnel.

---

### Hoof Trimming Stand (Goats)

Goats are commonly restrained using trimming stands equipped with adjustable head gates.

Benefits include:

* Improved operator safety
* Reduced stress
* Better access to hooves
* Reduced handling time

---

### Handling Facilities

Facilities should include:

* Raceways
* Pens
* Crushes where appropriate
* Non-slip flooring
* Secure gates
* Adequate lighting
* Good ventilation

Poorly designed facilities increase stress and injury.

---

# 4.7 Occupational Health and Safety (OHS)

Handlers face several workplace hazards.

Common risks include:

* Kicks
* Head butting
* Slips and falls
* Cuts from trimming equipment
* Needle-stick injuries
* Lifting injuries
* Zoonotic diseases

---

## Personal Protective Equipment (PPE)

The following PPE should be worn:

* Safety boots
* Protective overalls
* Leather or nitrile gloves
* Eye protection when required
* Waterproof clothing during wet conditions

---

## Safe Lifting Techniques

When lifting lambs or kids:

* Bend the knees.
* Keep the back straight.
* Lift using leg muscles.
* Hold the animal close to the body.
* Avoid twisting while lifting.

Heavy adult animals should never be lifted manually without assistance or appropriate equipment.

---

# 4.8 Biosecurity During Handling

Disease transmission often occurs during animal handling.

Biosecurity measures include:

* Cleaning handling facilities regularly.
* Disinfecting hoof trimming tools between animals.
* Washing hands before and after handling.
* Wearing clean PPE.
* Isolating sick animals.
* Restricting unnecessary visitor access.
* Disinfecting trimming stands.

Good biosecurity reduces disease spread throughout the flock.

---

# 4.9 Preparing Animals for Hoof Trimming

Before trimming:

* Inspect the animal from a distance.
* Observe walking behaviour.
* Identify signs of lameness.
* Prepare trimming equipment.
* Clean the work area.
* Wear appropriate PPE.
* Secure the animal safely.
* Examine each hoof before trimming.

Preparation reduces stress and improves trimming accuracy.

---

# 4.10 Emergency Situations

If an animal becomes distressed:

* Stop handling immediately.
* Allow the animal to calm down.
* Check for injuries.
* Use additional assistance if required.
* Resume only when safe.

If a handler is injured:

* Stop work.
* Provide first aid.
* Report the incident.
* Record the injury according to workplace procedures.

Emergency procedures should be communicated to all staff before practical work begins.

---

# Workplace Application

During routine farm operations, workers should:

* Handle animals calmly and confidently.
* Move sheep and goats using their natural behaviour.
* Use approved restraint methods for hoof trimming.
* Wear appropriate PPE at all times.
* Clean and disinfect equipment between animals.
* Monitor animals after handling for signs of injury or stress.
* Record any incidents involving injury, illness, or abnormal behaviour.

---

# Practical Activity 1

## Observing Animal Behaviour

Working in small groups:

1. Observe a flock of sheep and a herd of goats.
2. Record behavioural differences.
3. Identify the flight zone and point of balance.
4. Discuss how behaviour influences handling techniques.

Present observations to the facilitator.

---

# Practical Activity 2

## Safe Animal Restraint

Under facilitator supervision:

* Demonstrate correct manual restraint of a lamb or kid.
* Demonstrate safe restraint of an adult sheep.
* Secure a goat using a trimming stand.
* Maintain control while minimising stress.
* Release the animal safely.

The facilitator will assess competency using a practical observation checklist.

---

# Practical Activity 3

## OHS and Biosecurity Inspection

Inspect a livestock handling area and identify:

* Potential safety hazards.
* Biosecurity risks.
* Inadequate equipment.
* Unsafe work practices.

Develop recommendations to improve safety and animal welfare.

---

# Practical Activity 4

## Pre-Trimming Preparation

Prepare a workstation for hoof trimming by:

* Selecting the correct tools.
* Wearing appropriate PPE.
* Cleaning and disinfecting equipment.
* Organising the work area.
* Conducting a pre-trimming inspection of the animal.

---

# Knowledge Check

1. Explain the Five Freedoms of Animal Welfare.
2. Describe three behavioural differences between sheep and goats.
3. What is the flight zone, and how can it be used to move livestock safely?
4. Explain the importance of the point of balance during animal handling.
5. List five examples of personal protective equipment used during hoof trimming.
6. Describe the correct procedure for restraining an adult sheep for hoof trimming.
7. Identify five biosecurity measures that should be followed during handling.
8. Explain why low-stress handling improves both animal welfare and farm productivity.

---

# Module Summary

Effective hoof care begins with safe, humane, and efficient animal handling. Understanding the natural behaviour of sheep and goats, applying the principles of the Five Freedoms, and using low-stress handling techniques reduce the risk of injury, improve animal welfare, and increase the efficiency of hoof trimming procedures. Proper restraint, occupational health and safety practices, and strict biosecurity measures protect both livestock and handlers while supporting compliance with South African agricultural standards. These competencies provide the practical foundation required for the next stage of training.

**Next Module:** **Module 5 – Hoof Trimming Equipment and Safety**, where learners will identify, maintain, and safely use hoof trimming tools and equipment in preparation for practical hoof trimming procedures.`
          },
          {
            id: "hoof-m5",
            title: "Module 5: Hoof Trimming Equipment and Safety",
            duration: "30m",
            order: 4,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 5: Hoof Trimming Equipment and Safety

## Module Overview

The correct selection, maintenance, and safe use of hoof trimming equipment are essential for maintaining hoof health and ensuring the welfare of sheep and goats. Well-maintained tools improve trimming accuracy, reduce animal stress, minimise the risk of injury, and enhance workplace efficiency. Conversely, poorly maintained or incorrectly used equipment can cause excessive bleeding, infection, permanent hoof damage, and serious injuries to both animals and handlers.

This module introduces learners to the various tools used in sheep and goat hoof trimming, their functions, proper maintenance, and safe operating procedures. Learners will also study occupational health and safety (OHS) principles, personal protective equipment (PPE), equipment sanitation, and biosecurity practices. By the end of this module, learners will be competent in selecting appropriate tools, maintaining them in good working condition, and using them safely in accordance with South African agricultural workplace standards and animal welfare requirements.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Identify and describe the purpose of common hoof trimming equipment.
* Select the appropriate tools for different hoof trimming tasks.
* Demonstrate correct cleaning, sharpening, and maintenance procedures.
* Apply occupational health and safety requirements when using hoof trimming equipment.
* Wear and maintain appropriate personal protective equipment (PPE).
* Disinfect tools and equipment to prevent disease transmission.
* Store equipment correctly to maintain serviceability and extend its lifespan.

---

# 5.1 Importance of Proper Equipment

Using the correct equipment is essential for safe and effective hoof trimming. High-quality, well-maintained tools enable precise trimming, reduce the time required to complete the task, and minimise discomfort for the animal.

Proper equipment contributes to:

* Improved animal welfare
* Accurate hoof trimming
* Reduced operator fatigue
* Lower risk of injury
* Better hygiene and biosecurity
* Increased equipment lifespan
* Improved workplace efficiency

Equipment should always be suitable for the size and age of the animal being treated.

---

# 5.2 Common Hoof Trimming Equipment

## Hoof Trimming Shears

Hoof trimming shears are designed to remove excess hoof horn quickly and efficiently.

### Uses

* Trimming overgrown hoof walls
* Shaping the hoof
* Removing loose horn

### Advantages

* Fast trimming
* Clean cuts
* Easy to control
* Suitable for routine maintenance

### Inspection Checklist

Before use, ensure that:

* Blades are sharp.
* Handles are secure.
* Pivot bolts are tight.
* No cracks or damage are present.
* The tool opens and closes smoothly.

---

## Hoof Knife

A hoof knife is used for detailed trimming and cleaning.

### Uses

* Cleaning the sole
* Removing loose horn
* Cleaning the interdigital space
* Trimming around lesions

### Safety Considerations

Always cut away from your body and keep fingers clear of the blade. Use controlled movements to avoid accidental injury.

---

## Hoof Nippers

Hoof nippers are heavy-duty cutting tools designed for thick or overgrown hoof walls.

### Uses

* Removing large amounts of hoof horn
* Initial trimming of severely overgrown hooves

### Safety Considerations

Use only when necessary and avoid removing excessive hoof horn in one cut.

---

## Hoof Rasp

A hoof rasp is used to smooth and level the hoof after trimming.

### Functions

* Remove rough edges
* Balance the hoof
* Create a flat weight-bearing surface

A well-finished hoof reduces pressure points and improves animal comfort.

---

## Hoof Pick

A hoof pick is used to remove dirt, stones, manure, and debris before inspection and trimming.

Cleaning the hoof first improves visibility and reduces the risk of contamination.

---

## Hoof Testing Forceps (Optional)

These specialised forceps are used by experienced personnel or veterinarians to identify painful areas within the hoof.

Improper use can cause unnecessary pain and should only be performed by trained individuals.

---

# 5.3 Supporting Equipment

Additional equipment commonly used includes:

* Goat hoof trimming stand
* Sheep handling race
* Head gate
* Footbath containers
* Disinfectant spray bottles
* Portable work table
* Lighting equipment
* First aid kit
* Waste disposal containers
* Tool storage box

These items contribute to safe, efficient, and hygienic hoof care operations.

---

# 5.4 Personal Protective Equipment (PPE)

Appropriate PPE protects workers from injury and reduces the risk of disease transmission.

Recommended PPE includes:

* Safety boots with non-slip soles
* Protective overalls
* Cut-resistant gloves
* Disposable nitrile gloves when treating infected hooves
* Safety glasses where debris may become airborne
* Waterproof apron when working in wet conditions

PPE should be inspected before use and replaced if damaged.

---

# 5.5 Equipment Inspection

Equipment must be inspected before and after each use.

### Inspection Checklist

Check for:

* Sharp blades
* Loose handles
* Worn cutting edges
* Rust or corrosion
* Broken springs
* Damaged locking mechanisms
* Cracks in metal components
* Cleanliness

Faulty equipment must be removed from service until repaired or replaced.

---

# 5.6 Cleaning and Disinfection

Cleaning removes organic matter, while disinfection destroys disease-causing microorganisms.

## Cleaning Procedure

1. Remove visible dirt and manure.
2. Wash tools using clean water and detergent.
3. Dry thoroughly.
4. Inspect for damage.

## Disinfection Procedure

After cleaning:

* Apply an approved disinfectant according to the manufacturer's instructions.
* Allow the recommended contact time.
* Rinse if required.
* Dry before storage.

Disinfect tools between animals when infectious hoof diseases are suspected to prevent disease spread.

---

# 5.7 Sharpening and Maintenance

Sharp tools make cleaner cuts, require less force, and reduce stress on the animal.

### Sharpening Guidelines

* Follow the manufacturer's recommendations.
* Maintain the correct blade angle.
* Use appropriate sharpening stones or files.
* Remove burrs after sharpening.
* Test sharpness safely before use.

Avoid over-sharpening, which can weaken the blade.

### Routine Maintenance

* Lubricate moving parts.
* Tighten screws and pivot bolts.
* Replace worn blades.
* Remove rust promptly.
* Store tools in a dry environment.

Regular maintenance extends equipment life and ensures reliable performance.

---

# 5.8 Safe Tool Handling

Incorrect use of hoof trimming tools can result in serious injury.

### General Safety Rules

* Inspect equipment before use.
* Wear appropriate PPE.
* Keep blades pointed away from the body.
* Maintain a firm grip on tools.
* Use controlled cutting motions.
* Never force a cut.
* Keep the work area tidy.
* Return tools to a safe location after use.

Never leave sharp tools unattended where they may cause injury.

---

# 5.9 Biosecurity and Equipment

Hoof trimming equipment can spread infectious diseases if not properly sanitised.

Biosecurity measures include:

* Cleaning and disinfecting tools between animals where disease is suspected.
* Using separate equipment for infected animals where practical.
* Wearing clean gloves.
* Cleaning trimming stands after each session.
* Disinfecting footbaths regularly.
* Properly disposing of contaminated waste.

Strict biosecurity protects the entire flock or herd.

---

# 5.10 Equipment Storage

Correct storage prevents damage and prolongs equipment life.

Equipment should be stored:

* In a clean, dry area.
* Away from moisture.
* In lockable toolboxes or cabinets.
* Out of reach of unauthorised persons.
* With blades protected by covers.
* After cleaning and lubrication.

Maintain an inventory of tools and schedule routine maintenance.

---

# Workplace Application

During routine hoof care, workers should:

* Select the correct tool for each task.
* Inspect tools before use.
* Wear appropriate PPE.
* Clean and disinfect equipment after each use.
* Report damaged tools immediately.
* Store equipment safely.
* Follow workplace OHS and biosecurity procedures.

---

# Practical Activity 1

## Tool Identification Exercise

Working in small groups:

1. Identify each hoof trimming tool.
2. Explain its purpose.
3. Demonstrate the correct method of holding and using it.
4. Discuss the advantages and limitations of each tool.

---

# Practical Activity 2

## Equipment Inspection

Inspect a complete hoof trimming kit.

Record:

* Equipment condition.
* Maintenance requirements.
* Safety hazards.
* Recommendations for repair or replacement.

Complete the inspection checklist provided.

---

# Practical Activity 3

## Cleaning and Disinfection

Demonstrate the correct procedure for:

* Cleaning hoof trimming tools.
* Applying disinfectant.
* Drying and lubricating equipment.
* Preparing tools for storage.

The facilitator will observe and assess compliance with hygiene and biosecurity standards.

---

# Practical Activity 4

## PPE Demonstration

Learners will:

* Select appropriate PPE for hoof trimming.
* Inspect PPE for defects.
* Correctly don and remove PPE.
* Explain how each item protects the user.

---

# Practical Activity 5

## Safe Tool Handling Simulation

Using training equipment or under supervision with live animals:

* Position tools correctly.
* Demonstrate safe cutting techniques.
* Maintain proper body posture.
* Pass tools safely to another operator.
* Return tools to storage after use.

---

# Knowledge Check

1. Why is it important to use sharp hoof trimming tools?
2. Describe the primary function of hoof trimming shears.
3. Explain the difference between cleaning and disinfection.
4. List five items of PPE required during hoof trimming.
5. What should be checked during a pre-use equipment inspection?
6. Why should tools be disinfected between animals when infectious disease is suspected?
7. Describe the correct method for storing hoof trimming equipment.
8. Explain how poor tool maintenance can affect animal welfare and operator safety.

---

# Module Summary

Safe and effective hoof trimming depends on the correct selection, maintenance, and use of appropriate equipment. Learners have explored the functions of common hoof trimming tools, the importance of routine inspection and maintenance, and the application of occupational health and safety and biosecurity principles. Proper cleaning, sharpening, disinfection, and storage of equipment reduce the risk of injury and disease transmission while supporting high standards of animal welfare and workplace efficiency. Mastery of these skills prepares learners for the practical application of hoof trimming techniques.

**Next Module:** **Module 6 – Practical Hoof Trimming Techniques**, where learners will apply their knowledge of hoof anatomy, animal handling, and equipment safety to perform routine hoof trimming on sheep and goats using industry-approved methods.`
          },
          {
            id: "hoof-m6",
            title: "Module 6: Practical Hoof Trimming Techniques",
            duration: "35m",
            order: 5,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 6: Practical Hoof Trimming Techniques

## Module Overview

Practical hoof trimming is one of the most important routine management practices in sheep and goat production. Correct hoof trimming promotes sound locomotion, improves animal welfare, reduces the incidence of hoof diseases, and enhances overall flock productivity. Conversely, poor trimming techniques can cause pain, bleeding, infection, lameness, and long-term damage to the hoof.

This module provides learners with the practical skills required to inspect, assess, and trim sheep and goat hooves safely and effectively. Building on the knowledge gained in previous modules, learners will apply correct restraint methods, use appropriate equipment, assess hoof condition, and perform routine hoof trimming using industry-approved techniques. Emphasis is placed on maintaining the natural shape of the hoof, protecting sensitive tissues, adhering to animal welfare standards, and following occupational health and safety (OHS) and biosecurity procedures throughout the trimming process.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Prepare animals and equipment for hoof trimming.
* Conduct a systematic hoof inspection before trimming.
* Demonstrate the correct hoof trimming procedure for sheep and goats.
* Maintain the natural hoof shape and correct weight distribution.
* Identify abnormalities requiring veterinary referral.
* Apply post-trimming care and monitor animals for complications.
* Complete hoof trimming records accurately and in accordance with workplace procedures.

---

# 6.1 Principles of Correct Hoof Trimming

The primary objective of hoof trimming is to restore the hoof to its natural shape while preserving healthy tissue. Trimming should improve balance, comfort, and movement without causing unnecessary pain or injury.

### Objectives of Hoof Trimming

* Remove excess hoof horn.
* Restore normal hoof balance.
* Improve weight distribution.
* Prevent hoof diseases.
* Reduce lameness.
* Improve mobility.
* Promote animal welfare.

### Key Principles

* Trim only dead or overgrown hoof horn.
* Preserve healthy sole tissue.
* Maintain equal claw length.
* Avoid excessive trimming.
* Work slowly and carefully.
* Stop immediately if bleeding occurs.

---

# 6.2 Preparing for Hoof Trimming

Proper preparation ensures efficient, safe, and hygienic trimming.

## Step 1: Prepare the Work Area

The trimming area should be:

* Clean and dry.
* Well-lit.
* Free from unnecessary distractions.
* Equipped with non-slip flooring.
* Organised to minimise movement.

## Step 2: Prepare Equipment

Before beginning:

* Inspect all trimming tools.
* Sharpen blades if necessary.
* Clean and disinfect equipment.
* Assemble PPE.
* Prepare disinfectants and first aid supplies.

## Step 3: Prepare the Animal

Observe the animal before restraint:

* Walking pattern.
* Signs of pain.
* Limb position.
* Behaviour.
* Body condition.

Any severely lame or distressed animal should be examined carefully before trimming begins.

---

# 6.3 Hoof Inspection

Every trimming procedure begins with a thorough inspection.

Examine:

* Hoof wall.
* Sole.
* Heel.
* Coronary band.
* Interdigital space.

Look for:

* Overgrowth.
* Cracks.
* Swelling.
* Heat.
* Odour.
* Foreign objects.
* Discharge.
* Injury.

Record all findings before trimming.

---

# 6.4 Correct Hoof Trimming Procedure

### Step 1: Restrain the Animal

Use an approved restraint method appropriate for the species and size of the animal.

Ensure:

* Minimal stress.
* Good access to the hoof.
* Handler safety.
* Animal stability.

---

### Step 2: Clean the Hoof

Using a hoof pick:

* Remove mud.
* Remove manure.
* Remove stones.
* Remove loose debris.

A clean hoof allows accurate assessment.

---

### Step 3: Inspect Again

After cleaning, inspect for:

* Infection.
* Cracks.
* Foreign bodies.
* Lesions.
* Sole thickness.
* Hoof balance.

Only begin trimming once the hoof has been fully assessed.

---

### Step 4: Trim the Hoof Wall

Using hoof shears or nippers:

* Remove small amounts of excess horn.
* Work gradually.
* Follow the natural contour of the hoof.
* Keep both claws balanced.

Never remove large sections in one cut.

---

### Step 5: Level the Sole

Use a hoof knife carefully to:

* Remove loose horn.
* Preserve healthy sole.
* Maintain a slight natural concavity.

Avoid cutting into live tissue.

---

### Step 6: Shape the Heel

Trim the heel only when necessary.

Ensure:

* Even height.
* Proper support.
* Balanced weight distribution.

Excessive heel removal may cause discomfort and instability.

---

### Step 7: Smooth the Hoof

Use a hoof rasp to:

* Remove rough edges.
* Create an even weight-bearing surface.
* Improve hoof balance.

A properly finished hoof reduces abnormal pressure points.

---

### Step 8: Final Inspection

Check:

* Hoof symmetry.
* Sole thickness.
* Heel height.
* Claw balance.
* Signs of bleeding.
* Animal comfort.

The animal should stand comfortably after trimming.

---

# 6.5 Correct Hoof Shape

A correctly trimmed hoof should have:

* Equal claw length.
* Flat weight-bearing surface.
* Slightly concave sole.
* Straight hoof wall.
* Balanced heel height.
* Clean interdigital space.

The natural shape should always be maintained.

---

# 6.6 Common Trimming Mistakes

Incorrect trimming can have serious consequences.

### Over-Trimming

Results in:

* Bleeding.
* Pain.
* Infection.
* Lameness.

### Uneven Claws

Causes:

* Poor weight distribution.
* Joint strain.
* Abnormal gait.

### Excessive Sole Removal

May expose sensitive tissue and increase susceptibility to infection.

### Dull Equipment

Requires excessive force, resulting in rough cuts and increased animal stress.

### Poor Animal Restraint

Increases the risk of injury to both the animal and the operator.

---

# 6.7 When Not to Trim

Routine trimming should be postponed if:

* The animal has a severe hoof injury requiring veterinary attention.
* There is extensive bleeding.
* A fracture is suspected.
* The animal is excessively distressed or unstable.
* A contagious disease outbreak requires isolation and veterinary guidance.

Seek veterinary advice where appropriate.

---

# 6.8 Post-Trimming Care

After trimming:

* Observe the animal walking.
* Check for bleeding.
* Apply disinfectant if required.
* Clean trimming equipment.
* Return the animal to a clean, dry environment.
* Monitor recovery over the following days.

Animals with severe lesions should receive follow-up inspections according to farm protocols.

---

# 6.9 Record Keeping

Accurate records assist with flock health management.

Record:

* Animal identification.
* Date of trimming.
* Hoof inspected.
* Findings.
* Treatment provided.
* Name of operator.
* Follow-up recommendations.

These records help identify recurring problems and support breeding and management decisions.

---

# Workplace Application

During routine hoof care, workers should:

* Inspect every hoof before trimming.
* Use approved trimming techniques.
* Follow OHS and biosecurity procedures.
* Avoid unnecessary removal of healthy horn.
* Refer complicated cases to supervisors or veterinarians.
* Monitor animals after trimming.
* Maintain complete and accurate records.

---

# Practical Activity 1

## Routine Hoof Trimming

Under facilitator supervision:

1. Prepare the work area.
2. Assemble equipment.
3. Restrain a sheep safely.
4. Clean each hoof.
5. Inspect the hoof.
6. Trim overgrown horn.
7. Smooth the hoof.
8. Conduct a final inspection.
9. Complete the trimming record.

Repeat the exercise using a goat.

---

# Practical Activity 2

## Identifying Trimming Errors

Using prepared hoof specimens or photographs:

Identify:

* Over-trimming.
* Uneven claws.
* Excessive heel removal.
* Poor balance.
* Incorrect hoof shape.

Recommend corrective actions.

---

# Practical Activity 3

## Hoof Balance Assessment

Working in pairs:

Inspect trimmed hooves and determine:

* Claw symmetry.
* Sole thickness.
* Heel balance.
* Weight distribution.
* Overall hoof quality.

Discuss findings with the facilitator.

---

# Practical Activity 4

## Post-Trimming Evaluation

Observe trimmed animals for:

* Normal walking.
* Weight-bearing.
* Signs of pain.
* Bleeding.
* Behaviour changes.

Complete a post-trimming monitoring form.

---

# Practical Activity 5

## Workplace Simulation

Complete a full hoof trimming procedure under realistic farm conditions, demonstrating:

* Safe preparation.
* Animal restraint.
* Hoof inspection.
* Correct trimming.
* Equipment cleaning.
* Record completion.
* Animal release.

Competence will be assessed using a QCTO practical observation checklist.

---

# Knowledge Check

1. What is the primary objective of routine hoof trimming?
2. Why is it important to inspect the hoof before trimming?
3. List the correct sequence of steps in a hoof trimming procedure.
4. Describe the characteristics of a correctly trimmed hoof.
5. What are four common hoof trimming mistakes?
6. When should hoof trimming be postponed?
7. Why is post-trimming observation important?
8. What information should be recorded after each trimming procedure?

---

# Module Summary

Routine hoof trimming is a practical skill that combines anatomical knowledge, careful observation, correct tool use, and sound animal handling practices. Effective trimming restores natural hoof shape, improves mobility, prevents disease, and supports the overall health and productivity of sheep and goats. Learners have practised the complete trimming process—from preparation and inspection to trimming, finishing, post-care, and record keeping—while applying occupational health and safety and biosecurity principles. Competence in these techniques forms the basis for effective hoof health management in commercial and smallholder farming systems.

**Next Module:** **Module 7 – Biosecurity and Disease Prevention**, where learners will explore strategies to prevent the introduction and spread of hoof diseases through effective hygiene, quarantine, sanitation, and flock health management practices.`
          },
          {
            id: "hoof-m7",
            title: "Module 7: Biosecurity and Disease Prevention",
            duration: "30m",
            order: 6,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 7: Biosecurity and Disease Prevention

## Module Overview

Biosecurity is a critical component of sheep and goat health management and plays a vital role in preventing the introduction, spread, and persistence of infectious hoof diseases within a flock or herd. Effective biosecurity practices reduce disease outbreaks, improve animal welfare, protect farm profitability, and support compliance with South African animal health legislation and industry standards.

This module provides learners with the knowledge and practical skills required to implement biosecurity measures before, during, and after hoof trimming activities. Learners will examine the principles of disease transmission, farm hygiene, quarantine procedures, sanitation protocols, visitor management, waste disposal, and disease surveillance. The module also emphasises the importance of preventative flock health programmes, accurate record keeping, and early reporting of suspected disease outbreaks. These practices contribute to sustainable livestock production and help maintain healthy, productive sheep and goat enterprises.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the principles and objectives of farm biosecurity.
* Identify the routes through which hoof diseases spread.
* Implement biosecurity measures during hoof trimming and routine livestock management.
* Demonstrate correct cleaning and disinfection procedures for equipment and facilities.
* Apply quarantine procedures for new and sick animals.
* Develop a preventative hoof disease management programme.
* Maintain biosecurity records and report disease outbreaks according to workplace procedures.

---

# 7.1 Introduction to Biosecurity

Biosecurity refers to the management practices used to prevent the introduction and spread of infectious diseases on a farm.

A good biosecurity programme protects:

* Livestock health
* Farm profitability
* Food safety
* Animal welfare
* Human health
* The surrounding agricultural community

Biosecurity is everyone's responsibility. Every employee, visitor, contractor, and livestock owner plays a role in protecting the farm from disease.

---

# 7.2 Objectives of Biosecurity

The primary objectives are to:

* Prevent diseases from entering the farm.
* Reduce disease transmission within the flock or herd.
* Protect healthy animals from infection.
* Improve production efficiency.
* Reduce veterinary and treatment costs.
* Support compliance with animal health regulations.
* Safeguard market access and consumer confidence.

---

# 7.3 Routes of Disease Transmission

Understanding how diseases spread is essential for preventing outbreaks.

## Direct Animal-to-Animal Contact

Diseases may spread through:

* Physical contact
* Shared grazing
* Crowded housing
* Breeding activities
* Mixing animals from different sources

Foot rot is commonly transmitted through direct contact between infected and healthy animals.

---

## Indirect Transmission

Diseases may also spread through contaminated:

* Hoof trimming tools
* Footbaths
* Clothing
* Boots
* Vehicles
* Handling equipment
* Feed and water troughs
* Bedding

Regular cleaning and disinfection reduce these risks.

---

## Environmental Transmission

Some disease-causing organisms survive in:

* Mud
* Wet soil
* Manure
* Standing water
* Damp bedding

Poor drainage and wet conditions increase the risk of hoof infections.

---

## Human Transmission

Workers and visitors may unintentionally spread disease by:

* Wearing contaminated footwear.
* Using unclean equipment.
* Handling infected animals before healthy animals.
* Failing to wash hands or change gloves.

Strict hygiene practices minimise this risk.

---

# 7.4 Farm Biosecurity Measures

Effective farm biosecurity combines multiple preventative measures.

## Controlled Farm Access

Restrict unnecessary visitors.

Maintain:

* Visitor register
* Designated parking area
* Controlled entry points
* Biosecurity signage

Visitors should follow farm hygiene procedures before entering livestock areas.

---

## Vehicle Biosecurity

Vehicles entering livestock areas should:

* Be clean before entry.
* Avoid contaminated areas.
* Use designated routes.
* Be disinfected when necessary.

Livestock transport vehicles require particular attention.

---

## Equipment Management

Equipment should:

* Be cleaned after use.
* Be disinfected before moving between groups of animals.
* Be stored in clean, dry conditions.
* Be inspected regularly for damage.

Where practical, separate equipment should be used for isolated animals.

---

# 7.5 Cleaning and Disinfection

Cleaning removes dirt and organic matter, while disinfection destroys disease-causing microorganisms.

## Cleaning Procedure

1. Remove visible manure and debris.
2. Wash using water and detergent.
3. Rinse thoroughly.
4. Dry equipment completely.

## Disinfection Procedure

After cleaning:

* Apply an approved disinfectant.
* Follow the manufacturer's recommended concentration and contact time.
* Allow equipment to dry before reuse.

Disinfectants are less effective when applied to dirty surfaces.

---

# 7.6 Footbath Management

Footbaths are an important component of preventative hoof care when used correctly.

A footbath should:

* Be positioned where animals walk through calmly.
* Be cleaned regularly.
* Contain the correct disinfectant concentration.
* Be replenished according to the manufacturer's instructions.
* Be protected from excessive contamination by mud and manure.

Animals should enter the footbath with reasonably clean feet for maximum effectiveness.

---

# 7.7 Quarantine Procedures

Newly purchased or returning animals may introduce infectious diseases.

Recommended quarantine procedures include:

* Isolate new animals from the main flock for an appropriate observation period according to veterinary advice and farm policy.
* Inspect hooves thoroughly.
* Monitor daily for signs of illness or lameness.
* Treat identified conditions before introduction.
* Use dedicated feeding and watering equipment where possible.
* Maintain separate handling equipment.

Animals should only join the main flock when they are healthy.

---

# 7.8 Isolation of Sick Animals

Animals showing signs of infectious hoof disease should be isolated immediately.

Isolation facilities should:

* Be clean and dry.
* Prevent direct contact with healthy animals.
* Have dedicated feeding equipment.
* Allow easy observation.
* Be cleaned and disinfected after use.

Isolation helps prevent disease transmission and facilitates treatment.

---

# 7.9 Waste Management

Proper disposal of contaminated materials prevents disease spread.

Dispose of:

* Hoof trimmings
* Used bandages
* Disposable gloves
* Contaminated bedding
* Sharps (where applicable)
* Veterinary waste

Waste should be managed according to farm procedures and applicable South African environmental and veterinary requirements.

---

# 7.10 Personal Hygiene

Workers should:

* Wash hands before and after handling animals.
* Change disposable gloves between infected animals where required.
* Clean and disinfect boots.
* Wear clean protective clothing.
* Cover open wounds.
* Avoid eating or drinking in animal handling areas.

Good personal hygiene protects both livestock and workers.

---

# 7.11 Disease Surveillance

Routine monitoring enables early detection of disease.

Farm workers should observe animals for:

* Lameness
* Swelling
* Foul odours
* Reluctance to move
* Reduced feed intake
* Weight loss
* Abnormal hoof growth

Early reporting enables rapid intervention.

---

# 7.12 Biosecurity Records

Accurate records assist disease control and traceability.

Maintain records of:

* New animal introductions
* Quarantine periods
* Hoof inspections
* Treatments administered
* Disease outbreaks
* Cleaning schedules
* Equipment maintenance
* Visitor access

Good documentation supports effective flock health management and informed decision-making.

---

# 7.13 Developing a Preventative Hoof Health Programme

A comprehensive hoof health programme should include:

* Routine hoof inspections.
* Scheduled hoof trimming.
* Balanced nutrition.
* Good drainage.
* Clean housing.
* Appropriate stocking densities.
* Vaccination programmes where recommended by a veterinarian.
* Regular parasite control.
* Staff training.
* Annual review of hoof health records.

Preventative management is more effective and economical than responding to advanced disease outbreaks.

---

# Workplace Application

During routine farm operations, workers should:

* Follow farm biosecurity protocols at all times.
* Inspect animals daily for signs of hoof disease.
* Disinfect hoof trimming tools before moving between infected and healthy animals.
* Maintain clean handling facilities.
* Report suspected disease immediately.
* Keep accurate treatment and inspection records.
* Participate in scheduled biosecurity training.

---

# Practical Activity 1

## Farm Biosecurity Audit

Working in small groups:

1. Inspect a sheep or goat production unit.
2. Identify potential biosecurity risks.
3. Assess handling facilities, housing, and equipment.
4. Recommend practical improvements.
5. Present findings to the facilitator.

---

# Practical Activity 2

## Cleaning and Disinfection Exercise

Under facilitator supervision:

* Clean hoof trimming equipment.
* Prepare an approved disinfectant solution according to the manufacturer's instructions.
* Disinfect tools and handling surfaces.
* Store equipment correctly after drying.

The facilitator will assess adherence to hygiene and safety procedures.

---

# Practical Activity 3

## Quarantine Planning Exercise

Develop a quarantine plan for introducing ten new goats to an existing herd.

The plan should include:

* Arrival procedures.
* Inspection schedule.
* Hoof examinations.
* Isolation arrangements.
* Monitoring activities.
* Criteria for release into the main herd.

---

# Practical Activity 4

## Disease Surveillance Simulation

Using a case study:

* Identify animals showing signs of hoof disease.
* Determine possible routes of transmission.
* Recommend immediate biosecurity actions.
* Complete a disease incident report.

---

# Knowledge Check

1. Define biosecurity and explain its importance in sheep and goat production.
2. List four routes through which hoof diseases may spread.
3. Explain the difference between cleaning and disinfection.
4. Describe the purpose of quarantine for newly introduced animals.
5. What information should be included in a hoof health record?
6. Why is it important to isolate animals with suspected infectious hoof diseases?
7. Identify five components of an effective preventative hoof health programme.
8. Explain how good personal hygiene contributes to disease prevention.

---

# Module Summary

Biosecurity is essential for preventing the introduction and spread of infectious hoof diseases in sheep and goat enterprises. Effective disease prevention relies on a combination of sound management practices, including controlled farm access, quarantine, cleaning and disinfection, proper waste disposal, personal hygiene, disease surveillance, and accurate record keeping. By implementing these measures consistently, farm workers help protect animal health, improve productivity, reduce treatment costs, and maintain compliance with South African animal health and welfare standards. A proactive biosecurity programme is a cornerstone of sustainable flock management and supports the long-term success of hoof health initiatives.

**Next Module:** **Module 8 – Record Keeping and Hoof Health Management Plans**, where learners will develop the skills to maintain accurate hoof health records, analyse herd and flock data, and implement structured hoof care programmes that support continuous improvement in livestock health and productivity.`
          },
          {
            id: "hoof-m8",
            title: "Module 8: Record Keeping and Hoof Health Management Plans",
            duration: "30m",
            order: 7,
            videoUrl: null,
            content: `# Sheep and Goat Hoof Health and Trimming Certificate

# Module 8: Record Keeping and Hoof Health Management Plans

## Module Overview

Accurate record keeping is an essential component of modern livestock management and a key requirement for effective hoof health programmes. Reliable records enable farmers and livestock managers to monitor animal health, evaluate treatment effectiveness, identify recurring hoof problems, improve breeding decisions, and comply with workplace procedures, quality assurance systems, and applicable South African animal health regulations. Well-maintained records also support traceability, disease surveillance, and informed management decisions that enhance productivity and animal welfare.

This module equips learners with the knowledge and practical skills to develop, maintain, and interpret hoof health records and implement preventative hoof management plans for sheep and goat enterprises. Learners will understand how to collect, analyse, and use information to improve flock performance, reduce disease incidence, and support continuous improvement within commercial, communal, and smallholder farming systems.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the importance of accurate record keeping in hoof health management.
* Complete hoof inspection, treatment, and trimming records accurately.
* Monitor hoof health trends within a flock or herd.
* Develop a preventative hoof health management plan.
* Analyse hoof health data to support management decisions.
* Maintain records in accordance with workplace and quality assurance requirements.
* Recommend improvements based on recorded hoof health information.

---

# 8.1 Importance of Record Keeping

Record keeping provides valuable information for managing the health and productivity of livestock. Accurate records help identify problems early, monitor progress, and evaluate whether management practices are effective.

Good records support:

* Improved animal welfare
* Better disease control
* Increased productivity
* Reduced treatment costs
* Better breeding decisions
* Improved labour planning
* Regulatory compliance
* Farm profitability

Without accurate records, management decisions are often based on assumptions rather than evidence.

---

# 8.2 Types of Hoof Health Records

Several types of records should be maintained as part of a hoof health programme.

## Animal Identification Records

Each animal should have a unique identification number or mark.

Information may include:

* Ear tag number
* Breed
* Sex
* Date of birth
* Age
* Ownership
* Production group

Correct identification ensures that treatments and observations are linked to the correct animal.

---

## Hoof Inspection Records

Routine hoof inspections should record:

* Date of inspection
* Animal identification
* Hoof examined
* Hoof condition
* Signs of lameness
* Presence of disease
* Observations made
* Name of inspector

Regular inspections enable early detection of problems.

---

## Hoof Trimming Records

Every trimming procedure should be documented.

Include:

* Date
* Animal identification
* Hoof trimmed
* Reason for trimming
* Trimming method used
* Abnormal findings
* Operator's name
* Follow-up recommendations

These records assist in monitoring recurring hoof issues.

---

## Treatment Records

Treatment records should contain:

* Diagnosis
* Medication or treatment administered
* Dosage (where applicable)
* Date of treatment
* Person administering treatment
* Follow-up inspection date
* Outcome of treatment

Accurate treatment records support effective disease management and responsible medicine use.

---

## Mortality and Culling Records

Where hoof-related problems contribute to culling or mortality, records should include:

* Animal identification
* Date
* Reason for culling or death
* Veterinary findings (if available)
* Management recommendations

Analysing these records helps identify long-term management issues.

---

# 8.3 Hoof Health Monitoring

Monitoring involves collecting information over time to identify patterns and trends.

Indicators to monitor include:

* Number of lame animals
* Frequency of hoof trimming
* Common diseases
* Recovery rates
* Repeat treatments
* Seasonal disease occurrence
* Hoof growth patterns

Trend analysis enables proactive management before problems become widespread.

---

# 8.4 Analysing Hoof Health Data

Recorded information should be reviewed regularly to answer important management questions, such as:

* Which animals require frequent trimming?
* Which diseases occur most often?
* Are certain paddocks associated with higher disease incidence?
* Are treatment protocols effective?
* Do seasonal changes influence hoof health?

Simple tables, charts, or spreadsheets can be used to summarise information and support decision-making.

---

# 8.5 Developing a Hoof Health Management Plan

A hoof health management plan provides a structured approach to maintaining healthy animals.

A typical plan should include:

## Farm Objectives

Examples:

* Reduce lameness within the flock.
* Improve animal welfare.
* Minimise hoof disease outbreaks.
* Increase productivity.

---

## Routine Inspection Schedule

Routine inspections should specify:

* Frequency of inspections
* Responsible personnel
* Inspection procedures
* Reporting process

High-risk animals should be monitored more frequently.

---

## Trimming Programme

The programme should identify:

* Animals requiring routine trimming
* Trimming frequency
* Responsible personnel
* Equipment requirements
* Biosecurity procedures

---

## Disease Prevention Strategy

Include:

* Footbath programme
* Quarantine procedures
* Vaccination programme (where recommended by a veterinarian)
* Housing hygiene
* Drainage improvements
* Nutritional management

---

## Emergency Response Plan

The plan should outline actions to be taken when:

* An infectious hoof disease is detected.
* Multiple animals become lame.
* Severe injuries occur.
* Veterinary assistance is required.

Emergency contact details should be readily available.

---

# 8.6 Record Storage and Confidentiality

Records should be:

* Accurate
* Complete
* Legible
* Secure
* Accessible to authorised personnel
* Updated regularly

Electronic record systems should be backed up regularly, while paper records should be stored safely to prevent loss or damage.

---

# 8.7 Continuous Improvement

Record keeping supports continuous improvement by allowing farmers to evaluate management practices and identify opportunities for improvement.

Examples include:

* Adjusting trimming schedules.
* Improving drainage in high-risk areas.
* Enhancing nutrition.
* Reviewing biosecurity procedures.
* Providing additional staff training.
* Selecting breeding stock with sound hoof characteristics.

Regular review meetings encourage a culture of continuous learning and improvement.

---

# Workplace Application

During routine farm operations, workers should:

* Record every hoof inspection accurately.
* Document all trimming procedures.
* Record treatments immediately after administration.
* Report recurring hoof problems to supervisors.
* Update flock health records regularly.
* Review hoof health trends with management.
* Follow workplace documentation procedures.

---

# Practical Activity 1

## Completing Hoof Health Records

Using a practical case study:

1. Inspect assigned animals.
2. Record hoof condition.
3. Identify abnormalities.
4. Complete a hoof inspection form.
5. Submit records for facilitator review.

---

# Practical Activity 2

## Developing a Hoof Health Management Plan

Working in groups, develop a management plan for a flock of 150 sheep or 80 goats.

The plan should include:

* Inspection schedule
* Trimming programme
* Biosecurity measures
* Disease monitoring procedures
* Record-keeping system
* Staff responsibilities

Present the plan to the class and justify your recommendations.

---

# Practical Activity 3

## Data Analysis Exercise

Using sample farm records:

* Calculate the percentage of lame animals.
* Identify recurring hoof diseases.
* Determine which animals required repeated treatments.
* Recommend management improvements based on the data.

---

# Practical Activity 4

## Record Audit

Review a set of completed hoof health records and identify:

* Missing information
* Recording errors
* Inconsistencies
* Opportunities for improvement

Discuss how accurate records support effective livestock management.

---

# Sample Hoof Inspection Record

| Animal ID | Date | Hoof Examined | Condition Observed | Action Taken | Follow-up Date | Inspector |
| --- | --- | --- | --- | --- | --- | --- |
| SG-001 | 15/08/20XX | Front Left | Overgrown hoof wall | Trimmed | 15/11/20XX | J. Smith |
| SG-018 | 15/08/20XX | Rear Right | Early signs of foot rot | Isolated and referred for treatment | 22/08/20XX | J. Smith |
| SG-027 | 15/08/20XX | All four hooves | Healthy | No action required | Next routine inspection | J. Smith |

---

# Knowledge Check

1. Why is accurate record keeping important in hoof health management?
2. List five types of hoof health records maintained on a livestock farm.
3. What information should be included in a hoof trimming record?
4. Explain how hoof health records support disease prevention.
5. What are the key components of a hoof health management plan?
6. How can data analysis improve flock management decisions?
7. Why should records be stored securely and updated regularly?
8. Describe three examples of continuous improvement based on hoof health records.

---

# Module Summary

Effective record keeping is the foundation of proactive hoof health management. Accurate records enable livestock managers to monitor animal health, evaluate treatment outcomes, identify disease trends, and implement targeted improvements that enhance productivity and animal welfare. By developing structured hoof health management plans and maintaining reliable documentation, learners can support informed decision-making, strengthen biosecurity programmes, and improve the long-term sustainability of sheep and goat enterprises. Competence in these skills ensures that hoof care becomes an integrated part of overall flock management rather than a reactive response to disease.

---

# Course Completion

Upon successful completion of all eight modules, learners will have demonstrated competence in:

* Understanding sheep and goat hoof anatomy and physiology.
* Identifying and managing common hoof diseases and disorders.
* Applying safe animal handling and welfare practices.
* Selecting, maintaining, and safely using hoof trimming equipment.
* Performing routine hoof trimming using industry-approved techniques.
* Implementing effective biosecurity and disease prevention measures.
* Maintaining accurate hoof health records and management plans.
* Applying occupational health and safety principles throughout hoof care activities.

Successful learners will be prepared to perform routine hoof health management in commercial, communal, and smallholder farming systems under workplace conditions, in accordance with QCTO occupational standards, South African animal welfare legislation, and recognised best practices in livestock production. This certificate also provides a strong foundation for further learning in sheep and goat production, animal health, and livestock management.`
          }
        ]
      },
      {
        id: "c1",
        title: "Sustainable Agriculture Fundamentals",
        description: "Official QCTO-aligned course covering environmentally responsible, economically viable, and socially acceptable farming practices, soil conservation, water management, climate-smart agriculture, and farm planning.",
        category: "Agriculture",
        duration: "4h 05m",
        lessonsCount: 8,
        thumbnail: "agriculture",
        tier: "free",
        lessons: [
          {
            id: "l1",
            title: "Module 1: Introduction to Sustainable Agriculture",
            duration: "30m",
            order: 0,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 1: Introduction to Sustainable Agriculture

## Module Overview

Agriculture is essential for food security, economic development, and rural livelihoods in South Africa. However, conventional farming practices such as excessive tillage, overgrazing, poor water management, and the overuse of chemical inputs can lead to soil degradation, water pollution, biodiversity loss, and reduced agricultural productivity. Sustainable agriculture provides an approach to farming that balances environmental stewardship, economic viability, and social responsibility, ensuring that current food production does not compromise the ability of future generations to meet their own needs.

This module introduces learners to the principles of sustainable agriculture, the concept of the "triple bottom line," and the role of sustainable farming in addressing climate change, food security, and natural resource conservation. Learners will explore the South African agricultural landscape, the challenges facing the sector, and the opportunities created through sustainable farming practices. The module also introduces key legislation, occupational health and safety (OHS), and the importance of ethical farming practices.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Define sustainable agriculture and explain its importance within the South African context.
* Describe the three pillars of sustainability and their relationship to agriculture.
* Identify environmental, economic, and social challenges affecting agricultural sustainability.
* Explain the principles of responsible natural resource management.
* Recognise the role of sustainable agriculture in achieving food security and climate resilience.
* Identify relevant South African legislation and industry standards supporting sustainable agriculture.
* Demonstrate an understanding of occupational health, safety, and environmental responsibilities on a farm.

---

# 1.1 What is Sustainable Agriculture?

Sustainable agriculture is a farming approach that aims to produce sufficient food, fibre, and other agricultural products while protecting the environment, supporting economic growth, and improving the well-being of farming communities.

Unlike conventional farming, which may prioritise short-term production, sustainable agriculture focuses on long-term productivity by conserving natural resources and reducing environmental impacts.

The internationally recognised definition of sustainable development comes from the **Brundtland Report (1987)**:

> "Development that meets the needs of the present without compromising the ability of future generations to meet their own needs."

In agriculture, this means producing food efficiently while maintaining healthy soils, clean water, biodiversity, and resilient farming systems.

---

# 1.2 The Three Pillars of Sustainability

Sustainable agriculture is built on three interconnected pillars.

## Environmental Sustainability

Environmental sustainability focuses on protecting natural resources and ecosystems.

Key objectives include:

* Conserving soil fertility
* Protecting water resources
* Reducing pollution
* Conserving biodiversity
* Minimising greenhouse gas emissions
* Preventing land degradation

### Practical Examples

* Using cover crops to reduce soil erosion.
* Harvesting rainwater for irrigation.
* Planting windbreaks to protect crops.
* Applying integrated pest management (IPM).

---

## Economic Sustainability

Economic sustainability ensures that farming enterprises remain profitable and financially resilient.

Key objectives include:

* Increasing productivity
* Improving resource-use efficiency
* Reducing unnecessary costs
* Diversifying farm income
* Managing financial risks
* Supporting long-term business viability

### Practical Examples

* Reducing fertiliser wastage through soil testing.
* Using precision irrigation to save water and energy.
* Diversifying crops to reduce market risks.

---

## Social Sustainability

Social sustainability focuses on the well-being of farmers, workers, families, and rural communities.

Key objectives include:

* Fair labour practices
* Safe working conditions
* Skills development
* Community participation
* Gender equality
* Food security
* Ethical treatment of workers and animals

### Practical Examples

* Providing employees with appropriate PPE.
* Offering regular agricultural training.
* Promoting equal employment opportunities.
* Supporting local food production initiatives.

---

# 1.3 Principles of Sustainable Agriculture

Although farming systems vary, sustainable agriculture is generally based on the following principles:

### Resource Conservation

Natural resources such as soil, water, and biodiversity should be managed responsibly to ensure their long-term availability.

### Efficiency

Farm inputs including fertilisers, pesticides, water, fuel, and labour should be used efficiently to reduce waste and improve profitability.

### Biodiversity Protection

Maintaining a diversity of crops, livestock, insects, and natural habitats strengthens ecosystem resilience and reduces pest and disease risks.

### Climate Resilience

Farming systems should be able to adapt to changing weather patterns, droughts, floods, and other climate-related challenges.

### Continuous Improvement

Sustainable farming requires ongoing monitoring, evaluation, and adaptation to improve environmental, economic, and social outcomes.

---

# 1.4 Agriculture in South Africa

South Africa has a highly diverse agricultural sector due to its varied climate, soils, and landscapes.

Major agricultural enterprises include:

* Field crop production
* Horticulture
* Livestock farming
* Mixed farming
* Forestry
* Aquaculture

Agriculture contributes significantly to:

* National food security
* Employment
* Rural development
* Export earnings
* Economic growth

However, the sector faces numerous sustainability challenges.

---

# 1.5 Challenges Facing South African Agriculture

Several factors threaten the long-term sustainability of agriculture.

## Climate Change

Climate change contributes to:

* Higher temperatures
* Increased drought frequency
* Flooding
* Changing rainfall patterns
* Extreme weather events

These conditions affect crop yields, livestock production, and water availability.

---

## Soil Degradation

Unsustainable farming practices may result in:

* Soil erosion
* Loss of organic matter
* Nutrient depletion
* Soil compaction
* Salinisation

Healthy soils are essential for sustainable production.

---

## Water Scarcity

South Africa is classified as a water-scarce country.

Agriculture is the largest user of freshwater resources, making efficient water management essential.

Poor irrigation practices can result in:

* Water wastage
* Waterlogging
* Salinity
* Reduced productivity

---

## Biodiversity Loss

Habitat destruction, invasive alien species, pollution, and excessive chemical use threaten biodiversity.

Loss of biodiversity reduces ecosystem services such as:

* Pollination
* Natural pest control
* Soil formation
* Water purification

---

## Economic Pressures

Farmers must also respond to:

* Rising input costs
* Market fluctuations
* Labour shortages
* Infrastructure challenges
* Disease outbreaks

Sustainable management helps improve resilience against these pressures.

---

# 1.6 Sustainable Farming Practices

Examples of sustainable farming practices include:

* Crop rotation
* Conservation tillage
* Integrated pest management
* Organic matter management
* Rotational grazing
* Water harvesting
* Efficient irrigation
* Agroforestry
* Composting
* Renewable energy adoption

These practices often improve both environmental performance and long-term profitability.

---

# 1.7 Sustainable Development Goals (SDGs)

The **United Nations Sustainable Development Goals (SDGs)** provide a global framework for sustainable development.

Agriculture contributes directly to several SDGs, including:

* **SDG 2:** Zero Hunger
* **SDG 6:** Clean Water and Sanitation
* **SDG 8:** Decent Work and Economic Growth
* **SDG 12:** Responsible Consumption and Production
* **SDG 13:** Climate Action
* **SDG 15:** Life on Land

Farmers play an important role in achieving these goals through responsible resource management.

---

# 1.8 South African Legislation and Standards

Sustainable agriculture operates within a legal framework designed to protect natural resources, workers, and consumers.

Key legislation includes:

* National Environmental Management Act (NEMA)
* Conservation of Agricultural Resources Act (CARA)
* National Water Act
* Occupational Health and Safety Act
* Fertilizers, Farm Feeds, Agricultural Remedies and Stock Remedies Act
* Animal Diseases Act (where livestock are involved)

Farmers must understand and comply with applicable legal requirements.

---

# 1.9 Occupational Health, Safety and Environmental Responsibility

Sustainable farming includes protecting workers from workplace hazards.

Common agricultural hazards include:

* Machinery
* Chemicals
* Dust
* Heat stress
* Livestock injuries
* Slippery surfaces

Workers should:

* Wear appropriate PPE.
* Follow safe work procedures.
* Report hazards immediately.
* Handle chemicals responsibly.
* Protect water sources from contamination.

Safe workplaces improve productivity and reduce injuries.

---

# 1.10 The Role of Farmers in Sustainability

Farmers are custodians of natural resources.

Their responsibilities include:

* Conserving soil and water
* Protecting biodiversity
* Producing safe food
* Managing waste responsibly
* Caring for livestock humanely
* Supporting local communities
* Complying with environmental legislation

Responsible farming ensures that agricultural land remains productive for future generations.

---

# Workplace Application

During workplace activities, learners should:

* Identify sustainable and unsustainable farming practices on the farm.
* Observe how soil, water, and biodiversity are managed.
* Record examples of resource conservation measures.
* Discuss opportunities to improve farm sustainability with supervisors.
* Follow all workplace health, safety, and environmental procedures.

---

# Practical Activity 1

## Farm Sustainability Assessment

Visit a farm or agricultural training site and evaluate its sustainability practices.

Assess:

* Soil management
* Water use
* Waste management
* Biodiversity conservation
* Energy use
* Animal welfare (where applicable)

Prepare a short report identifying strengths and areas for improvement.

---

# Practical Activity 2

## Sustainability Mapping Exercise

Working in groups:

1. Draw a simple farm map.
2. Identify natural resources such as rivers, wetlands, grazing areas, and cultivated land.
3. Highlight environmental risks.
4. Recommend sustainable management practices for each area.

Present your findings to the class.

---

# Practical Activity 3

## Environmental Observation Walk

Conduct a guided walk around a farm and identify examples of:

* Soil erosion
* Water conservation
* Indigenous vegetation
* Invasive alien plants
* Wildlife habitats
* Sustainable farming practices

Record observations using a field checklist.

---

# Practical Activity 4

## Case Study Discussion

Analyse a case study describing a farm experiencing declining soil fertility and water shortages.

Discuss:

* Causes of the problem.
* Environmental impacts.
* Economic consequences.
* Sustainable solutions.

Prepare recommendations for improving long-term farm sustainability.

---

# Knowledge Check

1. Define sustainable agriculture.
2. Explain the three pillars of sustainability.
3. Identify five challenges affecting South African agriculture.
4. List six sustainable farming practices.
5. Why is biodiversity important in agriculture?
6. Explain the importance of efficient water management.
7. Name four pieces of South African legislation that support sustainable agriculture.
8. Describe the responsibilities of farmers in protecting natural resources.

---

# Module Summary

Sustainable agriculture is a holistic approach that balances environmental protection, economic viability, and social responsibility. By conserving natural resources, improving resource-use efficiency, protecting biodiversity, and adopting climate-smart farming practices, farmers can increase productivity while safeguarding the environment for future generations. In South Africa, sustainable agriculture is essential for addressing challenges such as climate change, water scarcity, soil degradation, and food insecurity. Understanding these principles provides the foundation for all subsequent modules, beginning with the management of one of agriculture's most valuable resources—healthy soil.

**Next Module:** **Module 2 – Soil Health and Conservation**, where learners will examine soil formation, soil fertility, erosion control, conservation practices, and methods for maintaining productive agricultural soils.`
          },
          {
            id: "l2",
            title: "Module 2: Soil Health and Conservation",
            duration: "30m",
            order: 1,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 2: Soil Health and Conservation

## Module Overview

Soil is a living, non-renewable natural resource that underpins all agricultural production. Healthy soil provides nutrients, anchors roots, stores water, and harbors millions of beneficial microorganisms. In South Africa, soil degradation and erosion threaten agricultural productivity. Module 2 provides learners with practical methods to assess soil texture, build soil organic matter, control erosion, and implement conservation tillage practices.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Apply soil conservation techniques to improve fertility, reduce erosion, and maintain long-term productivity.
* Describe soil formation, soil structure, and key physical, chemical, and biological properties.
* Identify causes and signs of soil erosion and compaction.
* Implement conservation tillage, cover cropping, and crop rotation strategies.
* Interpret basic soil test results and apply organic soil amendments effectively.

---

# 2.1 Soil Formation and Composition

Soil consists of four main components:

* **Mineral particles** (sand, silt, clay) ~ 45%
* **Organic matter** (humus, decaying matter, roots, soil organisms) ~ 5%
* **Water** (soil solution carrying dissolved nutrients) ~ 25%
* **Air** (gases essential for root and microbial respiration) ~ 25%

---

# 2.2 Soil Erosion and Prevention

Soil erosion involves the detachment and transport of topsoil by wind or water.

### Primary Causes:

* Overgrazing and vegetation removal
* Excessive tillage and soil disturbance
* Unprotected slopes and poor contour management
* Heavy rainfall events on bare ground

### Prevention Techniques:

* **Contour Farming**: Planting along contour lines to reduce water runoff velocity.
* **Cover Cropping**: Keeping the soil surface covered year-round with vegetative cover.
* **Mulching**: Applying organic material (straw, leaves) to reduce evaporation and impact from rain drops.
* **Terracing**: Constructing stepped levels on steep hillsides.

---

# 2.3 Conservation Agriculture Practices

1. **Minimal Mechanical Soil Disturbance**: Zero-till or minimum-till practices that preserve soil structure and earthworm channels.
2. **Permanent Soil Cover**: Retaining crop residues on fields after harvest.
3. **Diversified Crop Rotations**: Alternating grass crops, legumes, and brassicas to break pest cycles and enrich soil nitrogen.

---

# 2.4 Soil Organic Matter and Composting

Soil organic matter (SOM) improves soil structure, water infiltration, cation exchange capacity (CEC), and nutrient retention.

### Composting Steps:

1. Combine carbon-rich "browns" (straw, dry leaves) and nitrogen-rich "greens" (manure, green plant cuttings) at roughly a 30:1 C:N ratio.
2. Maintain adequate moisture (like a wrung-out sponge).
3. Turn the pile regularly to provide oxygen and accelerate decomposition.
4. Apply mature, dark, earthy-smelling compost to crop beds and orchards.

---

# Practical Activities

1. **Soil Texture and Ribbon Test**: Conduct field-based hand-feeling texture tests (sand, loam, clay ribboning) and visual soil assessments.
2. **Soil Conservation Plan**: Draft a contour-mapping and cover-crop plan for an erosion-prone plot.
3. **Compost Application**: Demonstrate correct compost turning, moisture checking, and soil incorporation methods.

---

# Knowledge Check

1. List the four main components of healthy soil and their approximate percentage volumes.
2. Explain how cover crops protect soil from water and wind erosion.
3. Describe the three core principles of Conservation Agriculture (CA).
4. What is the ideal Carbon to Nitrogen (C:N) ratio range for building a compost pile?

---

# Module Summary

Healthy soil is the foundation of sustainable agriculture. By adopting conservation tillage, cover crops, and organic matter additions, farmers restore soil fertility, prevent erosion, and create resilient growing conditions for crops and pastures.

**Next Module:** **Module 3 – Water Resource Management**, where learners will study water cycle dynamics, efficient irrigation, and rainwater harvesting.`
          },
          {
            id: "l3",
            title: "Module 3: Water Resource Management",
            duration: "30m",
            order: 2,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 3: Water Resource Management

## Module Overview

Water is one of the most valuable natural resources in agriculture and is essential for crop production, livestock health, food security, and ecosystem sustainability. South Africa is classified as a water-scarce country, making efficient water management a national priority. Increasing demand for water, climate change, prolonged droughts, pollution, and poor water management practices place significant pressure on agricultural production. Sustainable water management ensures that water resources are used efficiently while protecting rivers, wetlands, dams, groundwater, and surrounding ecosystems for future generations.

This module introduces learners to the principles of agricultural water resource management, water conservation, irrigation systems, water quality, rainwater harvesting, drainage, and climate-smart water management practices. Learners will develop the practical skills required to use water efficiently, minimise wastage, protect water resources, and implement sustainable irrigation strategies in accordance with South African agricultural best practices and environmental legislation.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the importance of water in sustainable agricultural production.
* Describe the water cycle and its influence on farming systems.
* Identify different sources of agricultural water.
* Apply water conservation and efficient irrigation practices.
* Assess water quality for agricultural use.
* Implement rainwater harvesting and drainage management systems.
* Develop a basic farm water management plan.

---

# 3.1 Importance of Water in Agriculture

Water is essential for all agricultural enterprises. It supports plant growth, livestock production, soil health, and food processing.

Water is required for:

* Crop irrigation
* Livestock drinking water
* Cleaning equipment and facilities
* Mixing agricultural chemicals
* Cooling livestock
* Food processing
* Maintaining biodiversity

Efficient water use improves productivity while reducing production costs and environmental impacts.

---

# 3.2 The Water Cycle

The water cycle is the continuous movement of water through the environment.

The main stages include:

### Evaporation

Water changes from liquid to vapour due to heat from the sun.

### Condensation

Water vapour cools and forms clouds.

### Precipitation

Water returns to the earth as rain, hail, or snow.

### Infiltration

Water moves into the soil and replenishes groundwater.

### Runoff

Water flows over the land into rivers, dams, and wetlands.

### Transpiration

Plants release water vapour through their leaves.

Understanding the water cycle helps farmers plan irrigation and conserve water effectively.

---

# 3.3 Sources of Agricultural Water

Agricultural water may come from several sources.

### Rainfall

Rainfall is the primary source of water for rain-fed agriculture.

Advantages:

* Low cost
* Natural replenishment

Limitations:

* Seasonal variation
* Drought risk
* Unpredictable distribution

---

### Surface Water

Includes:

* Rivers
* Dams
* Lakes
* Reservoirs

Surface water often requires permits and careful management to ensure sustainable use.

---

### Groundwater

Groundwater is accessed through:

* Boreholes
* Wells
* Springs

Groundwater is generally reliable but should be monitored to prevent over-abstraction.

---

### Harvested Rainwater

Rainwater can be collected from roofs and other surfaces for storage and later agricultural use.

Benefits include:

* Reduced dependence on municipal or surface water
* Improved drought resilience
* Lower water costs

---

# 3.4 Water Requirements of Crops and Livestock

Different agricultural enterprises have different water requirements.

Factors affecting crop water needs include:

* Crop type
* Growth stage
* Soil type
* Temperature
* Humidity
* Wind speed
* Rainfall

Livestock require adequate quantities of clean drinking water to maintain:

* Growth
* Reproduction
* Milk production
* Feed intake
* Animal welfare

Water shortages reduce productivity and increase stress.

---

# 3.5 Water Conservation

Water conservation aims to reduce wastage while maintaining agricultural productivity.

Effective conservation practices include:

* Repairing leaks promptly.
* Monitoring water use.
* Scheduling irrigation efficiently.
* Applying mulch to reduce evaporation.
* Improving soil organic matter.
* Harvesting rainwater.
* Planting drought-tolerant crops.
* Using efficient irrigation systems.

Conserving water improves both environmental sustainability and farm profitability.

---

# 3.6 Irrigation Systems

Selecting the correct irrigation system improves water-use efficiency.

## Surface Irrigation

Water flows across the soil surface.

Advantages:

* Low installation cost
* Simple operation

Limitations:

* Higher water losses
* Uneven water distribution

---

## Sprinkler Irrigation

Water is sprayed over crops using pressurised systems.

Advantages:

* Uniform application
* Suitable for many crops

Limitations:

* Higher energy requirements
* Evaporation losses during hot or windy conditions

---

## Drip Irrigation

Water is delivered directly to the root zone through emitters.

Advantages:

* High water-use efficiency
* Reduced evaporation
* Lower weed growth
* Improved fertiliser efficiency

This is one of the most water-efficient irrigation systems available.

---

## Micro-Irrigation

Small volumes of water are applied frequently to specific areas around plants.

Benefits include:

* Efficient water use
* Reduced runoff
* Improved plant growth
* Suitable for orchards and vegetable production

---

# 3.7 Irrigation Scheduling

Irrigation should be based on crop requirements rather than fixed schedules.

Factors to consider include:

* Soil moisture
* Weather conditions
* Crop growth stage
* Rainfall forecasts
* Evapotranspiration
* Soil type

Over-irrigation wastes water and may lead to waterlogging, nutrient leaching, and disease.

---

# 3.8 Water Quality

Water quality directly affects crop growth, livestock health, and irrigation equipment.

Important water quality indicators include:

* pH
* Salinity
* Turbidity
* Microbial contamination
* Chemical contamination
* Dissolved oxygen (where applicable)

Poor-quality water may reduce crop yields and increase soil salinity.

Regular testing helps identify potential problems.

---

# 3.9 Rainwater Harvesting

Rainwater harvesting involves collecting and storing rainwater for later use.

Common systems include:

* Roof collection systems
* Storage tanks
* Farm dams
* Small reservoirs

Benefits include:

* Increased water availability
* Reduced dependence on external water sources
* Improved drought preparedness
* Reduced runoff and erosion

Harvested water should be stored in clean, well-maintained facilities.

---

# 3.10 Drainage Management

Good drainage prevents waterlogging and maintains healthy soil conditions.

Poor drainage can result in:

* Root diseases
* Oxygen deficiency
* Nutrient loss
* Soil salinity
* Reduced crop growth

Drainage systems may include:

* Surface drains
* Subsurface drains
* Contour drains
* Grassed waterways

Regular maintenance is essential for effective drainage.

---

# 3.11 Climate-Smart Water Management

Climate change requires farmers to use water more efficiently.

Climate-smart practices include:

* Conservation agriculture
* Mulching
* Efficient irrigation technologies
* Drought-resistant crop varieties
* Rainwater harvesting
* Soil moisture monitoring
* Agroforestry
* Improved grazing management

These practices improve resilience to drought and changing weather patterns.

---

# 3.12 Water Legislation in South Africa

Water resources are regulated to ensure equitable and sustainable use.

Relevant legislation includes:

* National Water Act
* National Environmental Management Act (NEMA)
* Conservation of Agricultural Resources Act (CARA)

Farmers are responsible for:

* Using water responsibly.
* Preventing pollution.
* Protecting rivers and wetlands.
* Complying with water-use authorisations where required.
* Conserving water resources.

---

# Workplace Application

During workplace activities, learners should:

* Monitor irrigation systems for leaks and inefficiencies.
* Observe crop and livestock water requirements.
* Assess water quality using approved methods.
* Recommend practical water conservation measures.
* Record daily water use and report excessive consumption.

---

# Practical Activity 1

## Farm Water Audit

Conduct a water audit on a farm.

Record:

* Water sources
* Areas of water use
* Estimated daily consumption
* Water losses
* Opportunities to improve efficiency

Prepare recommendations for reducing water wastage.

---

# Practical Activity 2

## Irrigation System Evaluation

Inspect an irrigation system and assess:

* Uniformity of water application
* Leaks
* Pressure
* Equipment condition
* Water-use efficiency

Recommend maintenance and improvements.

---

# Practical Activity 3

## Water Quality Assessment

Collect water samples from a farm water source.

Measure or observe:

* pH
* Clarity
* Odour
* Visible contamination

Discuss how water quality may affect crops and livestock.

---

# Practical Activity 4

## Rainwater Harvesting Design

Working in groups, develop a rainwater harvesting system for a mixed farming enterprise.

Include:

* Collection surface
* Storage facilities
* Distribution system
* Maintenance requirements
* Estimated benefits

Present the design and explain how it contributes to sustainable water management.

---

# Knowledge Check

1. Explain why water is essential for sustainable agriculture.
2. Describe the stages of the water cycle.
3. Identify four sources of agricultural water.
4. Compare surface, sprinkler, drip, and micro-irrigation systems.
5. List six water conservation practices suitable for farms.
6. Explain why irrigation scheduling is important.
7. Describe the importance of water quality testing.
8. Identify the key South African legislation governing water management in agriculture.

---

# Module Summary

Water is a critical resource that underpins sustainable agricultural production and environmental health. Effective water resource management requires an understanding of the water cycle, responsible use of available water sources, efficient irrigation practices, water quality monitoring, and climate-smart conservation measures. By implementing rainwater harvesting, improving irrigation efficiency, maintaining proper drainage, and complying with South African water legislation, farmers can optimise water use while protecting ecosystems and ensuring long-term agricultural productivity. Sound water management strengthens farm resilience, supports food security, and contributes to the sustainable use of one of South Africa's most precious natural resources.

**Next Module:** **Module 4 – Biodiversity and Ecosystem Management**, where learners will explore the importance of biodiversity, ecosystem services, habitat conservation, pollinators, invasive species management, and integrated approaches to protecting agricultural ecosystems.`
          },
          {
            id: "l4",
            title: "Module 4: Biodiversity and Ecosystem Management",
            duration: "30m",
            order: 3,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 4: Biodiversity and Ecosystem Management

## Module Overview

Biodiversity is the variety of living organisms, including plants, animals, microorganisms, and the ecosystems they form. Healthy agricultural ecosystems depend on biodiversity to maintain soil fertility, pollination, natural pest control, nutrient cycling, and water regulation. Sustainable agriculture recognises that productive farming and environmental conservation are interconnected. Protecting biodiversity improves ecosystem resilience, supports food production, and helps farms adapt to changing climatic conditions.

This module introduces learners to the principles of biodiversity conservation and ecosystem management within South African agricultural systems. Learners will examine ecosystem services, the role of beneficial organisms, habitat conservation, invasive alien species management, and integrated approaches to protecting natural resources. The module also explores South African environmental legislation and practical farm management strategies that promote biodiversity while maintaining profitable agricultural production.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Define biodiversity and explain its importance in sustainable agriculture.
* Describe the structure and function of agricultural ecosystems.
* Identify ecosystem services that support agricultural production.
* Recognise the importance of pollinators and beneficial organisms.
* Implement practical biodiversity conservation measures on farms.
* Identify invasive alien species and recommend appropriate control measures.
* Develop a basic biodiversity management plan for an agricultural enterprise.

---

# 4.1 Understanding Biodiversity

Biodiversity refers to the variety of all living organisms and the ecosystems in which they exist. It includes diversity within species, between species, and across ecosystems.

The three main levels of biodiversity are:

### Genetic Diversity

Variation within a species that allows plants and animals to adapt to environmental changes and resist diseases.

Example:

Different maize varieties that tolerate drought or pests.

---

### Species Diversity

The variety of different plant, animal, insect, bird, and microbial species within an ecosystem.

Greater species diversity generally improves ecosystem stability.

---

### Ecosystem Diversity

The variety of habitats and ecosystems within a landscape.

Examples include:

* Grasslands
* Forests
* Wetlands
* Rivers
* Savannas
* Agricultural fields

Healthy ecosystems support sustainable agricultural production.

---

# 4.2 Agricultural Ecosystems

An agricultural ecosystem (agroecosystem) is an environment where crops, livestock, soil, water, climate, and living organisms interact.

Components include:

* Crops
* Livestock
* Soil
* Water
* Microorganisms
* Insects
* Birds
* Wildlife
* Farmers

Good ecosystem management seeks to maintain balance between agricultural production and environmental conservation.

---

# 4.3 Ecosystem Services

Ecosystem services are the natural processes that support life and agricultural production.

### Pollination

Bees, butterflies, birds, and other pollinators assist in the reproduction of many crops.

Pollination improves:

* Fruit production
* Seed production
* Crop quality
* Crop yields

---

### Natural Pest Control

Predatory insects, birds, frogs, spiders, and beneficial microorganisms naturally control pest populations.

Examples include:

* Ladybirds feeding on aphids.
* Owls controlling rodent populations.
* Parasitic wasps attacking crop pests.

Encouraging natural predators reduces dependence on chemical pesticides.

---

### Soil Formation

Earthworms, fungi, bacteria, and other soil organisms decompose organic matter and improve soil structure.

Healthy soil supports sustainable crop production.

---

### Nutrient Cycling

Microorganisms recycle nutrients by decomposing plant and animal material, making nutrients available for plant uptake.

---

### Water Regulation

Healthy ecosystems:

* Improve water infiltration.
* Reduce flooding.
* Protect water quality.
* Recharge groundwater.

---

# 4.4 Importance of Pollinators

Pollinators transfer pollen between flowers, enabling fertilisation and seed production.

Common pollinators include:

* Honey bees
* Solitary bees
* Butterflies
* Moths
* Beetles
* Birds
* Bats

Many fruit, vegetable, nut, and seed crops depend on pollinators.

Threats to pollinators include:

* Habitat loss
* Excessive pesticide use
* Climate change
* Diseases
* Invasive species

Protecting pollinators supports food security and agricultural productivity.

---

# 4.5 Beneficial Organisms

Many organisms contribute positively to agricultural production.

Examples include:

### Earthworms

Benefits:

* Improve soil structure.
* Increase aeration.
* Enhance drainage.
* Promote nutrient cycling.

---

### Nitrogen-Fixing Bacteria

These bacteria convert atmospheric nitrogen into forms plants can use.

Legume crops benefit from this natural process.

---

### Mycorrhizal Fungi

These fungi form partnerships with plant roots, improving water and nutrient uptake.

---

### Predatory Insects

Examples include:

* Ladybirds
* Lacewings
* Praying mantises

These insects help control agricultural pests naturally.

---

# 4.6 Habitat Conservation

Natural habitats support biodiversity and improve farm resilience.

Important habitats include:

* Wetlands
* Rivers
* Grasslands
* Indigenous forests
* Hedgerows
* Buffer strips

Farmers should avoid unnecessary destruction of natural vegetation and protect sensitive ecological areas.

---

# 4.7 Invasive Alien Species

Invasive alien species are non-native plants or animals that spread aggressively and threaten indigenous biodiversity.

Examples commonly encountered in South Africa include:

* Black wattle (*Acacia mearnsii*)
* Lantana (*Lantana camara*)
* Water hyacinth (*Eichhornia crassipes*)
* Bugweed (*Solanum mauritianum*)

Negative impacts include:

* Increased water consumption
* Reduced biodiversity
* Lower grazing capacity
* Soil degradation
* Competition with indigenous species

Control methods include:

* Mechanical removal
* Chemical control
* Biological control
* Integrated management

Always follow applicable environmental regulations and safety procedures when managing invasive species.

---

# 4.8 Integrated Pest Management (IPM)

Integrated Pest Management combines different control methods to reduce pest populations while minimising environmental impacts.

IPM principles include:

* Regular monitoring
* Correct pest identification
* Economic threshold levels
* Biological control
* Cultural practices
* Mechanical control
* Responsible chemical use when necessary

IPM reduces pesticide resistance and protects beneficial organisms.

---

# 4.9 Sustainable Land Management

Sustainable land management promotes biodiversity while maintaining agricultural productivity.

Examples include:

* Crop rotation
* Agroforestry
* Conservation agriculture
* Rotational grazing
* Riparian buffer zones
* Cover cropping
* Reduced chemical use
* Soil conservation

These practices strengthen ecosystem resilience and improve long-term farm sustainability.

---

# 4.10 South African Biodiversity Legislation

Environmental legislation supports biodiversity conservation.

Important legislation includes:

* National Environmental Management Act (NEMA)
* National Environmental Management: Biodiversity Act (NEMBA)
* Conservation of Agricultural Resources Act (CARA)
* National Water Act

Farmers have a responsibility to protect natural habitats and comply with environmental requirements.

---

# 4.11 Developing a Farm Biodiversity Management Plan

A biodiversity management plan should include:

### Resource Assessment

Identify:

* Natural vegetation
* Wetlands
* Rivers
* Wildlife habitats
* Invasive species

---

### Conservation Objectives

Examples include:

* Protect pollinator habitats.
* Reduce invasive species.
* Improve wildlife corridors.
* Enhance soil biodiversity.

---

### Management Actions

Actions may include:

* Plant indigenous vegetation.
* Establish buffer strips.
* Reduce pesticide use.
* Protect wetlands.
* Restore degraded land.

---

### Monitoring

Regularly assess:

* Pollinator activity
* Wildlife sightings
* Vegetation condition
* Water quality
* Invasive species spread

Continuous monitoring supports adaptive management.

---

# Workplace Application

During workplace activities, learners should:

* Identify beneficial organisms on the farm.
* Observe pollinator activity.
* Inspect natural habitats for signs of degradation.
* Identify invasive alien plants.
* Recommend practical biodiversity conservation measures.
* Record observations in farm environmental records.

---

# Practical Activity 1

## Biodiversity Survey

Conduct a biodiversity survey on a farm.

Record:

* Plant species
* Insect species
* Bird species
* Mammals observed
* Natural habitats
* Invasive species

Discuss how biodiversity contributes to agricultural productivity.

---

# Practical Activity 2

## Pollinator Assessment

Observe flowering crops or natural vegetation.

Identify:

* Pollinator species present
* Pollinator activity
* Flower diversity
* Potential threats to pollinators

Recommend measures to improve pollinator habitats.

---

# Practical Activity 3

## Invasive Species Identification

Inspect the farm for invasive alien plants.

Record:

* Species identified
* Location
* Extent of infestation
* Recommended control method

Prepare an invasive species management report.

---

# Practical Activity 4

## Farm Biodiversity Management Plan

Working in groups, develop a biodiversity management plan for an agricultural enterprise.

Include:

* Habitat conservation measures
* Pollinator protection
* Invasive species management
* Monitoring programme
* Staff responsibilities

Present the plan and justify your recommendations.

---

# Knowledge Check

1. Define biodiversity and describe its three levels.
2. Explain the concept of an agricultural ecosystem.
3. List five ecosystem services that support agriculture.
4. Why are pollinators important to crop production?
5. Identify four beneficial organisms commonly found on farms and describe their roles.
6. Explain the impacts of invasive alien species on agriculture.
7. Describe the principles of Integrated Pest Management (IPM).
8. Name four South African laws that support biodiversity conservation.

---

# Module Summary

Biodiversity and healthy ecosystems are fundamental to sustainable agricultural production. By protecting pollinators, conserving natural habitats, encouraging beneficial organisms, and managing invasive alien species responsibly, farmers strengthen ecosystem services that improve soil health, water quality, pest control, and crop productivity. Sustainable ecosystem management reduces reliance on external inputs, enhances resilience to climate change, and supports long-term environmental stewardship. Integrating biodiversity conservation into everyday farming practices ensures productive agricultural systems while safeguarding South Africa's rich natural heritage.

**Next Module:** **Module 5 – Climate-Smart Agriculture**, where learners will explore climate change, greenhouse gas emissions, climate adaptation and mitigation strategies, carbon sequestration, drought management, and resilient farming practices that support sustainable agricultural production.`
          },
          {
            id: "l5",
            title: "Module 5: Climate-Smart Agriculture",
            duration: "30m",
            order: 4,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 5: Climate-Smart Agriculture

## Module Overview

Climate change is one of the greatest challenges facing agriculture worldwide. In South Africa, rising temperatures, prolonged droughts, unpredictable rainfall, floods, heatwaves, and severe storms threaten crop production, livestock farming, water availability, and food security. Climate-smart agriculture (CSA) is an integrated approach that helps farmers adapt to changing climatic conditions while increasing productivity, improving resilience, and reducing greenhouse gas emissions where possible. It combines sustainable farming practices with innovative technologies to protect natural resources and strengthen agricultural systems.

This module introduces learners to the principles of climate-smart agriculture, climate change adaptation and mitigation, carbon management, drought preparedness, disaster risk reduction, and resilient farming practices. Learners will develop practical skills to identify climate risks, implement adaptation strategies, and contribute to sustainable agricultural development within the South African context.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the concept of climate-smart agriculture and its importance.
* Describe the causes and impacts of climate change on agriculture.
* Identify climate risks affecting South African farming systems.
* Apply adaptation and mitigation strategies to improve farm resilience.
* Explain the role of carbon sequestration and greenhouse gas reduction.
* Develop a basic climate risk management plan for a farm.
* Promote sustainable farming practices that support long-term environmental resilience.

---

# 5.1 Understanding Climate Change

Climate change refers to long-term changes in average weather patterns caused by natural processes and human activities.

Human activities that contribute to climate change include:

* Burning fossil fuels
* Deforestation
* Industrial activities
* Poor land management
* Unsustainable agricultural practices

These activities increase greenhouse gas concentrations in the atmosphere, leading to global warming.

---

# 5.2 Greenhouse Gases

Greenhouse gases trap heat in the Earth's atmosphere, causing temperatures to rise.

Major greenhouse gases include:

### Carbon Dioxide (CO₂)

Sources:

* Fuel combustion
* Deforestation
* Machinery
* Land clearing

---

### Methane (CH₄)

Agricultural sources include:

* Ruminant livestock
* Manure management
* Rice production

Methane has a much greater warming effect than carbon dioxide over a shorter period.

---

### Nitrous Oxide (N₂O)

Sources include:

* Nitrogen fertilisers
* Animal manure
* Soil management

Reducing unnecessary fertiliser use helps lower emissions.

---

# 5.3 Climate Change Impacts on Agriculture

Climate change affects both crop and livestock production.

### Crop Production

Potential impacts include:

* Reduced yields
* Heat stress
* Drought damage
* Increased pest pressure
* New crop diseases
* Poor pollination
* Reduced water availability

---

### Livestock Production

Livestock may experience:

* Heat stress
* Reduced feed availability
* Water shortages
* Lower fertility
* Increased disease outbreaks
* Reduced milk production
* Lower weight gain

Animal welfare becomes increasingly important during extreme weather.

---

### Natural Resources

Climate change also affects:

* Soil moisture
* River flow
* Wetlands
* Groundwater recharge
* Biodiversity

These impacts influence the long-term sustainability of agricultural systems.

---

# 5.4 Principles of Climate-Smart Agriculture

Climate-smart agriculture is based on three key objectives:

### Increasing Productivity

Improve agricultural output while using natural resources efficiently.

Examples include:

* Improved crop varieties
* Efficient irrigation
* Better livestock management

---

### Building Resilience

Strengthen the ability of farms to withstand climate-related shocks.

Examples include:

* Drought preparedness
* Water harvesting
* Soil conservation
* Diversified farming systems

---

### Reducing Emissions

Reduce greenhouse gas emissions where practical while maintaining productivity.

Examples include:

* Conservation agriculture
* Efficient fertiliser use
* Renewable energy
* Improved manure management

---

# 5.5 Climate Adaptation Strategies

Adaptation involves adjusting farming practices to cope with changing climatic conditions.

Effective adaptation strategies include:

### Water Conservation

* Rainwater harvesting
* Drip irrigation
* Mulching
* Soil moisture monitoring

---

### Soil Conservation

* Conservation tillage
* Cover crops
* Compost application
* Contour farming

Healthy soils retain more water during droughts.

---

### Crop Diversification

Growing multiple crop species reduces production risk.

Benefits include:

* Improved resilience
* Better pest management
* Reduced financial risk

---

### Drought-Tolerant Crops

Selecting crop varieties adapted to local climatic conditions improves production during dry periods.

---

### Rotational Grazing

Managing grazing pressure protects vegetation and improves pasture recovery.

---

### Agroforestry

Integrating trees with crops and livestock provides:

* Shade
* Wind protection
* Carbon storage
* Improved biodiversity
* Additional income opportunities

---

# 5.6 Climate Mitigation Strategies

Mitigation focuses on reducing greenhouse gas emissions.

Examples include:

### Renewable Energy

Use of:

* Solar power
* Wind energy
* Biogas systems

---

### Efficient Fertiliser Management

Practices include:

* Soil testing
* Precision application
* Correct timing
* Appropriate application rates

---

### Improved Livestock Management

Reduce emissions through:

* Improved nutrition
* Better breeding
* Healthy animals
* Efficient grazing systems

---

### Waste Management

Agricultural waste can be:

* Composted
* Recycled
* Used in biogas production

These practices reduce methane emissions.

---

# 5.7 Carbon Sequestration

Carbon sequestration is the process of capturing and storing carbon dioxide from the atmosphere.

Agriculture contributes through:

* Planting trees
* Increasing soil organic matter
* Conservation agriculture
* Agroforestry
* Permanent grasslands

Healthy soils store significant amounts of carbon while improving productivity.

---

# 5.8 Climate Risk Assessment

Farmers should identify climate-related risks before implementing adaptation measures.

Common risks include:

* Drought
* Flooding
* Frost
* Heatwaves
* Strong winds
* Wildfires
* Water shortages

Each risk should be evaluated based on:

* Likelihood
* Severity
* Impact on production
* Existing control measures

---

# 5.9 Disaster Risk Management

Preparedness reduces losses during extreme weather events.

A farm disaster plan should include:

* Emergency contacts
* Livestock evacuation procedures
* Water storage plans
* Alternative feed supplies
* Machinery protection
* Fire prevention measures
* Communication procedures

Regular reviews ensure the plan remains effective.

---

# 5.10 Weather Monitoring

Monitoring weather information helps farmers make informed decisions.

Useful information includes:

* Rainfall forecasts
* Temperature trends
* Wind speed
* Frost warnings
* Heatwave alerts
* Seasonal climate outlooks

Weather information assists with irrigation scheduling, planting, harvesting, and livestock management.

---

# 5.11 Sustainable Farm Planning

Climate-smart farm planning integrates environmental, economic, and social considerations.

Planning should include:

* Water management
* Soil conservation
* Biodiversity protection
* Crop selection
* Livestock management
* Risk management
* Record keeping
* Continuous improvement

Long-term planning improves farm resilience and sustainability.

---

# 5.12 South African Climate and Environmental Policies

Several national policies support climate-smart agriculture and environmental sustainability.

Examples include:

* National Climate Change Response Policy
* National Environmental Management Act (NEMA)
* Conservation of Agricultural Resources Act (CARA)
* National Water Act

Farmers should remain informed about current legal requirements and support programmes relevant to their operations.

---

# Workplace Application

During workplace activities, learners should:

* Identify climate risks affecting the farm.
* Observe existing climate adaptation measures.
* Monitor water use and soil moisture.
* Record weather conditions and their effects on crops or livestock.
* Recommend practical improvements to increase climate resilience.

---

# Practical Activity 1

## Climate Risk Assessment

Conduct a climate risk assessment for an agricultural enterprise.

Identify:

* Climate hazards
* Vulnerable resources
* Existing control measures
* Additional adaptation strategies

Present your findings to the facilitator.

---

# Practical Activity 2

## Farm Climate Adaptation Plan

Working in groups, develop a climate adaptation plan that includes:

* Water conservation measures
* Soil management practices
* Crop or livestock adaptation strategies
* Disaster preparedness actions
* Monitoring procedures

Explain how the plan will improve farm resilience.

---

# Practical Activity 3

## Carbon Storage Exercise

Inspect a farm and identify practices that contribute to carbon sequestration.

Examples may include:

* Tree planting
* Cover crops
* Permanent pasture
* Compost application
* Reduced tillage

Prepare recommendations to increase carbon storage.

---

# Practical Activity 4

## Weather Monitoring Exercise

Collect weather data over five consecutive days.

Record:

* Temperature
* Rainfall
* Humidity
* Wind conditions

Discuss how the recorded weather may influence farming operations and management decisions.

---

# Knowledge Check

1. Define climate-smart agriculture.
2. Name the three main objectives of climate-smart agriculture.
3. Identify three greenhouse gases that affect climate change.
4. Describe four impacts of climate change on crop production.
5. Explain five climate adaptation strategies suitable for South African farms.
6. What is carbon sequestration, and why is it important?
7. List the key components of a farm disaster risk management plan.
8. Name three South African policies or laws that support climate-smart agriculture.

---

# Module Summary

Climate-smart agriculture equips farmers with the knowledge and practices needed to respond effectively to climate change while maintaining productive and sustainable farming systems. By combining adaptation strategies such as water conservation, soil management, crop diversification, and agroforestry with mitigation measures that reduce greenhouse gas emissions, farmers can strengthen resilience to climate-related risks. Regular climate risk assessments, disaster preparedness, and informed farm planning enable agricultural enterprises to protect natural resources, improve productivity, and contribute to South Africa's long-term food security and environmental sustainability.

**Next Module:** **Module 6 – Sustainable Crop and Livestock Production**, where learners will explore climate change, greenhouse gas emissions, climate adaptation and mitigation strategies, carbon sequestration, drought management, and resilient farming practices that support sustainable agricultural production.`
          },
          {
            id: "l6",
            title: "Module 6: Sustainable Crop and Livestock Production",
            duration: "30m",
            order: 5,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 6: Sustainable Crop and Livestock Production

## Module Overview

Sustainable crop and livestock production focuses on producing high-quality agricultural products while conserving natural resources, protecting biodiversity, maintaining animal welfare, and ensuring long-term economic viability. Rather than treating crop and livestock enterprises as separate systems, sustainable agriculture encourages their integration to improve nutrient cycling, reduce waste, increase productivity, and build resilient farming operations. In South Africa, sustainable production practices help farmers address challenges such as climate variability, soil degradation, water scarcity, pests, diseases, and rising input costs.

This module introduces learners to sustainable crop production systems, responsible livestock management, integrated farming, nutrient cycling, grazing management, and environmentally responsible agricultural practices. Learners will develop practical skills to implement sustainable production methods that enhance profitability while protecting soil, water, biodiversity, and animal health.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the principles of sustainable crop and livestock production.
* Apply sustainable crop production practices that improve soil health and productivity.
* Demonstrate responsible livestock management techniques that promote animal welfare.
* Explain nutrient cycling and its role in integrated farming systems.
* Develop sustainable grazing management plans.
* Identify opportunities for integrating crop and livestock enterprises.
* Recommend production practices that improve environmental and economic sustainability.

---

# 6.1 Principles of Sustainable Crop and Livestock Production

Sustainable production seeks to balance productivity with responsible environmental management.

The key principles include:

* Efficient use of natural resources
* Protection of soil and water
* Biodiversity conservation
* Animal welfare
* Climate resilience
* Economic sustainability
* Continuous improvement

A sustainable farming system aims to meet current production needs without reducing the ability of future generations to farm successfully.

---

# 6.2 Sustainable Crop Production

Sustainable crop production focuses on maintaining healthy soils, efficient water use, and environmentally responsible farming practices.

### Crop Rotation

Crop rotation involves growing different crops in a planned sequence.

Benefits include:

* Improved soil fertility
* Reduced pest and disease pressure
* Better weed control
* Improved soil structure
* Reduced dependence on chemical inputs

Example:

* Year 1: Maize
* Year 2: Beans
* Year 3: Sunflower

---

### Cover Cropping

Cover crops are grown primarily to protect and improve the soil.

Benefits include:

* Reduced erosion
* Increased organic matter
* Improved soil fertility
* Better moisture retention
* Weed suppression

Common cover crops include legumes, rye, oats, and clover.

---

### Conservation Agriculture

Conservation agriculture is based on three principles:

* Minimal soil disturbance
* Permanent soil cover
* Crop diversification

These practices improve soil health and increase resilience to drought.

---

### Integrated Pest Management (IPM)

Integrated Pest Management reduces pest damage through a combination of:

* Crop monitoring
* Biological control
* Cultural practices
* Mechanical control
* Responsible pesticide use only when necessary

IPM protects beneficial organisms and reduces environmental impacts.

---

### Efficient Nutrient Management

Responsible nutrient management includes:

* Soil testing
* Balanced fertiliser application
* Compost use
* Green manures
* Precision nutrient application

Efficient nutrient management reduces costs and prevents nutrient pollution.

---

# 6.3 Sustainable Livestock Production

Livestock production should promote animal health, welfare, and efficient resource use.

Key management practices include:

* Balanced nutrition
* Adequate clean water
* Disease prevention
* Biosecurity
* Humane handling
* Suitable housing
* Responsible breeding

Healthy animals are more productive and require fewer medical interventions.

---

# 6.4 Animal Welfare

Animal welfare is an essential component of sustainable agriculture.

Animals should have:

* Adequate food
* Clean drinking water
* Comfortable shelter
* Freedom from unnecessary pain and suffering
* Appropriate veterinary care
* Opportunities to express normal behaviour

Good welfare improves productivity, reproduction, and product quality.

---

# 6.5 Nutrient Cycling

Nutrient cycling is the movement and reuse of nutrients within a farming system.

Examples include:

* Crop residues decomposing into the soil
* Livestock manure used as organic fertiliser
* Compost returning nutrients to fields
* Legumes fixing atmospheric nitrogen

Efficient nutrient cycling reduces dependence on synthetic fertilisers and supports soil fertility.

---

# 6.6 Integrated Crop-Livestock Farming

Integrated farming combines crop and livestock enterprises to improve efficiency and sustainability.

Examples include:

* Grazing livestock on crop residues after harvest.
* Applying composted manure to crop fields.
* Growing fodder crops for livestock.
* Using crop by-products as animal feed.

Benefits include:

* Reduced waste
* Improved soil fertility
* Lower input costs
* Diversified farm income
* Better resource use

---

# 6.7 Grazing Management

Proper grazing management protects grasslands and improves livestock productivity.

### Rotational Grazing

Animals are moved between paddocks to allow vegetation to recover.

Benefits include:

* Reduced overgrazing
* Improved pasture quality
* Better soil protection
* Increased carrying capacity

---

### Stocking Rate

The stocking rate is the number of animals that can be supported sustainably on a given area of land.

Overstocking may cause:

* Soil erosion
* Loss of vegetation
* Reduced animal performance
* Land degradation

Stocking rates should match available forage.

---

### Pasture Monitoring

Pastures should be monitored for:

* Grass height
* Species composition
* Bare ground
* Weed invasion
* Soil condition

Monitoring supports timely grazing decisions.

---

# 6.8 Sustainable Feed Management

Feed management should aim to maximise animal nutrition while reducing waste.

Good practices include:

* Producing quality forage
* Conserving hay and silage correctly
* Providing balanced rations
* Preventing feed spoilage
* Monitoring feed intake
* Storing feed safely

Efficient feeding improves productivity and reduces costs.

---

# 6.9 Water Management for Crops and Livestock

Water should be used efficiently throughout the production system.

Practices include:

* Drip irrigation where suitable
* Leak detection and repair
* Protecting water sources from contamination
* Providing clean drinking water for livestock
* Monitoring water consumption

Good water management supports both crop growth and animal health.

---

# 6.10 Sustainable Harvesting Practices

Harvesting should minimise losses and maintain product quality.

Best practices include:

* Harvesting at optimum maturity
* Proper handling and storage
* Reducing mechanical damage
* Maintaining hygiene
* Minimising post-harvest losses

Efficient harvesting increases profitability and reduces food waste.

---

# 6.11 Record Keeping in Production Systems

Accurate production records assist with decision-making.

Records should include:

* Planting dates
* Crop yields
* Fertiliser applications
* Irrigation schedules
* Livestock performance
* Feed consumption
* Disease treatments
* Grazing rotations

Regular analysis of records helps improve farm performance.

---

# 6.12 Continuous Improvement

Sustainable farming requires regular evaluation and adaptation.

Continuous improvement may involve:

* Reviewing production records
* Adopting new technologies
* Improving water-use efficiency
* Enhancing soil fertility
* Training farm workers
* Monitoring environmental performance

Small improvements made consistently contribute to long-term sustainability.

---

# Workplace Application

During workplace activities, learners should:

* Observe sustainable crop and livestock production practices.
* Assess grazing conditions and stocking rates.
* Inspect crop fields for soil cover and pest activity.
* Evaluate livestock housing, nutrition, and welfare.
* Record observations and recommend improvements to supervisors.

---

# Practical Activity 1

## Crop Rotation Planning

Develop a three-year crop rotation plan for a mixed farming enterprise.

Include:

* Crop sequence
* Soil fertility objectives
* Pest management considerations
* Expected benefits

Present the plan and explain your choices.

---

# Practical Activity 2

## Grazing Assessment

Inspect a grazing area and assess:

* Grass condition
* Stocking density
* Signs of overgrazing
* Water availability
* Soil condition

Recommend improvements to grazing management.

---

# Practical Activity 3

## Nutrient Cycling Exercise

Prepare a nutrient flow diagram showing how crop residues, manure, compost, and livestock interact within an integrated farming system.

Discuss how nutrient cycling reduces production costs and improves sustainability.

---

# Practical Activity 4

## Sustainable Production Improvement Plan

Working in groups, prepare a sustainability improvement plan for a farm.

Include:

* Crop management improvements
* Livestock welfare measures
* Grazing management
* Nutrient management
* Water conservation strategies
* Expected environmental and economic benefits

Present your recommendations to the class.

---

# Knowledge Check

1. Define sustainable crop and livestock production.
2. Explain the benefits of crop rotation.
3. Describe the three principles of conservation agriculture.
4. What is Integrated Pest Management (IPM), and why is it important?
5. Explain the concept of nutrient cycling in agriculture.
6. Describe the benefits of integrated crop-livestock farming.
7. Why is rotational grazing important for sustainable livestock production?
8. List five types of production records that should be maintained on a farm.

---

# Module Summary

Sustainable crop and livestock production integrates environmentally responsible practices with efficient resource management to create productive and resilient farming systems. Through crop rotation, conservation agriculture, integrated pest management, nutrient cycling, responsible livestock husbandry, and rotational grazing, farmers can improve soil fertility, reduce waste, enhance animal welfare, and increase long-term profitability. Integrated farming systems maximise the efficient use of natural resources while protecting biodiversity and supporting climate resilience. These practices form the foundation of sustainable agricultural production in South Africa and contribute to food security, environmental conservation, and rural economic development.

**Next Module:** **Module 7 – Waste Management and Renewable Resources**, where learners will examine agricultural waste management, composting, recycling, renewable energy technologies, biogas production, and circular economy principles that support sustainable farming systems.`
          },
          {
            id: "l7",
            title: "Module 7: Waste Management and Renewable Resources",
            duration: "30m",
            order: 6,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 7: Waste Management and Renewable Resources

## Module Overview

Effective waste management is an essential component of sustainable agriculture. Agricultural activities generate a variety of waste materials, including crop residues, livestock manure, plastics, chemical containers, wastewater, and organic by-products. If these wastes are not managed responsibly, they can pollute soil and water, spread diseases, attract pests, increase greenhouse gas emissions, and reduce farm productivity. Conversely, many agricultural waste products can be transformed into valuable resources through composting, recycling, biogas production, and other sustainable practices.

This module introduces learners to the principles of agricultural waste management, waste classification, recycling, composting, renewable energy technologies, and circular economy concepts. Learners will develop practical skills to minimise waste, recover valuable resources, reduce environmental impacts, and improve farm sustainability in accordance with South African environmental legislation and occupational health and safety requirements.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the importance of effective waste management in sustainable agriculture.
* Identify and classify different types of agricultural waste.
* Apply appropriate waste reduction, reuse, recycling, and disposal practices.
* Demonstrate compost production using organic agricultural waste.
* Explain the role of renewable energy in sustainable farming systems.
* Identify opportunities for implementing circular economy principles on farms.
* Develop a basic agricultural waste management plan.

---

# 7.1 Understanding Agricultural Waste

Agricultural waste refers to materials generated during farming operations that are no longer required for their original purpose. While some waste requires safe disposal, much of it can be reused or recycled to improve farm efficiency.

Common agricultural waste includes:

* Crop residues
* Livestock manure
* Animal bedding
* Feed waste
* Plastic packaging
* Fertiliser bags
* Chemical containers
* Wastewater
* Spoiled produce
* Pruning materials

Proper management protects the environment and creates opportunities to recover valuable resources.

---

# 7.2 Types of Agricultural Waste

Agricultural waste can be classified into several categories.

## Organic Waste

Organic waste decomposes naturally.

Examples include:

* Crop residues
* Fruit and vegetable waste
* Livestock manure
* Grass cuttings
* Leaves
* Food waste

Organic waste is suitable for composting and biogas production.

---

## Inorganic Waste

Inorganic waste does not readily decompose.

Examples include:

* Plastic irrigation pipes
* Plastic mulch
* Fertiliser bags
* Packaging materials
* Glass
* Metal
* Rubber

These materials should be reused or recycled where possible.

---

## Hazardous Waste

Hazardous waste requires specialised handling because it may pose risks to people, animals, and the environment.

Examples include:

* Pesticide containers
* Herbicide containers
* Veterinary medicine containers
* Waste oils
* Fuel
* Batteries

Hazardous waste must never be disposed of in rivers, fields, or open fires.

---

# 7.3 The Waste Management Hierarchy

The waste management hierarchy provides a framework for managing waste sustainably.

### Reduce

Prevent waste from being generated by using resources efficiently.

Examples:

* Buy only the required quantities.
* Apply fertilisers accurately.
* Reduce food losses.

---

### Reuse

Use materials again without significant processing.

Examples:

* Reusing storage containers where safe and appropriate.
* Reusing irrigation drums.
* Repairing farm equipment.

---

### Recycle

Convert waste into new products.

Examples:

* Recycling plastics
* Recycling metals
* Recycling cardboard

---

### Recover

Recover value from waste through processes such as:

* Compost production
* Biogas generation
* Energy recovery

---

### Dispose

Dispose of waste safely only when no other option is available.

Disposal should comply with environmental regulations.

---

# 7.4 Composting

Composting is the controlled decomposition of organic materials into a nutrient-rich soil amendment.

Suitable compost materials include:

* Crop residues
* Animal manure
* Dry leaves
* Grass cuttings
* Vegetable waste

Materials such as plastics, glass, treated wood, and hazardous chemicals should not be added to compost.

---

## Benefits of Compost

Compost improves:

* Soil fertility
* Soil structure
* Water retention
* Microbial activity
* Nutrient availability

Compost also reduces the need for synthetic fertilisers.

---

## Composting Process

Successful composting requires:

* A balanced mixture of green and brown materials.
* Adequate moisture.
* Oxygen through regular turning.
* Suitable temperatures for decomposition.

Finished compost should be dark, crumbly, and have an earthy smell.

---

# 7.5 Livestock Manure Management

Livestock manure is a valuable source of nutrients when managed correctly.

Good manure management practices include:

* Proper collection and storage.
* Preventing runoff into watercourses.
* Composting before application where appropriate.
* Applying manure at suitable rates.
* Avoiding application before heavy rainfall.

Responsible manure management improves soil fertility while reducing pollution risks.

---

# 7.6 Recycling on the Farm

Many farm materials can be recycled.

Examples include:

* Plastic containers (where accepted by recycling programmes)
* Metal scrap
* Glass bottles
* Cardboard packaging
* Paper products

Waste should be separated into clearly labelled containers to facilitate recycling.

---

# 7.7 Renewable Energy in Agriculture

Renewable energy uses naturally replenishing resources to produce power.

Common renewable energy sources include:

### Solar Energy

Uses photovoltaic panels to generate electricity.

Applications include:

* Water pumping
* Electric fencing
* Lighting
* Irrigation controllers

---

### Wind Energy

Wind turbines generate electricity in suitable locations.

Applications include:

* Water pumping
* Electricity generation

---

### Biogas

Biogas is produced when organic waste decomposes in an oxygen-free environment.

Feedstock may include:

* Livestock manure
* Crop waste
* Food waste

Biogas can be used for:

* Cooking
* Heating
* Electricity generation

The remaining digestate can be used as an organic fertiliser.

---

### Biomass Energy

Biomass uses organic materials such as crop residues or wood waste as fuel.

It can provide heat or electricity while making use of agricultural by-products.

---

# 7.8 Circular Economy in Agriculture

A circular economy aims to keep resources in use for as long as possible by reducing waste and recovering value.

Examples include:

* Composting crop residues.
* Using livestock manure as fertiliser.
* Recycling irrigation plastics.
* Producing biogas from organic waste.
* Reusing treated wastewater where appropriate and permitted.

Circular farming systems improve resource efficiency and reduce environmental impacts.

---

# 7.9 Pollution Prevention

Improper waste management can cause:

* Soil contamination
* Water pollution
* Air pollution
* Disease outbreaks
* Greenhouse gas emissions
* Harm to wildlife

Preventative measures include:

* Safe chemical storage.
* Proper waste segregation.
* Spill prevention.
* Responsible disposal of hazardous materials.
* Routine inspections of waste storage areas.

---

# 7.10 Occupational Health and Safety

Waste management activities must be carried out safely.

Workers should:

* Wear appropriate PPE.
* Handle hazardous waste carefully.
* Wash hands after handling waste.
* Follow workplace safety procedures.
* Report spills immediately.
* Use correct lifting techniques.

Safe work practices protect workers and the environment.

---

# 7.11 South African Environmental Legislation

Agricultural waste management is regulated by legislation that protects human health and the environment.

Relevant legislation includes:

* National Environmental Management Act (NEMA)
* National Environmental Management: Waste Act
* National Water Act
* Occupational Health and Safety Act

Farmers are responsible for complying with legal requirements relating to waste storage, handling, transport, and disposal.

---

# 7.12 Developing a Farm Waste Management Plan

A waste management plan should include:

### Waste Identification

Identify all waste generated on the farm.

### Waste Classification

Separate waste into:

* Organic
* Recyclable
* Hazardous
* General waste

### Waste Reduction Measures

Identify opportunities to reduce waste generation.

### Recycling and Recovery

Determine which materials can be reused, recycled, or composted.

### Safe Disposal

Establish procedures for disposing of waste that cannot be recovered.

### Monitoring

Regularly inspect waste management practices and update the plan where necessary.

---

# Workplace Application

During workplace activities, learners should:

* Identify different waste streams on the farm.
* Separate waste into appropriate categories.
* Monitor compost production.
* Inspect waste storage areas.
* Report environmental risks.
* Promote waste reduction practices among co-workers.

---

# Practical Activity 1

## Farm Waste Audit

Conduct a waste audit for an agricultural enterprise.

Record:

* Types of waste generated
* Estimated quantities
* Current disposal methods
* Opportunities for waste reduction and recycling

Prepare recommendations for improving waste management.

---

# Practical Activity 2

## Compost Production

Construct a compost pile using available organic farm materials.

Monitor:

* Moisture
* Temperature
* Aeration
* Decomposition progress

Record observations over several weeks.

---

# Practical Activity 3

## Renewable Energy Assessment

Inspect the farm and identify opportunities to introduce renewable energy technologies.

Consider:

* Solar energy
* Wind energy
* Biogas production
* Biomass utilisation

Present a report outlining potential benefits and implementation considerations.

---

# Practical Activity 4

## Farm Waste Management Plan

Working in groups, develop a waste management plan for a mixed farming enterprise.

Include:

* Waste identification
* Waste classification
* Composting programme
* Recycling strategy
* Hazardous waste procedures
* Monitoring schedule

Present the completed plan to the facilitator.

---

# Knowledge Check

1. Define agricultural waste and explain why effective waste management is important.
2. Differentiate between organic, inorganic, and hazardous agricultural waste.
3. Explain the five stages of the waste management hierarchy.
4. Describe the composting process and its benefits.
5. Explain how livestock manure can be managed sustainably.
6. Identify four renewable energy sources suitable for agricultural enterprises.
7. Describe the principles of a circular economy in agriculture.
8. Name four South African laws that regulate agricultural waste management.

---

# Module Summary

Effective waste management is essential for protecting the environment, improving resource efficiency, and supporting sustainable agricultural production. By applying the waste management hierarchy, composting organic materials, recycling reusable products, and adopting renewable energy technologies such as solar power and biogas, farmers can reduce pollution, lower production costs, and create valuable resources from agricultural waste. Integrating circular economy principles into farming systems strengthens environmental stewardship, enhances economic sustainability, and contributes to resilient agricultural enterprises that comply with South African environmental and occupational health and safety standards.

**Next Module:** **Module 8 – Farm Sustainability Planning and Continuous Improvement**, where learners will integrate the knowledge gained throughout the course to develop comprehensive farm sustainability plans, monitor environmental performance, establish sustainability indicators, and implement continuous improvement strategies for long-term agricultural success.`
          },
          {
            id: "l8",
            title: "Module 8: Farm Sustainability Planning and Continuous Improvement",
            duration: "35m",
            order: 7,
            videoUrl: null,
            content: `# Sustainable Agriculture Fundamentals

# Module 8: Farm Sustainability Planning and Continuous Improvement

## Module Overview

Farm sustainability planning is the process of integrating environmental stewardship, economic viability, and social responsibility into the daily management of an agricultural enterprise. A sustainable farm balances productivity with the responsible use of natural resources, ensuring that the needs of current generations are met without compromising the ability of future generations to produce food. Continuous improvement is equally important, requiring farmers to regularly monitor performance, evaluate outcomes, identify opportunities for improvement, and implement corrective actions based on evidence and best practices.

This module brings together the knowledge gained throughout the course by guiding learners in the development of a comprehensive Farm Sustainability Plan. Learners will explore sustainability indicators, farm monitoring systems, record keeping, environmental auditing, risk management, and continuous improvement processes. The module also highlights the importance of compliance with South African agricultural legislation, quality standards, and responsible resource management to ensure long-term farm success.

---

# Learning Outcomes

By the end of this module, learners will be able to:

* Explain the principles of farm sustainability planning.
* Develop a comprehensive farm sustainability plan.
* Monitor environmental, economic, and social sustainability indicators.
* Conduct a basic farm sustainability assessment.
* Implement continuous improvement processes within an agricultural enterprise.
* Maintain accurate sustainability records and reports.
* Recommend strategies to improve the long-term sustainability of farming operations.

---

# 8.1 Understanding Farm Sustainability

Farm sustainability is the ability of an agricultural enterprise to remain productive, profitable, environmentally responsible, and socially accountable over the long term.

Sustainable farming balances three interconnected pillars:

### Environmental Sustainability

Protecting natural resources by conserving soil, water, biodiversity, and ecosystems while reducing pollution and waste.

---

### Economic Sustainability

Maintaining profitable agricultural production through efficient resource use, sound financial management, and long-term business planning.

---

### Social Sustainability

Supporting worker welfare, occupational health and safety, community engagement, ethical labour practices, and food security.

Successful farms integrate all three pillars into their management systems.

---

# 8.2 Components of a Farm Sustainability Plan

A Farm Sustainability Plan provides a structured approach to managing farm operations responsibly.

Key components include:

* Farm description
* Sustainability objectives
* Natural resource assessment
* Water management plan
* Soil management plan
* Biodiversity conservation plan
* Waste management plan
* Climate adaptation strategy
* Animal welfare programme (where applicable)
* Risk management plan
* Monitoring and evaluation procedures

The plan should be reviewed and updated regularly.

---

# 8.3 Setting Sustainability Goals

Goals should follow the SMART principle.

Goals must be:

* **Specific**
* **Measurable**
* **Achievable**
* **Relevant**
* **Time-bound**

### Example Goals

* Reduce irrigation water consumption by 15% within 12 months.
* Increase soil organic matter by applying compost annually.
* Reduce chemical pesticide use through Integrated Pest Management.
* Plant indigenous vegetation along riverbanks to improve biodiversity.

Clearly defined goals provide direction and enable progress to be measured.

---

# 8.4 Sustainability Indicators

Indicators help farmers monitor performance and identify areas for improvement.

### Environmental Indicators

Examples include:

* Soil organic matter levels
* Water consumption
* Water quality
* Biodiversity levels
* Waste recycling rates
* Greenhouse gas emissions
* Soil erosion

---

### Economic Indicators

Examples include:

* Production costs
* Crop yields
* Livestock productivity
* Gross income
* Input efficiency
* Profitability

---

### Social Indicators

Examples include:

* Employee training hours
* Occupational injuries
* Worker satisfaction
* Community engagement
* Compliance with labour legislation

Monitoring these indicators supports informed decision-making.

---

# 8.5 Farm Record Keeping

Accurate records are essential for sustainability management.

Important records include:

* Crop production records
* Livestock production records
* Soil test reports
* Water usage records
* Fertiliser applications
* Pesticide applications
* Grazing records
* Machinery maintenance
* Financial records
* Environmental monitoring reports

Good record keeping improves planning, compliance, and farm performance.

---

# 8.6 Farm Sustainability Assessment

A sustainability assessment evaluates how well a farm is achieving its sustainability objectives.

The assessment should consider:

* Soil health
* Water management
* Biodiversity conservation
* Waste management
* Climate resilience
* Animal welfare
* Occupational health and safety
* Financial performance

Assessments should be conducted regularly to identify strengths and areas requiring improvement.

---

# 8.7 Risk Management

Risk management involves identifying, assessing, and controlling risks that may affect farm sustainability.

Common risks include:

* Drought
* Floods
* Pests and diseases
* Market fluctuations
* Labour shortages
* Equipment failure
* Fire
* Water shortages

Risk mitigation measures should be documented and reviewed annually.

---

# 8.8 Continuous Improvement

Continuous improvement is an ongoing process of evaluating performance and implementing positive changes.

The Plan–Do–Check–Act (PDCA) cycle provides a practical framework.

### Plan

Identify objectives and develop improvement strategies.

### Do

Implement planned improvements.

### Check

Monitor results and compare performance against targets.

### Act

Make adjustments and standardise successful practices.

Regular use of the PDCA cycle strengthens long-term sustainability.

---

# 8.9 Compliance with South African Legislation

Farm sustainability planning must align with relevant legislation.

Important legislation includes:

* National Environmental Management Act (NEMA)
* National Water Act
* Conservation of Agricultural Resources Act (CARA)
* Occupational Health and Safety Act
* Basic Conditions of Employment Act
* National Environmental Management: Waste Act

Compliance protects natural resources, workers, and the long-term viability of agricultural enterprises.

---

# 8.10 Environmental Auditing

Environmental audits evaluate whether farming activities comply with environmental standards and sustainability objectives.

An audit may assess:

* Waste management practices
* Water use efficiency
* Soil conservation measures
* Biodiversity protection
* Chemical storage
* Pollution prevention
* Legal compliance

Audit findings should be documented, and corrective actions implemented where necessary.

---

# 8.11 Stakeholder Engagement

Sustainable agriculture benefits from collaboration with all stakeholders.

Stakeholders may include:

* Farm owners
* Employees
* Local communities
* Agricultural advisers
* Input suppliers
* Buyers
* Government departments
* Industry organisations

Open communication supports continuous improvement and responsible farm management.

---

# 8.12 Developing a Farm Sustainability Improvement Plan

The final sustainability improvement plan should include:

### Current Situation Analysis

Assess existing farm practices and identify strengths and weaknesses.

### Improvement Objectives

Establish measurable sustainability goals.

### Action Plan

Specify activities, responsibilities, timelines, and required resources.

### Monitoring Programme

Identify performance indicators and reporting intervals.

### Review Process

Schedule annual reviews and update the plan based on monitoring results, legislative changes, and new technologies.

---

# Workplace Application

During workplace activities, learners should:

* Review existing farm management practices.
* Analyse farm records and sustainability indicators.
* Participate in environmental inspections or audits.
* Identify opportunities to improve resource efficiency.
* Assist in updating sustainability plans.
* Report findings to supervisors and recommend practical improvements.

---

# Practical Activity 1

## Farm Sustainability Assessment

Conduct a sustainability assessment of an agricultural enterprise.

Evaluate:

* Soil management
* Water use
* Biodiversity
* Waste management
* Animal welfare (where applicable)
* Occupational health and safety

Prepare a summary report with recommendations.

---

# Practical Activity 2

## Sustainability Indicator Monitoring

Select five sustainability indicators and monitor them over a defined period.

Record:

* Baseline measurements
* Current performance
* Improvement targets
* Corrective actions where required

Present the findings to the facilitator.

---

# Practical Activity 3

## Environmental Audit Exercise

Using a checklist, conduct a basic environmental audit of a farm.

Assess:

* Waste storage
* Water protection
* Chemical handling
* Soil conservation
* Biodiversity management

Document non-conformances and propose corrective actions.

---

# Practical Activity 4

## Farm Sustainability Improvement Plan

Working in groups, prepare a comprehensive Farm Sustainability Improvement Plan.

Include:

* Farm description
* Sustainability goals
* Resource management strategies
* Risk management measures
* Monitoring indicators
* Annual review schedule

Present the plan and explain how it supports environmental, economic, and social sustainability.

---

# Knowledge Check

1. Define farm sustainability and explain its three pillars.
2. List the key components of a Farm Sustainability Plan.
3. Explain the SMART principle for setting sustainability goals.
4. Differentiate between environmental, economic, and social sustainability indicators.
5. Why is accurate farm record keeping important?
6. Describe the Plan–Do–Check–Act (PDCA) cycle.
7. Explain the purpose of an environmental audit.
8. Identify four South African laws that support sustainable agricultural management.

---

# Module Summary

Farm sustainability planning integrates environmental protection, economic performance, and social responsibility into a structured management approach that promotes long-term agricultural success. By setting SMART objectives, monitoring sustainability indicators, maintaining accurate records, conducting regular assessments and environmental audits, and applying the Plan–Do–Check–Act cycle, farmers can continually improve their operations while meeting legislative requirements and industry best practices. A well-developed Farm Sustainability Improvement Plan enables agricultural enterprises to respond proactively to changing environmental, economic, and social conditions, ensuring resilient, productive, and sustainable farming systems for future generations.

---

# End-of-Course Capstone Project

To demonstrate competency, learners should complete a **Farm Sustainability Portfolio of Evidence (PoE)** that includes:

* A comprehensive Farm Sustainability Plan.
* Soil, water, and biodiversity assessments.
* A waste management and recycling plan.
* A climate risk and adaptation plan.
* Crop and/or livestock production improvement strategies.
* Sustainability monitoring records and key performance indicators (KPIs).
* An environmental audit report with corrective actions.
* A reflective report describing lessons learned and recommendations for continuous improvement.

Successful completion of the Portfolio of Evidence, together with formative and summative assessments and practical workplace evidence, demonstrates readiness to meet the competency requirements expected of a QCTO-aligned **Sustainable Agriculture Fundamentals** programme.`
          }
        ]
      },
      {
        id: "c2",
        title: "Supply Chain Resilience",
        description: "Master strategies for building robust food supply chains that withstand disruptions from climate, geopolitics, and logistics bottlenecks.",
        category: "Supply Chain",
        duration: "3h 15m",
        lessonsCount: 6,
        thumbnail: "supply",
        tier: "free",
        lessons: [
          { id: "l9", title: "Food Supply Chain Overview", duration: "20m", order: 0, videoUrl: null, content: "Map out producers, processors, distributors, retailers, and consumers to identify critical bottlenecks." },
          { id: "l10", title: "Identifying Vulnerabilities", duration: "18m", order: 1, videoUrl: null, content: "Learn tools for supply chain risk assessment and historical choke points." },
          { id: "l11", title: "Logistics and Cold Chain", duration: "22m", order: 2, videoUrl: null, content: "Temperature monitoring and rapid transport are crucial to avoiding spoilage." },
          { id: "l12", title: "Digital Traceability Systems", duration: "25m", order: 3, videoUrl: null, content: "Digital tags and tracking ensure rapid responses during food recall events." },
          { id: "l13", title: "Risk Modeling and Forecasting", duration: "20m", order: 4, videoUrl: null, content: "Combine weather projections and political indicators to forecast food supply gaps." },
          { id: "l14", title: "Emergency Response Planning", duration: "22m", order: 5, videoUrl: null, content: "Build crisis playbooks for grain reserves and emergency distribution." }
        ]
      },
      {
        id: "c3",
        title: "Climate Adaptation Strategies",
        description: "Explore how communities and nations adapt their food systems to changing weather patterns and shifting growing seasons.",
        category: "Climate",
        duration: "1h 50m",
        lessonsCount: 5,
        thumbnail: "climate",
        tier: "free",
        lessons: [
          { id: "l19", title: "Climate Impact on Food Systems", duration: "20m", order: 0, videoUrl: null, content: "Review projections for warming levels and extreme weather impact on staple crops." },
          { id: "l20", title: "Drought-Resistant Crops", duration: "18m", order: 1, videoUrl: null, content: "Discover drought-hardy millets, cassava varieties, and gene-edited maize." },
          { id: "l21", title: "Flood Management for Farms", duration: "17m", order: 2, videoUrl: null, content: "Structural adaptation tactics: raised beds, bio-swales, and polder farming." },
          { id: "l22", title: "Urban Agriculture Solutions", duration: "22m", order: 3, videoUrl: null, content: "Vertical farms, hydroponics, and rooftop farming to insulate cities from supply shocks." },
          { id: "l23", title: "Policy Frameworks for Adaptation", duration: "14m", order: 4, videoUrl: null, content: "National adaptation plans and climate insurance for smallholders." }
        ]
      },
      {
        id: "c4",
        title: "Food Safety and Quality",
        description: "Comprehensive training on food safety protocols, quality assurance systems, and regulatory compliance.",
        category: "Safety",
        duration: "2h 45m",
        lessonsCount: 5,
        thumbnail: "safety",
        tier: "free",
        lessons: [
          { id: "l25", title: "Food Safety Fundamentals", duration: "22m", order: 0, videoUrl: null, content: "Introduction to biological, chemical, and physical hazards in commercial operations." },
          { id: "l26", title: "HACCP Implementation", duration: "25m", order: 1, videoUrl: null, content: "Hazard Analysis Critical Control Point (HACCP) systematic approach." },
          { id: "l27", title: "Microbial Contamination Prevention", duration: "20m", order: 2, videoUrl: null, content: "Testing protocols and farm-to-table hygiene systems." },
          { id: "l28", title: "Quality Control Systems", duration: "23m", order: 3, videoUrl: null, content: "Statistical process control and sensory analysis." },
          { id: "l29", title: "Regulatory Compliance", duration: "22m", order: 4, videoUrl: null, content: "Global food safety regulations (FDA, EFSA, Codex Alimentarius)." }
        ]
      },

      // PRO PLAN COURSES (28 Requested Courses)
      {
        id: "pro-1",
        title: "Beef Production, Cattle Management and Feedlots",
        description: "Advanced management of beef herds, feedlot operation design, weight gain optimization, and market preparation.",
        category: "Livestock",
        duration: "4h 15m",
        lessonsCount: 4,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-1", title: "Beef Cattle Breeds & Selection Criteria", duration: "30m", order: 0, videoUrl: null, content: "Understanding commercial beef breeds (Angus, Bonsmara, Brahman, Hereford) and evaluating structural soundness, fertility, and weight-gain genetic traits." },
          { id: "pl-2", title: "Feedlot Layout & Infrastructure", duration: "35m", order: 1, videoUrl: null, content: "Designing stress-free pen facilities, automated feeding troughs, shade structures, and effluent management systems." },
          { id: "pl-3", title: "Nutritional Rationing & ADG Target Optimization", duration: "40m", order: 2, videoUrl: null, content: "Calculating Average Daily Gain (ADG), balancing silage, concentrates, and ionophores for maximum feed conversion efficiency." },
          { id: "pl-4", title: "Health Protocols & Slaughter Grading", duration: "30m", order: 3, videoUrl: null, content: "Vaccination programs against respiratory diseases, parasite control, and preparing cattle for carcass grading." }
        ]
      },
      {
        id: "pro-2",
        title: "Agricultural Quality Management and Food Safety",
        description: "Implementation of ISO 22000, GlobalGAP, auditing frameworks, and traceability standards across farm operations.",
        category: "Quality & Safety",
        duration: "3h 45m",
        lessonsCount: 4,
        thumbnail: "safety",
        tier: "pro",
        lessons: [
          { id: "pl-5", title: "GlobalGAP Certification Standards", duration: "35m", order: 0, videoUrl: null, content: "Step-by-step compliance with Good Agricultural Practices (GAP) for export readiness." },
          { id: "pl-6", title: "ISO 22000 Food Safety Management Systems", duration: "40m", order: 1, videoUrl: null, content: "Building institutional policies for hazard control, sanitation standard operating procedures (SSOPs), and internal audits." },
          { id: "pl-7", title: "Pesticide Residue & Heavy Metal Surveillance", duration: "30m", order: 2, videoUrl: null, content: "Maximum Residue Limits (MRLs) testing, sample collection, and laboratory reporting." },
          { id: "pl-8", title: "Batch Recall & Digital Traceability", duration: "30m", order: 3, videoUrl: null, content: "Setting up barcode/RFID tracking from harvest crate to retail destination for instant batch recall." }
        ]
      },
      {
        id: "pro-3",
        title: "Hydroponics",
        description: "Design and operation of Nutrient Film Technique (NFT), Deep Water Culture (DWC), and Dutch bucket hydroponic systems.",
        category: "Crops & Tech",
        duration: "3h 30m",
        lessonsCount: 4,
        thumbnail: "tech",
        tier: "pro",
        lessons: [
          { id: "pl-9", title: "Hydroponic System Architectures", duration: "35m", order: 0, videoUrl: null, content: "Comparing NFT, DWC, Aeroponics, and Dutch Buckets for greens, tomatoes, and berries." },
          { id: "pl-10", title: "Nutrient Solution Chemistry & EC/pH Regulation", duration: "40m", order: 1, videoUrl: null, content: "Formulating Hoagland-style nutrient mixes, managing Electrical Conductivity (EC), and maintaining 5.5-6.5 pH levels." },
          { id: "pl-11", title: "Substrates & Root Zone Aeration", duration: "30m", order: 2, videoUrl: null, content: "Evaluating rockwool, coco coir, perlite, and clay pebbles for water retention and oxygenation." },
          { id: "pl-12", title: "System Troubleshooting & Algae Control", duration: "30m", order: 3, videoUrl: null, content: "Preventing Pythium root rot, managing UV sterilization, and temperature regulation in reservoirs." }
        ]
      },
      {
        id: "pro-4",
        title: "Plant Growth and Development",
        description: "Physiology of plant growth, photosynthesis mechanisms, hormone regulation, and developmental stages.",
        category: "Crops & Soil",
        duration: "3h 10m",
        lessonsCount: 3,
        thumbnail: "crops",
        tier: "pro",
        lessons: [
          { id: "pl-13", title: "Photosynthesis & Light Spectrum Physiology", duration: "35m", order: 0, videoUrl: null, content: "C3, C4, and CAM photosynthetic pathways, Photosynthetically Active Radiation (PAR), and photoperiodism." },
          { id: "pl-14", title: "Plant Hormones & Growth Regulators", duration: "35m", order: 1, videoUrl: null, content: "Roles of Auxins, Cytokinins, Gibberellins, Abscisic Acid, and Ethylene in tissue differentiation and ripening." },
          { id: "pl-15", title: "Phenological Stages & Environmental Signals", duration: "30m", order: 2, videoUrl: null, content: "Tracking BBCH scale development from germination, tillering, flowering, seed set to senescence." }
        ]
      },
      {
        id: "pro-5",
        title: "Pig Production",
        description: "Swine herd management, breeding schedules, farrowing crate operations, and bio-secure piggery housing.",
        category: "Livestock",
        duration: "3h 40m",
        lessonsCount: 4,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-16", title: "Breeding Herd & Artificial Insemination", duration: "35m", order: 0, videoUrl: null, content: "Sow heat detection, AI techniques, gestation housing, and parity performance optimization." },
          { id: "pl-17", title: "Farrowing & Nursery Management", duration: "35m", order: 1, videoUrl: null, content: "Reducing piglet crushing, iron supplementation, creep feeding, and weaning protocols at 21-28 days." },
          { id: "pl-18", title: "Grower-Finisher Diets & Feed Conversion", duration: "30m", order: 2, videoUrl: null, content: "Phase feeding strategies using lysine, energy density, and automated auger feeder maintenance." },
          { id: "pl-19", title: "Piggery Climate Control & Waste Handling", duration: "30m", order: 3, videoUrl: null, content: "Negative pressure ventilation, slurry pit management, and methane digestion options." }
        ]
      },
      {
        id: "pro-6",
        title: "Harvesting Animal Products",
        description: "Hygienic collection, cooling, processing, and handling of milk, wool, honey, eggs, and meat.",
        category: "Livestock",
        duration: "3h 15m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-20", title: "Hygienic Milking & Bulk Tank Cooling", duration: "35m", order: 0, videoUrl: null, content: "Milking parlor sanitation, teat dipping, mastitis screening, and rapid chilling down to 4°C." },
          { id: "pl-21", title: "Poultry Egg Grading & Meat Processing Standards", duration: "35m", order: 1, videoUrl: null, content: "Egg washing, candling, weight classification, and humane abattoir processing guidelines." },
          { id: "pl-22", title: "Wool Shearing, Honey Extraction & Fiber Classing", duration: "30m", order: 2, videoUrl: null, content: "Fleece skirt techniques, micron testing, hygienic honey centrifugal extraction, and wax filtration." }
        ]
      },
      {
        id: "pro-7",
        title: "Poultry Production",
        description: "Broiler and layer management, hatchery operations, flock health, and automated poultry house climate systems.",
        category: "Livestock",
        duration: "3h 30m",
        lessonsCount: 4,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-23", title: "Broiler Management & Growth Curves", duration: "35m", order: 0, videoUrl: null, content: "Brooding climate, lighting schedules, waterer distribution, and target European Production Efficiency Factor (EPEF)." },
          { id: "pl-24", title: "Layer Housing & Peak Egg Yields", duration: "35m", order: 1, videoUrl: null, content: "Enriched cage vs free-range production, lighting stimulation, layer feed formulations, and shell strength." },
          { id: "pl-25", title: "Incubation & Hatchery Operations", duration: "30m", order: 2, videoUrl: null, content: "Egg turning, humidity maintenance, candling, and day-old chick vaccination." },
          { id: "pl-26", title: "Poultry Disease Prevention (Newcastle, Avian Flu)", duration: "30m", order: 3, videoUrl: null, content: "Bio-security protocols, foot baths, spray/drinking water vaccination routines." }
        ]
      },
      {
        id: "pro-8",
        title: "Livestock Industry Overview",
        description: "Macro-economic trends, global meat trade routes, industry regulations, and market demand forecasts.",
        category: "Livestock",
        duration: "2h 50m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-27", title: "Global Meat & Dairy Market Dynamics", duration: "30m", order: 0, videoUrl: null, content: "Analyzing consumption shifts, feed price impacts, and international export flows." },
          { id: "pl-28", title: "Regulatory Frameworks & Animal Welfare Laws", duration: "30m", order: 1, videoUrl: null, content: "Compliance with national livestock acts, transportation limits, and humane slaughter standards." },
          { id: "pl-29", title: "Value Chain Integration & Cooperative Marketing", duration: "30m", order: 2, videoUrl: null, content: "Smallholder participation in commercial livestock value chains and auction ring strategies." }
        ]
      },
      {
        id: "pro-9",
        title: "Animal Health and Bio-Security Programmes",
        description: "Designing farm bio-security barriers, quarantine facilities, vaccination calendars, and pathogen containment.",
        category: "Livestock",
        duration: "3h 40m",
        lessonsCount: 4,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-30", title: "Bio-Security Zoning & Access Control", duration: "35m", order: 0, videoUrl: null, content: "Establishing Dirty, Buffer, and Clean zones, vehicle disinfestation dips, and shower-in facilities." },
          { id: "pl-31", title: "Quarantine & Herd Isolation Protocols", duration: "35m", order: 1, videoUrl: null, content: "Managing new stock intake, testing for brucellosis, TB, and viral pathogens prior to herd integration." },
          { id: "pl-32", title: "Vaccination Schedules & Cold Chain Storage", duration: "30m", order: 2, videoUrl: null, content: "Administering live vs inactivated vaccines, cold storage maintenance, and record-keeping." },
          { id: "pl-33", title: "Outbreak Crisis Response & Stamping Out", duration: "30m", order: 3, videoUrl: null, content: "Notifiable disease notification, quarantine lockdown procedures, and humane culling compliance." }
        ]
      },
      {
        id: "pro-10",
        title: "Animal Nutrition",
        description: "Ruminant and monogastric digestive physiology, feed composition chemistry, Pearson Square ration balancing.",
        category: "Livestock",
        duration: "3h 30m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-34", title: "Ruminant vs Monogastric Digestion", duration: "35m", order: 0, videoUrl: null, content: "Microbial fermentation in the rumen vs enzymatic breakdown in swine and poultry GI tracts." },
          { id: "pl-35", title: "Feed Analysis & Nutritive Values (NDF, ADF, CP, ME)", duration: "35m", order: 1, videoUrl: null, content: "Interpreting lab tests for Dry Matter, Crude Protein, Neutral Detergent Fiber, and Metabolizable Energy." },
          { id: "pl-36", title: "Ration Balancing & Pearson Square Calculations", duration: "35m", order: 2, videoUrl: null, content: "Step-by-step formulation of least-cost feeds using locally available grains and protein meals." }
        ]
      },
      {
        id: "pro-11",
        title: "Agri-Business Plan",
        description: "Writing comprehensive bankable business plans for commercial farming enterprises and agtech startups.",
        category: "Agribusiness",
        duration: "4h 00m",
        lessonsCount: 4,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-37", title: "Executive Summary & Enterprise Selection", duration: "30m", order: 0, videoUrl: null, content: "Structuring your business pitch, defining competitive advantage, and risk-return ratios." },
          { id: "pl-38", title: "Market Feasibility & Off-Take Analysis", duration: "35m", order: 1, videoUrl: null, content: "Conducting market research, securing off-take agreements, and analyzing buyer requirements." },
          { id: "pl-39", title: "Operations, Machinery & Resource Planning", duration: "35m", order: 2, videoUrl: null, content: "Mapping land, labor, water allocation, and equipment amortization schedules." },
          { id: "pl-40", title: "Financial Projections & Sensitivity Testing", duration: "40m", order: 3, videoUrl: null, content: "Building 5-year Income Statements, Cash Flow, balance sheets, NPV, and Internal Rate of Return (IRR)." }
        ]
      },
      {
        id: "pro-12",
        title: "Farm Budgets",
        description: "Operating budget construction, gross margin analysis, cash flow management, and variance tracking.",
        category: "Agribusiness",
        duration: "3h 15m",
        lessonsCount: 3,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-41", title: "Gross Margin Budgets for Crops & Livestock", duration: "35m", order: 0, videoUrl: null, content: "Calculating income per hectare or head minus direct variable costs." },
          { id: "pl-42", title: "Monthly Cash Flow Forecasting", duration: "35m", order: 1, videoUrl: null, content: "Managing seasonal cash troughs, working capital lines, and harvest payout cycles." },
          { id: "pl-43", title: "Variance Analysis & Cost Control", duration: "30m", order: 2, videoUrl: null, content: "Comparing actual vs budgeted expenses, identifying overruns in fuel, labor, or fertilizer." }
        ]
      },
      {
        id: "pro-13",
        title: "Farm Layout and Site Selection",
        description: "GIS mapping, topographic analysis, water table assessment, and optimal placement of farm structures.",
        category: "Agribusiness",
        duration: "3h 20m",
        lessonsCount: 3,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-44", title: "Topography, Soil & Microclimate Assessment", duration: "35m", order: 0, videoUrl: null, content: "Evaluating slope, frost pockets, solar radiation, and soil depth before purchasing land." },
          { id: "pl-45", title: "Water Source Evaluation & Pumping Logistics", duration: "35m", order: 1, videoUrl: null, content: "Assessing borehole yields, dam capacities, water rights, and head loss calculations." },
          { id: "pl-46", title: "Zoning Infrastructure & Logistics Access", duration: "30m", order: 2, videoUrl: null, content: "Optimal layout of barns, packing sheds, roads, power lines, and waste facilities to minimize transit time." }
        ]
      },
      {
        id: "pro-14",
        title: "Farm Marketing Plans",
        description: "Commodity marketing, price hedging, forward contracting, branding, and direct-to-consumer sales models.",
        category: "Agribusiness",
        duration: "3h 10m",
        lessonsCount: 3,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-47", title: "Agricultural Commodity Markets & Hedging", duration: "35m", order: 0, videoUrl: null, content: "Understanding futures exchanges (SAFEX, CBOT), options contracts, and hedging price risk." },
          { id: "pl-48", title: "Forward Contracts & Off-Take Negotiations", duration: "30m", order: 1, videoUrl: null, content: "Structuring supply agreements with supermarkets, processors, and grain silos." },
          { id: "pl-49", title: "Niche Branding, Farm Stores & CSA Models", duration: "30m", order: 2, videoUrl: null, content: "Building organic, pasture-raised, or locally grown brand equity to command premium prices." }
        ]
      },
      {
        id: "pro-15",
        title: "Introduction to the Plant Production Industry in South Africa",
        description: "Overview of SA agronomy, citrus, wine, grains, subtropical fruits, climate zones, and regulatory bodies.",
        category: "Crops & Soil",
        duration: "3h 30m",
        lessonsCount: 3,
        thumbnail: "crops",
        tier: "pro",
        lessons: [
          { id: "pl-50", title: "Key Crop Sectors & Regional Distribution", duration: "35m", order: 0, videoUrl: null, content: "Mapping maize in the Highveld, citrus in Limpopo/Eastern Cape, wine in Western Cape, and sugarcane in KZN." },
          { id: "pl-51", title: "Water Rights, DALRRD & Regulatory Environment", duration: "35m", order: 1, videoUrl: null, content: "Navigating National Water Act allocations, phytosanitary requirements, and plant breeder rights." },
          { id: "pl-52", title: "Export Channels (PPECB) & Market Access", duration: "35m", order: 2, videoUrl: null, content: "Perishable Products Export Control Board protocols, cold chain corridors, and trade agreement advantages." }
        ]
      },
      {
        id: "pro-16",
        title: "Dairy Production",
        description: "Milking herd operations, pasture management, TMR (Total Mixed Ration) feeding, and udder health.",
        category: "Livestock",
        duration: "3h 40m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-53", title: "Dairy Cattle Breeds & Reproductive Cycles", duration: "35m", order: 0, videoUrl: null, content: "Holstein, Jersey, and Ayrshire management, calving intervals, and artificial insemination timing." },
          { id: "pl-54", title: "Pasture vs TMR Feeding Systems", duration: "40m", order: 1, videoUrl: null, content: "Balancing ryegrass/clover pastures with high-energy Total Mixed Rations for maximum milk yield." },
          { id: "pl-55", title: "Parlor Automation & Somatic Cell Count (SCC)", duration: "35m", order: 2, videoUrl: null, content: "Rotary vs herringbone parlors, automatic cluster removers, and minimizing SCC for quality bonuses." }
        ]
      },
      {
        id: "pro-17",
        title: "Farm Machinery, Technology and Infrastructure",
        description: "Selection, calibration, maintenance, and precision operation of tractors, implements, and smart farm sensors.",
        category: "Crops & Tech",
        duration: "3h 45m",
        lessonsCount: 4,
        thumbnail: "tech",
        tier: "pro",
        lessons: [
          { id: "pl-56", title: "Tractor Sizing & Implement Matching", duration: "35m", order: 0, videoUrl: null, content: "Calculating horsepower requirements for plows, seeders, sprayers, and balancing ballasting." },
          { id: "pl-57", title: "Sprayer Calibration & Nozzle Selection", duration: "35m", order: 1, videoUrl: null, content: "Calculating application rates per hectare, drift prevention, and nozzle wear maintenance." },
          { id: "pl-58", title: "Telemetry, GPS Auto-Steer & ISOBUS Integration", duration: "30m", order: 2, videoUrl: null, content: "RTK guidance systems, prescription mapping, and ISOBUS machine-to-tractor communication." },
          { id: "pl-59", title: "Preventative Maintenance & Safety Protocols", duration: "30m", order: 3, videoUrl: null, content: "Hydraulic system checks, PTO safety shields, oil sampling, and machinery lifespan extension." }
        ]
      },
      {
        id: "pro-18",
        title: "Agricultural Inputs",
        description: "Sourcing, evaluating, storing, and applying fertilizers, seeds, crop protection chemicals, and bio-stimulants.",
        category: "Crops & Soil",
        duration: "3h 15m",
        lessonsCount: 3,
        thumbnail: "crops",
        tier: "pro",
        lessons: [
          { id: "pl-60", title: "Seed Selection & Germination Guarantees", duration: "30m", order: 0, videoUrl: null, content: "Evaluating hybrid vigor, GMO trait stacks, seed treatments, and germination testing." },
          { id: "pl-61", title: "Chemical Crop Protection Classification", duration: "35m", order: 1, videoUrl: null, content: "Understanding active ingredients in herbicides, fungicides, and insecticides to manage resistance." },
          { id: "pl-62", title: "Safe Storage & Hazardous Materials Handling", duration: "30m", order: 2, videoUrl: null, content: "Designing bunded chemical stores, SDS sheets, spill kits, and personal protective equipment (PPE)." }
        ]
      },
      {
        id: "pro-19",
        title: "Harvesting Plans",
        description: "Scheduling harvest timing, labor logistics, combine harvester settings, and post-harvest handling.",
        category: "Agribusiness",
        duration: "3h 00m",
        lessonsCount: 3,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-63", title: "Maturity Indices & Moisture Testing", duration: "30m", order: 0, videoUrl: null, content: "Determining optimal grain moisture or fruit brix levels prior to initiating harvest." },
          { id: "pl-64", title: "Machinery Capacity & Labor Coordination", duration: "30m", order: 1, videoUrl: null, content: "Scheduling harvesting teams, transport bin logistics, and weather window contingency planning." },
          { id: "pl-65", title: "Field Ingress/Egress & Field Loss Minimization", duration: "30m", order: 2, videoUrl: null, content: "Adjusting combine rotor speeds, header height, and cleaning fan airflow to cut harvest loss." }
        ]
      },
      {
        id: "pro-20",
        title: "Agricultural Export Logistics",
        description: "International freight shipping, refrigerated container management, phytosanitary clearance, and customs.",
        category: "Supply Chain",
        duration: "3h 40m",
        lessonsCount: 3,
        thumbnail: "supply",
        tier: "pro",
        lessons: [
          { id: "pl-66", title: "Reefer Container Dynamics & CA (Controlled Atmosphere)", duration: "35m", order: 0, videoUrl: null, content: "Managing oxygen/CO2 concentrations and temperature set-points inside ocean reefer containers." },
          { id: "pl-67", title: "Phytosanitary Certificates & Border Compliance", duration: "35m", order: 1, videoUrl: null, content: "Inspections for quarantine pests, cold treatment protocols, and port authority paperwork." },
          { id: "pl-68", title: "Incoterms 2020 & Export Risk Insurance", duration: "35m", order: 2, videoUrl: null, content: "Navigating FOB, CIF, DAP terms, marine cargo insurance, and currency hedging." }
        ]
      },
      {
        id: "pro-21",
        title: "Damage Control in Animals and Victims",
        description: "Emergency animal care, predator management, wildlife conflict mitigation, and farm injury response.",
        category: "Livestock",
        duration: "3h 10m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-69", title: "Emergency Livestock First Aid & Trauma Response", duration: "35m", order: 0, videoUrl: null, content: "Treating bloat, difficult births, bone fractures, deep lacerations, and snake bites in animals." },
          { id: "pl-70", title: "Predator Management & Non-Lethal Barriers", duration: "30m", order: 1, videoUrl: null, content: "Guard dogs (Anatolian Shepherds), kraal enclosures, electrified fencing, and predator deterrents." },
          { id: "pl-71", title: "Farm First Aid & Human Emergency Care", duration: "30m", order: 2, videoUrl: null, content: "Treating PTO entanglement injuries, chemical exposure, heat stroke, and emergency evacuation." }
        ]
      },
      {
        id: "pro-22",
        title: "Animal Anatomy and Physiology",
        description: "Skeletal, muscular, circulatory, respiratory, and reproductive systems across domestic livestock species.",
        category: "Livestock",
        duration: "3h 30m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-72", title: "Skeletal & Muscular Structure", duration: "35m", order: 0, videoUrl: null, content: "Understanding bone density, muscular attachment points, and conformation for meat yield." },
          { id: "pl-73", title: "Circulatory & Respiratory Systems", duration: "35m", order: 1, videoUrl: null, content: "Heart rate, lung capacity, gas exchange, and stress physiology during transport and heat." },
          { id: "pl-74", title: "Endocrine & Reproductive Physiology", duration: "35m", order: 2, videoUrl: null, content: "Hormonal control of estrus, ovulation, gestation, and lactation across bovine, ovine, and porcine species." }
        ]
      },
      {
        id: "pro-23",
        title: "Soil Fertility and Plant Nutrition",
        description: "Soil chemistry, cation exchange capacity (CEC), macronutrient/micronutrient roles, and lime/fertilizer recommendations.",
        category: "Crops & Soil",
        duration: "3h 50m",
        lessonsCount: 4,
        thumbnail: "crops",
        tier: "pro",
        lessons: [
          { id: "pl-75", title: "Soil Chemistry & Cation Exchange Capacity (CEC)", duration: "35m", order: 0, videoUrl: null, content: "Understanding soil electrical charge, base saturation (Ca, Mg, K, Na), and nutrient retention." },
          { id: "pl-76", title: "Soil pH Regulation & Agricultural Liming", duration: "35m", order: 1, videoUrl: null, content: "Calculating calcitic vs dolomitic lime requirements to neutralize acid soil and aluminum toxicity." },
          { id: "pl-77", title: "Macronutrient Dynamics (N, P, K, S)", duration: "35m", order: 2, videoUrl: null, content: "Nitrogen fixation, phosphorus fixation dynamics, and potassium luxury consumption." },
          { id: "pl-78", title: "Micronutrients & Tissue Sampling Diagnostics", duration: "30m", order: 3, videoUrl: null, content: "Identifying deficiencies in Zinc, Boron, Manganese, Iron, and reading leaf analysis reports." }
        ]
      },
      {
        id: "pro-24",
        title: "Breeding Systems",
        description: "Genetic selection, crossbreeding programs, heterosis (hybrid vigor), and artificial insemination strategies.",
        category: "Livestock",
        duration: "3h 20m",
        lessonsCount: 3,
        thumbnail: "livestock",
        tier: "pro",
        lessons: [
          { id: "pl-79", title: "Principles of Genetics & Heritability Traits", duration: "35m", order: 0, videoUrl: null, content: "Understanding Estimated Breeding Values (EBVs), dominant/recessive genes, and selection intensity." },
          { id: "pl-80", title: "Crossbreeding Systems & Hybrid Vigor", duration: "35m", order: 1, videoUrl: null, content: "Designing terminal, rotational, and composite breeding systems to maximize heterosis." },
          { id: "pl-82", title: "Assisted Reproductive Technologies (AI, E.T., IVF)", duration: "30m", order: 2, videoUrl: null, content: "Sperm sexing, embryo transfer, and in vitro fertilization protocols for rapid genetic progress." }
        ]
      },
      {
        id: "pro-25",
        title: "Plant Manipulation",
        description: "Pruning, grafting, trellising, hormone applications, and canopy management in horticulture and viticulture.",
        category: "Crops & Soil",
        duration: "3h 15m",
        lessonsCount: 3,
        thumbnail: "crops",
        tier: "pro",
        lessons: [
          { id: "pl-83", title: "Grafting Techniques & Rootstock Selection", duration: "35m", order: 0, videoUrl: null, content: "Whip-and-tongue, chip budding, and cleft grafting for orchard trees and vines." },
          { id: "pl-84", title: "Canopy Management & Trellising Architectures", duration: "30m", order: 1, videoUrl: null, content: "VSP (Vertical Shoot Positioning), open center, and cordon pruning to maximize sunlight interception." },
          { id: "pl-85", title: "Growth Regulator Applications & Chemical Thinning", duration: "30m", order: 2, videoUrl: null, content: "Using gibberellic acid for fruit sizing and chemical thinners to prevent biennial bearing." }
        ]
      },
      {
        id: "pro-26",
        title: "Basic Farm Accounts",
        description: "Bookkeeping principles, single and double-entry accounts, asset registers, tax preparation, and depreciation.",
        category: "Agribusiness",
        duration: "3h 10m",
        lessonsCount: 3,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-86", title: "Chart of Accounts & Record Keeping", duration: "35m", order: 0, videoUrl: null, content: "Setting up income, expenditure, asset, and liability codes specific to farm operations." },
          { id: "pl-87", title: "Asset Registers & Depreciation Schedules", duration: "30m", order: 1, videoUrl: null, content: "Calculating straight-line vs diminishing value depreciation on tractors, pumps, and buildings." },
          { id: "pl-88", title: "Balance Sheets, Trial Balance & Tax Prep", duration: "30m", order: 2, videoUrl: null, content: "Reconciling bank accounts, generating financial statements, and SARS/tax compliance." }
        ]
      },
      {
        id: "pro-27",
        title: "Permaculture",
        description: "Ethics, design principles, sector analysis, water harvesting, food forests, and guild planting.",
        category: "Crops & Soil",
        duration: "3h 30m",
        lessonsCount: 3,
        thumbnail: "crops",
        tier: "pro",
        lessons: [
          { id: "pl-89", title: "Permaculture Ethics & Design Principles", duration: "35m", order: 0, videoUrl: null, content: "Earth Care, People Care, Fair Share, and applying Bill Mollison's 12 design principles." },
          { id: "pl-90", title: "Zone & Sector Mapping Analysis", duration: "35m", order: 1, videoUrl: null, content: "Designing Zones 0 to 5 based on energy usage and mapping wild sectors (sun, wind, fire)." },
          { id: "pl-91", title: "Food Forest Layering & Plant Guilds", duration: "35m", order: 2, videoUrl: null, content: "Constructing 7-layer edible food forests and companion plant guilds for pest management." }
        ]
      },
      {
        id: "pro-28",
        title: "Human Resource Management on a Farm",
        description: "Labor legislation, fair wage compliance, farm worker housing, training, health & safety, and performance reviews.",
        category: "Agribusiness",
        duration: "3h 25m",
        lessonsCount: 3,
        thumbnail: "business",
        tier: "pro",
        lessons: [
          { id: "pl-92", title: "Farm Labor Legislation & Employment Contracts", duration: "35m", order: 0, videoUrl: null, content: "Basic Conditions of Employment Act, Sectoral Determination for agriculture, and legal contracts." },
          { id: "pl-93", title: "Occupational Health & Safety (OHSA) Compliance", duration: "35m", order: 1, videoUrl: null, content: "Establishing safety committees, incident reporting, medical surveillance, and hazard mitigation." },
          { id: "pl-94", title: "Staff Accommodation, Welfare & Incentive Systems", duration: "30m", order: 2, videoUrl: null, content: "Managing farm worker housing standards, productivity bonus schemes, and skill upliftment." }
        ]
      }
    ]
  });
});

// 3. Resources API Route
app.get("/api/resources", (req, res) => {
  res.json({
    resources: [
      { id: "r-hoof-1", title: "1. Sheep & Goat Hoof Health and Trimming Certificate Guide", description: "Complete QCTO-aligned learner guide covering footbath management, hoof anatomy, lameness prevention, and observation exercises.", type: "Certificate Guide", category: "Livestock", author: "AgriSETA / QCTO" },
      { id: "r1", title: "2. Global Food Security Index 2026", description: "Comprehensive annual report analyzing food affordability, availability, quality, and safety across 113 countries.", type: "Report", category: "Research", author: "Economist Impact" },
      { id: "r2", title: "3. Regenerative Agriculture Handbook", description: "A practical guide for farmers transitioning to regenerative practices, covering soil restoration, biodiversity, and water cycles.", type: "Guide", category: "Agriculture", author: "FAO" },
      { id: "r3", title: "4. Climate-Smart Crop Selection Matrix", description: "Interactive decision-support tool for selecting crop varieties based on regional climate projections and soil conditions.", type: "Tool", category: "Climate", author: "CGIAR" },
      { id: "r4", title: "5. Supply Chain Risk Assessment Framework", description: "Standardized methodology for evaluating and monitoring risks across multi-tier food supply networks.", type: "Framework", category: "Supply Chain", author: "World Bank" },
      { id: "r5", title: "6. Urban Farming Best Practices", description: "Case studies and technical guides for establishing productive urban and peri-urban agriculture systems.", type: "Guide", category: "Agriculture", author: "UN-Habitat" },
      { id: "r6", title: "7. Food Loss and Waste Reduction Toolkit", description: "Practical strategies and measurement tools for reducing post-harvest losses and consumer food waste.", type: "Toolkit", category: "Operations", author: "UNEP" },
      { id: "r7", title: "8. Water-Energy-Food Nexus Analysis", description: "Research paper exploring the interconnections between water, energy, and food systems in developing economies.", type: "Paper", category: "Research", author: "SEI" },
      { id: "r8", title: "9. Indigenous Food Systems Documentation", description: "Ethnographic study preserving and analyzing traditional food knowledge from six indigenous communities.", type: "Study", category: "Culture", author: "FAO" },
      { id: "r9", title: "10. Pest and Disease Early Warning Protocol", description: "Technical manual for implementing community-based surveillance systems for agricultural pests and plant diseases.", type: "Manual", category: "Safety", author: "CABI" },
      { id: "r10", title: "11. Agroecology Transition Roadmap", description: "Step-by-step guide for policymakers and organizations supporting the transition to agroecological food systems.", type: "Guide", category: "Policy", author: "IPES-Food" },
      { id: "r11", title: "12. Food Price Volatility Monitor", description: "Monthly dashboard tracking staple food prices across major markets with trend analysis and forecasts.", type: "Dashboard", category: "Economics", author: "WFP" },
      { id: "r12", title: "13. Soil Health Assessment Methods", description: "Field protocols for evaluating soil organic matter, microbial activity, and nutrient cycling capacity.", type: "Manual", category: "Agriculture", author: "USDA-NRCS" },
      { id: "r13", title: "14. Beef Cattle Nutrition & Feedlot Ration Formulation", description: "Technical specs for calculating metabolisable energy (ME), crude protein, and dry matter intake for beef steers.", type: "Manual", category: "Livestock", author: "ARC South Africa" },
      { id: "r14", title: "15. Smallholder Drip Irrigation Installation Manual", description: "Low-cost solar and gravity drip irrigation setup guide for small acreage farms in water-scarce regions.", type: "Guide", category: "Water Management", author: "IWMI" },
      { id: "r15", title: "16. Hydroponic Nutrient Solution Chemistry", description: "Formulating Hoagland nutrient solutions, managing pH (5.5-6.5) and EC (1.2-2.4 mS/cm) for leafy greens.", type: "Guide", category: "Agriculture", author: "Wageningen University" },
      { id: "r16", title: "17. Poultry Bio-Security & Avian Flu Protocol", description: "Standard operating procedures for sanitation, footbaths, quarantine, and wild bird vector exclusion.", type: "Protocol", category: "Safety", author: "WOAH" },
      { id: "r17", title: "18. Agricultural Export Cold Chain Compliance", description: "Temperature tracking, ethylene scrubbing, and sanitary protocols for fresh fruit export containers.", type: "Manual", category: "Supply Chain", author: "PPECB" },
      { id: "r18", title: "19. Integrated Pest Management (IPM) for Maize & Sorghum", description: "Biological controls, pheromone traps, and eco-friendly spray schedules for fall armyworm control.", type: "Guide", category: "Agriculture", author: "ICIPE" },
      { id: "r19", title: "20. Conservation Tillage & Cover Crop Selection", description: "No-till planter maintenance, cover crop seed mixtures (legumes & radishes), and biomass accumulation.", type: "Manual", category: "Soil", author: "Grain SA" },
      
      // Resources 21 onwards (PRO Tier Exclusive)
      { id: "r20", title: "21. Enterprise Agribusiness Financial Modeling (Pro Exclusive)", description: "Advanced Excel budget templates, cash flow projections, internal rate of return (IRR), and debt service ratios.", type: "Pro Template", category: "Agribusiness", author: "SecureDish Pro Institute" },
      { id: "r21", title: "22. Commercial Swine Herd Breeding & Genetics (Pro Exclusive)", description: "Heterosis matrix, AI straw handling, sow parity management, and piglet mortality reduction blueprints.", type: "Pro Blueprint", category: "Livestock", author: "SecureDish Pro Institute" },
      { id: "r22", title: "23. Satellite Remote Sensing for Crop Health (NDVI) (Pro Exclusive)", description: "GIS satellite image analysis, Sentinel-2 band ratios, and prescription fertilizer mapping guide.", type: "Pro Guide", category: "Technology", author: "SecureDish Pro Institute" },
      { id: "r23", title: "24. Dairy Cattle Parlor Automation & Somatic Cell Counts (Pro Exclusive)", description: "Rotary parlor throughput optimization, mastitis early detection, and automated milk cooling systems.", type: "Pro Manual", category: "Livestock", author: "SecureDish Pro Institute" },
      { id: "r24", title: "25. Climate Adaptation Sovereign Risk Insurance (Pro Exclusive)", description: "Parametric drought insurance policy structures and payout mechanisms for regional food reserve funds.", type: "Pro Paper", category: "Policy", author: "SecureDish Pro Institute" },
      { id: "r25", title: "26. High-Tech Greenhouse Climate Controls (Pro Exclusive)", description: "Vapor pressure deficit (VPD) optimization, CO2 enrichment (1000ppm), and thermal curtain installation.", type: "Pro Guide", category: "Agriculture", author: "SecureDish Pro Institute" },
      { id: "r26", title: "27. Permaculture Food Forest Guild Mapping (Pro Exclusive)", description: "7-layer canopy blueprints, nitrogen-fixing root systems, and perennial yield schedules.", type: "Pro Blueprint", category: "Agriculture", author: "SecureDish Pro Institute" },
      { id: "r27", title: "28. Grain Silo Pest Fumigation & Moisture Safety (Pro Exclusive)", description: "Phosphine gas application, moisture monitoring (below 12.5%), and aflatoxin prevention standards.", type: "Pro Standard", category: "Safety", author: "SecureDish Pro Institute" },
      { id: "r28", title: "29. Regional Food Logistics Optimization Models (Pro Exclusive)", description: "Linear programming algorithms for minimizing transportation fuel costs and truck turnaround times.", type: "Pro Paper", category: "Supply Chain", author: "SecureDish Pro Institute" },
      { id: "r29", title: "30. Agroforestry Timber & Crop Intercropping (Pro Exclusive)", description: "Silvopasture layouts, acacia shade tree density, and soil carbon sequestration credit accounting.", type: "Pro Manual", category: "Climate", author: "SecureDish Pro Institute" },
      { id: "r30", title: "31. Organic Fertilizer Composting & Biochar Blends (Pro Exclusive)", description: "Carbon-to-Nitrogen ratio (30:1) balancing, aerobic thermophilic turning, and biochar inoculation.", type: "Pro Guide", category: "Soil", author: "SecureDish Pro Institute" },
      { id: "r31", title: "32. Agricultural Export Customs & Phytosanitary Certificates (Pro Exclusive)", description: "WTO SPS agreements, quarantine inspection checklists, and border post clearance procedures.", type: "Pro Guide", category: "Policy", author: "SecureDish Pro Institute" },
      { id: "r32", title: "33. Sheep & Goat Feed Intake & Pasture Rotation (Pro Exclusive)", description: "Carrying capacity calculations (LSU), veld condition scoring, and camp resting cycles.", type: "Pro Manual", category: "Livestock", author: "SecureDish Pro Institute" },
      { id: "r33", title: "34. Farm Worker Occupational Health & Safety Compliance (Pro Exclusive)", description: "OHSA audit checklists, PPE standards, pesticide handler medical screening, and emergency plans.", type: "Pro Toolkit", category: "Safety", author: "SecureDish Pro Institute" },
      { id: "r34", title: "35. Renewable Solar PV & Biogas Farm Integration (Pro Exclusive)", description: "Off-grid solar pump sizing, slurry anaerobic digester methane capture, and dual-fuel generators.", type: "Pro Blueprint", category: "Operations", author: "SecureDish Pro Institute" }
    ]
  });
});

// 4. AI Advisor Chat API Route
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
  }

  const ai = getAiClient();
  if (!ai) {
    // If Gemini key is not set, provide an elegant mock/educational response
    const lastMessage = messages[messages.length - 1]?.content || "";
    let reply = "Hello! I am the SecureDish AI Advisor. It looks like the Gemini API Key is not set up in the environment. Here is an educational response based on local intelligence:\n\n";

    if (lastMessage.toLowerCase().includes("drought") || lastMessage.toLowerCase().includes("africa")) {
      reply += "East Africa is currently facing elevated drought risk (Supply index: 52%, Trend: Down). Recommended strategies include:\n1. Cultivating drought-tolerant crops like sorghum, cassava, and millet.\n2. Implementing drip irrigation systems and soil mulching to conserve moisture.\n3. Creating local seed banks and buffer grain stockpiles.";
    } else if (lastMessage.toLowerCase().includes("supply") || lastMessage.toLowerCase().includes("chain") || lastMessage.toLowerCase().includes("resilience")) {
      reply += "Food supply chain resilience relies heavily on cold chain logistics, multi-tier traceability, and supplier diversification. Implementing cold-storage facilities near regional transport hubs dramatically cuts spoilage losses.";
    } else {
      reply += "SecureDish focuses on three main action paths: monitoring regional supply, assessing environmental/geopolitical risk alerts, and raising knowledge through our open courses (Sustainable Agriculture, Supply Chain Resilience, Climate Adaptation). How can I assist you with sustainable crop management, trade bottlenecks, or climate adaptation strategies today?";
    }

    return res.json({ text: reply });
  }

  try {
    // Prepare the system instruction
    const systemInstruction = `You are the SecureDish Food Security & Sustainability Advisor. 
You are an expert in agriculture, sustainable farming, climatology, supply chain logistics, and food equity.
Your goal is to provide highly scientific, accurate, practical, and constructive advice.
You have access to current SecureDish dashboard state:
- Monitored region status shows high drought risk in East Africa (Index: 52%, Trend: Down), mild distress in South Asia (68%) and South America (74%).
- Grains, vegetables, dairy, and proteins are monitored.
- Active risks include drought in East Africa, port congestion in Southeast Asia, and fertilizer shortage in South America.

Use this context when answering where relevant. Keep your responses structured with bullet points and clear, professional language.`;

    // Map message history to GenAI SDK contents format
    // GoogleGenAI SDK expectations: { contents: [{ role: 'user', parts: [{ text: '...' }] }] }
    const contents = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I apologize, but I could not formulate a response at this moment. Please try asking in a different way.";
    res.json({ text: replyText });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: `AI Generation failed: ${err.message || err}` });
  }
});

// Vite middleware & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SecureDish Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
