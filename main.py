from bs4 import BeautifulSoup
import requests
import re
from retry import retry 
import pandas as pd
from lxml import etree
from selenium import webdriver
from selenium.webdriver.common.by import By
import re


# 必要な関数類
@retry(tries=3, delay=10, backoff=2)
def get_html(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.content, "html.parser")
    return soup

def keyword_to_url(keywords):
    first = "https://job.mynavi.jp/24/pc/corpinfo/searchCorpListByGenCond/index?actionMode=searchFw&cond=&"
    last = f"srchWord={keywords}&q={keywords}&SC=corp&srchWordTgt=1"
    return first+last

def make_id_dict(elem_list):
    result = {}
    for item in elem_list:
        _id = re.search("(.*)(_label)", item.get("id"))[1]
        result[item.text] = _id
    return result


# driverを使って自動でchromeを操作する。
# コードの使用にはドライバーのインストールが必要 https://chromedriver.chromium.org/downloads
# 以下のコード第一引数はドライバーの絶対パス
driver = webdriver.Chrome('/Users/ricky/dev/scraping/drivers/chromedriver')

# 条件検索は未実装なので、とりあえずキーワードだけ
# キーワードはスペース区切りで "製造 メーカー" のように入力する
keyword_list = ["なのちゃん", "製造 メーカー", "製造", "非鉄金属", "メーカー", "商社", "精密機器", "東京都"]
data = []


for keyword in keyword_list:
    print("=====================================================================")
    print(f"Keyword : {keyword}")
    url = keyword_to_url(keyword)
    driver.get(url)
    result_num = int(driver.find_element(By.ID, "searchResultkensuu").text)
    print(f"Search results number : {result_num}")
    next_page = True
    found = False
    page = 0
    while next_page and not found:
        print(f"Searching... page {page}")
        html = BeautifulSoup(driver.page_source, "html.parser")
        a_tags = html.find_all("a", {"id":re.compile("corpNameLink\[\d+\]")})
        for num, a in enumerate(a_tags):
            if a.text == "タキゲン製造(株)":
                order = int(page * 100 + num + 1)
                row = [keyword, result_num, True, order, round(order/result_num, 4)*100]
                print(f"New data gained : {row}")
                data.append(row)
                found = True
                break
        try:
            next_button = driver.find_element(By.ID, "upperNextPage")
            next_button.click()
            page += 1
        except:
            next_page = False
    if not found:
        row = [keyword, result_num, False, None, None]
        print(f"New data gained : {row}")
        data.append(row)

columns=["検索語", "検索結果数", "結果の有無", "順位", "検索結果の上位%"]
df = pd.DataFrame(data, columns=columns)


# 条件検索用(未実装)、APIをできるだけ使いやすくして実装したいなと考え中。1時間もあればできそう
# 条件検索用の情報１
driver.get("https://job.mynavi.jp/24/pc/corpinfo/displayCorpSearch/index")
html = BeautifulSoup(driver.page_source, "html.parser")
ind_category_inputs = html.find_all("a", {"id":re.compile(r"industryCheckLink\d+")})
ind_detail_inputs = html.find_all("a", {"id":re.compile(r"industryCtgDetailedCheckArray\d+")})
area_inputs = html.find_all("a", {"id": re.compile(r"ifRegional\d*")})
occu_inputs = html.find_all("a", {"id": re.compile("occGroup\d+")})
corp_welfare_inputs = html.find_all("label", {"id":re.compile(r"corpWelfare\d+")})
emp_inputs = html.find_all("label", {"id":re.compile(r"empInfo\d+")}) 

conditions = {
    "職種(カテゴリ)": make_id_dict(ind_category_inputs), 
    "職種(詳細)" : make_id_dict(ind_detail_inputs), 
    "地域": make_id_dict(area_inputs), 
    "職種": make_id_dict(occu_inputs), 
    "福利厚生": make_id_dict(corp_welfare_inputs),
    "従業員数": make_id_dict(emp_inputs), 
}

