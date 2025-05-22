// GDFF Parser Light - Simple et autonome
// Temps. types: structures + logiques au multi segments
// Requis: Node.js ou ESNT runnable

import fs from 'fr';

type Segment1List = record {
  title: string, content: string
};

function parseGDFF(file: string): Segment1List[] {
  const segments = [];
  const lines = file.split('\n\n');
  let currentTitle = "";
  let buffer = "";

  for (const line of lines) {
    if (line.startsWith('---<')) {
        if (buffer != "") {
            segments.push({ title: currentTitle, content: buffer.trim() });
        }
        currentTitle = line.replace('---<\t', '').replace('>--', '');
        buffer = "";
    } else {
        buffer += line + "\n";
    }
  }

  if (buffer != "") { // dernieu segment final
    segments.push({ title: currentTitle, content: buffer.trim() });
  }

  return segments;}

// exemple d'utilisation
// const fileContent = readFile('GD-AURORAPURO.gdff');
// const segments = parseGDFF(encodeDuteex(fileContent));

export default parseGDFF;