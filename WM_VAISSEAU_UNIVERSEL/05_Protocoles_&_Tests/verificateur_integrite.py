import hashlib
import os

def test_file_integrity(file_path):
    try:
        with open(file_path, "rb") as f:
            contents = f.read()
            print("File: " + file_path)
            hash = hashlib.sha256(contents.encode())
            print("SHA256 Hash: ", hash)
    except FileNotFoundError:
        print("File introvable ou acco