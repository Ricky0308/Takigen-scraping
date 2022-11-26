import shutil
from pathlib import Path
import os

from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

from .data_versions import data_versions
from accounts.models import Account
from conditions.models import ConditionCluster


allowed_versions = {"1"}

def csv_template_paths(version):
    if type(version) == int:
        version = str(version)
    if not version in allowed_versions:
        raise Exception(f"version {version} is not allowed")
    return f'{settings.MEDIA_ROOT}/csv_templates/template_{version}.csv'

def csv_path(instance, filename=None):
    if instance.account:
        account_id = instance.account.id
    else:
        account_id = "00000000"
    return f"csv_files/{account_id}/{instance.cluster.id}.csv"


# Create your models here.
class Data(models.Model):
    csv = models.FileField(
        upload_to=csv_path, 
        null=False, 
        validators=[FileExtensionValidator( ['csv'] )], 
        max_length=150,
    )
    # account = models.ForeignKey(
    #     Account, 
    #     on_delete=models.CASCADE, 
    #     null=True, 
    #     blank=True, 
    # )
    cluster = models.OneToOneField(
        ConditionCluster,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"data : {self.cluster.name}"

    def save(self, *args, **kwargs):
        if not self.csv:
            # clusterかdataが消える時にcsvも消えるようにする
            if hasattr(self.cluster.account, "id"):
                account_id = self.cluster.account.id
            else:
                account_id = "00000000"
            version = self.cluster.data_version
            csv_dir = f'{settings.MEDIA_ROOT}/csv_files/{account_id}'
            Path(csv_dir).mkdir(parents=True, exist_ok=True)
            csv = shutil.copyfile(csv_template_paths(version), f'{csv_dir}/{self.cluster.id}.csv')
            self.csv = f"csv_files/{account_id}/{self.cluster.id}.csv"
        super().save(*args, **kwargs)


