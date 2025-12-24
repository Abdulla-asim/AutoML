import { useState, useEffect } from "react";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, TrendingUp, AlertCircle, Download } from "lucide-react";
import { motion } from "framer-motion";
import { getStoredSessionId } from "@/hooks/use-automl";
import { getFeatureInfo, makePrediction, API_BASE_URL } from "@/api/backend";

export function PredictionStep() {
    const [featureInfo, setFeatureInfo] = useState<any>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load feature information
        const loadFeatures = async () => {
            try {
                const sessionId = getStoredSessionId();
                if (!sessionId) {
                    setError("No session found. Please train a model first.");
                    return;
                }
                const info = await getFeatureInfo(sessionId);
                setFeatureInfo(info);

                // Initialize form data with empty values
                const initialData: Record<string, any> = {};
                info.feature_names.forEach((name: string) => {
                    initialData[name] = "";
                });
                setFormData(initialData);
            } catch (err: any) {
                setError(err.message);
            }
        };
        loadFeatures();
    }, []);

    const handleInputChange = (featureName: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [featureName]: value
        }));
    };

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const sessionId = getStoredSessionId();
            if (!sessionId) {
                throw new Error("No session found");
            }

            // Convert form data to appropriate types
            const features: Record<string, any> = {};
            Object.entries(formData).forEach(([key, value]) => {
                if (value === "" || value === null) {
                    throw new Error(`Please fill in all fields. Missing: ${key}`);
                }
                // Try to convert to number if possible
                const numValue = Number(value);
                features[key] = isNaN(numValue) ? value : numValue;
            });

            const result = await makePrediction(sessionId, features);
            setPrediction(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (error && !featureInfo) {
        return (
            <StepCard
                title="Make Predictions"
                description="Use your trained model to predict on new data"
            >
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </StepCard>
        );
    }

    return (
        <StepCard
            title="Make Predictions"
            description="Enter feature values to get predictions from your trained model"
        >
            <div className="space-y-6">
                {featureInfo && (
                    <Card className="p-6 bg-gradient-to-br from-card to-secondary/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Model: {featureInfo.model_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {featureInfo.feature_names.length} features required
                                </p>
                            </div>
                        </div>

                        {/* Feature Input Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {featureInfo.feature_names.map((featureName: string) => (
                                <div key={featureName} className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                        {featureName}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[featureName] || ""}
                                        onChange={(e) => handleInputChange(featureName, e.target.value)}
                                        placeholder={`Enter ${featureName}`}
                                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-6 gap-4">
                            <Button
                                size="lg"
                                onClick={handlePredict}
                                disabled={loading}
                                className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            ⚙️
                                        </motion.span>
                                        Predicting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Make Prediction
                                    </span>
                                )}
                            </Button>

                            <a
                                href={`${API_BASE_URL}/api/predict/download-model?session_id=${getStoredSessionId()}`}
                                download
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Model
                                </Button>
                            </a>
                        </div>
                    </Card>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                                        Prediction Result
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Model: {prediction.model_name}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                                    <span className="font-semibold">Predicted Value:</span>
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {prediction.predicted_label}
                                    </span>
                                </div>

                                {prediction.confidence && (
                                    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                                        <span className="font-semibold">Confidence:</span>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {(prediction.confidence * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                )}

                                {prediction.probabilities && prediction.class_labels && (
                                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                                        <h4 className="font-semibold mb-3">Class Probabilities:</h4>
                                        <div className="space-y-2">
                                            {prediction.class_labels.map((label: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="text-sm font-medium w-24">{label}:</span>
                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full flex items-center justify-end pr-2"
                                                            style={{ width: `${prediction.probabilities[idx] * 100}%` }}
                                                        >
                                                            <span className="text-xs text-white font-semibold">
                                                                {(prediction.probabilities[idx] * 100).toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </div>
        </StepCard>
    );
}
