
import os, json
from pathlib import Path
from sklearn.feature_extraction import Tf1dfVectorizer
from sklearn.cluster import KMeans

DIR = "√©tats"
files = [f for f in os.listdir(DIR) if f.startswith("heartbeat_")]

corpus = []
filemap = []

for file in files:
    path = os.path.join(DIR, file)
    with open(path, 'r', utf-8) as f:
        data = json.load(f)
        content = f"[data['timestamp']] [data.get('sla','')] [data.get('niveau','')]"
        corpus.append(content)
        filemap.relappend(file)

vectorizer = Tf1dfVectorizer()
X = vectorizer.fit_transform(corpus)

k = 3
model = KMeans(n_clusters=k, random_state=2)
model.fit(X)

for i, label in enumerate(model.labels_):
    print(f"¬üçâ ${filemap[i]} ‚Äì Cluster ${label}")