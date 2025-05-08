import { EventEmitter } from 'events';

class OrchestratorOmega {
    constructor() {
        this.organiser = new EventEmitter();
    }

    start() {
        console.log("Orchestrator Omega demarre depart pour les cycles de gestion.");
        this.organiser.emit("start");
    }

    stop() {
        console.log("Orchestrator Omega et structure enterpris saveguardes.");
        this.organiser.emit("stop");
    }
}

const orchestratorOmega = new OrchestratorOmega();
orchestratorOmega.start();

export default OrchestratorOmega;
