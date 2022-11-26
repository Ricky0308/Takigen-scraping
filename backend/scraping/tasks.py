from celery import shared_task
from accounts.models import Account 
from conditions.models import ConditionCluster
from logs.models import Log
from selenium import webdriver
from scraping.utils import scraping

import csv


driver_path = "/usr/bin/chromedriver"
"/Users/ricky/dev/scraping/drivers/chromedriver"

@shared_task
def example_task():
    print(Account.objects.all())
    print("celery task successfully started!")

@shared_task
def scrape_condition(condcluster_id, target_company:str):
    """
    parameter:
        condcluster_id : ConditionCluster modelのid
    functionality:
        ・condition 一つ一つをスクレイピング => データをcsvに書き込む
        ・conditionの状態を更新 ("yet started" => (スクレイピング開始) => "in progress" => (結果) => "completed")
    """
    condcluster = ConditionCluster.objects.get(id = condcluster_id) 
    cond_obj_list = condcluster.condition_set.all()
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(
        driver_path, 
        options=options
    )
    f = open(condcluster.data.csv.path, 'a', encoding='utf-8', newline='')
    writer = csv.writer(f)
    if condcluster.in_progress:
        return 
    else:
        condcluster.in_progress = True
        condcluster.save()
    for cond_obj in cond_obj_list:
        if cond_obj.state in ('yet started', 'failed'):
            cond_obj.state = 'in progress'
            cond_obj.save()
            try:
                is_success, data = scraping.scrape_mynavi(target_company, cond_obj, driver)
                if is_success:
                    cond_obj.state = "completed"
                if is_success and not cond_obj.row:
                    data.insert(0, int(cond_obj.order))
                    cond_obj.row = data
                    #新しくデータを書き込む
                    writer.writerow(data)
            except BaseException as e:
                print(e)
                cond_obj.state = 'failed'
            finally:
                cond_obj.save()
    f.close()
    condcluster.in_progress = False
    condcluster.save()
    return 
    

