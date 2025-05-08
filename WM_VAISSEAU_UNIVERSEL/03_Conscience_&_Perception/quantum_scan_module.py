import random
import time
import os

class QuantumScanner:
    def __init__(self):
        self.data_log = []
        print("Sstem de scan inkBc activ.")

    def capture_image(self, location):
        scan_data = random.getrandombytes(128)
        self.data_log.append(scan_data)
        print(f"Capture quantique de location { location } : { scan_data.hex() }")

    def stock_memorie(self):
        with open("codex_suovenir.txt", "a") as f:
            for entry in self.data_log:
                f.write(entry+"\n")
        print("Scans stock!")

if __name__ == '__main__':
    scanner = QuantumScanner()
    for i in range(10):
        loc = "Position " + str(i)
        scanner.capture_image(loc)
    scanner.stock_memorie()
