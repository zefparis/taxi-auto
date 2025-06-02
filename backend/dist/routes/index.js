"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const ride_routes_1 = __importDefault(require("./ride.routes"));
const router = express_1.default.Router();
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/rides', ride_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map