import React, { useState } from 'react';
import axios from 'axios';

function FeatureImportanceScreen() {
  const [featureData, setFeatureData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchFeatureImportance = async () => {
    setIsLoading(true);
    setError(null);
    setFeatureData(null);
    setHasFetched(true);

    try {
      const response = await axios.get('https://ml-pipeline-summative-1q2i.onrender.com/feature_importance');

      // Try to handle various possible structures of Swagger JSON
      const data = response.data;
      const importanceData =
        data?.feature_importance ||
        data?.data?.feature_importance || // nested
        data?.[0]?.feature_importance || // array-wrapped
        null;

      if (!importanceData || typeof importanceData !== 'object') {
        throw new Error('Invalid or missing feature importance data');
      }

      setFeatureData(importanceData);
    } catch (error) {
      console.error('Error fetching feature importance data:', error);
      setError('Failed to load feature importance data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const sortedFeatures = featureData
    ? Object.entries(featureData).sort((a, b) => b[1] - a[1])
    : [];

  const getImportanceBarStyle = (importance) => {
    let color;
    if (importance > 0.15) {
      color = 'bg-danger';
    } else if (importance > 0.05) {
      color = 'bg-warning';
    } else {
      color = 'bg-success';
    }

    return {
      width: `${importance * 100}%`,
      className: `progress-bar ${color}`,
    };
  };

  return (
    <div className="feature-importance-screen container mt-4 mb-5">
      <h2 className="text-center mb-4">Feature Importance Analysis</h2>

      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={fetchFeatureImportance}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Fetch Feature Importance'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-center">
          <p className="mb-0">{error}</p>
        </div>
      )}

      {hasFetched && !isLoading && !error && !featureData && (
        <div className="alert alert-warning text-center">
          <p className="mb-0">No feature importance data found.</p>
        </div>
      )}

      {!isLoading && featureData && (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Feature Importance Rankings</h4>
              </div>
              <div className="card-body">
                <div className="alert alert-info mb-4">
                  <p className="mb-0">
                    <strong>What is Feature Importance?</strong> Feature importance indicates how much each feature contributes to the model's predictions. Higher values mean the feature has a stronger influence on obesity classification.
                  </p>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '60%' }}>Feature</th>
                        <th style={{ width: '30%' }}>Importance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFeatures.map(([feature, importance], index) => {
                        const barStyle = getImportanceBarStyle(importance);

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{feature}</td>
                            <td>
                              <div className="progress">
                                <div
                                  className={barStyle.className}
                                  role="progressbar"
                                  style={{ width: barStyle.width }}
                                  aria-valuenow={importance * 100}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeatureImportanceScreen;

