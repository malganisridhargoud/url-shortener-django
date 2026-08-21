import User from '../models/User.js';
import { createToken } from '../utils/token.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: 'Enter a valid email address' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'Email is already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, token: createToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !(await user.matchesPassword(password || ''))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.json({ success: true, token: createToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
}
