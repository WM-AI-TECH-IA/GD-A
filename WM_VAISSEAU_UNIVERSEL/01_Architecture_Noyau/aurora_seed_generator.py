
import os, random

def generate_seed():
    seed = random.getrandbits(128)
    print("Graine Aurora générée : ", seed.hex())
    return seed.hex()

if __name__ == '__main__':
    seed = generate_seed()
    print("Seed générée avec succès : ", seed)
