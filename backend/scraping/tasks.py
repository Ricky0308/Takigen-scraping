from celery import shared_task
from accounts.models import Account 
from conditions.models import ConditionCluster
from logs.models import Log
from selenium import webdriver
from scraping.utils import scraping
from django.conf import settings
import boto3

driver_path = "/usr/bin/chromedriver"
"/Users/ricky/Desktop/chromedriver"
"/Users/ricky/dev/scraping/drivers/chromedriver"


def converter(elem):
    if elem == None:
        return ""
    else:
        return str(elem)

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
    remote_csv_path = f"{settings.S3_CSV_FOLDER}/{str(condcluster.data.csv)}"
    cond_obj_list = condcluster.condition_set.all()
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(
        driver_path, 
        options=options
    )
    s3 = boto3.resource("s3")
    remote_csv = s3.Object(settings.AWS_STORAGE_BUCKET_NAME, remote_csv_path)
    remote_csv_value = remote_csv.get().get("Body").read().decode("utf-8")
    new_data_str = ""
    # f = open(condcluster.data.csv, 'a', encoding='utf-8', newline='')
    # writer = csv.writer(f)
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
                is_success, result = scraping.scrape_mynavi(target_company, cond_obj, driver)
                if is_success:
                    cond_obj.state = "completed"
                if is_success and not cond_obj.row:
                    result.insert(0, int(cond_obj.order))
                    cond_obj.row = result
                    result_str = ",".join(map(converter, result)) + "\n"
                    new_data_str += result_str
            except BaseException as e:
                print(e)
                cond_obj.state = 'failed'
            finally:
                cond_obj.save()
    # 新しくデータを書き込む
    remote_csv.put(Body=remote_csv_value + new_data_str)
    condcluster.in_progress = False
    condcluster.save()
    return 
    

