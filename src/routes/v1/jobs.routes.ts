import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Jobs list');
});

router.get('/:id', (req, res) => {
  res.send(`Job ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('Job created');
});

router.patch('/:id', (req, res) => {
  res.send(`Job ${req.params.id} updated`);
});

router.delete('/:id', (req, res) => {
  res.send(`Job ${req.params.id} deleted`);
});

export default router;
