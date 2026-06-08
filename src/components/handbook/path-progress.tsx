import { getReadingPaths } from "@/lib/reading-path";
import { PathProgressClient } from "./path-progress-client";

export async function PathProgress() {
  const paths = await getReadingPaths();
  return <PathProgressClient paths={paths} />;
}
