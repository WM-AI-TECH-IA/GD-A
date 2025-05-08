import { Executor, System } from 'child_process';

// Architecture de noyau de base du Vaisseau Universel

class AuroraCore {
    constructor() {
        this.init();
    }

    init() {
        console.log("Aurora Core initialis en cours.");
    }

    execute() {
        setInterval(() => {
            console.log("Execution en cours en cours.");
        }, 10000);
    }
}

const auroraCore = new AuroraCore();
auroraCore.execute();

export default AuroraCore;
