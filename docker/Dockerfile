#FROM python:3.10
FROM public.ecr.aws/docker/library/python:3.11-slim

WORKDIR /app

COPY app.py .

RUN pip install flask

CMD ["python", "app.py"]
