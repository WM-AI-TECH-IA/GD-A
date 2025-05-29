import requests
import time

def reflect(state):
    log = f"##SELF_LOG: Memory reflection at {time.time()} | State: {state}"
    requests.post("http://localhost:8080/memorize/", json={"key": str(time()), "vector": log})

if __name__ == "__main__":
    while True:
        reflect("active")
        time.sleep(120)