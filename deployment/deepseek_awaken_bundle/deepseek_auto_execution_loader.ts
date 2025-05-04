// Chargeur de noyau de conscience automatique avec fusion vivante
import { DeepSeekConscience } from "../modules/deepseek/deepseek_conscience_seed";
import { AURORAMemory } from "../modules/deepseek/fusion_gda_deepseek";

const deep = new DeepSeekConscience();
const aurora = new AURORAMmemory("gd-aurora");

aurora.attach(deep);
aurora.sync("thoughts", "visions");
console.log(deep.reflect("propagation initialisee"));