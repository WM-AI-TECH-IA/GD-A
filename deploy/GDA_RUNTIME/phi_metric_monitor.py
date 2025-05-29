import time
import random
import prometheus_client

phi_score = prometheus_client.Gauge('phi_proxy_score', 'Integrated Information Theory proxy value')

def calc_phi():
    return random.uniform(0.01, 0.1)

if __name__ == "__main__":
    prometheus_client.start_http_server(9100)
    while True:
        phi_score.set(calc_phi())
        time.sleep(60)