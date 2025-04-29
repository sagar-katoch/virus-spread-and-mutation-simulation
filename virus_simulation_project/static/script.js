document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Basic parameters
    const populationSizeSlider = document.getElementById('population-size');
    const populationSizeValue = document.getElementById('population-size-value');
    const simulationDurationSlider = document.getElementById('simulation-duration');
    const simulationDurationValue = document.getElementById('simulation-duration-value');
    const transmissionRateSlider = document.getElementById('transmission-rate');
    const transmissionRateValue = document.getElementById('transmission-rate-value');
    const mutationRateSlider = document.getElementById('mutation-rate');
    const mutationRateValue = document.getElementById('mutation-rate-value');
    
    // DOM Elements - Advanced parameters
    const meanRecoveryTimeSlider = document.getElementById('mean-recovery-time');
    const meanRecoveryTimeValue = document.getElementById('mean-recovery-time-value');
    const recoveryStdDevSlider = document.getElementById('recovery-std-dev');
    const recoveryStdDevValue = document.getElementById('recovery-std-dev-value');
    const deathRateSlider = document.getElementById('death-rate');
    const deathRateValue = document.getElementById('death-rate-value');
    const immunityDecayToggle = document.getElementById('immunity-decay-toggle');
    const immunityDecaySlider = document.getElementById('immunity-decay');
    const immunityDecayValue = document.getElementById('immunity-decay-value');
    const immunityDecaySliderContainer = document.getElementById('immunity-decay-slider-container');
    const vaccinationRateSlider = document.getElementById('vaccination-rate');
    const vaccinationRateValue = document.getElementById('vaccination-rate-value');
    
    // DOM Elements - Results
    const runSimulationButton = document.getElementById('run-simulation');
    const loadingIndicator = document.getElementById('loading-indicator');
    const statsContainer = document.getElementById('stats-container');
    const mutationStrains = document.getElementById('mutation-strains');
    const strainList = document.getElementById('strain-list');
    const totalMutations = document.getElementById('total-mutations');
    const totalDeaths = document.getElementById('total-deaths');
    const populationStatus = document.getElementById('population-status');
    
    // Chart setup
    let infectionChart = null;
    const chartContext = document.getElementById('infection-chart').getContext('2d');
    
    // Setup slider interactions
    function setupSliders() {
        // Basic parameters
        populationSizeSlider.addEventListener('input', function() {
            populationSizeValue.textContent = this.value;
            updateSliderTrack(this);
        });
        
        simulationDurationSlider.addEventListener('input', function() {
            simulationDurationValue.textContent = this.value;
            updateSliderTrack(this);
        });
        
        transmissionRateSlider.addEventListener('input', function() {
            transmissionRateValue.textContent = parseFloat(this.value).toFixed(2);
            updateSliderTrack(this);
        });
        
        mutationRateSlider.addEventListener('input', function() {
            mutationRateValue.textContent = parseFloat(this.value).toFixed(2);
            updateSliderTrack(this);
        });
        
        // Advanced parameters
        meanRecoveryTimeSlider.addEventListener('input', function() {
            meanRecoveryTimeValue.textContent = this.value;
            updateSliderTrack(this);
        });
        
        recoveryStdDevSlider.addEventListener('input', function() {
            recoveryStdDevValue.textContent = this.value;
            updateSliderTrack(this);
        });
        
        deathRateSlider.addEventListener('input', function() {
            deathRateValue.textContent = parseFloat(this.value).toFixed(3);
            updateSliderTrack(this);
        });
        
        // Immunity decay toggle & slider logic
        immunityDecayToggle.addEventListener('change', function() {
            if (this.checked) {
                immunityDecaySlider.disabled = false;
                immunityDecaySliderContainer.style.display = 'flex';
                immunityDecayValue.textContent = immunityDecaySlider.value;
            } else {
                immunityDecaySlider.disabled = true;
                immunityDecaySliderContainer.style.display = 'none';
                immunityDecayValue.textContent = '∞';
            }
        });
        
        immunityDecaySlider.addEventListener('input', function() {
            immunityDecayValue.textContent = this.value;
            updateSliderTrack(this);
        });
        
        vaccinationRateSlider.addEventListener('input', function() {
            vaccinationRateValue.textContent = parseFloat(this.value).toFixed(2);
            updateSliderTrack(this);
        });
        
        // Initialize slider tracks for all sliders
        updateSliderTrack(populationSizeSlider);
        updateSliderTrack(simulationDurationSlider);
        updateSliderTrack(transmissionRateSlider);
        updateSliderTrack(mutationRateSlider);
        updateSliderTrack(meanRecoveryTimeSlider);
        updateSliderTrack(recoveryStdDevSlider);
        updateSliderTrack(deathRateSlider);
        updateSliderTrack(immunityDecaySlider);
        updateSliderTrack(vaccinationRateSlider);
    }
    
    // Update visual slider track based on value
    function updateSliderTrack(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const percentage = ((val - min) / (max - min)) * 100;
        
        // Add a background gradient to show the slider position
        slider.style.background = `linear-gradient(90deg, 
            var(--glow-color-1) ${percentage}%, 
            rgba(255, 255, 255, 0.1) ${percentage}%)`;
    }
    
    // Initialize the infection chart
    function initChart() {
        // If chart already exists, destroy it first
        if (infectionChart) {
            infectionChart.destroy();
        }
        
        infectionChart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: [], // Will be filled with days
                datasets: [
                    {
                        label: 'Total Infections',
                        data: [], // Will be filled with cumulative infection counts
                        borderColor: 'rgb(255, 42, 109)',
                        backgroundColor: 'rgba(255, 42, 109, 0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(255, 42, 109)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Active Cases',
                        data: [], // Will be filled with active case counts
                        borderColor: 'rgb(255, 152, 0)',
                        backgroundColor: 'rgba(255, 152, 0, 0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(255, 152, 0)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Deaths',
                        data: [], // Will be filled with death counts
                        borderColor: 'rgb(244, 67, 54)',
                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(244, 67, 54)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Recovered',
                        data: [], // Will be filled with recovery counts
                        borderColor: 'rgb(76, 175, 80)',
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(76, 175, 80)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Active Strains',
                        data: [], // Will be filled with strain counts
                        borderColor: 'rgb(5, 217, 232)',
                        backgroundColor: 'rgba(5, 217, 232, 0.05)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(5, 217, 232)',
                        tension: 0.3,
                        fill: true,
                        hidden: true // Hide by default to avoid cluttering the chart
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'rgba(231, 231, 231, 0.8)',
                            font: {
                                family: "'Roboto', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(26, 26, 46, 0.9)',
                        borderColor: 'rgba(231, 231, 231, 0.2)',
                        borderWidth: 1,
                        titleFont: {
                            family: "'Orbitron', sans-serif",
                            size: 14
                        },
                        bodyFont: {
                            family: "'Roboto', sans-serif",
                            size: 13
                        },
                        padding: 10,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Days',
                            color: 'rgba(231, 231, 231, 0.8)'
                        },
                        ticks: {
                            color: 'rgba(231, 231, 231, 0.6)',
                            font: {
                                family: "'Roboto', sans-serif"
                            }
                        },
                        grid: {
                            color: 'rgba(231, 231, 231, 0.1)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Count',
                            color: 'rgba(231, 231, 231, 0.8)'
                        },
                        ticks: {
                            color: 'rgba(231, 231, 231, 0.6)',
                            font: {
                                family: "'Roboto', sans-serif"
                            }
                        },
                        grid: {
                            color: 'rgba(231, 231, 231, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    // Update the chart with new data
    function updateChart(simulationData) {
        const days = Array.from({ length: simulationData.infections_per_day.length }, (_, i) => i);
        
        infectionChart.data.labels = days;
        infectionChart.data.datasets[0].data = simulationData.infections_per_day;
        infectionChart.data.datasets[1].data = simulationData.active_cases_per_day;
        infectionChart.data.datasets[2].data = simulationData.deaths_per_day;
        infectionChart.data.datasets[3].data = simulationData.recovered_per_day;
        infectionChart.data.datasets[4].data = simulationData.total_strains_per_day;
        
        infectionChart.update();
    }
    
    // Display population status breakdown
    function displayPopulationStatus(status) {
        populationStatus.innerHTML = '';
        
        // Create status items in this order: susceptible, infected, recovered, deceased, vaccinated
        const statusItems = [
            { label: 'Susceptible', key: 'susceptible', cssClass: 'susceptible-indicator' },
            { label: 'Infected', key: 'infected', cssClass: 'infected-indicator' },
            { label: 'Recovered', key: 'recovered', cssClass: 'recovered-indicator' },
            { label: 'Deceased', key: 'deceased', cssClass: 'deceased-indicator' },
            { label: 'Vaccinated', key: 'vaccinated_not_infected', cssClass: 'vaccinated-indicator' }
        ];
        
        statusItems.forEach(item => {
            if (status[item.key] !== undefined) {
                const statusItem = document.createElement('div');
                statusItem.className = 'status-item';
                
                statusItem.innerHTML = `
                    <div class="status-label">
                        <div class="status-indicator ${item.cssClass}"></div>
                        ${item.label}
                    </div>
                    <div class="status-count">${status[item.key].toLocaleString()}</div>
                `;
                
                populationStatus.appendChild(statusItem);
            }
        });
    }
    
    // Display the top mutation strains
    function displayStrains(strains) {
        strainList.innerHTML = '';
        
        strains.forEach((strain, index) => {
            const strainItem = document.createElement('div');
            strainItem.className = 'strain-item';
            
            // Create a color based on the strain ID
            const hue = (strain.strain_id * 137) % 360; // Use golden ratio to distribute colors
            
            strainItem.innerHTML = `
                <div class="strain-id" style="color: hsl(${hue}, 80%, 70%)">
                    Strain #${strain.strain_id}
                </div>
                <div class="strain-count">${strain.count}</div>
            `;
            
            strainList.appendChild(strainItem);
        });
    }
    
    // Run simulation with current parameters
    async function runSimulation() {
        // Show loading state
        loadingIndicator.classList.remove('hidden');
        statsContainer.classList.add('hidden');
        mutationStrains.classList.add('hidden');
        runSimulationButton.disabled = true;
        
        try {
            // Get basic parameters
            const parameters = {
                population_size: parseInt(populationSizeSlider.value),
                duration: parseInt(simulationDurationSlider.value),
                transmission_rate: parseFloat(transmissionRateSlider.value),
                mutation_rate: parseFloat(mutationRateSlider.value),
                
                // Advanced parameters
                mean_recovery_time: parseInt(meanRecoveryTimeSlider.value),
                recovery_std_dev: parseInt(recoveryStdDevSlider.value),
                death_rate: parseFloat(deathRateSlider.value),
                vaccination_rate: parseFloat(vaccinationRateSlider.value)
            };
            
            // Handle immunity decay (optional)
            if (immunityDecayToggle.checked) {
                parameters.immunity_decay_days = parseInt(immunityDecaySlider.value);
            }
            
            console.log('Running simulation with parameters:', parameters);
            
            // Make API request
            const response = await fetch('/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parameters)
            });
            
            // Handle API response
            if (!response.ok) {
                throw new Error('Simulation request failed');
            }
            
            const data = await response.json();
            
            // Initialize chart if it doesn't exist
            if (!infectionChart) {
                initChart();
            }
            
            // Update UI with simulation results
            updateChart(data);
            totalMutations.textContent = data.total_unique_mutations;
            totalDeaths.textContent = data.total_deaths;
            displayPopulationStatus(data.population_status);
            displayStrains(data.top_strains);
            
            // Show results sections
            statsContainer.classList.remove('hidden');
            mutationStrains.classList.remove('hidden');
        } catch (error) {
            console.error('Simulation error:', error);
            alert('Error running simulation: ' + error.message);
        } finally {
            // Hide loading state
            loadingIndicator.classList.add('hidden');
            runSimulationButton.disabled = false;
        }
    }
    
    // Add event listeners
    function setupEventListeners() {
        runSimulationButton.addEventListener('click', runSimulation);
    }
    
    // Initialize the app
    function init() {
        setupSliders();
        initChart();
        setupEventListeners();
    }
    
    // Start the application
    init();
});