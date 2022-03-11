import { connectToDb } from "./db";
import "./swagger";

export async function loadConfig() {
    await connectToDb();
}

export { Envs } from "./_envs";
export * from "./db";
export * from "./swagger";
