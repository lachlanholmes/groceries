import { useRef, useState } from 'react';
import './PhotoCapture.css';

interface PhotoCaptureProps {
  onClose: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [extractedIngredients, setExtractedIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCapturing(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to base64 (removing the data:image/jpeg;base64, prefix)
    const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
    
    // Process the image
    processImage(imageData);
  };

  const processImage = async (imageData: string) => {
    setProcessing(true);
    
    try {
      const response = await fetch('/extract-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setExtractedIngredients(data.ingredients);
      setSelectedIngredients(data.ingredients); // Pre-select all ingredients
      
      // Stop camera after successful processing
      stopCamera();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to extract ingredients. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addToGroceryList = async () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient to add');
      return;
    }

    try {
      // Fetch the user's email from current auth state
      const user = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.user;
      const email = user?.email || 'unknown@example.com';

      // Create an array of items to add
      const itemsToAdd = selectedIngredients.map(name => ({
        name: name,
        completed: false,
        added_by: email
      }));

      // Send to your grocery_items table
      const response = await fetch('/api/add-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToAdd }),
      });

      if (!response.ok) {
        throw new Error('Failed to add items to grocery list');
      }

      alert('Ingredients added to grocery list!');
      onClose(); // Return to grocery list view
    } catch (error) {
      console.error('Error adding to grocery list:', error);
      alert('Failed to add items to grocery list. Please try again.');
    }
  };

  return (
    <div className="photo-capture">
      <h2>Scan Recipe</h2>
      
      {!isCapturing && extractedIngredients.length === 0 && (
        <div className="capture-start">
          <p>Take a photo of your recipe to extract ingredients.</p>
          <button className="primary-button" onClick={startCamera}>
            Start Camera
          </button>
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      )}
      
      {isCapturing && (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-preview"
          />
          <div className="camera-controls">
            <button 
              className="capture-button" 
              onClick={capturePhoto}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Capture'}
            </button>
            <button 
              className="secondary-button" 
              onClick={() => {
                stopCamera();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
      
      {extractedIngredients.length > 0 && (
        <div className="ingredients-selection">
          <h3>Select Ingredients to Add</h3>
          <ul className="ingredients-list">
            {extractedIngredients.map((ingredient, idx) => (
              <li key={idx} className="ingredient-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient)}
                    onChange={() => toggleIngredient(ingredient)}
                  />
                  <span>{ingredient}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="action-buttons">
            <button 
              className="primary-button" 
              onClick={addToGroceryList}
              disabled={selectedIngredients.length === 0}
            >
              Add to Grocery List
            </button>
            <button 
              className="secondary-button" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCapture; 