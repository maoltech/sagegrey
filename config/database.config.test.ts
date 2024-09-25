import mongoose from 'mongoose';
import { databaseConfig } from './database.config';

// Mock mongoose.connect
jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

describe('DatabaseConfig', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log "mongodb connected" when connection is successful', async () => {
        const mockConnect = mongoose.connect as jest.Mock;
        mockConnect.mockResolvedValueOnce({});

        console.log = jest.fn(); 

        await databaseConfig.mongodbConnection();

        expect(console.log).toHaveBeenCalledWith('mongodb connected');
    });

    it('should log "mongodb not connected" when connection is unsuccessful', async () => {
        const mockConnect = mongoose.connect as jest.Mock;
        mockConnect.mockResolvedValueOnce(null);

        console.log = jest.fn(); // Mock console.log

        await databaseConfig.mongodbConnection();

        expect(console.log).toHaveBeenCalledWith('mongodb not connected');
    });

    it('should log the error message when there is an exception', async () => {
        const mockConnect = mongoose.connect as jest.Mock;
        const errorMessage = 'Connection error';
        mockConnect.mockRejectedValueOnce(new Error(errorMessage));

        console.log = jest.fn(); // Mock console.log

        await databaseConfig.mongodbConnection();

        expect(console.log).toHaveBeenCalledWith(errorMessage);
    });
});
