FROM python:3.5-slim
ADD . /app
WORKDIR /app
RUN pip install -r requirements
CMD ["python", "deploy.py"]
