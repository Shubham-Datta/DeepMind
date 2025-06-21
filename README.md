# DeepMind - Deepfake Detection using CNN+LSTM

## Overview
DeepMind is a sophisticated deepfake detection application that uses a hybrid CNN+LSTM architecture to identify manipulated videos with high accuracy. The system analyzes video frames to determine whether a video is authentic or a deepfake, providing probability scores for both classifications.

## Features
- **Advanced Deep Learning Model**: Combines CNN (EfficientNetB6) with LSTM for temporal analysis of video frames
- **User-friendly Interface**: Modern React-based frontend with intuitive video upload functionality
- **Multiple Input Methods**: Support for both file uploads and YouTube video links
- **Real-time Analysis**: Processes videos and provides immediate detection results
- **Visual Results**: Displays detection results using an intuitive gauge chart

## Project Structure
```
├── backend/                  # Flask backend server
│   ├── app.py               # Main server file
│   ├── model/               # Contains the trained model
│   └── temp_frames/         # Temporary storage for video frames
├── frontend/                # React frontend
│   ├── src/                 # Source code
│   │   ├── App.jsx          # Main application component
│   │   ├── Home/            # Home page components
│   │   ├── components/      # Reusable components
│   │   └── styles/          # CSS and styling files
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
├── Sample_Videos/           # Sample videos for testing
├── cnn-lstm-deepfake.ipynb  # Jupyter notebook for model training
├── requirements.txt         # Python dependencies
└── package.json             # Project dependencies
```

## Technology Stack
- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Flask, TensorFlow, OpenCV
- **Model**: CNN (EfficientNetB6) + LSTM architecture
- **Data Processing**: NumPy, TensorFlow preprocessing tools

## Prerequisites
- Python 3.10.0
- Node.js and npm
- Git

## Installation

### Clone the Repository
```bash
git clone https://github.com/Shubham-Datta/DeepMind.git
cd DeepMind
```

### Backend Setup
1. Create and activate a virtual environment:
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
```

2. Install the required Python packages:
```bash
pip install -r requirements.txt
```

3. Download the model file (not included in the repository) and place it in the `backend/model/` directory.

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install the required npm packages:
```bash
npm install
```

## Running the Application

### Start the Backend Server
```bash
cd backend
python app.py
```
The backend server will start on http://127.0.0.1:5000

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend development server will start on http://localhost:5173

## Usage
1. Open your browser and navigate to http://localhost:5173
2. Sign up or log in to your account
3. Upload a video file or provide a YouTube link
4. Click "Detect" to analyze the video
5. View the results on the gauge chart
6. Check your detection history in the dashboard

## Model Architecture
The deepfake detection model uses a hybrid architecture:
- **Feature Extraction**: EfficientNetB6 CNN pre-trained on ImageNet
- **Temporal Analysis**: LSTM layer to analyze sequences of video frames
- **Classification**: Dense layer with softmax activation for binary classification

The model was trained on a sample of the Deepfake Detection Challenge dataset from Kaggle, containing a large collection of real and deepfake videos. Data augmentation techniques were applied to improve generalization and model performance.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- TensorFlow and Keras for the deep learning framework
- React and Vite for the frontend framework
- Flask for the backend server