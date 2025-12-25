# AutoML - Smart Machine Learning Pipeline

<div align="center">

![AutoML](https://img.shields.io/badge/AutoML-Machine%20Learning-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**A full-stack automated machine learning platform that simplifies the entire ML workflow from data upload to model prediction.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [ML Pipeline Steps](#-ml-pipeline-steps)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AutoML** is an end-to-end machine learning platform designed to automate the entire ML workflow. It provides an intuitive web interface that guides users through six sequential steps: data upload, exploratory data analysis, preprocessing, model training, report generation, and prediction. The platform is perfect for data scientists, ML engineers, and anyone looking to quickly prototype and deploy machine learning models without extensive coding.

### Why AutoML?

- **No Code Required**: Complete ML workflows through an intuitive UI
- **Automated EDA**: Instant insights into your data with visualizations
- **Smart Preprocessing**: Automated handling of missing values, encoding, scaling, and outliers
- **Multiple Models**: Train and compare 7+ classification algorithms simultaneously
- **Hyperparameter Tuning**: Automatic GridSearchCV optimization
- **Interactive Reports**: Comprehensive model comparison with metrics and visualizations
- **Easy Predictions**: Make predictions on new data with the best-trained model
- **Session Management**: Persistent sessions to resume your work anytime

---

## ✨ Features

### 🎯 Core Features

- **📊 Exploratory Data Analysis (EDA)**
  - Automatic data profiling and statistics
  - Distribution plots and correlation heatmaps
  - Missing value analysis
  - Data quality insights

- **🔧 Intelligent Preprocessing**
  - Missing value imputation (Mean, Median, Mode, Constant)
  - Categorical encoding (One-Hot, Ordinal)
  - Feature scaling (Standard, MinMax)
  - Outlier detection and handling
  - Duplicate removal

- **🤖 Multi-Model Training**
  - Logistic Regression
  - K-Nearest Neighbors
  - Decision Tree
  - Gaussian Naive Bayes
  - Random Forest
  - Support Vector Machine (SVM)
  - Rule-based Decision Tree

- **⚙️ Hyperparameter Tuning**
  - Automated GridSearchCV for all models
  - Optimized parameter grids for each algorithm
  - Cross-validation (5-fold CV)

- **📈 Comprehensive Reporting**
  - Model performance comparison
  - Confusion matrices
  - ROC-AUC scores
  - Precision, Recall, F1-Score
  - Training time analysis
  - Best model recommendation

- **🔮 Prediction Interface**
  - Dynamic form generation based on features
  - Real-time predictions with confidence scores
  - Model download capability
  - Input validation

### 🎨 UI/UX Features

- **Modern Design**: Sleek, gradient-based UI with smooth animations
- **Progress Tracking**: Visual pipeline with step indicators
- **Responsive Layout**: Works seamlessly on desktop and tablet
- **Dark Mode Support**: Eye-friendly interface
- **Interactive Charts**: Powered by Recharts for data visualization
- **Toast Notifications**: Real-time feedback for user actions

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance REST API framework |
| **Python 3.8+** | Core programming language |
| **scikit-learn** | Machine learning algorithms and utilities |
| **pandas** | Data manipulation and analysis |
| **numpy** | Numerical computing |
| **matplotlib/seaborn** | Data visualization |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool and dev server |
| **TailwindCSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **Recharts** | Charting library |
| **TanStack Query** | Data fetching and caching |
| **Wouter** | Lightweight routing |
| **Radix UI** | Accessible component primitives |

---

## 📁 Project Structure

```
AutoML/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI application entry point
│   │   ├── config.py          # Configuration settings
│   │   ├── session_manager.py # Session state management
│   │   ├── routers/           # API route handlers
│   │   │   ├── dataset_router.py    # Dataset upload endpoints
│   │   │   ├── eda_router.py        # EDA endpoints
│   │   │   ├── preprocess_router.py # Preprocessing endpoints
│   │   │   ├── models_router.py     # Model training endpoints
│   │   │   ├── report_router.py     # Report generation endpoints
│   │   │   ├── predict_router.py    # Prediction endpoints
│   │   │   └── issues_router.py     # Issue detection endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── eda.py         # EDA analysis functions
│   │   │   ├── preprocess.py  # Data preprocessing functions
│   │   │   ├── train.py       # Model training and tuning
│   │   │   ├── evaluation.py  # Model evaluation metrics
│   │   │   ├── report.py      # Report generation
│   │   │   └── issues.py      # Data quality checks
│   │   ├── utils/             # Utility functions
│   │   │   ├── file_handler.py      # File I/O operations
│   │   │   ├── plot_generator.py    # Chart generation
│   │   │   └── data_generator.py    # Data utilities
│   │   └── static/            # Static files and sessions
│   │       └── sessions/      # User session data
│   └── env/                   # Python virtual environment
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── main.tsx          # Application entry point
│   │   ├── App.tsx           # Root component
│   │   ├── index.css         # Global styles
│   │   ├── pages/            # Page components
│   │   │   ├── Home.tsx      # Main pipeline page
│   │   │   └── steps/        # Pipeline step components
│   │   │       ├── UploadStep.tsx
│   │   │       ├── EdaStep.tsx
│   │   │       ├── PreprocessingStep.tsx
│   │   │       ├── TrainingStep.tsx
│   │   │       ├── ReportStep.tsx
│   │   │       └── PredictionStep.tsx
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── use-automl.ts # AutoML API hooks
│   │   ├── api/             # API client
│   │   └── lib/             # Utilities and helpers
│   ├── package.json         # Node dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── vite.config.ts       # Vite configuration
│   └── tailwind.config.js   # TailwindCSS configuration
│
└── README.md                 # This file
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** (optional, for cloning)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Abdulla-asim/AutoML.git
cd AutoML
```

### Step 2: Backend Setup

1. **Navigate to the backend directory:**

```bash
cd backend
```

2. **Create a virtual environment:**

```bash
python -m venv env
```

3. **Activate the virtual environment:**

- **Windows:**
  ```bash
  env\Scripts\activate
  ```

- **macOS/Linux:**
  ```bash
  source env/bin/activate
  ```

4. **Install Python dependencies:**

```bash
pip install fastapi uvicorn pandas numpy scikit-learn matplotlib seaborn python-multipart
```

5. **Run the backend server:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the client directory:**

```bash
cd client
```

2. **Install Node dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📖 Usage

### Quick Start Guide

1. **Upload Dataset**
   - Click "Upload Dataset" or drag and drop a CSV file
   - Select the target column (variable to predict)
   - Click "Next" to proceed

2. **Explore Data (EDA)**
   - Review automatic data analysis
   - View statistics, distributions, and correlations
   - Identify data quality issues
   - Click "Next" when ready

3. **Preprocess Data**
   - Configure preprocessing options:
     - Missing value strategy
     - Encoding method
     - Scaling technique
     - Outlier handling
   - Apply preprocessing
   - Click "Next" to continue

4. **Train Models**
   - Select models to train (or train all)
   - Choose test split size (default: 20%)
   - Enable hyperparameter tuning (optional)
   - Start training
   - Wait for results

5. **View Report**
   - Compare model performances
   - Review metrics and confusion matrices
   - Identify the best model
   - Download the report (optional)
   - Click "Next" to make predictions

6. **Make Predictions**
   - Enter values for each feature
   - Click "Predict"
   - View prediction results and confidence
   - Download the trained model (optional)

### Example Dataset

You can test the application with any CSV dataset. Here's an example structure:

```csv
age,income,education,purchased
25,50000,Bachelor,0
35,75000,Master,1
45,100000,PhD,1
22,30000,High School,0
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Upload Dataset

```http
POST /api/dataset/upload
Content-Type: multipart/form-data

Parameters:
  - file: CSV file
  - target: Target column name

Response:
{
  "message": "Dataset uploaded successfully",
  "session_id": "uuid-string",
  "columns": ["col1", "col2", ...],
  "shape": [rows, cols]
}
```

#### 2. Get EDA Results

```http
GET /api/eda/{session_id}

Response:
{
  "statistics": {...},
  "missing_values": {...},
  "correlations": {...},
  "plots": {...}
}
```

#### 3. Preprocess Data

```http
POST /api/preprocess/apply

Body:
{
  "session_id": "uuid-string",
  "missing_strategy": "Mean",
  "encoding": "OneHot",
  "scaling": "Standard",
  "outlier_method": "Remove"
}

Response:
{
  "message": "Preprocessing applied successfully",
  "shape": [rows, cols]
}
```

#### 4. Train Models

```http
POST /api/models/train

Body:
{
  "session_id": "uuid-string",
  "test_size": 0.2,
  "selected_models": ["Random Forest", "Logistic Regression"],
  "tune": true
}

Response:
{
  "results": {
    "Random Forest": {
      "accuracy": 0.95,
      "precision": 0.94,
      "recall": 0.93,
      "f1_score": 0.94,
      "roc_auc": 0.96,
      "confusion_matrix": [[...], [...]],
      "training_time": 2.5
    },
    ...
  }
}
```

#### 5. Generate Report

```http
GET /api/report/{session_id}

Response:
{
  "best_model": "Random Forest (Tuned)",
  "models": {...},
  "comparison": {...}
}
```

#### 6. Make Prediction

```http
POST /api/predict/predict

Body:
{
  "session_id": "uuid-string",
  "input_data": {
    "age": 30,
    "income": 60000,
    "education": "Bachelor"
  }
}

Response:
{
  "prediction": 1,
  "probability": 0.87,
  "model_used": "Random Forest (Tuned)"
}
```

#### 7. Download Model

```http
GET /api/predict/download-model/{session_id}

Response: Binary file (pickle format)
```

### Interactive API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🔄 ML Pipeline Steps

### Step 1: Data Upload
- Accepts CSV files
- Validates file format
- Creates unique session ID
- Stores dataset in session

### Step 2: Exploratory Data Analysis
- Generates descriptive statistics
- Identifies missing values
- Computes correlations
- Creates visualizations
- Detects data quality issues

### Step 3: Preprocessing
- **Missing Values**: Mean, Median, Mode, or Constant imputation
- **Encoding**: One-Hot or Ordinal encoding for categorical features
- **Scaling**: Standard or MinMax scaling for numerical features
- **Outliers**: Remove or cap outliers using IQR method
- **Duplicates**: Automatic duplicate removal

### Step 4: Model Training
- Splits data into train/test sets
- Trains multiple classification models
- Optional hyperparameter tuning with GridSearchCV
- Evaluates models on test set
- Saves trained models and scalers

### Step 5: Report Generation
- Compares all trained models
- Displays performance metrics
- Shows confusion matrices
- Recommends best model
- Provides downloadable report

### Step 6: Prediction
- Loads best model and preprocessing pipeline
- Accepts new data input
- Applies same preprocessing steps
- Returns prediction with confidence
- Allows model download

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint and Prettier for TypeScript/React code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **scikit-learn** for machine learning algorithms
- **FastAPI** for the amazing web framework
- **React** and **Vite** for the frontend ecosystem
- **TailwindCSS** for beautiful styling
- **Radix UI** for accessible components

---

## 📧 Contact

**Project Maintainer**: Abdulla Asim

**Repository**: [https://github.com/Abdulla-asim/AutoML](https://github.com/Abdulla-asim/AutoML)

---

<div align="center">

**Made with ❤️ by Abdulla Asim**

⭐ Star this repo if you find it helpful!

</div>
