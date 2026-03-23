const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const { scorePatient } = require('../services/scoringService');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('priority_score', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const patient = req.body;
  const priority_score = await scorePatient(patient);
  const { data, error } = await supabase
    .from('patients')
    .insert([{ ...patient, priority_score }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  await supabase
    .from('resources')
    .update({ available: true, assigned_to: null })
    .eq('assigned_to', id);

  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Patient removed' });
});
module.exports = router;