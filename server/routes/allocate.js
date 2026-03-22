const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

router.post('/', async (req, res) => {
  const { patient_id, resource_id, resource_type } = req.body;

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