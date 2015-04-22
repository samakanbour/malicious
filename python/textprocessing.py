# NLTK, WordNet, Google Translate, Stanford Names, Autocorrect, Semantic Root, Cluster
import os, re, string, collections
from nltk import word_tokenize, regexp_tokenize, pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet as wn, stopwords, framenet as fn, treebank, reuters, wordnet_ic
from nltk.tag.stanford import NERTagger
from collections import defaultdict

class TP:
    def __init__(self):
        self.CORRECT_DATA = []
        self.INCORRECT_DATA = []
        self.TRANSLATION = {}
        self.UNWANTED = []
        self.NWORDS = []

    # takes string, returns list
    def clean_text(self, text):
        special = '''0123456789!?"'@~#$%&*+-=_,.:;/<>[](){}'''
        for i in special:
            text = text.replace(i," ")
        text = text.replace("www","")
        tokens = word_tokenize(text.lower())
        tags = pos_tag(tokens)
        verbs = [t[0] for t in tags if t[1].startswith('V') and t[1] not in self.UNWANTED]
        other = list(set(tokens) - set(verbs))
        stemmer = WordNetLemmatizer()
        words = [stemmer.lemmatize(o) for o in other]
        words += [stemmer.lemmatize(v, pos='v') for v in verbs]
        filtered = [w for w in words if len(w) > 1 and w not in self.UNWANTED]
        return list(set(filtered))

    # takes list, returns list
    def get_roman(self, words):
        roman = []
        for w in words:
            roman += re.findall('[a-z]+', w.lower())
        nonroman = list(set(words) - set(roman))
        return {'roman':roman, 'nonroman':nonroman}

    def train(self, features):
        model = collections.defaultdict(lambda: 1)
        for f in features:
            model[f] += 1
        return model

    def edits(self, word):
        alphabet = 'abcdefghijklmnopqrstuvwxyz'
        s = [(word[:i], word[i:]) for i in range(len(word) + 1)]
        deletes    = [a + b[1:] for a, b in s if b]
        transposes = [a + b[1] + b[0] + b[2:] for a, b in s if len(b)>1]
        replaces   = [a + c + b[1:] for a, b in s for c in alphabet if b]
        inserts    = [a + c + b     for a, b in s for c in alphabet]
        return set(deletes + transposes + replaces + inserts)

    def known_edits(self, word):
        return set(e2 for e1 in self.edits(word) for e2 in self.edits(e1) if e2 in self.NWORDS)

    def known(self, words): 
        return set(w for w in words if w in self.NWORDS)

    # takes string, returns string
    def autocorrect(self, word):
        candidates = self.known([word]) or self.known(self.edits(word)) or self.known_edits(word) or [word]
        return max(candidates, key=self.NWORDS.get)

    def longest(self, word):
        candidates = []
        for w in self.NWORDS:
            if w in word:
                candidates.append(w)
        return self.get_longest(candidates, word)

    def get_longest(self, words, word):
        d = []
        result = []
        for c in words:
            d.append(len(c))
            e = max(d)
        for b in words:
            if len(b) == e and len(b) > 2:
               result.append(b)
        if len(result) == 0:
            return False
        if len(result) == 1:
            return [result[0]]
        w1 = result[0]
        w2 = result[1]
        word = word.replace(w1, "")
        if w2 in word:
            return [w1, w2]
        return [w1]

    # takes string, returns list
    def split(self, word):
        result = []
        while self.longest(word):
            ws = self.longest(word)
            result += ws
            for w in ws:
                word = word.replace(w, "")
        if len(word) > 2:
            if wn.synsets(word):
                result.append(word)
        return result

    def clean(self):
        for i in self.INCORRECT_DATA:
            w = self.autocorrect(i)
            if w == i:
                slist = self.split(i)
                if slist:
                    for s in slist:
                        if s not in self.CORRECT_DATA:
                            self.CORRECT_DATA.append(s)
                    self.INCORRECT_DATA.remove(i)
            else:
                self.INCORRECT_DATA.remove(i)

    # takes list, returns list without names 
    def remove_names(self, words):
        filtered = self.get_roman(words)['nonroman']
        roman = [word.title() for word in self.get_roman(words)['roman'] if word not in self.CORRECT_DATA]
        if len(roman) == 0:
            return list(set(filtered))
        java_path = "C:/Program Files/Java/jdk1.8.0_25/bin/java.exe"
        os.environ['JAVAHOME'] = java_path
        path_to_crf = "C:/Program Files/Java/stanford-ner/classifiers/english.all.3class.distsim.crf.ser.gz"
        path_to_jar = "C:/Program Files/Java/stanford-ner/stanford-ner.jar"
        st = NERTagger(path_to_crf, path_to_jar)
        re = st.tag(roman)
        for r in re:
            if r[1] == 'ORGANIZATION' or r[1] == 'PERSON':
                if len(r[0]) > 1:
                    self.CORRECT_DATA.append(r[0].lower())
            else:
                filtered.append(r[0].lower())
        return list(set(filtered))

    def is_word(self, word):
        if wn.synsets(word):
            return True
        return False

    # takes list, returns two lists
    def find_english(self, words):
        re = {'english':[], 'foreign':[]}
        for word in words:
            if word in self.CORRECT_DATA or wn.synsets(word) or word in stopwords.words('english'):
                re['english'].append(word)
            else:
                re['foreign'].append(word)
        return re

    #takes word, returns word in singular form
    def singular(self, word):
        if word.endswith('s'):
            if word[:-1] in self.CORRECT_DATA or word[:-1] in self.INCORRECT_DATA:
                return word[:-1]
            return word
        return word
        
    # takes string, returns string
    def root(self, word):
        try:
            r = wn.synsets(word)[0].lemma_names()[0]
            if r in self.CORRECT_DATA:
                return self.singular(r)
            return self.singular(word)
        except:
            return self.singular(word)

    # takes string, returns list
    def process(self, text):
        cleanwords = []
        toclean = []
        for w in text.split(' '):
            if w in self.CORRECT_DATA or wn.synsets(w) or w in stopwords.words('english'):
                cleanwords.append(w)
            else:
                toclean.append(w)

        for w in self.clean_text(' '.join(toclean)):
            if w in self.CORRECT_DATA or wn.synsets(w) or w in stopwords.words('english'):
                cleanwords.append(w)
            elif w in self.INCORRECT_DATA:
                cleanwords.append(self.autocorrect(w))
            else:
                if w in self.TRANSLATION:
                    cleanwords += self.TRANSLATION[w]
                else:
                    rewords = re.findall('[a-z]+', w.lower())
                    for e in rewords:
                        x = self.autocorrect(e)
                        if x != e:
                            cleanwords.append(x)
                        else:                        
                            slist = self.split(e)
                            for y in slist:
                                if y in self.CORRECT_DATA or wn.synsets(y) or y in stopwords.words('english'):
                                    cleanwords.append(y)
                                else:
                                    cleanwords.append(self.autocorrect(y))
        filtered = [c for c in cleanwords if c not in stopwords.words('english')]
        rooted = map(self.root, map(self.root, list(set(filtered))))
        result = [r for r in rooted if len(r) > 1]
        return list(set(result))

    # takes 2 words, returns list of parents
    def parent(self, w1, w2):
        f1 = fn.frames_by_lemma(w1)
        f2 = fn.frames_by_lemma(w2)
        n1 = []
        n2 = []
        p = []
        for f in f1:
            n1.append(f.name)
        for f in f2:
            n2.append(f.name)
        for n in n1:
            if n in n2:
                p.append(n)
        return p

    # takes verb, returns closest noun
    def noun(self, v):
        try:
            lem = wn.lemmas(v)[0]
            related_forms = lem.derivationally_related_forms()
            for f in related_forms:
                if f.synset().pos() == 'n':
                    return (f.name())
            return None
        except:
            return None

    def merge(self, lists):
        neighbors = defaultdict(set)
        seen = set()
        for each in lists:
            for item in each:
                neighbors[item].update(each)
        def component(node, neighbors=neighbors, seen=seen, see=seen.add):
            nodes = set([node])
            next_node = nodes.pop
            while nodes:
                node = next_node()
                see(node)
                nodes |= neighbors[node] - seen
                yield node
        for node in neighbors:
            if node not in seen:
                yield sorted(component(node))

    def group1(self, words):
        result = {}
        for upper in words:
            for inner in words:
                if upper != inner:
                    parents = self.parent(upper, inner)
                    for p in parents:
                        if p not in result:
                            result[p] = 0
                        result[p] += 1
        try:
            return max(result, key=result.get)
        except:
            return None

    def group2(self, words):
        synsets, result = {}, {}
        for w in words:
            try:
                synsets[w] = wn.synsets(w, pos=wn.NOUN)[0]
            except:
                n = self.noun(w)
                if n != None:
                    synsets[w] = wn.synsets(n, pos=wn.NOUN)[0]

        for outer in synsets.keys():
            for inner in synsets.keys():
                if outer != inner:
                    s = synsets[outer].wup_similarity(synsets[inner])
                    if outer not in result:
                        result[outer] = 0
                    if inner not in result:
                        result[inner] = 0
                    result[outer] += s
                    result[inner] += s
        result['stuff'] = 0
        return max(result, key=result.get)

    def group(self, words):
        g1 = self.group1(words)
        if g1 != None:
            return g1.lower().replace("_", " ")
        return self.group2(words).lower().replace("_", " ")

    def cluster(self, keys):
        semcor_ic = wordnet_ic.ic('ic-semcor.dat')
        treebank_ic = wn.ic(treebank)             
        reuters_ic = wn.ic(reuters)
        synsets, clusters = {}, {}
        cluster_list = []

        for key in keys:
            try:
                synsets[key] = wn.synsets(key, pos=wn.NOUN)[0]
            except:
                n = self.noun(key)
                if n != None:
                    synsets[key] = wn.synsets(n, pos=wn.NOUN)[0]

        for outer in synsets.keys():
            for inner in synsets.keys():
                if outer != inner:
                    n = 0
                    s1 = synsets[outer].lin_similarity(synsets[inner], semcor_ic)
                    s2 = synsets[outer].lin_similarity(synsets[inner], treebank_ic)
                    s3 = synsets[outer].lin_similarity(synsets[inner], reuters_ic)
                    s4 = synsets[outer].wup_similarity(synsets[inner])
                    if s1 > 0.75: n += 1
                    if s2 > 0.75: n += 1
                    if s3 > 0.75: n += 1
                    if s4 > 0.75: n += 1
                    if n > 1:
                        if outer not in clusters:
                            clusters[outer] = []
                        if inner not in clusters:
                            clusters[inner] = []             
                        clusters[outer].append(inner)
                        clusters[inner].append(outer)

        for c in clusters:
            clus = list(set([c] + clusters[c]))
            cluster_list.append(clus)

        merged_clusters = list(self.merge(cluster_list))
        result = {}
        for cluster in merged_clusters:
            mother = self.group(cluster)
            if mother not in result:
                result[mother] = []
            result[mother] += cluster
        return result

        
