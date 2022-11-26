from django.dispatch import receiver
from django.db.models.signals import post_delete, post_save
import os

from .models import Data
from conditions.models import ConditionCluster

@receiver(post_delete, sender=Data)
def delete_csv(sender, instance, **kwargs):
    csv = instance.csv
    csv_dir, csv_name = os.path.split(csv.path)
    csv.delete(save=False)
    # もしcsvを保存していたディレクトリが空なら, それも削除
    # remove the directory tied to the account if empty
    if os.path.exists(csv_dir) and not os.listdir(csv_dir):
        try:
            os.rmdir(csv_dir)
        except BaseException as e:
            print(e)

@receiver(post_save, sender=ConditionCluster)
def create_new_data(sender, instance, created, **kwargs):
    if created:
        new_data = Data(cluster=instance)
        new_data.save()
