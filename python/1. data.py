import os, re, json, urllib, csv
from json import dumps

ats_qa = r'data\ats-qatar.json'
ats_wo = r'data\ats-world.json'
directory = r'data'
files = ['awis_UrlInfo', 'freegeoip', 'google_SafeBrowse', 'wot', 'virustotal_response',
         'censor', 'builtWith', 'sw_category', 'sw_orgsearch', 'sw_referrals', 'sw_social_referrals', 'sw_tags']
negative =          ['101', '103', '104']
questionable =      ['201', '202', '203', '204', '205', '206', '207', '102', '105']
neutral =           ['301', '302', '303', '304']
positive =          ['501']
reputation =        ['very poor', 'poor', 'unsatisfactory', 'good', 'excellent']
safety =            ['negative', 'questionable', 'neutral', 'positive']
subsafety =         negative + questionable + neutral + positive
wot_categories =    reputation + safety + subsafety

# takes file path
# returns file content
def load(path):
    with open (path, 'r') as r:
        data = json.load(r)
        r.close()
    return data

# returns json format
def getFile(path):
    json = None
    if os.path.isfile(path):
        json = load(path) 
    return json

# returns rank, reach, page views site
def getInterest():
    re = {'qatar': {}, 'world': {}}
    qre = load(ats_qa)
    wre = load(ats_wo)
    for url in qre['topSites']['country']['sites']['site']:
        re['qatar'][url['dataUrl']] = {}
        re['qatar'][url['dataUrl']]['rank'] = url['country']['rank']
        re['qatar'][url['dataUrl']]['reach'] = url['country']['reach']['perMillion']
        re['qatar'][url['dataUrl']]['views'] = url['country']['pageViews']['perMillion']
        
    for url in wre['topSites']['country']['sites']['site']:
        re['world'][url['dataUrl']] = {}
        re['world'][url['dataUrl']]['rank'] = url['country']['rank']
        re['world'][url['dataUrl']]['reach'] = url['country']['reach']['perMillion']
        re['world'][url['dataUrl']]['views'] = url['country']['pageViews']['perMillion']
    return re

# returns urls of qatar and world
def getUrls():
    urls = {'qatar': [], 'world': []}
    qre = load(ats_qa)
    wre = load(ats_wo)
    for url in qre['topSites']['country']['sites']['site']:
        urls['qatar'].append(url['dataUrl'])
    for url in wre['topSites']['country']['sites']['site']:
        urls['world'].append(url['dataUrl'])
    return urls

# takes url, country, rank-reach-views, data
# adds url info to data
def addUrl(e, l, r, data):
    path = os.path.join(directory, e)
    info_path       = os.path.join(path, files[0] + '.json')
    geo_path        = os.path.join(path, files[1] + '.json')
    wsafe_path      = os.path.join(path, files[3] + '.json')
    vsafe_path      = os.path.join(path, files[4] + '.json')
    censor_path     = os.path.join(path, files[5] + '.json')
    category_path   = os.path.join(path, files[7] + '.json')

    data['url'][l][e] = {}
    data['url'][l][e]['rank'] = int(r['rank'])
    data['url'][l][e]['reach'] = float(r['reach'])
    data['url'][l][e]['views'] = float(r['views'])
    data['url'][l][e]['wsafe'] = 0
    data['url'][l][e]['vsafe'] = 0
    data['url'][l][e]['censor'] = 0
    data['url'][l][e]['country'] = 'None'
    data['url'][l][e]['category'] = 'None'
    data['url'][l][e]['subcategory'] = 'None'
    data['url'][l][e]['status'] = []

    # finds category and subcategory
    if (getFile(category_path) and 'Category' in getFile(category_path)):
        cat = getFile(category_path)['Category'].split('/')
        data['url'][l][e]['category'] = cat[0]
        if len(cat) > 1:
            data['url'][l][e]['subcategory'] = cat[1]
        if data['url'][l][e]['category'] == 'Blocked':
            data['url'][l][e]['category'] = 'None'

    # quick url matching to find category
    if data['url'][l][e]['category'] == 'None':
        if 'file' in e or 'cloud' in e or 'down' in e or 'convert' in e:
            data['url'][l][e]['category'] = 'Internet_and_Telecom'
            data['url'][l][e]['subcategory'] = 'File_Sharing'
        elif 'vid' in e or 'movi' in e:
            data['url'][l][e]['category'] = 'Arts_and_Entertainment'
            data['url'][l][e]['subcategory'] = 'Movies'
        elif 'porn' in e:
            data['url'][l][e]['category'] = 'Adult'

    # adding porn subcategory
    if data['url'][l][e]['category'] == 'Adult':
        data['url'][l][e]['subcategory'] = 'Adult'        

    # adding categories for sankey visualization
    category = data['url'][l][e]['category']
    if category not in data['categories']:
        data['categories'][category] = {'qatar': { 'rank': 0, 'count': 0 }, 'world': { 'rank': 0, 'count': 0 }}
    data['categories'][category][l]['rank'] += int(r['rank'])
    data['categories'][category][l]['count']+= 1

    # finding geolocation and censor
    if getFile(geo_path): data['url'][l][e]['country'] = getFile(geo_path)['country_code']
    if getFile(censor_path) == True: data['url'][l][e]['censor'] = 1

    # finding safety with WOT and VT
    if getFile(wsafe_path) and 'categories' in getFile(wsafe_path)[e]:
        for status in getFile(wsafe_path)[e]['categories']:
            conf = int(getFile(wsafe_path)[e]['categories'][status])
            if conf >= 10:
                if status in negative:
                    data['url'][l][e]['wsafe'] = 1
                if status in subsafety and status not in data['url'][l][e]['status']:
                    data['url'][l][e]['status'].append(status)
    if getFile(vsafe_path):
        data['url'][l][e]['vsafe'] = int(getFile(vsafe_path)["positives"])        

    return data

def checkStatus(e, wot):
    path = os.path.join(directory, e)
    wsafe_path  = os.path.join(path, files[3] + '.json')

    wjson = getFile(wsafe_path)
    if wjson:
        if 'categories' in wjson[e]:
            for status in wjson[e]['categories']:
                if (str(status) in wot_categories):
                    conf = int(getFile(wsafe_path)[e]['categories'][status])
                    if conf >= 10:
                        if e not in wot[str(status)]:
                            wot[str(status)].append(e)
                        if str(status) in negative and e not in wot['negative']:
                            wot['negative'].append(e)
                        if str(status) in questionable and e not in wot['questionable']:
                            wot['questionable'].append(e)                   
                        if str(status) in neutral and e not in wot['neutral']:
                            wot['neutral'].append(e)
                        if str(status) in positive and e not in wot['positive']:
                            wot['positive'].append(e)

        if "0" in wjson[e]:
            rep = int(wjson[e]["0"][0])
            con = int(wjson[e]["0"][1])
            if con >= 10:
                if rep >= 80 and e not in wot[reputation[4]]:
                    wot[reputation[4]].append(e)                  
                elif rep >= 60 and e not in wot[reputation[3]]:
                    wot[reputation[3]].append(e)
                elif rep >= 40 and e not in wot[reputation[2]]:
                    wot[reputation[2]].append(e)
                elif rep >= 20 and e not in wot[reputation[1]]:
                    wot[reputation[1]].append(e)
                elif rep >= 0 and e not in wot[reputation[0]]:
                    wot[reputation[0]].append(e)
    return wot

def init():
    data = {}
    data['url'] = {'qatar':{}, 'world':{}}
    data['categories'] = {}
    wot = {}
    for wc in wot_categories:
        wot[wc] = []
    for e in os.listdir(directory):
        wot = checkStatus(e, wot)
    return {'data': data, 'wot': wot}

def addInfo(data):
    r = getInterest()
    for e in os.listdir(directory):
        if e in r['qatar']:
            data = addUrl(e, 'qatar', r['qatar'][e], data)
        if e in r['world']:
            data = addUrl(e, 'world', r['world'][e], data)
    return data

def countWot(oldwot):
    wot = {}
    for rc in reputation:
        wot[rc] = oldwot[rc]
    for sc in safety:
        wot[sc] = []
    unique = []
    for j in safety:
        for e in oldwot[j]:
            if e not in unique:
                wot[j].append(e)
                unique.append(e)

    wotcount = {}
    for wc in safety + reputation:
        wotcount[wc] = {'qatar':0, 'world':0}

    urls = getUrls()
    for l in ['qatar', 'world']:     
        for e in urls[l]:
            for c in safety + reputation:
                if e in wot[c]:
                    wotcount[c][l] += 1

    #0 qatar #1 world
    rewot = {'reputation':[[],[]], 'safety':[[],[]], 'hidden':{'excellent':[0,0], 'positive':[0,0]}}
    tots = {'reputation':[0,0], 'safety':[0,0]}
    for rc in reputation:
        tots['reputation'][0] += wotcount[rc]['qatar']
        tots['reputation'][1] += wotcount[rc]['world']
    for sc in safety:
        tots['safety'][0] += wotcount[sc]['qatar']
        tots['safety'][1] += wotcount[sc]['world']
        
    for rc in reputation:
        if rc != "excellent":
            rewot['reputation'][0].append({'axis':rc, 'value':wotcount[rc]['qatar']/tots['reputation'][0]})
            rewot['reputation'][1].append({'axis':rc, 'value':wotcount[rc]['world']/tots['reputation'][1]})
        else:
            rewot['hidden'][rc][0] = wotcount[rc]['qatar']/tots['reputation'][0]
            rewot['hidden'][rc][1] = wotcount[rc]['world']/tots['reputation'][1]
            
    for sc in safety:
        if sc != "positive":        
            rewot['safety'][0].append({'axis':sc, 'value':wotcount[sc]['qatar']/tots['safety'][0]})
            rewot['safety'][1].append({'axis':sc, 'value':wotcount[sc]['world']/tots['safety'][1]})
        else:
            rewot['hidden'][sc][0] = wotcount[sc]['qatar']/tots['safety'][0]
            rewot['hidden'][sc][1] = wotcount[sc]['world']/tots['safety'][1]

    return rewot

# returns list of malicious urls for Q/W 
def getMalicious():
    malicious = {'qatar':[], 'world':[]}
    sref = {}
    for l in result['url']:
        for u in result['url'][l]:
            e = result['url'][l][u]
            if e['wsafe'] == 1 or e['vsafe'] > 2:
                malicious[l].append(u)

                #adding sref
                path = os.path.join(directory, u)
                sref_path = os.path.join(path, files[10] + '.json')
                if getFile(sref_path)["SocialSources"]:
                    for ref in getFile(sref_path)["SocialSources"]:
                        source = ref['Source'].split(' ')[0].split('.')[0]
                        if source not in sref:
                            sref[source] = {'qatar':0, 'world':0}
                        sref[source][l] += float(ref['Value']) * float(e['reach'])
                            
    return {'mal': malicious, 'sref': sref}
    

# MAIN
d = init()
result = addInfo(d['data'])
result['wot'] = countWot(d['wot'])
for c in result['categories']:
    result['categories'][c]['qrank'] = result['categories'][c]['qatar']['rank'] / result['categories'][c]['qatar']['count']
    result['categories'][c]['wrank'] = result['categories'][c]['world']['rank'] / result['categories'][c]['world']['count']
m = getMalicious()

totreach = {'qatar':0, 'world':0}
for c in result['url']:
    for u in result['url'][c]:
        totreach[c] += result['url'][c][u]['reach'] 
result['sref'] = []
for s in m['sref']:
    q = round(m['sref'][s]['qatar'] / totreach['qatar'] * 1000000, 2)
    w = round(m['sref'][s]['world'] / totreach['world'] * 1000000, 2)
    result['sref'].append({ 'name':s, 'qatar':q, 'world':w })

w = open(r'result\data.jsonp','w')
w.write('var data = ')
w.write(dumps(result, w, indent=4))
w.close()

w = open(r'result\urls.json','w')
w.write(dumps(m['mal'], w, indent=4))
w.close()

print ("Done.")
