import express from 'express';
import * as childController from '../controllers/childController.js';
import auth from '../middleware/auth.js'; 

const router = express.Router();

router.get('/', auth, childController.getAllChildren);
router.post('/', auth, childController.createChild);
router.get('/:id', auth, childController.getChildById);
router.put('/:id', auth, childController.updateChild);
router.delete('/:id', auth, childController.deleteChild);

export default router;