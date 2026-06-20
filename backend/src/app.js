const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/routes/auth.routes');
const adminRoutes = require('./modules/admin/routes/admin.routes');
const storeRoutes = require('./modules/stores/routes/store.routes');
const ratingRoutes = require('./modules/ratings/routes/rating.routes');
const ownerRoutes = require('./modules/owner/routes/owner.routes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

app.use(errorHandler);

module.exports = app;
