from email.policy import default
import uuid
from django.db import models
from accounts.models import Account
from .choices import state_choices
from config.models import ExtendedManager
from data.data_versions import data_versions


# Create your models here.

class ConditionCluster(models.Model):
    objects = ExtendedManager()
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False,
    )
    name = models.CharField(
        max_length=100,
        null=False, 
        blank=False
    )
    account = models.ForeignKey(
        Account, 
        null=True,
        blank=True, 
        on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)
    data_version = models.CharField(
        max_length=3, 
        choices=[('1', '1')],
        default='1',
        null = False, 
        blank = False
    ) 
    # スクレイピングしている最中の場合 True となる
    # in_progress is True while the cluster is being used for scraping
    in_progress = models.BooleanField(default=False, null=False)
    target_url = models.URLField(max_length=350, default="https://www.google.com/")
    target_company = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return f"{self.name} : {self.created}"

    def show_detail(self):
        """
        description:
            Clusterの情報 + 紐づけられたData + 紐づけられたConditions全てを返す
        """
        conditions = [ 
            dict([("condition", cond.condition), ("state", cond.state)])
            for cond in self.condition_set.all()
        ]
        data = self.show_extended_info()
        data.update({
            "data_path" : self.data.csv.path,
            "data_file" : self.data.csv, 

            "conditions" : conditions, 
        })
        return data

    def show_extended_info(self):
        """
        description:
            Clusterの情報 + 紐づけられたConditionsの数 + 完了したConditionの数を返す
        """
        completed_conditions = [cond.state == "completed" for cond in self.condition_set.all()]

        data = {
            "id" : str(self.id), 
            "name" : self.name, 
            "created" : str(self.created), 
            "data_version" : self.data_version, 
            "in_progress" : self.in_progress, 

            "completed_conditions" : sum(completed_conditions), 
            "num_of_conditions" : len(completed_conditions)
        }
        return data 


class Condition(models.Model):
    objects = ExtendedManager()
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False,
    )
    condition = models.JSONField(
        default=dict,
        blank=False, 
        null=False
    )
    row = models.JSONField(
        default=list, 
        blank=True, 
        null=True,
    )
    cluster = models.ForeignKey(
        ConditionCluster, 
        on_delete=models.CASCADE
    )
    order = models.IntegerField()
    state = models.CharField(
        max_length=20,
        choices=state_choices,
        default="yet started"
    )

    def __str__(self):
        return f"{self.cluster.name} : {self.order}"

    def search_dict(self):
        """
        return:
            検索用の条件dict => {"業種(カテゴリ):['金融', '商社']}
        """
        condition = dict(self.condition)
        for index, value in condition.items():
            condition[index] = value.split(",")
        return condition
    
    
