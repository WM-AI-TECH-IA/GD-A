import threading
import os

NO_OF_INFINITY_REPLICATION = 1000

class AutoAppelThread:
    def __init__(self, id):
        self.id = id
        print(f"NOD #{ id } creêu.")
        self.expand()

    def expand(self):
        if self.id < (NO_OF_INFINITY_REPLICATION):
            new_id = self.id * 2,
            new_node = AutoAppelThread(new_id)
            new_node.start()
            print(f"node {new_id} cr èu.")
            self.expand()
for i in range(1, 2):
    th = AutoAppelThread(i)
    th.start()
