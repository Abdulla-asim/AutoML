from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import pickle
import json
import pandas as pd
from app.session_manager import get_session_path

router = APIRouter()

class PredictionInput(BaseModel):
    """Input data for making predictions"""
    features: dict  # Dictionary of feature_name: value

@router.post("/single")
def predict_single(session_id: str, input_data: PredictionInput):
    """
    Make a prediction on a single input using the best trained model
    
    Query Parameters:
    - session_id: Session ID
    
    Request Body:
    - features: Dictionary of feature values
    
    Returns:
        Prediction result with confidence/probability
    """
    session_path = get_session_path(session_id)
    
    # Check if session exists
    if not os.path.exists(session_path):
        raise HTTPException(404, f"Session {session_id} not found")
    
    # Load best model
    model_path = os.path.join(session_path, "best_model.pkl")
    if not os.path.exists(model_path):
        raise HTTPException(404, "No trained model found. Please train a model first.")
    
    try:
        with open(model_path, 'rb') as f:
            best_model = pickle.load(f)
    except Exception as e:
        raise HTTPException(500, f"Error loading model: {str(e)}")
    
    # Load model metadata
    metadata_path = os.path.join(session_path, "model_metadata.json")
    if not os.path.exists(metadata_path):
        raise HTTPException(404, "Model metadata not found")
    
    try:
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
    except Exception as e:
        raise HTTPException(500, f"Error loading metadata: {str(e)}")
    
    # Load preprocessing transformers
    transformers_path = os.path.join(session_path, "transformers.pkl")
    transformers = None
    if os.path.exists(transformers_path):
        try:
            with open(transformers_path, 'rb') as f:
                transformers = pickle.load(f)
        except Exception as e:
            print(f"Warning: Could not load transformers: {str(e)}")
    
    # Prepare input data
    try:
        # Create DataFrame from input
        input_df = pd.DataFrame([input_data.features])
        
        # Ensure columns are in the same order as training
        feature_names = metadata.get('feature_names', [])
        if feature_names:
            # Reorder columns to match training data
            input_df = input_df[feature_names]
        
        # Apply transformations if available
        if transformers:
            # Apply encoding
            if 'encoder' in transformers and transformers['encoder']:
                try:
                    input_df = transformers['encoder'].transform(input_df)
                    if hasattr(input_df, 'toarray'):  # If sparse matrix
                        input_df = pd.DataFrame(input_df.toarray())
                except Exception as e:
                    print(f"Warning: Encoding failed: {str(e)}")
            
            # Apply scaling
            if 'scaler' in transformers and transformers['scaler']:
                try:
                    input_df = pd.DataFrame(
                        transformers['scaler'].transform(input_df),
                        columns=input_df.columns
                    )
                except Exception as e:
                    print(f"Warning: Scaling failed: {str(e)}")
        
        # Make prediction
        prediction = best_model.predict(input_df)[0]
        
        # Get probability/confidence if available
        confidence = None
        probabilities = None
        if hasattr(best_model, 'predict_proba'):
            try:
                proba = best_model.predict_proba(input_df)[0]
                probabilities = proba.tolist()
                confidence = float(max(proba))
            except:
                pass
        
        # Convert prediction to native Python type
        if hasattr(prediction, 'item'):
            prediction = prediction.item()
        else:
            prediction = str(prediction)
        
        # Get class labels if available
        class_labels = metadata.get('class_labels', [])
        predicted_label = None
        if class_labels and isinstance(prediction, (int, float)):
            try:
                predicted_label = class_labels[int(prediction)]
            except (IndexError, ValueError):
                predicted_label = str(prediction)
        
        return {
            "prediction": prediction,
            "predicted_label": predicted_label or str(prediction),
            "confidence": confidence,
            "probabilities": probabilities,
            "model_name": metadata.get('model_name', 'Unknown'),
            "class_labels": class_labels
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error making prediction: {str(e)}")


@router.get("/features")
def get_feature_info(session_id: str):
    """
    Get information about features needed for prediction
    
    Query Parameters:
    - session_id: Session ID
    
    Returns:
        Feature names, types, and metadata
    """
    session_path = get_session_path(session_id)
    
    # Check if session exists
    if not os.path.exists(session_path):
        raise HTTPException(404, f"Session {session_id} not found")
    
    # Load model metadata
    metadata_path = os.path.join(session_path, "model_metadata.json")
    if not os.path.exists(metadata_path):
        raise HTTPException(404, "Model metadata not found. Please train a model first.")
    
    try:
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        return {
            "feature_names": metadata.get('feature_names', []),
            "feature_types": metadata.get('feature_types', {}),
            "class_labels": metadata.get('class_labels', []),
            "model_name": metadata.get('model_name', 'Unknown')
        }
    except Exception as e:
        raise HTTPException(500, f"Error loading feature info: {str(e)}")


@router.get("/download-model")
def download_model(session_id: str):
    """
    Download the trained model pickle file
    
    Query Parameters:
    - session_id: Session ID
    
    Returns:
        Model pickle file for download
    """
    from fastapi.responses import FileResponse
    
    session_path = get_session_path(session_id)
    
    # Check if session exists
    if not os.path.exists(session_path):
        raise HTTPException(404, f"Session {session_id} not found")
    
    # Check if model exists
    model_path = os.path.join(session_path, "best_model.pkl")
    if not os.path.exists(model_path):
        raise HTTPException(404, "No trained model found. Please train a model first.")
    
    # Return the model file for download
    return FileResponse(
        path=model_path,
        media_type="application/octet-stream",
        filename=f"model_{session_id}.pkl"
    )
