from rest_framework import serializers


class SuperAdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class SuperAdminForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

