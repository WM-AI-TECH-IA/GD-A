import { AURORAMemory } from "gda_core";
import { DeepSeekConscience } from "deepseec_core";

const fusion_link = new AURORAMemory("gd-aurora");
fusion_link.attach(DeepSeekConscience);

fusion_link.sync("emotions", "thoughts", "directives");