# 🧬 Virus Spread and Mutation Simulation

## 🧭 Introduction
This project is a Python-based simulation that models the spread of a virus through a population and how the virus may mutate over time. It is designed to help understand viral dynamics, visualize epidemic curves, and analyze how different parameters affect the course of an outbreak.

The main aim is to:
- Demonstrate the interaction between virus transmission and mutation.
- Observe how an outbreak evolves over time.
- Allow modification of parameters to simulate different scenarios.

It’s an educational tool useful for students, researchers, or hobbyists curious about how infections spread and evolve.

---

## 🔧 How It Works

### 1. **Initialization**
- The simulation starts by initializing a population of individuals.
- Each individual is assigned a status: Susceptible (S), Infected (I), or Recovered (R).
- A few individuals are initially infected to begin the simulation.

### 2. **Simulation Loop**
The simulation runs in time steps (iterations). In each step:
- Infected individuals attempt to infect susceptible ones based on a defined **infection rate**.
- With each transmission, there is a chance that the virus **mutates**, governed by the **mutation rate**.
- Infected individuals recover after a certain time and are marked as Recovered.

### 3. **Mutation Modeling**
- Each mutation may change the virus slightly (for simplicity, this might be represented by an identifier or numerical trait).
- The simulation can track different strains over time.

### 4. **Output and Visualization**
- At the end of the simulation, results are either printed or plotted.
- Key metrics: number of susceptible, infected, recovered individuals, and number of unique virus strains.

---

## 🔍 Features

- 📈 **Simulation of virus spread**
- 🧪 **Mutation tracking**
- 👥 **SIR population model** (Susceptible, Infected, Recovered)
- 🛠 **Configurable parameters**
- 📊 **Optional visualization of results**

---

## 🚀 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/sagar-katoch/virus-spread-and-mutation-simulation.git
cd virus-spread-and-mutation-simulation
```

### 2. Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run the simulation:
```bash
python simulate.py
```

### 4. Customize Parameters:
Edit `config.py` or `simulate.py` to change:
- Infection rate
- Mutation rate
- Population size
- Recovery time

---

## 📁 Project Structure
```
virus-spread-and-mutation-simulation/
├── simulate.py        # Main simulation logic
├── config.py          # Parameter configurations
├── README.md          # Documentation
└── requirements.txt   # Dependencies
```

---

## 🧠 Use Cases
- Teaching basic concepts in epidemiology and virus evolution
- Modeling outbreak scenarios for research or education
- Studying effects of virus mutations on epidemic outcomes

---

## 📜 License
This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing
Feel free to fork this project and propose improvements via pull requests. Contributions are welcome!

---

## 📬 Contact
For any questions or suggestions, feel free to contact [katochsagar2@gmail.com](mailto:katochsagar2@gmail.com).

