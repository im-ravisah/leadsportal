from rest_framework import serializers


class AssigneeLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class AssigneeForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

