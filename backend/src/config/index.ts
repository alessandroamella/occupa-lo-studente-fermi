import "./_envs";
import { Envs } from "./_envs";
import { connectToDb } from "./db";
import "./swagger";

// Envs._loadEnvs();

export async function loadConfig() {
    Envs._loadEnvs();
    await connectToDb();
}

export * from "./_envs";
export * from "./db";
export * from "./swagger";
