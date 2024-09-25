import { Help, helpStatus, IHelp } from "../model/help.model";

class HelpService {
    public async createHelp(data: Partial<IHelp>): Promise<IHelp> {
        try {
            return await Help.create(data);
        } catch (error: any) {
            throw new Error(`Error creating help: ${error.message}`);
        }
    }

    public async getHelpList(userId: string): Promise<IHelp[]> {
        try {
            return await Help.find({userId});
        } catch (error: any) {
            throw new Error(`Error fetching help list: ${error.message}`);
        }
    }

    public async getHelpById(id: string): Promise<IHelp | null> {
        try {
           return await Help.findById(id);
        } catch (error: any) {
            throw new Error(`Error fetching help by ID: ${error.message}`);
        }
    }

    // Get help entries by status
    async getHelpByStatus(status: helpStatus): Promise<IHelp[]> {
        try {
            return await Help.find({ status });
        } catch (error: any) {
            throw new Error(`Error fetching help by status: ${error.message}`);
        }
    }
}

export const helpService = new HelpService();