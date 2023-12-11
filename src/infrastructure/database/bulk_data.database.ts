import { execSync } from 'child_process';
import { platform } from 'os';
import { join } from 'path';

export default function ExecBulkData(): void {
  try {
    const scriptName = 'bulk_data';
    const scriptExtension = platform() === 'win32' ? 'bat' : 'sh';
    const scriptPath = join(
      __dirname,
      `../../../scripts/bash/${scriptName}.${scriptExtension}`,
    );

    execSync(scriptPath, {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Error al ejecutar el script:', error);
    process.exit(1);
  }
}
