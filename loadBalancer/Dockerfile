FROM python:3.9-alpine
RUN pip install flask pyyaml pythonping
COPY ./app.py /app/app.py
COPY ./loadbalancer.yaml /app/loadbalancer.yaml
CMD ["python", "/app/app.py"]