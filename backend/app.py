from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import logging

from models import Doctor, DoctorTreatment, Treatment
from extensions import db, migrate
from config import SQLALCHEMY_DATABASE_URI

app = Flask(__name__)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
app.logger.addHandler(logging.StreamHandler())

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['CORS_HEADERS'] = 'Content-Type'

db.init_app(app)
migrate.init_app(app, db)

@app.route('/save_user', methods=['POST'])
def save_user():
    body = request.get_json()
    # take body args and make a user and save in db
    name = body.get('name')
    email = body.get('email')
    password = body.get('password')
    
    new_doctor = Doctor(name=name, email=email, password=password)
    db.session.add(new_doctor)
    db.session.commit()
    
    print(new_doctor)
    
    return jsonify(message='Doctor saved successfully')

@app.route('/validate_user', methods=['POST'])
def validate_user():
    body = request.get_json()
    # after login, check if user email and pwd in the db, return true or false
    email = body.get('email')
    password = body.get('password')
    user = Doctor.query.filter_by(email=email, password=password).first()
    
    if user:
        return jsonify({"doctor_id": user.id})
    else:
        return jsonify(valid=False)
    
@app.route('/update_favorite', methods=['POST'])
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


@app.route('/get_favorites', methods=['POST'])
def get_favorites():
    body = request.get_json()
    # get body.doctor_id and get all fav treatments from doctor_treatments table
    # only display these in the frontend...
    doctor_id = body.get('doctor_id')
    doctor = Doctor.query.get(doctor_id)

    if doctor:
        favorite_treatments = Treatment.query.filter_by(doctor_id=doctor_id).all()
        favorites = []
        for treatment in favorite_treatments:
            favorites.append({
                'treatment_id': treatment.id,
                'treatment_code': treatment.treatment_code,
                'description': treatment.description
            })
        return jsonify({'favorites': favorites}), 200
    else:
        return jsonify({'error': 'Doctor not found.'}), 404

@app.route('/save_treatments', methods=['POST'])
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
                created_at=datetime_obj
            )
            db.session.add(new_doctor_treatment)

        db.session.commit()

        return jsonify({'message': 'Treatments saved successfully.'}), 200
    else:
        return jsonify({'error': 'Doctor not found.'}), 404

@app.route('/get_treatments', methods=['POST'])
def get_treatments():
    body = request.get_json()
    # get date, doctor_id from the body and then fetch all treatments for that
    # date from doctor_treatment
    doctor_id = body.get('doctor_id')
    date = body.get('date')
    datetime_obj = datetime.fromisoformat(date[:-1])
    logger.info("datetimeOBJ")
    logger.info(datetime_obj.date())

    doctor_treatments = DoctorTreatment.query.filter(
        DoctorTreatment.doctor_id == doctor_id,
        db.func.date(DoctorTreatment.created_at) == datetime_obj.date(),
    ).all()
    treatment_list = []
    for doctor_treatment in doctor_treatments:
        treatment_data = {
            'treatment_id': doctor_treatment.id,
            'treatment_code': doctor_treatment.treatment_code,
            'quantity': doctor_treatment.quantity,
        }
        treatment_list.append(treatment_data)
    return jsonify({'treatments': treatment_list})

if __name__ == '__main__':
    app.run()