import json
import torch
import numpy as np

phoneme_grouped_ctc_removed = torch.load('/home/felix/Documents/Mines/Césure/_Stage Télécom/test_Tom McKenzie - Directions.pt').numpy()

phoneme_grouped_ctc_removed = phoneme_grouped_ctc_removed.tolist()

with open('data_phoneme.json', 'w') as outfile:
    outfile.write("data_phoneme = '")
    json.dump(phoneme_grouped_ctc_removed, outfile)
    outfile.write("'")


