from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.vgg16 import preprocess_input
from werkzeug.utils import secure_filename
import re  # For URL validation

app = Flask(__name__)
CORS(app)

# Paths and configuration
UPLOAD_FOLDER = r'backend\temp_frames'
MODEL_PATH = r'backend\model\final_deepfake_detection_model_CNN+LSTM.h5'  
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure that the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load the model (no TPU strategy needed, works on CPU)
model = tf.keras.models.load_model(MODEL_PATH)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_youtube_url(url):
    # Simple regex to validate YouTube URLs
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/.+')
    return youtube_regex.match(url)

def download_youtube_video(url, output_folder):
    try:
        # Using yt-dlp to download the YouTube video as mp4
        command = f'yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" -o "{output_folder}/%(title)s.%(ext)s" {url}'
        os.system(command)

        # Find the downloaded file in the output folder
        for file in os.listdir(output_folder):
            if file.endswith(".mp4"):
                return os.path.join(output_folder, file)

        print("No suitable video file found after downloading.")
        return None
    except Exception as e:
        print(f"Error downloading YouTube video: {e}")
        return None

def extract_frames(video_path, output_folder, max_frames=100):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    cap = cv2.VideoCapture(video_path)
    frames = []
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret or count >= max_frames:
            break
        frame_path = os.path.join(output_folder, f"frame_{count:04d}.jpg")
        cv2.imwrite(frame_path, frame)
        frames.append(frame_path)
        count += 1

    cap.release()
    return frames

def preprocess_frame(image_path):
    image = cv2.imread(image_path)
    image = cv2.resize(image, (528, 528))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = preprocess_input(image)
    return image

def batch_frames(frames, batch_size=10):
    batched_frames = []
    for i in range(0, len(frames), batch_size):
        batch = frames[i:i+batch_size]
        if len(batch) == batch_size:
            batch_images = np.vstack([preprocess_frame(frame) for frame in batch])
            batched_frames.append(batch_images)
    return np.array(batched_frames)

def predict_video(model, frames):
    batched_frames = batch_frames(frames)
    predictions = []

    for batch in batched_frames:
        batch = np.expand_dims(batch, axis=0)  # Adding batch dimension
        pred = model(batch, training=False)
        predictions.append(pred.numpy())

    avg_prediction = np.mean(predictions, axis=0)
    return avg_prediction

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'file' in request.files and request.files['file'].filename != '':
        # Handle file upload
        file = request.files['file']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Process the video
            frames = extract_frames(file_path, UPLOAD_FOLDER)
            if not frames:
                return jsonify({"error": "Could not extract frames from the video."}), 500

            prediction = predict_video(model, frames)

            # Clean up frames and uploaded video
            for frame in frames:
                os.remove(frame)
            os.remove(file_path)

            # Return the prediction result
            if len(prediction.shape) > 1:
                prediction = prediction.flatten()

            real_prob = float(prediction[0])
            deepfake_prob = float(prediction[1])

            return jsonify({
                "real_probability": real_prob,
                "deepfake_probability": deepfake_prob
            })

        return jsonify({"error": "Invalid file format. Only mp4, mov, and avi files are allowed."}), 400

    elif 'url' in request.form and is_youtube_url(request.form['url']): 
        # Handle YouTube URL
        url = request.form['url']
        video_path = download_youtube_video(url, UPLOAD_FOLDER)
        if not video_path:
            return jsonify({"error": "Failed to download the YouTube video. Please check the URL and try again."}), 400

        # Process the downloaded video
        frames = extract_frames(video_path, UPLOAD_FOLDER)
        if not frames:
            return jsonify({"error": "Could not extract frames from the video."}), 500

        prediction = predict_video(model, frames)

        # Clean up frames and downloaded video
        for frame in frames:
            os.remove(frame)
        os.remove(video_path)

        # Return the prediction result
        if len(prediction.shape) > 1:
            prediction = prediction.flatten()

        real_prob = float((prediction[0]))
        deepfake_prob = float((prediction[1]))

        return jsonify({
            "real_probability": real_prob,
            "deepfake_probability": deepfake_prob
        })

    else:
        return jsonify({"error": "No file selected or invalid YouTube URL provided."}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
