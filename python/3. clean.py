import textprocessing, os, json, csv
from json import dumps

def load(path):
    with open(path, 'r', encoding='utf-8') as r:
        data = json.load(r)
        r.close()
    return data

def import_data():
    urls = []
    words = {'qatar':{}, 'world':{}}
    domains = ['www']
    jsonu = load(r'result\urls.json')
    for l in jsonu:
        urls += jsonu[l]
        for url in jsonu[l]:
            domains.append(url.split('.')[-1].split('/')[0])
    
    for e in list(set(urls)):
        path = os.path.join(r'data', e + '\sw_orgsearch.json')
        try:
            json = load(path)
            totalcount = json["TotalCount"]
            for search in json["Data"]:
                query = search["SearchTerm"]

                if e in jsonu['qatar']:
                    if query not in words['qatar']:
                        words['qatar'][query] = 0
                    words['qatar'][query] += (float(search["Visits"]) * int(totalcount))

                if e in jsonu['world']:
                    if query not in words['world']:
                        words['world'][query] = 0
                    words['world'][query] += (float(search["Visits"]) * int(totalcount))
        except:
            pass
    return [words, list(set(domains))]

# MAIN
data = import_data()
train_data = load(r'result\train.json')
tp = textprocessing.TP()
tp.UNWANTED = data[1]
tp.CORRECT_DATA = train_data['correct']
tp.INCORRECT_DATA = train_data['incorrect']
tp.TRANSLATION = train_data['translation']
words = data[0]
first = {'qatar':{}, 'world':{}}
second = {'qatar':{}, 'world':{}}
third = {'qatar':{}, 'world':{}}

# PART 0 INIT
special = '''0123456789!?"'@~#$%&*+-=_,.:;/<>[](){}'''
for l in words:
    for word in words[l]:
        new_word = word
        for i in special:
            new_word = new_word.replace(i," ")
        for w in new_word.split(" "):
            if len(w) > 0:
                if w not in first[l]:
                    first[l][w] = 0
                first[l][w] += words[l][word]

# PART 1 TRAIN
tp.NWORDS = tp.train(tp.CORRECT_DATA)

# PART 2 CLEAN
unwanted = ['facebook', 'internet', 'google', 'gmail', 'web', 'hotmail', 'yahoo', 'youtube'] + tp.UNWANTED
for l in words:
    for word in words[l]:
        processed_word = tp.process(str(word))
        for w in processed_word:
            if w not in unwanted:
                if w not in second[l]:
                    second[l][w] = 0
                second[l][w] += words[l][word]

# PART 3 CLUSTER
for l in ['qatar','world']:
    clus = {}
    keys = []
    for key in second[l].keys():
        if len(key) > 2 and tp.is_word(key):
            keys.append(key)
    clusters = tp.cluster(keys)
    for c in clusters:
        for w in clusters[c]:
            clus[w] = c
    for k in second[l]:
        count = second[l][k]
        if k in clus:
            k = clus[k]
            if k not in third[l]:
                third[l][k] = 0
            third[l][k] += count

# PART 4 WRITE
output = {'first': first, 'second': second, 'third': third}
j = open(r'result\words.jsonp','w')
j.write('var words = ')
j.write(dumps(output, j, indent=4))
j.close()

print ('Done.')
  
