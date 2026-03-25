import { analyzeSymptoms } from "../services/geminiservice.js";
const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

router.post('/', async (req, res) => {
  const { patient_id, resource_id, resource_type } = req.body;
  router.post('/recommend', async (req, res) => {
  try {
    const { symptoms } = req.body;

    const aiData = await analyzeSymptoms(symptoms);

    // MOCK hospitals (you can replace later with DB)
    const hospitals = [
      { name: "City Hospital", icu: 2, waitTime: 10 },
      { name: "Care Medical", icu: 1, waitTime: 5 },
      { name: "LifeCare", icu: 3, waitTime: 15 }
    ];

    let filtered = hospitals;

    if (aiData.hospitalType === "ICU") {
      filtered = hospitals.filter(h => h.icu > 0);
    }

    const best = filtered.sort((a, b) => a.waitTime - b.waitTime)[0];

    res.json({
      hospital: best,
      urgency: aiData.urgency,
      reason: `Based on symptoms, ${aiData.hospitalType} care required`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .update({ status: 'allocated', allocated_resource: resource_type })
    .eq('id', patient_id)
    .select();

  if (patientError) return res.status(500).json({ error: patientError.message });

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .update({ available: false, assigned_to: patient_id })
    .eq('id', resource_id)
    .select();

  if (resourceError) return res.status(500).json({ error: resourceError.message });

  res.json({ 
    message: 'Resource allocated successfully',
    patient: patient[0],
    resource: resource[0]
  });
});

module.exports = router;