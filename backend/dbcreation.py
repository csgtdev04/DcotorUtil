from application import app
from extensions import db
from models import Doctor, Treatment, DoctorTreatment

with app.app_context():
    db.create_all()

# to check connection, use below code
# from sqlalchemy import create_engine

# url = 'postgresql+psycopg://postgres:postgres@stm-postgres.cjo8hweq7mcq.us-east-2.rds.amazonaws.com:5432/hospital'
# engine = create_engine(url)
# conn = engine.connect()
# conn.close()