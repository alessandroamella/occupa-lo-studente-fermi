import "./_envs";
import { connectToDb } from "./db";
import "./swagger";

// Envs._loadEnvs();

export async function loadConfig() {
    await connectToDb();
}

export * from "./_envs";
export * from "./db";
export * from "./swagger";
