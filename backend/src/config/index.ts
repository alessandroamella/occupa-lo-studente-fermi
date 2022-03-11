import { loadEnvs } from "./_envs";
import { connectToDb } from "./db";
import "./swagger";

export async function loadConfig() {
    loadEnvs();
    await connectToDb();
}

export { envs } from "./_envs";
