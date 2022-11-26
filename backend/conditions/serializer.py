from rest_framework import serializers

from .models import ConditionCluster


class CondClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConditionCluster
        exclude = []

class CondClusterSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConditionCluster
        fields = ["id", "name"]