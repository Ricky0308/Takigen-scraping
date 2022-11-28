import shutil
from pathlib import Path
import os

from django.core.files import File
from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

from .data_versions import data_versions
from accounts.models import Account
from conditions.models import ConditionCluster


allowed_versions = {"1"}

def csv_path(instance, filename=None):
    if hasattr(instance.cluster.account, "id"):
        account_id = instance.cluster.account
    else:
        account_id = "anonymous"
    return f"{account_id}/{instance.cluster.name}.csv"


# Create your models here.
class Data(models.Model):
    csv = models.FileField(
        upload_to=csv_path, 
        null=False,
        validators=[FileExtensionValidator(['csv'])], 
        max_length=150,
    )
    cluster = models.OneToOneField(
        ConditionCluster,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"data : {self.cluster.name}"

    def save(self, *args, **kwargs):
        if not self.csv:
            version = self.cluster.data_version
            csv_template_path = f"{settings.MEDIA_ROOT}/csv_templates/template_{version}.csv"
            # csv_dir = f'{settings.MEDIA_ROOT}/csv_files/{account_id}'
            # Path(csv_dir).mkdir(parents=True, exist_ok=True)
            # csv = shutil.copyfile(csv_template_paths(version), f'{csv_dir}/{self.cluster.id}.csv')
            # self.csv = f"csv_files/{account_id}/{self.cluster.id}.csv"
            # cp = shutil.copyfile(csv_template_paths(version), f'csv_tmp/{self.cluster.id}.csv')
            csv = File(open(csv_template_path, "rb"))
            self.csv = csv 
        super().save(*args, **kwargs)


p = f'{settings.MEDIA_ROOT}/csv_templates/template_1.csv'
from django.core.files import File
f = File(open(p, "r"))

csv = shutil.copyfile(f'{settings.MEDIA_ROOT}/csv_templates/template_1.csv', f'sample.csv')