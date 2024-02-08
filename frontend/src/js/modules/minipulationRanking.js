class Ranking {
    constructor() {
        this.limit = 100;
        this.selectedPeriod = 'DAILY';
    }

    async getRanking(url) {
        if (!url) {
            throw new Error('URL is required');
        }

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) {
                    return null; 
                }
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching ranking:', error);
            throw error;
        }
    }

    createRanking(data) {
        const resultsUsersModal = document.getElementById('showRankingDiv');
        const tableHTML = document.createElement('table');
        
        tableHTML.innerHTML = '<tr><th>Position</th><th>Username</th><th>Score</th></tr>';
    
        if (!data || data.length === 0) {
            const noResultsMessage = document.createElement('tr');
            const noResultsCell = document.createElement('td');
            noResultsCell.setAttribute('colspan', '3');
            noResultsCell.textContent = 'No ranking available for the selected period';
            noResultsMessage.appendChild(noResultsCell);
            tableHTML.appendChild(noResultsMessage);
            document.getElementById('showMoreResults').style.display = 'none';
        } else {
            data.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${index + 1}°</td><td>${entry.username}</td><td>${entry.score}</td>`;
                tableHTML.appendChild(row);
            });
    
            if (data.length < this.limit) {
                document.getElementById('showMoreResults').style.display = 'none';
            } else {
                document.getElementById('showMoreResults').style.display = 'block';
            }
        }
    
        
        resultsUsersModal.innerHTML = '';
        resultsUsersModal.appendChild(tableHTML);
    }
    
    

    getSelectedPeriod() {
        let selectedValue = document.getElementById("selectPeriodRanking").value;
        return selectedValue;
    }

    async handlePeriodChange(periodRanking) {
        this.selectedPeriod = periodRanking;
        const urlRanking = `http://localhost:8180/users/game/rank/${periodRanking}?limit=${this.limit}`;
        try {
            const data = await this.getRanking(urlRanking);
            this.createRanking(data?.ranking); 
        } catch (error) {
            console.error(error);
        }
    }
    
    clearPreviousResults() {
        const resultsUsersModal = document.getElementById('resultsUsersModal');
        resultsUsersModal.innerHTML = '';
    }
    
    initialize() {
        const btnDailyRanking = document.querySelector('#btnDailyRanking');
        const btnWeeklyRanking = document.querySelector('#btnWeeklyRanking');
        const btnMonthlyRanking = document.querySelector('#btnMonthlyRanking');
    
        const applyStyle = (selectedButton) => {
            const buttons = [btnDailyRanking, btnWeeklyRanking, btnMonthlyRanking];
            buttons.forEach(button => {
                if (button === selectedButton) {
                    button.style.backgroundColor = 'black';
                    button.style.color = '#fff';
                } else {
                    button.style.backgroundColor = '';
                    button.style.color = '';
                }
            });
        };
    
        btnDailyRanking.addEventListener('click', () => {
            this.clearPreviousResults();
            this.handlePeriodChange('DAILY');
            applyStyle(btnDailyRanking);
        });
    
        btnWeeklyRanking.addEventListener('click', () => {
            this.clearPreviousResults();
            this.handlePeriodChange('WEEKLY');
            applyStyle(btnWeeklyRanking);
        });
    
        btnMonthlyRanking.addEventListener('click', () => {
            this.clearPreviousResults();
            this.handlePeriodChange('MONTLHY');
            applyStyle(btnMonthlyRanking);
        });
    
        // Inicialmente, o botão de ranking diário será ativado
        btnDailyRanking.click();
    }
    
}

const ranking = new Ranking();
export default ranking;