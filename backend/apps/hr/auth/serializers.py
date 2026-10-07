from rest_framework import serializers


class HRLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class HRForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

