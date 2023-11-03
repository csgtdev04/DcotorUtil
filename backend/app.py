from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
import logging
import json

from models import Doctor, DoctorTreatment, Treatment
from extensions import db, migrate
from config import SQLALCHEMY_DATABASE_URI

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
jwt = JWTManager(app)

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
app.logger.addHandler(logging.StreamHandler())

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['CORS_HEADERS'] = 'Content-Type'

db.init_app(app)
migrate.init_app(app, db)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=5))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/save_user', methods=['POST'])
def save_user():
    body = request.get_json()
    name = body.get('name')
    email = body.get('email')
    password = body.get('password')
    
    # Check if doctor with the given email already exists
    existing_doctor = Doctor.query.filter_by(email=email).first()
    
    if existing_doctor:
        return jsonify({"valid": False})
    
    new_doctor = Doctor(name=name, email=email, password=password)
    db.session.add(new_doctor)
    db.session.commit()
    
    print(new_doctor)
    
    return jsonify({"valid": True})


@app.route('/validate_user', methods=['POST'])
def validate_user():
    body = request.get_json()
    # after login, check if user email and pwd in the db, return true or false
    email = body.get('email')
    password = body.get('password')
    user = Doctor.query.filter_by(email=email, password=password).first()
    
    if user:
        access_token = create_access_token(identity=email)
        return jsonify({"valid": True, "doctor_id": user.id, "access_token": access_token})
    else:
        return jsonify({"valid": False})
    
@app.route('/doctors', methods=['GET'])
def get_doctors():
    try:
        doctors = Doctor.query.all()
        doctors_list = []
        for doctor in doctors:
            doctors_list.append({
                'id': doctor.id,
                'name': doctor.name,
                'email': doctor.email
            })

        return jsonify(doctors_list), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to fetch doctors'}), 500
    
@app.route('/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    try:
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404

        db.session.delete(doctor)
        db.session.commit()

        return jsonify({'message': 'Doctor deleted successfully'}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'error': 'Failed to delete doctor'}), 500
    
@app.route('/update_favorite', methods=['POST'])
@jwt_required()
def update_fav():
    body = request.get_json()
    # change from fav to not fav, update the treatment table
    # next to all the treatments, the favorite status should be displayed as a button, and if it is clicked, update_favorite endpoint should be hit with treatment_id and 
    treatment_id = body.get('treatment_id')
    is_favorite = body.get('is_favorite')

    treatment = Treatment.query.get(treatment_id)

    if treatment:
        treatment.is_favorite = is_favorite
        db.session.commit()
        return jsonify({'message': 'Favorite updated successfully.'}), 200
    else:
        return jsonify({'error': 'Treatment not found.'}), 404


@app.route('/get_doc_treatments', methods=['POST'])
@jwt_required()
def get_doc_treaments():
    body = request.get_json()
    doctor_id = body.get('doctor_id')
    doctor = Doctor.query.get(doctor_id)

    if doctor:
        doc_treatments = Treatment.query.filter_by(doctor_id=doctor_id).all()
        treatments_json = []
        for treatment in doc_treatments:
            treatments_json.append({
                'treatment_id': treatment.id,
                'treatment_code': treatment.treatment_code,
                'description': treatment.description
            })
        return jsonify({'treatments': treatments_json}), 200
    else:
        return jsonify({'error': 'Doctor not found.'}), 404

@app.route('/save_treatments', methods=['POST'])
@jwt_required()
def save_treatments():
    body = request.get_json()
    # get all treatments from body and save in doctor_treatment table for
    # doctor_id, favorite ones will get saved in the treatment db if not existing    
    doctor_id = body.get('doctor_id')
    treatments = body.get('treatments')
    date = body.get('date') # change into a timestamp => utc
    datetime_obj = datetime.fromisoformat(date[:-1])
    logger.info("datetimeOBJ")
    logger.info(datetime_obj.date())

    # Fetch the doctor from the database based on doctor_id
    doctor = Doctor.query.get(doctor_id)

    if doctor:
        for treatment in treatments:
            treatment_code = treatment.get('treatment_code')
            quantity = treatment.get('quantity')

            treatment_to_put = None
            existing_treatment = Treatment.query.filter_by(treatment_code=treatment_code).first()

            if not existing_treatment:
                new_treatment = Treatment(
                    treatment_code=treatment_code,
                    description='',
                    doctor_id=doctor_id,
                    is_favorite=True
                )
                treatment_to_put = new_treatment
                db.session.add(new_treatment)
                db.session.commit()
            else:
                treatment_to_put = existing_treatment
                
            logger.info("ID!!!!")
            logger.info(treatment_to_put.id)
            new_doctor_treatment = DoctorTreatment(
                doctor_id=doctor_id,
                treatment_id=treatment_to_put.id,
                treatment_code=treatment_code,
                quantity=quantity,
                created_at=datetime_obj.date()
            )
            db.session.add(new_doctor_treatment)

        db.session.commit()

        return jsonify({'message': 'Treatments saved successfully.'}), 200
    else:
        return jsonify({'error': 'Doctor not found.'}), 404

@app.route('/get_treatments', methods=['POST'])
@jwt_required()
def get_treatments():
    body = request.get_json()
    # get date, doctor_id from the body and then fetch all treatments for that
    # date from doctor_treatment
    
    doctor_id = body.get('doctor_id')
    date = body.get('date')
    datetime_obj = datetime.fromisoformat(date[:-1])
    # logger.info("datetimeOBJ")
    # logger.info(datetime_obj.date())
    
    
    logger.info("doctor+_id")
    logger.info(doctor_id)
    from sqlalchemy.sql import func
    doctor_treatments = DoctorTreatment.query.filter_by(doctor_id=doctor_id, 
                                                        created_at=func.DATE(datetime_obj)).all()
    logger.info("doctor treatments")
    logger.info(doctor_treatments)
    treatment_list = []
    for doctor_treatment in doctor_treatments:
        treatment_data = {
            'treatment_id': doctor_treatment.id,
            'treatment_code': doctor_treatment.treatment_code,
            'quantity': doctor_treatment.quantity,
        }
        treatment_list.append(treatment_data)
    return jsonify({'treatments': treatment_list})

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

if __name__ == '__main__':
    app.run(debug=True)