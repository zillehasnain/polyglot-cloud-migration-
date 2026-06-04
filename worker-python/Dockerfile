FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
# Ensure logs appear in real-time in Docker console
ENV PYTHONUNBUFFERED=1 
CMD ["python", "src/main.py"]