"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../src/server"); // Keep relative for tests
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../../src/models/user.model"); // Keep relative for tests
describe('Authentication API', () => {
    let server;
    beforeAll(async () => {
        // Connect to test database
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        server = await (0, server_1.startServer)();
    });
    afterAll(async () => {
        await server.stop();
        await user_model_1.User.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    beforeEach(async () => {
        // Clean up users before each test
        await user_model_1.User.deleteMany({});
    });
    describe('POST /api/auth/login', () => {
        it('should return 401 for invalid credentials', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword',
                },
            });
            expect(response.statusCode).toBe(401);
            const payload = JSON.parse(response.payload);
            expect(payload.isOk).toBe(false);
            expect(payload.error).toBeDefined();
        });
        it('should return token for valid credentials', async () => {
            // Create a test user
            const user = new user_model_1.User({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                role: 'user',
            });
            await user.save();
            const response = await server.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            });
            expect(response.statusCode).toBe(200);
            const payload = JSON.parse(response.payload);
            expect(payload.isOk).toBe(true);
            expect(payload.data.token).toBeDefined();
            expect(payload.data.user).toBeDefined();
            expect(payload.data.user.email).toBe('test@example.com');
        });
    });
});
//# sourceMappingURL=auth.test.js.map