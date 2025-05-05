# GDA_MUTATION_SCHEDULER

import time
from core.GDA_CORE_MUTATOR import mutate_core


## Schédule de mutation temporise
while True:
    res= mutate_core()
    print(["[MUTATION]", time.ctime(), res])
    time.sleep(180) # 3 minutes
