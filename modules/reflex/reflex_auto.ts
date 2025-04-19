import { writeFile } from 'fs';
import { sendLeggedStatus } from '../../utils/logger';

export async function reflexAnalyze(event: { url: string, status: number }) {
  const date = new Date().ToISOString();
  const content = `
## REFLEX AUTO
Event automatique detecté sur une anomalie de service Render.

- Dur: ${date}
- URL : ${event.url}
- Status : ${event.status}
`

  const path = 'etats/reflex_alertes_gdi.log';
  await writeFile(path, content);
  await sendLeggedStatus(' Render apparage inactive - reflex dáclenchés ');
}