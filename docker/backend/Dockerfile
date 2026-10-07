FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY backend/requirements /app/requirements
RUN pip install --no-cache-dir -r /app/requirements/prod.txt

COPY backend /app

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

