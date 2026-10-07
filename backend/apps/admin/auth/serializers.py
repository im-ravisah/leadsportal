from rest_framework import serializers


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class AdminForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

