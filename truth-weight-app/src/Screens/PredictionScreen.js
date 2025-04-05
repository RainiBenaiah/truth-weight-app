import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";

const Predict = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    family_history_with_overweight: "",
    FAVC: "",
    FCVC: "",
    NCP: "",
    CAEC: "",
    SMOKE: "",
    CH2O: "",
    SCC: "",
    FAF: "",
    TUE: "",
    CALC: "",
    MTRANS: "",
  });

  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction("");

    console.log("Form data being sent:", formData);

    try {
      const response = await fetch("https://ml-pipeline-summative-1q2i.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Full API Response:", data);

      if (response.ok) {
        if (data["obesity_class"]) {
          setPrediction(data["obesity_class"]);
        } else {
          setError(`Missing 'obesity_class'. Response: ${JSON.stringify(data)}`);
        }
      } else {
        setError(`API Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setError("Failed to connect to the API.");
    }
  };

  const categoricalFields = {
    gender: ["Male", "Female"],
    family_history_with_overweight: ["yes", "no"],
    FAVC: ["yes", "no"],
    CAEC: ["no", "Sometimes", "Frequently", "Always"],
    SMOKE: ["yes", "no"],
    SCC: ["yes", "no"],
    CALC: ["no", "Sometimes", "Frequently", "Always"],
    MTRANS: ["Public_Transportation", "Automobile", "Bike", "Walking", "Motorbike"],
  };

  const isCategorical = (field) => Object.keys(categoricalFields).includes(field);

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow p-4">
        <h2 className="text-center mb-3">Predict Obesity Class</h2>
        <p className="text-center">
          Enter the parameters below to predict obesity classification.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {prediction !== "" && (
          <Alert variant="success">
            <strong>Prediction Result:</strong> {prediction}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <Form.Group className="mb-3" key={key}>
              <Form.Label className="text-capitalize">
                {key.replace(/_/g, " ")}
              </Form.Label>

              {isCategorical(key) ? (
                <Form.Select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select {key.replace(/_/g, " ")}</option>
                  {categoricalFields[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type="number"
                  step="any"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              )}
            </Form.Group>
          ))}

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Get Prediction
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Predict;
