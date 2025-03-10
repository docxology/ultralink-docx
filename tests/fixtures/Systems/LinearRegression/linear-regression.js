/**
 * Linear Regression Statistical Model Test Fixtures
 * 
 * This module provides test data for a Linear Regression model.
 * The dataset demonstrates UltraLink's capabilities for modeling statistical systems.
 */

const { UltraLink } = require('../../../../src');

/**
 * Creates a Linear Regression dataset modeling statistical components
 * @returns {UltraLink} Populated UltraLink instance
 */
function createLinearRegressionDataset() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Add the main model entity
  ultralink.addEntity('linear_regression_model', 'model', {
    name: 'Linear Regression Model',
    description: 'A statistical model that examines the linear relationship between a dependent variable and independent variables',
    domain: 'statistics',
    model_type: 'regression',
    assumptions: [
      'Linearity',
      'Independence of errors',
      'Homoscedasticity',
      'Normality of errors',
      'No multicollinearity'
    ]
  });
  
  // Define the dataset entity
  ultralink.addEntity('dataset', 'data', {
    name: 'Sample Dataset',
    description: 'Data used for building and validating the linear regression model',
    data_points: 100,
    features: ['x1', 'x2', 'x3'],
    target: 'y',
    split: {
      training: 0.7,
      testing: 0.3
    }
  });
  
  // Define variables in the model
  ultralink.addEntity('dependent_variable', 'variable', {
    name: 'Dependent Variable (Y)',
    symbol: 'Y',
    description: 'The target variable to be predicted',
    data_type: 'continuous',
    variance: 25.5,
    mean: 50.2
  });
  
  ultralink.addEntity('independent_variable_x1', 'variable', {
    name: 'Independent Variable X1',
    symbol: 'X₁',
    description: 'First predictor variable',
    data_type: 'continuous',
    variance: 12.3,
    mean: 25.7
  });
  
  ultralink.addEntity('independent_variable_x2', 'variable', {
    name: 'Independent Variable X2',
    symbol: 'X₂',
    description: 'Second predictor variable',
    data_type: 'continuous',
    variance: 8.7,
    mean: 15.3
  });
  
  ultralink.addEntity('independent_variable_x3', 'variable', {
    name: 'Independent Variable X3',
    symbol: 'X₃',
    description: 'Third predictor variable',
    data_type: 'continuous',
    variance: 5.2,
    mean: 10.1
  });
  
  // Model parameters
  ultralink.addEntity('intercept', 'parameter', {
    name: 'Intercept',
    symbol: 'β₀',
    description: 'The y-intercept of the regression line',
    value: 12.5,
    standard_error: 1.2,
    p_value: 0.001
  });
  
  ultralink.addEntity('coefficient_x1', 'parameter', {
    name: 'Coefficient for X1',
    symbol: 'β₁',
    description: 'The slope parameter for X1',
    value: 2.3,
    standard_error: 0.5,
    p_value: 0.002
  });
  
  ultralink.addEntity('coefficient_x2', 'parameter', {
    name: 'Coefficient for X2',
    symbol: 'β₂',
    description: 'The slope parameter for X2',
    value: 1.7,
    standard_error: 0.3,
    p_value: 0.008
  });
  
  ultralink.addEntity('coefficient_x3', 'parameter', {
    name: 'Coefficient for X3',
    symbol: 'β₃',
    description: 'The slope parameter for X3',
    value: 0.8,
    standard_error: 0.2,
    p_value: 0.015
  });
  
  // Error term
  ultralink.addEntity('error_term', 'parameter', {
    name: 'Error Term',
    symbol: 'ε',
    description: 'The random error term in the regression model',
    distribution: 'normal',
    mean: 0,
    variance: 4.2
  });
  
  // Model quality metrics
  ultralink.addEntity('model_metrics', 'metrics', {
    name: 'Model Quality Metrics',
    description: 'Statistical measures of model fit',
    r_squared: 0.82,
    adjusted_r_squared: 0.81,
    f_statistic: 145.3,
    f_p_value: 0.00001,
    aic: 523.7,
    bic: 537.2,
    rmse: 2.05,
    mae: 1.67
  });
  
  // Prediction process
  ultralink.addEntity('prediction', 'process', {
    name: 'Regression Prediction',
    description: 'Process to generate predictions using the linear regression model',
    formula: 'Y = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + ε',
    steps: [
      'Collect feature values (X₁, X₂, X₃)',
      'Multiply each feature by its coefficient',
      'Sum all terms including the intercept',
      'Output the predicted value of Y'
    ]
  });
  
  // Training process
  ultralink.addEntity('training', 'process', {
    name: 'Model Training',
    description: 'Process to estimate model parameters from training data',
    method: 'Ordinary Least Squares (OLS)',
    objective: 'Minimize the sum of squared errors',
    steps: [
      'Split data into training and testing sets',
      'Calculate coefficients using OLS formula',
      'Evaluate model fit on training data',
      'Validate model on testing data',
      'Calculate model quality metrics'
    ]
  });
  
  // Diagnostic tests
  ultralink.addEntity('diagnostic_tests', 'process', {
    name: 'Model Diagnostics',
    description: 'Statistical tests to validate model assumptions',
    tests: [
      {
        name: 'Durbin-Watson Test',
        purpose: 'Test for autocorrelation of residuals',
        value: 2.05,
        interpretation: 'No significant autocorrelation'
      },
      {
        name: 'Breusch-Pagan Test',
        purpose: 'Test for heteroscedasticity',
        value: 3.2,
        p_value: 0.35,
        interpretation: 'Homoscedasticity assumption holds'
      },
      {
        name: 'Shapiro-Wilk Test',
        purpose: 'Test for normality of residuals',
        value: 0.97,
        p_value: 0.23,
        interpretation: 'Residuals approximately normal'
      },
      {
        name: 'Variance Inflation Factor',
        purpose: 'Test for multicollinearity',
        values: {
          'X₁': 1.3,
          'X₂': 1.5,
          'X₃': 1.2
        },
        interpretation: 'No significant multicollinearity'
      }
    ]
  });
  
  // Add relationships
  // Model components relationships
  ultralink.addRelationship('linear_regression_model', 'dataset', 'uses');
  ultralink.addRelationship('linear_regression_model', 'dependent_variable', 'predicts');
  ultralink.addRelationship('linear_regression_model', 'independent_variable_x1', 'includes');
  ultralink.addRelationship('linear_regression_model', 'independent_variable_x2', 'includes');
  ultralink.addRelationship('linear_regression_model', 'independent_variable_x3', 'includes');
  ultralink.addRelationship('linear_regression_model', 'intercept', 'has_parameter');
  ultralink.addRelationship('linear_regression_model', 'coefficient_x1', 'has_parameter');
  ultralink.addRelationship('linear_regression_model', 'coefficient_x2', 'has_parameter');
  ultralink.addRelationship('linear_regression_model', 'coefficient_x3', 'has_parameter');
  ultralink.addRelationship('linear_regression_model', 'error_term', 'includes');
  ultralink.addRelationship('linear_regression_model', 'model_metrics', 'evaluated_by');
  
  // Process relationships
  ultralink.addRelationship('linear_regression_model', 'prediction', 'performs');
  ultralink.addRelationship('linear_regression_model', 'training', 'undergoes');
  ultralink.addRelationship('linear_regression_model', 'diagnostic_tests', 'validated_by');
  
  // Relationship between parameters and variables
  ultralink.addRelationship('coefficient_x1', 'independent_variable_x1', 'applies_to');
  ultralink.addRelationship('coefficient_x2', 'independent_variable_x2', 'applies_to');
  ultralink.addRelationship('coefficient_x3', 'independent_variable_x3', 'applies_to');
  
  // Relationships between processes
  ultralink.addRelationship('training', 'model_metrics', 'produces');
  ultralink.addRelationship('diagnostic_tests', 'model_metrics', 'validates');
  ultralink.addRelationship('prediction', 'dependent_variable', 'estimates');
  
  return ultralink;
}

module.exports = {
  createLinearRegressionDataset
}; 