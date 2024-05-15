FROM python:3.11.4

ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /usr/src/app

# Copy project files into the container
COPY pyproject.toml /usr/src/app/

# Install project dependencies
RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-root

# Copy the project code into the container
COPY . .

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]

