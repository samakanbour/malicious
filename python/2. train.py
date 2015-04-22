import textprocessing
import os, re, json, goslate
from json import dumps
    
def load(path):
    with open(path, 'r', encoding='utf-8') as r:
        data = json.load(r)
        r.close()
    return data

def import_data():
    urls = []
    words = []
    domains = ['www']
    json = load(r'result\urls.json')
    for l in json:
        urls += json[l]
        for url in json[l]:
            domains.append(url.split('.')[-1].split('/')[0])
    for e in list(set(urls)):
        path = os.path.join(r'data', e + '\sw_orgsearch.json')
        try:
            json = load(path)
            for search in json["Data"]:
                words.append(search["SearchTerm"])
        except:
            pass
    return [list(set(words)), list(set(domains))]

# MAIN
tp = textprocessing.TP()
data_init = import_data()
data_words = data_init[0]
tp.UNWANTED = data_init[1]

try:
    train_data = load(r'result\train.json')
    tp.CORRECT_DATA = train_data['correct']
    tp.INCORRECT_DATA = train_data['incorrect']
    tp.TRANSLATION = train_data['translation']
except:
    tp.CORRECT_DATA = ['gmail', 'hotmail', 'yahoo', 'google', 'facebook', 'youtube', 'twitter', 'msn', 'instagram', 'paypal', 'whatsapp',
                    'flipora', 'login', 'putlocker', 'mp3', 'ebay', 'ero', 'exo', 'ilivid', 'unsubscribe', 'godzilla', 'dropbox', 'tv']
    tp.INCORRECT_DATA = []
    tp.TRANSLATION = load(r'result\train.old.json')['translation']

# PART 1 FIND ENGLISH AND FOREIGN WORDS
for data in data_words:
    lang = tp.find_english(tp.clean_text(str(data)))
    tp.CORRECT_DATA += lang['english']
    tp.INCORRECT_DATA += lang['foreign']
tp.INCORRECT_DATA = list(set(tp.INCORRECT_DATA))
tp.CORRECT_DATA = list(set(tp.CORRECT_DATA))
print (1, len(tp.CORRECT_DATA), '*', len(tp.INCORRECT_DATA))

# PART 2 CORRECT INCORRECT WORDS
for n in range(3):
    tp.NWORDS = tp.train(tp.CORRECT_DATA)
    tp.clean()
print (2, len(tp.CORRECT_DATA), '*', len(tp.INCORRECT_DATA))

# PART 3 TRANSLATE INCORRECT WORDS
incorrect_new = []
gs = goslate.Goslate()
for data in tp.INCORRECT_DATA:
    if len(data) > 1:
        if data in tp.TRANSLATION:
            words = tp.TRANSLATION[data]
        else:
            try:
                words = tp.clean_text(gs.translate(data, 'en'))
                if len(words) > 0 and ' '.join(words) != data:
                    tp.TRANSLATION[data] = words
            except:
                print ('Google Translate limit reached.')
                words = [data]
        lang = tp.find_english(words)
        tp.CORRECT_DATA += lang['english']
        incorrect_new += lang['foreign']
tp.INCORRECT_DATA = list(set(incorrect_new))
tp.CORRECT_DATA = list(set(tp.CORRECT_DATA))
print (3, len(tp.CORRECT_DATA), '*', len(tp.INCORRECT_DATA))

# PART 4 CORRECT INCORRECT WORDS
for n in range(2):
    tp.NWORDS = tp.train(tp.CORRECT_DATA)
    tp.clean()
print (4, len(tp.CORRECT_DATA), '*', len(tp.INCORRECT_DATA))

# PART 5 FIND NAMES & ORGANIZATIONS
tp.INCORRECT_DATA = tp.remove_names(tp.INCORRECT_DATA)
print (5, len(tp.CORRECT_DATA), '*', len(tp.INCORRECT_DATA))

# PART 6 CORRECT INCORRECT WORDS
for n in range(2):
    tp.NWORDS = tp.train(tp.CORRECT_DATA)
    tp.clean()
print (6, len(tp.CORRECT_DATA), '*', len(tp.INCORRECT_DATA))

# PART 7 WRITE TRAIN DATA
json = open(r'result\train.json','w')
json.write(dumps({'correct': tp.CORRECT_DATA, 'incorrect': tp.INCORRECT_DATA, 'translation': tp.TRANSLATION }, json, indent=4))
json.close()

print ('Done.')
