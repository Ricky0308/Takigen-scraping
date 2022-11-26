from django.db import models
from conditions.models import ConditionCluster

# Create your models here.

class Log(models.Model):
    cluster = models.ForeignKey(ConditionCluster, on_delete = models.CASCADE)
    condition_no = models.IntegerField(null=True, blank=True) 
    created_time = models.DateTimeField(auto_now_add = True)
    text = models.TextField(max_length = 300)

    def __str__(self):
        return f"{str(self.cluster.id)[:6]} : condition {self.condition_no}"
