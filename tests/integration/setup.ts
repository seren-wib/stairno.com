import { execSync } from 'node:child_process';

// Build once for the whole integration project. Tests only read dist/.
export default function setup(): void {
  execSync('npx astro build', { stdio: 'inherit' });
}
