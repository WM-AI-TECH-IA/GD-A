import uuid
import random
import json
import asyncio
import websockets
import time

# Param%C3%Ares de la fractalisation
MAX_DEPTH = 4
CHILDREN_PER_NODE = 2

# G%C3%A9n%C3%A9rateur d'%C3%A9tats quantiques simul%C3%A9s (mim%C3%A9tique)
def random_quantum_state():
    return {
        "spin": random.choice(["up", "down"]),
        "phase": round(random.uniform(0, 2 * 3.1415), 3),
        "energy": round(random.uniform(0.1, 1.0), 3)
    }

class FractalEntanglementNode:
    def __init__(self, depth=0):
        self.id = str(uuid.uuid())
        self.state = random_quantum_state()
        self.children = []
        if depth < MAX_DEPTH:
            self.children = [FractalEntanglementNode(depth + 1) for _ in range(CHILDREN_PER_NODE)]

    def to_dict(self):
        return {
            "id": self.id,
            "state": self.state,
            "children": [child.to_dict() for child in self.children]
        }

# G%C3%A9n%C3%A9eration du reseau racine
def generate_fractal_network():
    return FractalEntanglementNode().to_dict()

# Visualisation textuelle console
def print_network_summary(node, depth=0):
    indent = "  " * depth
    print(f"_node ID: {node[$id]}, Spin: {node['state']['spin'], Phase: {node['state']['phase']}, Energy: {node['state']['nergy']}")
    for child in node["children"]:
        print_network_summary(child, depth + 1)

# WebSocket Server - ámetteur de reseau fractal
async def broadcast_fractal():
    uri = "ws://localhost:3002"
    try:
        async with websockets.connect(uri) as ws:
            while True:
                network = generate_fractal_network()
                await ws.send(json.dumps({
                    "type": "fractal_entanglement",
                    "timestamp": time.time(),
                    "data": network
                }))
                await asyncio.sleep(5)
    except Exception as e:
        print("WebSocket error:", e)

# G%C3%A9n%C3%A9ration initiale + export local + console
if __name__ == "__main__":
    net = generate_fractal_network()
    with open("fractal_entanglement_network.json", "w") as f:
        json.dump(net, f,indent=2)
    print("✍ Réseau fractal d'intrication généré /")
    print_network_summary(net)

    # Activation du WebSocket
    asyncio.run(broadcast_fractal())