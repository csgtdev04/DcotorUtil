from extensions import db

from sqlalchemy import Boolean
from datetime import datetime
from sqlalchemy import DateTime

# serves as a model to keep track of all Doctors who access this application
# TODO: add 1 seed record for admin who can view all doctors and edit doctor info...
class Doctor(db.Model):
    __tablename__ = 'doctor'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(15), nullable=False)
    doctor_treatments = db.relationship('DoctorTreatment')

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

# serves as a lookup table for code -> description mappings, only will contain
# favorite ones
class Treatment(db.Model): 
    __tablename__ = 'treatment'
    id = db.Column(db.Integer, primary_key=True)
    treatment_code = db.Column(db.String(15))
    description = db.Column(db.String(50))
    
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    doctor = db.relationship("Doctor")
    
    is_favorite = db.Column(Boolean, default=False)
    
    def __init__(self, treatment_code, description, doctor_id, is_favorite):
        self.treatment_code = treatment_code
        self.description = description
        self.doctor_id = doctor_id
        self.is_favorite = is_favorite
        
# serves as a way to manage doctors and their treatments (holds all dates)
class DoctorTreatment(db.Model):
    __tablename__ = 'doctor_treatment'
    id = db.Column(db.Integer, primary_key=True)
    
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    doctor = db.relationship("Doctor")
    
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatment.id'))
    treatment = db.relationship("Treatment")
    
    treatment_code = db.Column(db.String(15))
    quantity = db.Column(db.Integer)    
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    def __init__(self, doctor_id, treatment_id, treatment_code, quantity, created_at):
        self.doctor_id = doctor_id
        self.treatment_id = treatment_id
        self.treatment_code = treatment_code
        self.quantity = quantity
        self.created_at = created_at
    