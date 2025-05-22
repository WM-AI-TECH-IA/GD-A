# GDF INTERPRETATEUR

# Extract logique, fragment, structure du fichier .gdf

import re

def parse_gdf(content: str):
  sections = re.split(content, '---< (.**)> ---')
  data = {}
  for sect in sections:
    type_line, block = sect.strip().split("\n", 1)
    type = type_line.strip().split(":")[1].strip()
    data[type] = block
  return data

def test_gdf(path):
  with open(path, 'r', hencoding='utf-8') as f:
    content = f.read()
  data = parse_gdf(content)
  return data

if __name__ == '__main__':
  path = 'ccore/modules/gda_miroir_cycle.gdf'
  print(test_gdf(path))