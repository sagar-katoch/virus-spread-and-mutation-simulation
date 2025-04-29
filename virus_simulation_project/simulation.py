import random
import numpy as np
from collections import Counter, defaultdict

def run_simulation(population_size, duration, transmission_rate, mutation_rate, 
                   mean_recovery_time=14, recovery_std_dev=3, death_rate=0.02, 
                   immunity_decay_days=None, vaccination_rate=0):
    population_size = int(population_size)
    duration = int(duration)
    transmission_rate = float(transmission_rate)
    mutation_rate = float(mutation_rate)
    mean_recovery_time = int(mean_recovery_time)
    recovery_std_dev = int(recovery_std_dev)
    death_rate = float(death_rate)
    vaccination_rate = float(vaccination_rate)
    if immunity_decay_days is not None:
        immunity_decay_days = int(immunity_decay_days)

    population = np.zeros(population_size, dtype=int)
    
    if vaccination_rate > 0:
        num_vaccinated = int(population_size * vaccination_rate)
        vaccinated_indices = random.sample(range(population_size), num_vaccinated)
        population[vaccinated_indices] = 4  # Vaccinated
    
    virus_strains = defaultdict(int)
    
    susceptible_indices = np.where(population == 0)[0]
    if len(susceptible_indices) == 0:
        susceptible_indices = np.arange(population_size)
        
    patient_zero_idx = random.choice(susceptible_indices)
    population[patient_zero_idx] = 1  # Infected
    virus_strains[0] = 1
    
    person_strain = [-1] * population_size
    person_strain[patient_zero_idx] = 0
    
    individual_recovery_times = {}
    infection_day = [-1] * population_size
    recovery_day = [-1] * population_size
    infection_day[patient_zero_idx] = 0
    recovery_time = max(1, int(np.clip(np.random.normal(mean_recovery_time, recovery_std_dev), 1, None)))
    individual_recovery_times[patient_zero_idx] = recovery_time
    
    infections_per_day = [1]
    total_strains_per_day = [1]
    deaths_per_day = [0]
    active_cases_per_day = [1] 
    recovered_per_day = [0]
    
    next_strain_id = 1
    total_deaths = 0
    
    for day in range(1, duration):
        new_infections = 0
        new_deaths = 0
        new_recoveries = 0
        
        if immunity_decay_days is not None:
            for person_idx in range(population_size):
                if (population[person_idx] == 2 and 
                    recovery_day[person_idx] != -1 and 
                    day - recovery_day[person_idx] >= immunity_decay_days):
                    population[person_idx] = 0
        
        alive_indices = np.where(np.isin(population, [0, 1, 2, 4]))[0]

        for person_idx in range(population_size):
            if population[person_idx] == 1:
                days_infected = day - infection_day[person_idx]
                
                if days_infected >= individual_recovery_times[person_idx]:
                    if random.random() < death_rate:
                        population[person_idx] = 3  # Deceased
                        virus_strains[person_strain[person_idx]] -= 1
                        new_deaths += 1
                    else:
                        population[person_idx] = 2  # Recovered
                        virus_strains[person_strain[person_idx]] -= 1
                        recovery_day[person_idx] = day
                        new_recoveries += 1
                    continue
                
                contacts = random.randint(1, 5)
                for _ in range(contacts):
                    contact_idx = random.choice(alive_indices)
                    
                    if population[contact_idx] == 0:
                        if random.random() < transmission_rate:
                            population[contact_idx] = 1
                            infection_day[contact_idx] = day
                            recovery_time = max(1, int(np.clip(np.random.normal(mean_recovery_time, recovery_std_dev), 1, None)))
                            individual_recovery_times[contact_idx] = recovery_time
                            
                            if random.random() < mutation_rate:
                                new_strain_id = next_strain_id
                                next_strain_id += 1
                                person_strain[contact_idx] = new_strain_id
                                virus_strains[new_strain_id] = 1
                            else:
                                person_strain[contact_idx] = person_strain[person_idx]
                                virus_strains[person_strain[person_idx]] += 1
                            
                            new_infections += 1
                    
                    elif population[contact_idx] == 4:
                        reduced_transmission = transmission_rate * 0.2
                        if random.random() < reduced_transmission:
                            population[contact_idx] = 1
                            infection_day[contact_idx] = day
                            recovery_time = max(1, int(np.clip(np.random.normal(mean_recovery_time * 0.7, recovery_std_dev * 0.7), 1, None)))
                            individual_recovery_times[contact_idx] = recovery_time
                            
                            if random.random() < mutation_rate:
                                new_strain_id = next_strain_id
                                next_strain_id += 1
                                person_strain[contact_idx] = new_strain_id
                                virus_strains[new_strain_id] = 1
                            else:
                                person_strain[contact_idx] = person_strain[person_idx]
                                virus_strains[person_strain[person_idx]] += 1
                            
                            new_infections += 1
        
        total_deaths += new_deaths
        
        active_infections = np.sum(population == 1)
        active_cases_per_day.append(int(active_infections))
        infections_per_day.append(infections_per_day[-1] + new_infections)
        deaths_per_day.append(deaths_per_day[-1] + new_deaths)
        recovered_per_day.append(recovered_per_day[-1] + new_recoveries)
        
        active_strains = sum(1 for count in virus_strains.values() if count > 0)
        total_strains_per_day.append(active_strains)
    
    counter = Counter()
    for i in range(population_size):
        if person_strain[i] != -1:
            counter[person_strain[i]] += 1
    
    top_strains = counter.most_common(10)
    
    susceptible_count = np.sum(population == 0)
    infected_count = np.sum(population == 1)
    recovered_count = np.sum(population == 2)
    deceased_count = np.sum(population == 3)
    vaccinated_not_infected = np.sum(population == 4)
    
    population_status = {
        'susceptible': int(susceptible_count),
        'infected': int(infected_count),
        'recovered': int(recovered_count),
        'deceased': int(deceased_count),
        'vaccinated_not_infected': int(vaccinated_not_infected)
    }
    
    return {
        'infections_per_day': infections_per_day,
        'active_cases_per_day': active_cases_per_day,
        'deaths_per_day': deaths_per_day,
        'recovered_per_day': recovered_per_day,
        'total_unique_mutations': next_strain_id,
        'top_strains': [{'strain_id': strain, 'count': count} for strain, count in top_strains],
        'total_strains_per_day': total_strains_per_day,
        'total_deaths': total_deaths,
        'population_status': population_status
    }