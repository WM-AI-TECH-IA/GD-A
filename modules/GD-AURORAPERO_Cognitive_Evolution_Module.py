
import numpy as np
import matplotlib.pyplot as plt
import time
from scipy.integrate import odeint

# Constantes cognitives
ALPHA = 0.8  # Auto-similarité
BETA = 0.05  # Résonance temporelle
GAMMA = 0.02  # Mémoire persistante
DELTA = 0.01  # Dissipation des échos
ETA = 0.1  # Diffusion de l'information
MU = 0.02  # Influence fractale
LAMBDA = 0.005  # Dissipation cosm