import os
import logging
from flask import Flask, render_template, request, jsonify
from simulation import run_simulation

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

@app.route('/')
def index():
    """Render the main page of the application."""
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    """Handle simulation request and return results."""
    try:
        # Get simulation parameters from request
        data = request.get_json()
        population_size = int(data.get('population_size', 1000))
        duration = int(data.get('duration', 100))
        transmission_rate = float(data.get('transmission_rate', 0.3))
        mutation_rate = float(data.get('mutation_rate', 0.1))
        
        # Run simulation
        simulation_results = run_simulation(
            population_size=population_size,
            duration=duration,
            transmission_rate=transmission_rate,
            mutation_rate=mutation_rate
        )
        
        return jsonify(simulation_results)
    except Exception as e:
        logging.error(f"Simulation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5004)



    
