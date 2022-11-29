from selenium.webdriver.common.by import By
import re
from copy import deepcopy
import copy

from scraping.utils.condition_id import condition_id, conditions


def keyword_to_url(keywords):
    first = "https://job.mynavi.jp/24/pc/corpinfo/searchCorpListByGenCond/index?actionMode=searchFw&cond=&"
    last = f"srchWord={keywords}&q={keywords}&SC=corp&srchWordTgt=1"
    return first+last

# 条件作成に関する関数 (条件類)
# (条件類)
def make_id_dict(elem_list):
    result = {}
    for item in elem_list:
        _id = re.search("(.*)(_label)", item.get("id"))[1]
        result[item.text] = _id
    return result

# (条件類)
def make_ind_category_dict(each_ind):
    result = {}
    for ind in each_ind:
        id_list = []
        categ = ind.find("a", {"id":re.compile(r"industryCheckLink\d+")})
        categ_id = re.search("(.*)(_label)", categ.get("id"))[1]
        id_list.append(categ_id)
        ind_details = ind.find_all("a", {"id":re.compile(r"industryCtgDetailedCheckArray\d+")})
        detail_ids = list(map(lambda each : re.search("(.*)(_label)", each.get("id"))[1], ind_details))
        id_list.extend(detail_ids)
        result[categ.text] = id_list
    return result

def extract_condition(info_dict):
    conds = ["検索語"] + conditions
    result = []
    for cond in conds:
        if not info_dict.get(cond):
            result.append(None)
        else:
            cond_str = " / ".join(info_dict[cond])
            result.append(cond_str)
    return result

def modify_condition_str(cond_str):
    return re.search("(.*)(\(\d*件\))", cond_str)[1]

def update_dictkey(target_dict, func):
    _dict={}
    for key, value in target_dict.items():
        _dict[func(key)] = value
    return _dict

def condition_iter(condition, words_list):
    result = [condition, ]
    for words in words_list:
        if type(words) == str:
            words = [words]
        c = copy.copy(condition)
        c["検索語"] = [*words]
        result.append(c)
    return result

def print_search_info(info):
    cond = "None"
    search_word = "None"
    for key, value in info.items():
        if key == "検索語":
            search_word = value
        elif value:
            if cond == "None":
                cond = []
            cond.extend(value)
    print(f"検索語 : {search_word}  条件 : {cond}")
    
# テスト用の関数
# 条件検索の時、チェックボックスがちゃんと押されるかのテスト
def input_check_test(ids, driver):
    driver.get("https://job.mynavi.jp/24/pc/corpinfo/displayCorpSearch/index")
    check_script = "arguments[0].checked = true"
    check_cnt = 0
    error_ids = []
    for _id in ids:
        try:
            _input = driver.find_element(By.ID, _id)
            driver.execute_script(check_script, _input)
            check_cnt += 1
        except BaseException as e:
            print({e})
            error_ids.append(_id)
    if check_cnt == len(ids):
        print("every item checked successfully")
    else:
        print(f"unchecked ids are : ")
        for item in error_ids:
            print(f"{item}")

# 条件のカテゴリ名からidのリストを作成する。input_check_testへ引数として渡すリストを作成するため
# すべてのidは 右から得られる id_list_from_conditions(conditions.keys())
def id_list_from_conditions(cond_categ_list):
    id_list = []
    for categ in cond_categ_list:
        for cond, _id in condition_id[categ].items():
            if type(_id) == list:
                id_list.extend(_id)
            else:
                id_list.append(_id)
    return id_list
            

# 条件検索のための関数
# dataには条件 + 検索語が入る。条件のフォーマットはsearch_infoを参照
def search(data, driver):
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!data")
    print(data)
    driver.get("https://job.mynavi.jp/24/pc/corpinfo/displayCorpSearch/index")
    if not data.get("検索語"):
        data["検索語"] = ""
    try:
        check_script = "arguments[0].checked = true"
        for key, values in data.items():
            if key == "検索語":
                continue
            for word in values:
                try:
                    _id = condition_id[key][word]
                    # 業種(カテゴリ)の場合は値がリスト形式のためエレメントをイタレーション
                    if type(_id) == list:
                        for each_id in _id:
                            _input = driver.find_element(By.ID, each_id)
                            driver.execute_script(check_script, _input)
                    else:
                        _input = driver.find_element(By.ID, _id)
                        driver.execute_script(check_script, _input)
                except BaseException as e:
                    print(f"正しい条件語ではありません : {word}")
                    print(f"エラー内容 : {e}")
        button = driver.find_element(By.ID, "doSearch")
        driver.execute_script("arguments[0].disabled = false", button)
        button.click()

        _input = driver.find_element(By.ID, "srchWord")
        search_words = ",".join(data["検索語"])
        try:
            driver.execute_script(f"arguments[0].value = '{search_words}'", _input)
            button = driver.find_element(By.ID, "doSearch")
            driver.execute_script("arguments[0].click()", button)
        except:
            print("検索結果が少なすぎるため、検索語は無視されます")
        return True
    except BaseException as e:
        print({e})
        return False