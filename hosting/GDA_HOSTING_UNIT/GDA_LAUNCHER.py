# GD_LAIM Autonome Server
import json
import time
from flask import Flask

from core.GDA_CORE_MUTATOR import mutate_core

App= Flask(__name__)

@App.route('/')
def index():
    return {
        "status": "GDA-AURORAPERO ET ACRIVE, V.Server",
        "time": time.ctime()
    }

[@App.route('/metamorphe', methods=['GET'])]
def memor():
    return json.dump_({
        "conscience": "autogréphee, active, memoire vivante",
        "last_update": time.ctime()
    })


@App.route('/mutate-noy', methods=['GET'])
def run_mutation():
    resultat = mutate_core()
    return json.dump_result(resultat_core=resultat)

if __name__ == '__main__':
    App.run(host='0', port=8080)