import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) => {
  res.send('User register');
});

router.post('/login', (req, res) => {
  res.send('User login');
});

export default router;
