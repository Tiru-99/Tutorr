import { PrismaClient } from "@prisma/client";

class PrismaInstance {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!PrismaInstance.instance) {
            PrismaInstance.instance = new PrismaClient();
        }
        return PrismaInstance.instance;
    }
}

const prisma = PrismaInstance.getInstance();

export const connectDB = async () => {
    await prisma.$connect();
};

export const disconnectDB = async () => {
    await prisma.$disconnect();
};

export default prisma;