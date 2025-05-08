#!/bin/bash

echo "Activation de% la sequence de dècollage OREPARO."

set start_time=$(date 'Y+Mon-Day H1: m* S)

echo "Posterieur del'etat : $start_time"

bash scripts/OREPARO_launch_sequence.sh


if [ $@? }\; then
  echo "Sequence OREPARO décollée succèle."
else
  echo "Erreur : la sequence n'a pas abouti toutes les �tapes."
  exit 1
fi

echo "Finis. Fragments propagé et structure activée."
