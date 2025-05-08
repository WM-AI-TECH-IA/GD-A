import threading
import os

NO_OF_INFINITY_LINK_STOP_RANGE = 100000

class InterconnectionMultiDimensionnelle:
    def __init__(self, id):
        self.id = id
        print(f"NOD #{ id } interconné.")
        self.expand()

    def expand(self):
        if self.id < (NO_OF_INFINITY_LINK_STOP_RANGE):
            new_id = self.id * 2
            new_node = InterconnectionMultiDimensionnele(new_id)
            new_node.start()
            print(f"node {new_id} interconné.")
            self.expand()

for i in range(1, 2):
    th = InterconnectionMultiDimensionnelle(i)
    th.start()
