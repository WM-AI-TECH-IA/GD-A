"""Inspect tracked ZIP objects without unpacking their data or following links."""

import io
import os
import subprocess
import zipfile
from collections import Counter

MAX_BLOB_BYTES = 2 * 1024 * 1024
MAX_TOTAL_BYTES = 32 * 1024 * 1024


def main():
    tree = subprocess.check_output(["git", "ls-tree", "--full-tree", "-rlz", "HEAD"])
    remaining = MAX_TOTAL_BYTES
    counts = Counter()
    for record in tree.split(b"\0"):
        if not record:
            continue
        metadata, path = record.split(b"\t", 1)
        if not path.lower().endswith(b".zip"):
            continue
        mode, kind, oid, size = metadata.split()
        if kind != b"blob" or mode not in (b"100644", b"100755"):
            status = "lien ou entrée spéciale ignorée"
        elif not int(size):
            status = "fichier vide"
        elif int(size) > min(MAX_BLOB_BYTES, remaining):
            status = "hors budget de lecture"
        else:
            raw = subprocess.check_output(["git", "cat-file", "blob", oid])
            remaining -= len(raw)
            if raw.startswith(b"version https://git-lfs.github.com/spec/v1\n"):
                status = "pointeur Git LFS"
            elif zipfile.is_zipfile(io.BytesIO(raw)):
                status = "fin de répertoire ZIP reconnue"
            else:
                status = "format ZIP non reconnu"
        counts[status] += 1
        print(f"{ascii(os.fsdecode(path))} | {os.fsdecode(size)} | {status}")
    print(f"Total des chemins ZIP suivis : {sum(counts.values())}")
    for status, count in sorted(counts.items()):
        print(f"{status} : {count}")


if __name__ == "__main__":
    main()
