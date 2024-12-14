from flask import Flask, render_template, request, jsonify
import xgboost as xgb
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load the trained model and scaler
with open('model/xgboost_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('model/scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Collect input data from the form
        fly_ash = float(request.form['fly_ash'])
        sodium_silicate = float(request.form['sodium_silicate'])
        sodium_hydro = float(request.form['sodium_hydro'])
        molarity = float(request.form['molarity'])
        coarse_agg = float(request.form['coarse_agg'])
        fine_agg = float(request.form['fine_agg'])
        curing_days = float(request.form['curing_days'])
        curing_temp = float(request.form['curing_temp'])
        ss_sh_ratio = float(request.form['ss_sh_ratio'])
        extra_water = float(request.form['extra_water'])

        # Prepare the data for prediction
        input_data = np.array([[fly_ash, sodium_silicate, sodium_hydro, molarity, coarse_agg, fine_agg, curing_days, curing_temp, ss_sh_ratio, extra_water]])

        # Scale the input data using the scaler
        input_data_scaled = scaler.transform(input_data)

        # Make prediction using the trained model
        prediction = model.predict(input_data_scaled)

        # Render the result in the HTML
        return render_template('index.html', prediction=prediction[0])
    except Exception as e:
        return render_template('index.html', prediction="Prediction failed. Please check your inputs.")

if __name__ == '__main__':
    app.run(debug=True)