from logs.models import Log
from scraping.utils.condition_id import condition_id
from scraping.utils.functions import * 
import time
from bs4 import BeautifulSoup

def scrape_mynavi(target_company, condition_obj, driver):
    """
    parameter:
        条件dict => {"業種(カテゴリ):'金融,商社'"}
    return:
        tuple => (成功失敗(bool), 結果のリスト(list))
    """
    is_success = False
    condition = condition_obj.search_dict()
    # 条件を検索ページに打ち込む prepare conditions for searching
    is_condition_valid = search(condition, driver)
    if not is_condition_valid:
        return (is_success, None)
    result_num = int(driver.find_element(By.ID, "searchResultkensuu").text)
    
    # ログを書く write a new log
    log_kwargs = {"cluster" : condition_obj.cluster, "condition_no" : condition_obj.order} 
    start_log = Log(**log_kwargs, text = f"検索結果の企業数 : {result_num}")
    start_log.save()
    print(f"Search results number : {result_num}")

    next_page = True
    found = False
    page = 0
    while next_page and not found:
        iteration_log = Log(**log_kwargs, text = f"{page}ページ目を調査中...")
        iteration_log.save()
        print(f"Scraping... page {page}")
        html = BeautifulSoup(driver.page_source, "html.parser")
        a_tags = html.find_all("a", {"id":re.compile("corpNameLink\[\d+\]")})
        num = 0
        for num, a in enumerate(a_tags, 1):
            if a.text == f"{target_company}":
                order = int(page * 100 + num + 1)
                # ["社名", "検索サイト" ,"検索語", "業種(カテゴリ)", extract_condition("業種(詳細)", "地域", "職種", "福利厚生", "従業員数"), "検索結果数", "表示の有無", "妥当性", "順位", "検索結果の上位%"]
                result = [target_company, "マイナビ", *extract_condition(condition), result_num, True, True, order, round(order/result_num, 4)*100]
                is_success = True
                success_log = Log(**log_kwargs, text = f"新たなデータを取得しました。")
                success_log.save()
                print(f"New data gained : {result}")
                found = True
                break
        try:
            time.sleep(0.5)
            next_button = driver.find_element(By.ID, "upperNextPage")
            next_button.click()
            page += 1
        except BaseException as e:
            next_page = False
    if not found:
        #  is_search_valid => 全てのページの検索ができたかを調べる
        is_search_valid = page * 100 + num == result_num
        is_success = is_search_valid
        result = [target_company, "マイナビ", *extract_condition(condition), result_num, False, is_search_valid, None, None]
        new_log = Log(**log_kwargs, text = f"新たなデータを取得しました。")
        new_log.save()
        print(f"New data gained : {result}")
    return (is_success, result)


# "タキゲン製造(株)"
# target = "ＴＤ　ＳＹＮＮＥＸ(株)"

# /usr/bin/chromedriver
# /usr/bin/chromium
# /usr/bin/google-chrome